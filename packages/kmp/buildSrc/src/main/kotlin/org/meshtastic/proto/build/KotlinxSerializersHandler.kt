package org.meshtastic.proto.build

import com.squareup.wire.schema.EnumType
import com.squareup.wire.schema.Extend
import com.squareup.wire.schema.Field
import com.squareup.wire.schema.MessageType
import com.squareup.wire.schema.ProtoType
import com.squareup.wire.schema.Schema
import com.squareup.wire.schema.SchemaHandler
import com.squareup.wire.schema.Service
import com.squareup.wire.schema.Type
import com.squareup.wire.schema.internal.hasEponymousType
import com.squareup.wire.schema.internal.legacyQualifiedFieldName
import com.squareup.kotlinpoet.NameAllocator
import okio.Path

/**
 * Writes a kotlinx.serialization `KSerializer` for every message and enum in the `meshtastic`
 * package, so any kotlinx format reads and writes the Wire types on every target, with no
 * reflection. The shape is proto3 JSON's: lowerCamelCase keys, enums by name (a quoted number
 * reads too), bytes as base64, 64-bit integers as strings (a bare signed one reads too),
 * `uint32` unsigned, and a field at its default left out. Nullability and default-omission
 * follow each field's `EncodeMode`, which is what the Kotlin generator itself decides them from.
 *
 * Where it parts from protoc: an enum number the proto does not name is an error, since a Wire
 * enum cannot hold it; of two oneof members in one input the last wins, as Wire's builder keeps
 * it; and NaN or an infinity needs a format that allows them (`allowSpecialFloatingPointValues`
 * on a kotlinx `Json`).
 *
 * Reached as `LocalConfig.serializer()`, through an extension on each type's companion.
 */
class KotlinxSerializersHandler : SchemaHandler() {

    private lateinit var schema: Schema

    override fun handle(schema: Schema, context: Context) {
        this.schema = schema
        val types = mutableListOf<Type>()
        for (protoFile in schema.protoFiles) {
            if (!context.inSourcePath(protoFile) || protoFile.packageName != PROTO_PACKAGE) continue
            protoFile.types.forEach { collect(it, types) }
        }
        requireAcyclic(types.filterIsInstance<MessageType>())
        write(context, "ProtoScalarSerializers.kt", SCALARS)
        for ((file, inFile) in types.groupBy { it.location.path }) {
            val name = file.substringAfterLast('/').removeSuffix(".proto")
                .split('_').joinToString("") { it.replaceFirstChar(Char::uppercaseChar) }
            write(context, "${name}Serializers.kt", render(inFile))
        }
    }

    private fun collect(type: Type, out: MutableList<Type>) {
        if (type is MessageType || type is EnumType) out += type
        type.nestedTypes.forEach { collect(it, out) }
    }

    /**
     * A descriptor holds its elements' descriptors, so two messages that reach each other would
     * build forever. None do today; say which if one ever does.
     */
    private fun requireAcyclic(messages: List<MessageType>) {
        val byType = messages.associateBy { it.type }
        val done = mutableSetOf<ProtoType>()
        fun visit(type: ProtoType, path: List<ProtoType>) {
            check(type !in path) { "message cycle: ${(path + type).joinToString(" -> ")}" }
            if (type in done) return
            byType[type]?.fieldsAndOneOfFields?.mapNotNull { it.type }?.forEach { visit(it, path + type) }
            done += type
        }
        messages.forEach { visit(it.type, emptyList()) }
    }

    private fun write(context: Context, fileName: String, text: String) {
        val path = context.outDirectory.resolve("org/meshtastic/proto/$fileName")
        context.fileSystem.createDirectories(path.parent!!)
        context.fileSystem.write(path) { writeUtf8(text) }
    }

    private fun kotlinName(type: ProtoType): String = type.toString().removePrefix("$PROTO_PACKAGE.")

    private fun serializerName(type: ProtoType): String = kotlinName(type).replace('.', '_') + "Serializer"

