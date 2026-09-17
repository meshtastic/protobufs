//
//  protoc-gen-fieldmeta-swift
//
//  A pure-Swift protoc plugin that emits FieldMetadataRegistry.swift for
//  (meshtastic.field_metadata) options - the Swift-native sibling of the Go
//  protoc-gen-fieldmeta in ../protoc-gen-fieldmeta, for consumers whose
//  toolchain is already swift-protobuf based (e.g. Meshtastic-Apple).
//  Output is byte-identical to the Go plugin's swift target.
//
//  Built on SwiftProtobufPluginLibrary - the same library protoc-gen-swift itself
//  uses - so Swift type paths (`Config.PositionConfig`) and property names
//  (`rxGpio`) match the real generated code BY CONSTRUCTION (same NamingUtils),
//  rather than by reimplementing snake_case→camelCase and hoping it agrees.
//

import Foundation
import SwiftProtobuf
import SwiftProtobufPluginLibrary

@main
struct FieldMetaSwiftGenerator: CodeGenerator {

    var supportedFeatures: [Google_Protobuf_Compiler_CodeGeneratorResponse.Feature] {
        [.proto3Optional]
    }

    // Registering the extensions here is what makes `field.options.fieldMetadata`
    // and `value.options.enumValueMetadata` decode as typed values instead of
    // landing in unknownFields.
    var customOptionExtensions: [any AnyMessageExtension] {
        [Extensions_field_metadata, Extensions_enum_value_metadata]
    }

    var version: String? { "1.0.0 (swift)" }

    /// One annotated field or enum value. For an enum value, `protoTypeName` is the
    /// enum's full name, `protoFieldName` is the value's name and `tag` is its number -
    /// the shapes are identical, so one registry and one key format serve both.
    struct Entry {
        let isEnumValue: Bool
        let swiftTypePath: String     // e.g. Config.PositionConfig
        let protoTypeName: String     // e.g. meshtastic.Config.PositionConfig
        let protoFieldName: String    // e.g. rx_gpio (ordering key, matches the Go plugin)
        let tag: Int32
        let metadata: FieldMetadata
        // Mirrored from the field's standard `[deprecated = true]` option (not
        // from the custom annotation); surfaced as the `deprecated` attribute.
        let deprecated: Bool
    }

