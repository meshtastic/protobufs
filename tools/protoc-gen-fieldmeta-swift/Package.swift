// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "protoc-gen-fieldmeta-swift",
    platforms: [.macOS(.v10_15)],
    dependencies: [
        // 1.36.1 is the verified floor (the plugin uses SwiftProtobufPluginLibrary's
        // customOptionExtensions hook). Consumers should let this resolve to the same
        // swift-protobuf version their own codegen uses so the naming engine matches.
        .package(url: "https://github.com/apple/swift-protobuf.git", from: "1.36.1")
    ],
    targets: [
        .executableTarget(
            name: "protoc-gen-fieldmeta-swift",
            dependencies: [
                .product(name: "SwiftProtobuf", package: "swift-protobuf"),
                .product(name: "SwiftProtobufPluginLibrary", package: "swift-protobuf")
            ]
        )
    ]
)
