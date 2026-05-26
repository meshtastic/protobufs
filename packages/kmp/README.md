# Meshtastic Protobufs (KMP)

This package publishes Kotlin Multiplatform models generated from the protobuf schema in this repository using [Square Wire](https://square.github.io/wire/).

## What this provides

- A single generated-model source of truth for downstream Kotlin and KMP clients.
- Kotlin/Android, Kotlin/JVM, and Kotlin/Native (iOS) artifacts from the same protobuf schema.
- Wire runtime-based models in the existing protobuf namespace (`meshtastic` package from `.proto`).
- Wire reads schema sources from `packages/kmp/proto/`, which symlinks back to the repo-root proto files.

> This package publishes Kotlin/KMP artifacts to Maven repositories. Native Swift-only distribution (for example an XCFramework/SPM package) is a separate delivery path and is not part of this module.

## Maven coordinates

```kotlin
// build.gradle.kts
implementation("org.meshtastic:protobufs:1.0.0")

// Platform-specific artifacts (resolved automatically by Gradle KMP):
//   org.meshtastic:protobufs-android
//   org.meshtastic:protobufs-jvm
//   org.meshtastic:protobufs-iosx64
//   org.meshtastic:protobufs-iosarm64
//   org.meshtastic:protobufs-iossimulatorarm64
```

## Local build

```bash
packages/kmp/gradlew -p packages/kmp clean build
```

## Publish locally

```bash
packages/kmp/gradlew -p packages/kmp publishToMavenLocal -Pversion=0.0.0-dev
```

## Publish to Maven Central

Set these environment variables:

- `ORG_GRADLE_PROJECT_mavenCentralUsername`
- `ORG_GRADLE_PROJECT_mavenCentralPassword`
- `ORG_GRADLE_PROJECT_signingInMemoryKey` (ASCII-armored private key)
- `ORG_GRADLE_PROJECT_signingInMemoryKeyPassword`

Then run:

```bash
packages/kmp/gradlew -p packages/kmp publishAndReleaseToMavenCentral -Pversion=<semver>
```