    func generate(
        files: [FileDescriptor],
        parameter: any CodeGeneratorParameter,
        protoCompilerContext: any ProtoCompilerContext,
        generatorOutputs: any GeneratorOutputs
    ) throws {
        // Locate the FieldMetadata message descriptor (drives the emitted struct's
        // shape, so a schema-only attribute addition needs no plugin change).
        var metadataDescriptor: Descriptor?
        for file in files {
            if let d = file.messages.first(where: { $0.fullName == "meshtastic.FieldMetadata" }) {
                metadataDescriptor = d
                break
            }
        }
        guard let metadataDescriptor else {
            throw GenError.message("meshtastic.FieldMetadata not found among the input protos - include meshtastic/field_metadata.proto")
        }
        // Scalar-only guard, mirroring the Go plugin's hard errors. 64-bit integer
        // kinds are rejected as well: TypeScript's number holds 53 bits and the typed
        // targets declare Int64, so only a 32-bit kind is exact on every target.
        for f in metadataDescriptor.fields {
            guard swiftScalarType(for: f.type) != nil, !f.isRepeated else {
                throw GenError.message("FieldMetadata.\(f.name): attributes must be scalar (bool / 32-bit int / float / string), not repeated/message/enum/bytes")
            }
            if is64BitInt(f.type) {
                throw GenError.message("FieldMetadata.\(f.name): 64-bit integer attributes are not supported (TypeScript's number cannot hold a \(f.type) exactly); use a 32-bit kind")
            }
        }

        var entries: [Entry] = []
        for file in files {
            let namer = SwiftProtobufNamer()

            // A picker's options and a bitfield's flags are enum values, so enums are
            // walked alongside messages.
            func collectEnums(_ enums: [EnumDescriptor]) throws {
                for enumDescriptor in enums {
                    // allow_alias lets two values share a number, and the registry is keyed
                    // by number: a second metadata-bearing alias would be a duplicate row and
                    // a duplicate dictionary key below, so it is rejected (as in the Go plugin).
                    var claimed: [Int32: String] = [:]
                    for value in enumDescriptor.values
                    where value.options.hasEnumValueMetadata || value.options.deprecated {
                        if value.options.enumValueMetadata.hasDeprecated {
                            throw GenError.message(
                                "\(enumDescriptor.fullName).\(value.name): the \"deprecated\" attribute is generator-managed and cannot be set in (meshtastic.enum_value_metadata); mark the value `[deprecated = true]` instead and it is mirrored automatically"
                            )
                        }
                        if let first = claimed[value.number] {
                            throw GenError.message(
                                "\(enumDescriptor.fullName): values \(first) and \(value.name) share number \(value.number); metadata (or [deprecated = true]) can be attached to only one alias of a number"
                            )
                        }
                        claimed[value.number] = value.name
                        entries.append(Entry(
                            isEnumValue: true,
                            swiftTypePath: namer.fullName(enum: enumDescriptor),
                            protoTypeName: enumDescriptor.fullName,
                            protoFieldName: value.name,
                            tag: value.number,
                            metadata: value.options.enumValueMetadata,
                            deprecated: value.options.deprecated
                        ))
                    }
                }
            }

            try collectEnums(file.enums)

            var stack = file.messages
            while !stack.isEmpty {
                let message = stack.removeFirst()
                stack.append(contentsOf: message.messages)
                try collectEnums(message.enums)
                // A field earns an entry if it carries the custom annotation OR
                // the standard `deprecated` option (which we mirror below).
                for field in message.fields where field.options.hasFieldMetadata || field.options.deprecated {
                    // `deprecated` is generator-managed (mirrored from the standard
                    // option); a hand-set value in the annotation is a hard error,
                    // matching the Go plugin, so the generators can't disagree.
                    if field.options.fieldMetadata.hasDeprecated {
                        throw GenError.message(
                            "\(message.fullName).\(field.name): the \"deprecated\" attribute is generator-managed and cannot be set in (meshtastic.field_metadata); mark the field `[deprecated = true]` instead and it is mirrored automatically"
                        )
                    }
                    entries.append(Entry(
                        isEnumValue: false,
                        swiftTypePath: namer.fullName(message: message),
                        protoTypeName: message.fullName,
                        protoFieldName: field.name,
                        tag: field.number,
                        metadata: field.options.fieldMetadata,
                        deprecated: field.options.deprecated
                    ))
                }
            }
        }

        try checkDuplicateLabels(entries)

        var out = "// DO NOT EDIT -- generated by protoc-gen-fieldmeta from (meshtastic.field_metadata) options.\n\n"

        // The FieldMetadata struct, shaped by the schema.
        out += "public struct FieldMetadata {\n"
        for f in metadataDescriptor.fields {
            out += "    public var \(NamingUtils.toLowerCamelCase(f.name)): \(swiftScalarType(for: f.type)!)? = nil\n"
        }
        out += "}\n\n"

        // Message fields get NO typed accessor - look them up by tag.
        //
        // An accessor keyed on the field's name is only stable where the generated
        // name IS the proto name. Wire keeps snake_case, so the Kotlin handler can
        // hang `Config.PositionConfig.rx_gpio` off the companion and have it mean what
        // the schema says. swift-protobuf renames - `sx126x_rx_boosted_gain` becomes
        // `sx126XRxBoostedGain` - so the Swift accessor was keyed on a name
        // swift-protobuf chooses, not one this schema controls. The tag is the only key
        // stable by contract, which makes the dynamic lookup the real API here.
        //
        // It also collided. A static named after the field competes with the message's
        // own instance property of that name once the generated types are in a
        // different module from the consumer, which breaks writes at the call site.
        //
        // Enums are unaffected and keep a single INSTANCE property, looked up by
        // rawValue, rather than one static per value. An instance property shadows
        // nothing, and keying on rawValue avoids reimplementing swift-protobuf's
        // enum-case naming, which is exactly where an independent implementation
        // would drift.
        var enumGrouped: [String: String] = [:]
        for e in entries where e.isEnumValue {
            enumGrouped[e.swiftTypePath] = e.protoTypeName
        }
        for typePath in enumGrouped.keys.sorted() {
            out += "extension \(typePath) {\n"
            out += "    /// Metadata for this value, or nil if it carries none.\n"
            out += "    public var metadata: FieldMetadata? { FieldMetadataRegistry.get(\(swiftStringLiteral(enumGrouped[typePath]!)), tag: rawValue) }\n"
            out += "}\n\n"
        }

        // Low-level table + dynamic lookup. Entries sorted by (proto type, tag),
        // matching the Go plugin.
        out += "public enum FieldMetadataRegistry {\n"
        out += "    // Keyed by \"\\(messageType)#\\(tag)\".\n"
        out += "    static let registry: [String: FieldMetadata] = [\n"
        let sortedEntries = entries.sorted { a, b in
            a.protoTypeName != b.protoTypeName ? a.protoTypeName < b.protoTypeName : a.tag < b.tag
        }
        for e in sortedEntries {
            out += "        \"\(e.protoTypeName)#\(e.tag)\": \(try literal(for: e, shape: metadataDescriptor)),\n"
        }
        out += "    ]\n\n"
        out += "    /// Metadata for the field with `tag` on `messageType`, or nil.\n"
        out += "    public static func get(_ messageType: String, tag: Int) -> FieldMetadata? {\n"
        out += "        return registry[\"\\(messageType)#\\(tag)\"]\n"
        out += "    }\n"
        out += "}\n"

        try generatorOutputs.add(fileName: "FieldMetadataRegistry.swift", contents: out)
    }