    private fun render(types: List<Type>): String = buildString {
        appendLine("// GENERATED CODE -- DO NOT EDIT.")
        appendLine("// Produced by KotlinxSerializersHandler.")
        appendLine("@file:Suppress(\"DEPRECATION\", \"RedundantVisibilityModifier\")")
        // decodeNullableSerializableElement is experimental API.
        appendLine("@file:OptIn(kotlinx.serialization.ExperimentalSerializationApi::class)")
        appendLine()
        appendLine("package $KOTLIN_PACKAGE")
        appendLine()
        appendLine("import kotlinx.serialization.KSerializer")
        appendLine("import kotlinx.serialization.SerializationException")
        appendLine("import kotlinx.serialization.builtins.ListSerializer")
        appendLine("import kotlinx.serialization.builtins.nullable")
        appendLine("import kotlinx.serialization.builtins.serializer")
        appendLine("import kotlinx.serialization.descriptors.PrimitiveKind")
        appendLine("import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor")
        appendLine("import kotlinx.serialization.descriptors.SerialDescriptor")
        appendLine("import kotlinx.serialization.descriptors.buildClassSerialDescriptor")
        appendLine("import kotlinx.serialization.encoding.CompositeDecoder")
        appendLine("import kotlinx.serialization.encoding.Decoder")
        appendLine("import kotlinx.serialization.encoding.Encoder")
        appendLine("import kotlinx.serialization.encoding.decodeStructure")
        appendLine("import kotlinx.serialization.encoding.encodeStructure")
        for (type in types) {
            appendLine()
            when (type) {
                is EnumType -> renderEnum(type)
                is MessageType -> renderMessage(type)
                else -> Unit
            }
        }
    }

