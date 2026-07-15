package org.meshtastic.proto.build

import com.squareup.wire.schema.Extend
import com.squareup.wire.schema.Field
import com.squareup.wire.schema.MessageType
import com.squareup.wire.schema.Options
import com.squareup.wire.schema.ProtoMember
import com.squareup.wire.schema.ProtoType
import com.squareup.wire.schema.Schema
import com.squareup.wire.schema.SchemaHandler
import com.squareup.wire.schema.Service
import com.squareup.wire.schema.Type
import okio.Path

/**
 * Wire [SchemaHandler] that generates a reflection-free `FieldMetadataRegistry` Kotlin object
 * from the `(meshtastic.field_metadata)` field options declared in the protobuf schema.
 *
 * The registry exposes two layers:
 *  - **Typed accessors** generated as extension properties on each message's companion object,
 *    e.g. `Config.PositionConfig.rx_gpio` — the everyday, autocomplete-friendly API that hangs
 *    directly off the real generated message type (no magic strings, no parallel namespace). The
 *    accessor name matches Wire's snake_case field name.
 *  - **`FieldMetadataRegistry.get(messageType, tag)`** — a dynamic escape hatch for generic
 *    field walking.
 *
 * The handler is GENERIC over the contents of the `FieldMetadata` message: it reads whatever
 * scalar sub-fields are set on each annotated field and re-emits them as a `FieldMetadata(...)`
 * constructor call. Adding a new scalar attribute to `field_metadata.proto` requires NO change here.
 *
 * Output is `org/meshtastic/proto/FieldMetadataRegistry.kt`, written into the custom target's `out`
 * directory, which the KMP build wires into `commonMain` — so it is queryable on every KMP target
 * (JVM, Android, JS, Wasm, Native) with no reflection and no runtime cost.
 */
class FieldMetadataRegistryHandler : SchemaHandler() {

    private data class Entry(
        val messageType: String, // fully-qualified, e.g. "meshtastic.Config.PositionConfig"
        val typePath: List<String>, // package-relative, e.g. ["Config", "PositionConfig"]
        val fieldName: String, // proto field name, e.g. "rx_gpio"
        val tag: Int,
        val ctor: String, // rendered "FieldMetadata(...)" call
    )

    override fun handle(schema: Schema, context: Context) {
        val optionMember = ProtoMember.get(Options.FIELD_OPTIONS, FIELD_METADATA_OPTION)

        // Sub-field name -> proto scalar type, read from the FieldMetadata message definition so
        // value rendering stays correct as new attributes are added.
        val metaFieldTypes: Map<String, ProtoType> =
            (schema.getType(FIELD_METADATA_TYPE) as? MessageType)
                ?.fieldsAndOneOfFields
                ?.mapNotNull { field -> field.type?.let { field.name to it } }
                ?.toMap()
                .orEmpty()

        val entries = mutableListOf<Entry>()
        for (protoFile in schema.protoFiles) {
            if (!context.inSourcePath(protoFile)) continue
            for (type in protoFile.types) {
                collect(type, protoFile.packageName, optionMember, metaFieldTypes, entries)
            }
        }
        entries.sortWith(compareBy({ it.messageType }, { it.tag }))

        val path = context.outDirectory.resolve(REGISTRY_RELATIVE_PATH)
        context.fileSystem.createDirectories(path.parent!!)
        context.fileSystem.write(path) { writeUtf8(render(entries)) }
    }

    private fun collect(
        type: Type,
        packageName: String?,
        optionMember: ProtoMember,
        metaFieldTypes: Map<String, ProtoType>,
        out: MutableList<Entry>,
    ) {
        if (type is MessageType) {
            val fqn = type.type.toString()
            val relative = if (packageName != null) fqn.removePrefix("$packageName.") else fqn
            val typePath = relative.split(".")
            for (field in type.fieldsAndOneOfFields) {
                // A field earns an entry if it carries the custom annotation OR the standard
                // `deprecated` option, which we mirror into the registry (see renderConstructor).
                val ctor = renderConstructor(field.options.get(optionMember), field.isDeprecated, metaFieldTypes)
                    ?: continue
                out += Entry(fqn, typePath, field.name, field.tag, ctor)
            }
        }
        for (nested in type.nestedTypes) {
            collect(nested, packageName, optionMember, metaFieldTypes, out)
        }
    }

    /**
     * Renders the `FieldMetadata(...)` constructor call for one field, or null if the field has no
     * metadata at all. [raw] is the decoded `(meshtastic.field_metadata)` option (may be null);
     * [isDeprecated] is the field's standard `deprecated` option, mirrored in as the `deprecated`
     * attribute so apps can read deprecation at runtime. Args are keyed by attribute name (sorted,
     * deduped) so the standard `deprecated` option is authoritative and ordering matches the other
     * generators.
     */
    private fun renderConstructor(
        raw: Any?,
        isDeprecated: Boolean,
        metaFieldTypes: Map<String, ProtoType>,
    ): String? {
        val args = sortedMapOf<String, String>()
        (raw as? Map<*, *>)?.forEach { (key, value) ->
            if (value == null) return@forEach
            val name = (key as? ProtoMember)?.simpleName ?: key.toString()
            args[name] = "$name = ${renderLiteral(value, metaFieldTypes[name])}"
        }
        if (isDeprecated) {
            args[DEPRECATED_ATTR] = "$DEPRECATED_ATTR = true"
        }
        return if (args.isEmpty()) null else "FieldMetadata(${args.values.joinToString(", ")})"
    }