    /// FieldMetadata(...) literal with only the explicitly-set attributes.
    ///
    /// Values are read generically by traversing the decoded option, so a new scalar
    /// attribute needs no change here - the Swift counterpart of the Go plugin's
    /// protoreflect `Range`. Args come out in schema declaration order, matching the Go
    /// plugin's Swift target, so the two stay byte-identical even when a field carries
    /// more than one attribute. `deprecated` is sourced from the entry's mirrored
    /// standard option, not from the custom-annotation `metadata`.
    private func literal(for entry: Entry, shape: Descriptor) throws -> String {
        var collector = AttributeCollector()
        try entry.metadata.traverse(visitor: &collector)

        // An attribute this plugin's bundled field_metadata.pb.swift predates decodes
        // into unknownFields instead of a property, so it would vanish from the output.
        // Fail loudly rather than dropping metadata silently; the fix is to regenerate
        // the binding (see README, "Regenerating the bundled field_metadata.pb.swift").
        if !entry.metadata.unknownFields.data.isEmpty {
            throw GenError.message(
                "\(entry.protoTypeName).\(entry.protoFieldName) sets a field_metadata attribute this plugin's bundled field_metadata.pb.swift does not know; regenerate it (see tools/protoc-gen-fieldmeta-swift/README.md)"
            )
        }

        var args: [(name: String, rendered: String)] = []
        for f in shape.fields {
            let label = NamingUtils.toLowerCamelCase(f.name)
            // `deprecated` is generator-managed: mirrored from the field's standard
            // option rather than read from the annotation, matching the Go plugin's
            // upsertBool. Every other attribute is read generically below.
            if f.name == "deprecated" {
                if entry.deprecated { args.append((f.name, "\(label): true")) }
                continue
            }
            guard let value = collector.values[Int(f.number)] else { continue }
            args.append((f.name, "\(label): \(try render(value, attribute: f.name, of: entry))"))
        }
        // Schema declaration order, which `shape.fields` already gives us - NOT sorted
        // by name as the other targets do. Swift's memberwise initializer requires
        // arguments in property-declaration order, and the properties above are emitted
        // from the same schema, so a field carrying more than one attribute would not
        // compile if these disagreed.
        return "FieldMetadata(\(args.map(\.rendered).joined(separator: ", ")))"
    }