    private fun StringBuilder.renderEnum(type: EnumType) {
        val name = kotlinName(type.type)
        val ser = serializerName(type.type)
        appendLine("public object $ser : KSerializer<$name> {")
        appendLine("    override val descriptor: SerialDescriptor =")
        appendLine("        PrimitiveSerialDescriptor(\"${type.type}\", PrimitiveKind.STRING)")
        // Proto names by number, not the Kotlin constants, which Wire renames when they clash.
        val byTag = type.constants.distinctBy { it.tag }
        appendLine("    private val names: kotlin.collections.Map<Int, String> = mapOf(${byTag.joinToString { "${it.tag} to \"${it.name}\"" }})")
        appendLine("    private val tags: kotlin.collections.Map<String, Int> = mapOf(${type.constants.joinToString { "\"${it.name}\" to ${it.tag}" }})")
        appendLine("    override fun serialize(encoder: Encoder, value: $name): Unit =")
        appendLine("        encoder.encodeString(names[value.value] ?: value.value.toString())")
        appendLine("    override fun deserialize(decoder: Decoder): $name {")
        appendLine("        val text = decoder.decodeString()")
        appendLine("        return (text.toIntOrNull() ?: tags[text])?.let { $name.fromValue(it) }")
        appendLine("            ?: throw SerializationException(\"${type.type} has no value '\$text'\")")
        appendLine("    }")
        appendLine("}")
        appendLine("public fun $name.Companion.serializer(): KSerializer<$name> = $ser")
    }

    private fun StringBuilder.renderMessage(type: MessageType) {
        val name = kotlinName(type.type)
        val ser = serializerName(type.type)
        // Sorted by key, as PyYAML dumps them; protoc prints field-number order, which no reader relies on.
        val fields = type.fieldsAndOneOfFields.sortedBy { jsonName(it) }
        val property = propertyNames(type)
        appendLine("public object $ser : KSerializer<$name> {")
        appendLine("    override val descriptor: SerialDescriptor by lazy {")
        appendLine("        buildClassSerialDescriptor(\"${type.type}\") {")
        for (field in fields) {
            appendLine("            element(\"${jsonName(field)}\", ${fieldSerializer(field)}.descriptor, isOptional = true)")
        }
        appendLine("        }")
        appendLine("    }")
        appendLine()
        appendLine("    override fun serialize(encoder: Encoder, value: $name): Unit = encoder.encodeStructure(descriptor) {")
        fields.forEachIndexed { index, field ->
            val get = "value.`${property.getValue(field)}`"
            val write = "encodeSerializableElement(descriptor, $index, ${fieldSerializer(field)}, it)"
            // Wire makes every singular message field nullable, whatever its EncodeMode says.
            val nullable = !field.isRepeated && schema.getType(field.type!!) is MessageType
            val line = when (if (nullable) Field.EncodeMode.NULL_IF_ABSENT else field.encodeMode!!) {
                Field.EncodeMode.NULL_IF_ABSENT -> "$get?.let { $write }"
                Field.EncodeMode.REPEATED, Field.EncodeMode.PACKED -> "$get.takeIf { it.isNotEmpty() }?.let { $write }"
                Field.EncodeMode.REQUIRED -> "$get.let { $write }"
                Field.EncodeMode.OMIT_IDENTITY -> "$get.takeIf { ${notIdentity(field)} }?.let { $write }"
                Field.EncodeMode.MAP -> error("${type.type}.${field.name}: map fields are not supported")
            }
            appendLine("        $line")
        }
        appendLine("    }")
        appendLine()
        appendLine("    override fun deserialize(decoder: Decoder): $name = decoder.decodeStructure(descriptor) {")
        appendLine("        val builder = $name.Builder()")
        appendLine("        while (true) {")
        appendLine("            when (val index = decodeElementIndex(descriptor)) {")
        fields.forEachIndexed { index, field ->
            // Nullable reads, so an empty YAML section or a JSON null leaves the field unset.
            appendLine(
                "                $index -> decodeNullableSerializableElement(descriptor, $index, " +
                    "${fieldSerializer(field)}.nullable)?.let { builder.`${property.getValue(field)}`(it) }",
            )
        }
        appendLine("                CompositeDecoder.DECODE_DONE -> break")
        // A format that surfaces a key this build has no field for, rather than skipping it.
        appendLine("                CompositeDecoder.UNKNOWN_NAME -> Unit")
        appendLine("                else -> throw SerializationException(\"${type.type}: unexpected index \$index\")")
        appendLine("            }")
        appendLine("        }")
        appendLine("        builder.build()")
        appendLine("    }")
        appendLine("}")
        appendLine("public fun $name.Companion.serializer(): KSerializer<$name> = $ser")
    }

    /**
     * The Kotlin property Wire generates for each field, allocated as `KotlinGenerator.nameAllocator`
     * allocates them: keywords and its own members reserved first, then the fields in source order,
     * a field named like its type taking the package-qualified name. So `data` is `data_`.
     */
    private fun propertyNames(message: MessageType): Map<Field, String> {
        val allocator = NameAllocator(preallocateKeywords = true)
        for (reserved in listOf("unknownFields", "ADAPTER", "adapter", "reader", "Builder", "builder", "MESSAGE_OPTIONS")) {
            allocator.newName(reserved, reserved)
        }
        return message.fieldsAndOneOfFields.sortedBy { it.location.line }.associateWith { field ->
            val eponymous = field.name == field.type!!.simpleName || hasEponymousType(schema, field)
            allocator.newName(if (eponymous) legacyQualifiedFieldName(field) else field.name, field)
        }
    }

    /** protoc's `ToJsonName`: underscores dropped and the letter after each capitalised. */
    private fun jsonName(field: Field): String = field.declaredJsonName ?: buildString {
        var upper = false
        for (c in field.name) {
            when {
                c == '_' -> upper = true
                upper -> append(c.uppercaseChar()).also { upper = false }
                else -> append(c)
            }
        }
    }

    private fun fieldSerializer(field: Field): String {
        val element = elementSerializer(field.type!!)
        return if (field.isRepeated) "ListSerializer($element)" else element
    }

    private fun elementSerializer(type: ProtoType): String = when (type) {
        ProtoType.INT32, ProtoType.SINT32, ProtoType.SFIXED32 -> "Int.serializer()"
        ProtoType.UINT32, ProtoType.FIXED32 -> "ProtoUInt32Serializer"
        ProtoType.INT64, ProtoType.SINT64, ProtoType.SFIXED64 -> "ProtoInt64Serializer"
        ProtoType.UINT64, ProtoType.FIXED64 -> "ProtoUInt64Serializer"
        ProtoType.BOOL -> "Boolean.serializer()"
        ProtoType.FLOAT -> "Float.serializer()"
        ProtoType.DOUBLE -> "Double.serializer()"
        ProtoType.STRING -> "String.serializer()"
        ProtoType.BYTES -> "ProtoBytesSerializer"
        else -> {
            check(type.toString().startsWith("$PROTO_PACKAGE.")) { "$type is outside $PROTO_PACKAGE" }
            serializerName(type)
        }
    }

    private fun notIdentity(field: Field): String = when (field.type) {
        ProtoType.INT32, ProtoType.SINT32, ProtoType.SFIXED32, ProtoType.UINT32, ProtoType.FIXED32 -> "it != 0"
        ProtoType.INT64, ProtoType.SINT64, ProtoType.SFIXED64, ProtoType.UINT64, ProtoType.FIXED64 -> "it != 0L"
        ProtoType.BOOL -> "it"
        // equals, not ==: -0.0 is not the default, as Wire's binary encoder also decides.
        ProtoType.FLOAT -> "!it.equals(0f)"
        ProtoType.DOUBLE -> "!it.equals(0.0)"
        ProtoType.STRING -> "it.isNotEmpty()"
        ProtoType.BYTES -> "it.size != 0"
        // An implicit-presence field of message type is NULL_IF_ABSENT, so this is an enum.
        else -> "it.value != 0"
    }

    override fun handle(type: Type, context: Context): Path? = null

    override fun handle(service: Service, context: Context): List<Path> = emptyList()

    override fun handle(extend: Extend, field: Field, context: Context): Path? = null

    private companion object {
        const val PROTO_PACKAGE = "meshtastic"
        const val KOTLIN_PACKAGE = "org.meshtastic.proto"

        val SCALARS = """
            |// GENERATED CODE -- DO NOT EDIT.
            |// Produced by KotlinxSerializersHandler: the proto3 JSON forms of the scalars kotlinx has no
            |// serializer of that shape for.
            |package $KOTLIN_PACKAGE
            |
            |import kotlinx.serialization.KSerializer
            |import kotlinx.serialization.SerializationException
            |import kotlinx.serialization.descriptors.PrimitiveKind
            |import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
            |import kotlinx.serialization.descriptors.SerialDescriptor
            |import kotlinx.serialization.encoding.Decoder
            |import kotlinx.serialization.encoding.Encoder
            |import okio.ByteString
            |import okio.ByteString.Companion.decodeBase64
            |
            |/** `uint32` and `fixed32`, which Wire holds as the bits of an Int: written unsigned. */
            |public object ProtoUInt32Serializer : KSerializer<Int> {
            |    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("meshtastic.uint32", PrimitiveKind.LONG)
            |    override fun serialize(encoder: Encoder, value: Int): Unit = encoder.encodeLong(value.toUInt().toLong())
            |    override fun deserialize(decoder: Decoder): Int = decoder.decodeLong().let { value ->
            |        if (value !in 0L..0xFFFF_FFFFL) throw SerializationException("uint32 out of range: ${'$'}value")
            |        value.toInt()
            |    }
            |}
            |
            |/** The signed 64-bit kinds, a string in proto3 JSON; a bare number reads too. */
            |public object ProtoInt64Serializer : KSerializer<Long> {
            |    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("meshtastic.int64", PrimitiveKind.STRING)
            |    override fun serialize(encoder: Encoder, value: Long): Unit = encoder.encodeString(value.toString())
            |    override fun deserialize(decoder: Decoder): Long = decoder.decodeLong()
            |}
            |
            |/** `uint64` and `fixed64`, a string in proto3 JSON, unsigned. */
            |public object ProtoUInt64Serializer : KSerializer<Long> {
            |    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("meshtastic.uint64", PrimitiveKind.STRING)
            |    override fun serialize(encoder: Encoder, value: Long): Unit = encoder.encodeString(value.toULong().toString())
            |    override fun deserialize(decoder: Decoder): Long = decoder.decodeString().let { text ->
            |        (text.toULongOrNull() ?: throw SerializationException("not a uint64: ${'$'}text")).toLong()
            |    }
            |}
            |
            |/** `bytes`, standard base64 with padding; either alphabet reads. */
            |public object ProtoBytesSerializer : KSerializer<ByteString> {
            |    override val descriptor: SerialDescriptor = PrimitiveSerialDescriptor("meshtastic.bytes", PrimitiveKind.STRING)
            |    override fun serialize(encoder: Encoder, value: ByteString): Unit = encoder.encodeString(value.base64())
            |    override fun deserialize(decoder: Decoder): ByteString = decoder.decodeString().let { text ->
            |        text.decodeBase64() ?: throw SerializationException("not base64: ${'$'}text")
            |    }
            |}
            |""".trimMargin()
    }
}

/** See [FieldMetadataRegistryHandlerFactory]: Wire instantiates this by name. */
class KotlinxSerializersHandlerFactory : SchemaHandler.Factory {
    override fun create(
        includes: List<String>,
        excludes: List<String>,
        exclusive: Boolean,
        outDirectory: String,
        options: Map<String, String>,
    ): SchemaHandler = KotlinxSerializersHandler()
}
