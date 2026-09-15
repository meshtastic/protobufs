package org.meshtastic.proto.build

import com.squareup.wire.schema.EnumType
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
 * The registry covers both `(meshtastic.field_metadata)` on fields and
 * `(meshtastic.enum_value_metadata)` on enum values, and exposes two layers:
 *  - **Typed accessors** generated as extension properties on each message's companion object,
 *    e.g. `Config.PositionConfig.rx_gpio` - the everyday, autocomplete-friendly API that hangs
 *    directly off the real generated message type (no magic strings, no parallel namespace). The
 *    accessor name matches Wire's snake_case field name.
 *    For an enum value the accessor hangs off the enum TYPE instead, dispatching on the
 *    receiver - `role.metadata?.label`. It cannot hang off the companion: an extension named
 *    after a value is shadowed by the enum entry itself, because Kotlin resolves members
 *    before extensions, so it would compile and never be reachable.
 *  - **`FieldMetadataRegistry.get(messageType, tag)`** - a dynamic escape hatch for generic
 *    walking. Enum values share this registry and its key format with fields, as in the other
 *    generators; `forEnum`/`forEnumValue` are named aliases over it.
 *
 * The handler is GENERIC over the contents of the `FieldMetadata` message: it reads whatever
 * scalar sub-fields are set on each annotated field and re-emits them as a `FieldMetadata(...)`
 * constructor call. Adding a new scalar attribute to `field_metadata.proto` requires NO change here.
 *
 * Output is `org/meshtastic/proto/FieldMetadataRegistry.kt`, written into the custom target's `out`
 * directory, which the KMP build wires into `commonMain` - so it is queryable on every KMP target
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

    private data class EnumEntry(
        val enumType: String, // fully-qualified, e.g. "meshtastic.Config.DeviceConfig.Role"
        val typePath: List<String>, // package-relative, e.g. ["Config", "DeviceConfig", "Role"]
        val valueName: String, // proto enum value name, e.g. "CLIENT"
        val tag: Int, // the enum value number
        val ctor: String, // rendered "FieldMetadata(...)" call
    )

    override fun handle(schema: Schema, context: Context) {
        val optionMember = ProtoMember.get(Options.FIELD_OPTIONS, FIELD_METADATA_OPTION)
        val enumOptionMember = ProtoMember.get(Options.ENUM_VALUE_OPTIONS, ENUM_VALUE_METADATA_OPTION)

        // Sub-field name -> proto scalar type, read from the FieldMetadata message definition so
        // value rendering stays correct as new attributes are added.
        val metaFieldTypes: Map<String, ProtoType> =
            (schema.getType(FIELD_METADATA_TYPE) as? MessageType)
                ?.fieldsAndOneOfFields
                ?.mapNotNull { field -> field.type?.let { field.name to it } }
                ?.toMap()
                .orEmpty()

        val entries = mutableListOf<Entry>()
        val enumEntries = mutableListOf<EnumEntry>()
        for (protoFile in schema.protoFiles) {
            if (!context.inSourcePath(protoFile)) continue
            for (type in protoFile.types) {
                collect(type, protoFile.packageName, optionMember, enumOptionMember, metaFieldTypes, entries, enumEntries)
            }
        }
        entries.sortWith(compareBy({ it.messageType }, { it.tag }))
        enumEntries.sortWith(compareBy({ it.enumType }, { it.tag }))

        val path = context.outDirectory.resolve(REGISTRY_RELATIVE_PATH)
        context.fileSystem.createDirectories(path.parent!!)
        context.fileSystem.write(path) { writeUtf8(render(entries, enumEntries)) }
    }

    private fun collect(
        type: Type,
        packageName: String?,
        optionMember: ProtoMember,
        enumOptionMember: ProtoMember,
        metaFieldTypes: Map<String, ProtoType>,
        out: MutableList<Entry>,
        enumOut: MutableList<EnumEntry>,
    ) {
        if (type is MessageType) {
            val fqn = type.type.toString()
            val relative = if (packageName != null) fqn.removePrefix("$packageName.") else fqn
            val typePath = relative.split(".")
            for (field in type.fieldsAndOneOfFields) {
                val raw = field.options.get(optionMember)
                // `deprecated` is generator-managed (mirrored from the standard option); a
                // hand-set value in the annotation is a hard error, matching the other
                // generators, so they can't disagree about it.
                val handSet = (raw as? Map<*, *>)?.keys?.any { key ->
                    ((key as? ProtoMember)?.simpleName ?: key.toString()) == DEPRECATED_ATTR
                } == true
                check(!handSet) {
                    "$fqn.${field.name}: the \"$DEPRECATED_ATTR\" attribute is generator-managed and cannot be " +
                        "set in (meshtastic.field_metadata); mark the field `[deprecated = true]` instead and " +
                        "it is mirrored automatically"
                }
                // A field earns an entry if it carries the custom annotation OR the standard
                // `deprecated` option, which we mirror into the registry (see renderConstructor).
                val ctor = renderConstructor(raw, field.isDeprecated, metaFieldTypes)
                    ?: continue
                out += Entry(fqn, typePath, field.name, field.tag, ctor)
            }
        }
        if (type is EnumType) {
            val fqn = type.type.toString()
            val relative = if (packageName != null) fqn.removePrefix("$packageName.") else fqn
            val typePath = relative.split(".")
            for (constant in type.constants) {
                val raw = constant.options.get(enumOptionMember)
                val handSet = (raw as? Map<*, *>)?.keys?.any { key ->
                    ((key as? ProtoMember)?.simpleName ?: key.toString()) == DEPRECATED_ATTR
                } == true
                check(!handSet) {
                    "$fqn.${constant.name}: the \"$DEPRECATED_ATTR\" attribute is generator-managed and cannot " +
                        "be set in (meshtastic.enum_value_metadata); mark the value `[deprecated = true]` instead " +
                        "and it is mirrored automatically"
                }
                val ctor = renderConstructor(raw, constant.isDeprecated, metaFieldTypes)
                    ?: continue
                enumOut += EnumEntry(fqn, typePath, constant.name, constant.tag, ctor)
            }
        }
        for (nested in type.nestedTypes) {
            collect(nested, packageName, optionMember, enumOptionMember, metaFieldTypes, out, enumOut)
        }
    }

    /**
     * Renders the `FieldMetadata(...)` constructor call for one field, or null if the field has no
     * metadata at all. [raw] is the decoded `(meshtastic.field_metadata)` option (may be null);
     * [isDeprecated] is the field's standard `deprecated` option, mirrored in as the `deprecated`
     * attribute so apps can read deprecation at runtime (a hand-set `deprecated` in the annotation
     * is rejected in [collect]). Args are keyed by attribute name and sorted so ordering matches
     * the other generators.
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
            args[name] = "$name = ${renderLiteral(name, value, metaFieldTypes[name])}"
        }
        if (isDeprecated) {
            args[DEPRECATED_ATTR] = "$DEPRECATED_ATTR = true"
        }
        return if (args.isEmpty()) null else "FieldMetadata(${args.values.joinToString(", ")})"
    }

    /**
     * Renders one attribute value as a Kotlin literal of the type Wire generates for the
     * attribute's proto kind, so the `FieldMetadata(...)` call compiles whatever scalar
     * attributes the schema declares. The kinds the other generators reject (64-bit
     * integers, non-finite floats, non-scalars) are rejected here with the same rule.
     */
    private fun renderLiteral(name: String, value: Any, protoType: ProtoType?): String {
        val text = value.toString()
        return when (protoType) {
            ProtoType.BOOL -> text.toBoolean().toString()
            // Wire maps double to Double and float to Float; Kotlin needs the `f` suffix on
            // the latter and never coerces an integer literal, so render each as its own type.
            ProtoType.DOUBLE -> text.toDouble().also { requireFinite(name, it) }.toString()
            ProtoType.FLOAT -> text.toFloat().also { requireFinite(name, it.toDouble()) }.toString() + "f"
            // Wire maps every 32-bit integer kind, signed or unsigned, to Int; a uint32 above
            // Int.MAX_VALUE is carried as its two's-complement Int, which toLong().toInt() gives.
            ProtoType.INT32, ProtoType.SINT32, ProtoType.SFIXED32,
            ProtoType.UINT32, ProtoType.FIXED32,
            -> text.toLong().toInt().toString()
            ProtoType.STRING -> text.quote()
            ProtoType.INT64, ProtoType.SINT64, ProtoType.SFIXED64,
            ProtoType.UINT64, ProtoType.FIXED64,
            -> error(
                "FieldMetadata.$name: 64-bit integer attributes are not supported (not every target can " +
                    "hold them exactly); use a 32-bit kind"
            )
            null -> error("FieldMetadata has no attribute named \"$name\"")
            else -> error("FieldMetadata.$name: attributes must be scalar (bool / 32-bit int / float / string); got $protoType")
        }
    }

    private fun requireFinite(name: String, d: Double) = require(d.isFinite()) {
        "FieldMetadata.$name: float attributes must be finite (leave a bound unset instead); got $d"
    }

    /**
     * Kotlin string literal for [this]. Escapes everything Kotlin gives meaning to inside
     * `"..."`: backslash, quote, `$` (template start), and the control characters a
     * single-line literal cannot contain.
     */
    private fun String.quote(): String = buildString {
        append('"')
        for (c in this@quote) {
            when (c) {
                '\\' -> append("\\\\")
                '"' -> append("\\\"")
                '$' -> append("\\\$")
                '\n' -> append("\\n")
                '\r' -> append("\\r")
                '\t' -> append("\\t")
                else -> if (c < ' ') append("\\u%04x".format(c.code)) else append(c)
            }
        }
        append('"')
    }

    private fun render(entries: List<Entry>, enumEntries: List<EnumEntry>): String = buildString {
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

        // Typed accessors for enum values. These hang off the enum TYPE, not its companion: an
        // extension on the companion named after a value (`Role.Companion.CLIENT`) is shadowed by
        // the enum entry itself, because Kotlin resolves members before extensions. It compiles and
        // is then unreachable. Dispatching on the receiver also reads better at the call site -
        // a UI holds a `Role`, not a reference to a field.
        for ((typePath, values) in enumEntries.groupBy { it.typePath }) {
            val type = typePath.joinToString(".")
            for (v in values) {
                appendLine("private val ${(typePath + v.valueName).joinToString("_")}: FieldMetadata = ${v.ctor}")
            }
            appendLine("public val $type.metadata: FieldMetadata? get() = when (this.value) {")
            for (v in values) {
                appendLine("    ${v.tag} -> ${(typePath + v.valueName).joinToString("_")}")
            }
            appendLine("    else -> null")
            appendLine("}")
            appendLine()
        }

        appendLine("/**")
        appendLine(" * Reflection-free dynamic lookup of [FieldMetadata] declared via the")
        appendLine(" * `(meshtastic.field_metadata)` and `(meshtastic.enum_value_metadata)` options. For a")
        appendLine(" * known entry prefer the typed accessor above (e.g. `Config.PositionConfig.rx_gpio`,")
        appendLine(" * or `role.metadata`); use [get] for generic walking.")
        appendLine(" */")
        appendLine("public object FieldMetadataRegistry {")
        // Fully-qualify the stdlib Map: the schema defines a `meshtastic.Map` message generated
        // into this same package, which would otherwise shadow `kotlin.collections.Map`.
        appendLine("    private val byType: kotlin.collections.Map<String, kotlin.collections.Map<Int, FieldMetadata>> = mapOf(")
        // Reference the backing val rather than re-rendering the constructor: the map
        // literal would otherwise duplicate every label and description into a second
        // constant pool entry, and the registry is already the largest generated file.
        val byType = sortedMapOf<String, MutableMap<Int, String>>()
        for (e in entries) {
            byType.getOrPut(e.messageType) { sortedMapOf() }[e.tag] =
                (e.typePath + e.fieldName).joinToString("_")
        }
        // Enum values share the registry and the key format with fields, the same way
        // protoc-gen-fieldmeta does it. A message and an enum cannot share a fully-qualified
        // name, so the two kinds cannot collide.
        for (e in enumEntries) {
            byType.getOrPut(e.enumType) { sortedMapOf() }[e.tag] =
                (e.typePath + e.valueName).joinToString("_")
        }
        for ((typeName, fields) in byType) {
            appendLine("        ${typeName.quote()} to mapOf(")
            for ((tag, backing) in fields) {
                appendLine("            $tag to $backing,")
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
        appendLine()
        appendLine("    /** Metadata for the value numbered [number] on proto enum [enumType], or null. */")
        appendLine("    public fun forEnumValue(enumType: String, number: Int): FieldMetadata? =")
        appendLine("        get(enumType, number)")
        appendLine()
        appendLine("    /** All metadata-annotated values on [enumType], keyed by value number. */")
        appendLine("    public fun forEnum(enumType: String): kotlin.collections.Map<Int, FieldMetadata> =")
        appendLine("        forType(enumType)")
        appendLine("}")
    }

    // The registry is emitted wholesale by handle(schema); nothing is produced per type/service/extend.
    override fun handle(type: Type, context: Context): Path? = null

    override fun handle(service: Service, context: Context): List<Path> = emptyList()

    override fun handle(extend: Extend, field: Field, context: Context): Path? = null

    private companion object {
        const val FIELD_METADATA_OPTION = "meshtastic.field_metadata"
        const val ENUM_VALUE_METADATA_OPTION = "meshtastic.enum_value_metadata"
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