    /// Rejects two fields of the same message, or two values of the same enum, carrying
    /// the same label. Mirrors the Go plugin's `checkDuplicateLabels`.
    ///
    /// A label is the display name every client shows and translates from, so within one
    /// type it has to identify which setting is which. Duplicates are indistinguishable to
    /// a user and are nearly always a seeding mistake rather than intent - five
    /// TrafficManagementConfig fields once came out labelled "Enabled" because the tool
    /// lifting them from a client matched the wrong control. That failure is invisible
    /// otherwise: the annotation is present and syntactically valid, just wrong.
    ///
    /// Scoped per type, not globally - "Enabled" once each on MQTTConfig and SerialConfig
    /// is fine, since the screen around it says which is which.
    private func checkDuplicateLabels(_ entries: [Entry]) throws {
        var seen: [String: [String: String]] = [:]
        var problems: [String] = []
        for entry in entries where entry.metadata.hasLabel && !entry.metadata.label.isEmpty {
            let label = entry.metadata.label
            if let first = seen[entry.protoTypeName]?[label] {
                problems.append("\(entry.protoTypeName): \(first) and \(entry.protoFieldName) both use label \"\(label)\"")
                continue
            }
            seen[entry.protoTypeName, default: [:]][label] = entry.protoFieldName
        }
        guard problems.isEmpty else {
            throw GenError.message("duplicate labels within a type:\n  " + problems.sorted().joined(separator: "\n  "))
        }
    }

    /// Renders one attribute value. Non-string attributes become plain literals;
    /// STRING attributes are user-facing display text (see field_metadata.proto) and
    /// become `String(localized:defaultValue:comment:)`, so Xcode's string-catalog
    /// extractor picks them up out of the generated file. The English in the schema is
    /// then the source string and translations live in the consuming app's catalog
    /// rather than in the wire schema.
    ///
    /// The catalog key is the field's full proto name plus the attribute, not the
    /// English: labels repeat across the schema ("Enabled" many times over), and a
    /// shared key would force one translation on all of them, which languages that
    /// inflect cannot do.
    private func render(_ value: AttributeCollector.Value, attribute: String, of entry: Entry) throws -> String {
        switch value {
        case .bool(let b): return "\(b)"
        case .double(let d):
            // An open bound is left unset: there is no portable literal for inf/nan,
            // and the Go plugin rejects them the same way.
            guard d.isFinite else {
                throw GenError.message("float attributes must be finite (leave a bound unset instead): \(entry.protoTypeName).\(entry.protoFieldName): \(attribute) is \(d)")
            }
            return decimalFloat(d)
        case .int(let i): return "\(i)"
        // Exact: the schema guard rejects 64-bit kinds, so this is at most UInt32.max.
        case .uint(let u): return "\(u)"
        case .string(let s):
            let full = "\(entry.protoTypeName).\(entry.protoFieldName)"
            return "String(localized: \(swiftStringLiteral("\(full).\(attribute)"))"
                + ", defaultValue: \(swiftStringLiteral(s))"
                + ", comment: \(swiftStringLiteral("\(attribute) of \(full)")))"
        }
    }

    /// Shortest decimal form that round-trips, never in exponent notation, with a
    /// trailing `.0` on integral values so the literal types as `Double`. Mirrors the
    /// Go plugin's `decimalFloat`, which is `strconv.FormatFloat(f, 'f', -1, 64)`.
    private func decimalFloat(_ d: Double) -> String {
        // Fixed locale: the decimal separator must be "." whatever the host is set to.
        let posix = Locale(identifier: "en_US_POSIX")
        for precision in 0...17 {
            let s = String(format: "%.\(precision)f", locale: posix, d)
            if Double(s) == d {
                return s.contains(".") ? s : s + ".0"
            }
        }
        let s = String(format: "%.17f", locale: posix, d)
        return s.contains(".") ? s : s + ".0"
    }

    /// Swift type for a FieldMetadata attribute. Integer kinds all widen to `Int64` and
    /// float to `Double`, matching the Go plugin's `swiftType` - the two must agree or
    /// the emitted struct definitions diverge. Returns nil for non-scalars, which drives
    /// the scalar-only guard; 64-bit kinds pass here and are rejected by `is64BitInt`.
    private func swiftScalarType(for type: Google_Protobuf_FieldDescriptorProto.TypeEnum) -> String? {
        switch type {
        case .bool: return "Bool"
        case .double, .float: return "Double"
        case .string: return "String"
        case .int32, .sint32, .sfixed32, .int64, .sint64, .sfixed64: return "Int64"
        case .uint32, .fixed32, .uint64, .fixed64: return "Int64"
        default: return nil
        }
    }

    private func is64BitInt(_ type: Google_Protobuf_FieldDescriptorProto.TypeEnum) -> Bool {
        switch type {
        case .int64, .sint64, .sfixed64, .uint64, .fixed64: return true
        default: return false
        }
    }