    private fun renderLiteral(value: Any, protoType: ProtoType?): String = when (protoType) {
        ProtoType.BOOL -> value.toString().toBoolean().toString()
        // Constructor params are Double?, so emit a decimal literal even for integral values.
        ProtoType.DOUBLE, ProtoType.FLOAT -> value.toString().toDouble().toString()
        ProtoType.STRING -> value.toString().quote()
        // Fallback for any scalar kind not anticipated here (rendered as a String literal).
        else -> value.toString().quote()
    }

    private fun String.quote(): String =
        "\"" + replace("\\", "\\\\").replace("\"", "\\\"") + "\""

    private fun render(entries: List<Entry>): String = buildString {
        appendLine("// GENERATED CODE -- DO NOT EDIT.")
        appendLine("// Produced by FieldMetadataRegistryHandler from (meshtastic.field_metadata) options.")
        appendLine()
        appendLine("package $REGISTRY_PACKAGE")
        appendLine()

        // Typed accessors: extension properties on each message's companion object, so metadata
        // hangs off the real generated type, e.g. `Config.PositionConfig.rx_gpio`. The accessor
        // name matches Wire's snake_case field name so it lines up with the message's own field.
        // Backed by a private val so access is allocation-free.
        for (e in entries) {
            val type = e.typePath.joinToString(".")
            val backing = (e.typePath + e.fieldName).joinToString("_")
            appendLine("private val $backing: FieldMetadata = ${e.ctor}")
            appendLine("public val $type.Companion.${e.fieldName}: FieldMetadata get() = $backing")
            appendLine()
        }

        appendLine("/**")
        appendLine(" * Reflection-free dynamic lookup of [FieldMetadata] declared via the")
        appendLine(" * `(meshtastic.field_metadata)` field option. For a known field, prefer the typed")
        appendLine(" * accessor above (e.g. `Config.PositionConfig.rx_gpio`); use [get] for generic walking.")
        appendLine(" */")
        appendLine("public object FieldMetadataRegistry {")
        // Fully-qualify the stdlib Map: the schema defines a `meshtastic.Map` message generated
        // into this same package, which would otherwise shadow `kotlin.collections.Map`.
        appendLine("    private val byType: kotlin.collections.Map<String, kotlin.collections.Map<Int, FieldMetadata>> = mapOf(")
        val byType = sortedMapOf<String, MutableMap<Int, String>>()
        for (e in entries) {
            byType.getOrPut(e.messageType) { sortedMapOf() }[e.tag] = e.ctor
        }
        for ((typeName, fields) in byType) {
            appendLine("        ${typeName.quote()} to mapOf(")
            for ((tag, ctor) in fields) {
                appendLine("            $tag to $ctor,")
            }
            appendLine("        ),")
        }
        appendLine("    )")
        appendLine()
        appendLine("    /** Metadata for the field with [tag] on proto message [messageType], or null. */")
        appendLine("    public fun get(messageType: String, tag: Int): FieldMetadata? =")
        appendLine("        byType[messageType]?.get(tag)")
        appendLine()
        appendLine("    /** All metadata-annotated fields on [messageType], keyed by field tag. */")
        appendLine("    public fun forType(messageType: String): kotlin.collections.Map<Int, FieldMetadata> =")
        appendLine("        byType[messageType].orEmpty()")
        appendLine("}")
    }

    // The registry is emitted wholesale by handle(schema); nothing is produced per type/service/extend.
    override fun handle(type: Type, context: Context): Path? = null

    override fun handle(service: Service, context: Context): List<Path> = emptyList()

    override fun handle(extend: Extend, field: Field, context: Context): Path? = null

    private companion object {
        const val FIELD_METADATA_OPTION = "meshtastic.field_metadata"
        const val FIELD_METADATA_TYPE = "meshtastic.FieldMetadata"
        const val DEPRECATED_ATTR = "deprecated"
        const val REGISTRY_PACKAGE = "org.meshtastic.proto"
        const val REGISTRY_RELATIVE_PATH = "org/meshtastic/proto/FieldMetadataRegistry.kt"
    }
}

/**
 * Referenced from the Wire `custom { }` target by fully-qualified name. Wire instantiates it via
 * its public no-arg constructor (see [SchemaHandler.Factory]); kept top-level so the FQCN string
 * has no nested-class `$` ambiguity.
 */
class FieldMetadataRegistryHandlerFactory : SchemaHandler.Factory {
    override fun create(
        includes: List<String>,
        excludes: List<String>,
        exclusive: Boolean,
        outDirectory: String,
        options: Map<String, String>,
    ): SchemaHandler = FieldMetadataRegistryHandler()
}