    private func swiftStringLiteral(_ s: String) -> String {
        var escaped = ""
        for c in s.unicodeScalars {
            switch c {
            case "\"": escaped += "\\\""
            case "\\": escaped += "\\\\"
            case "\n": escaped += "\\n"
            case "\r": escaped += "\\r"
            case "\t": escaped += "\\t"
            default: escaped.unicodeScalars.append(c)
            }
        }
        return "\"\(escaped)\""
    }

    /// Collects the attributes a FieldMetadata value actually sets, keyed by field
    /// number. This is the Swift counterpart of the Go plugin's protoreflect `Range`:
    /// `traverse` visits only fields that are present, so a new scalar attribute is
    /// picked up with no change here.
    ///
    /// Only the widest case of each family is implemented. `Visitor`'s forwarding
    /// defaults widen 32-bit and sint/fixed/sfixed variants into these, which is also
    /// what the Go plugin's `goValue` does, so the two agree on rendering.
    struct AttributeCollector: SwiftProtobuf.Visitor {
        enum Value {
            case bool(Bool)
            case double(Double)
            case int(Int64)
            case uint(UInt64)
            case string(String)
        }

        var values: [Int: Value] = [:]

        mutating func visitSingularBoolField(value: Bool, fieldNumber: Int) throws {
            values[fieldNumber] = .bool(value)
        }
        mutating func visitSingularDoubleField(value: Double, fieldNumber: Int) throws {
            values[fieldNumber] = .double(value)
        }
        mutating func visitSingularInt64Field(value: Int64, fieldNumber: Int) throws {
            values[fieldNumber] = .int(value)
        }
        mutating func visitSingularUInt64Field(value: UInt64, fieldNumber: Int) throws {
            values[fieldNumber] = .uint(value)
        }
        mutating func visitSingularStringField(value: String, fieldNumber: Int) throws {
            values[fieldNumber] = .string(value)
        }
        // The scalar-only guard rejects non-scalar attributes before any value is read,
        // so the rest of the protocol is unreachable. Throwing keeps it that way: if the
        // guard is ever loosened, generation stops instead of emitting a literal with a
        // silently missing attribute.
        mutating func visitUnknown(bytes: Data) throws {}

        mutating func visitSingularBytesField(value: Data, fieldNumber: Int) throws {
            throw GenError.message("field_metadata attribute \(fieldNumber) is bytes; attributes must be scalar")
        }
        mutating func visitSingularEnumField<E: Enum>(value: E, fieldNumber: Int) throws {
            throw GenError.message("field_metadata attribute \(fieldNumber) is an enum; attributes must be scalar")
        }
        mutating func visitSingularMessageField<M: Message>(value: M, fieldNumber: Int) throws {
            throw GenError.message("field_metadata attribute \(fieldNumber) is a message; attributes must be scalar")
        }
        mutating func visitMapField<KeyType, ValueType: MapValueType>(
            fieldType: _ProtobufMap<KeyType, ValueType>.Type,
            value: _ProtobufMap<KeyType, ValueType>.BaseType,
            fieldNumber: Int
        ) throws {
            throw GenError.message("field_metadata attribute \(fieldNumber) is a map; attributes must be scalar")
        }
        mutating func visitMapField<KeyType, ValueType>(
            fieldType: _ProtobufEnumMap<KeyType, ValueType>.Type,
            value: _ProtobufEnumMap<KeyType, ValueType>.BaseType,
            fieldNumber: Int
        ) throws where ValueType.RawValue == Int {
            throw GenError.message("field_metadata attribute \(fieldNumber) is a map; attributes must be scalar")
        }
        mutating func visitMapField<KeyType, ValueType>(
            fieldType: _ProtobufMessageMap<KeyType, ValueType>.Type,
            value: _ProtobufMessageMap<KeyType, ValueType>.BaseType,
            fieldNumber: Int
        ) throws {
            throw GenError.message("field_metadata attribute \(fieldNumber) is a map; attributes must be scalar")
        }
    }

    enum GenError: Error, CustomStringConvertible {
        case message(String)
        var description: String {
            switch self { case .message(let m): return m }
        }
    }
}
