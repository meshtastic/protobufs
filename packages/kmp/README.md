# Meshtastic Protobufs (KMP)

This package publishes Kotlin Multiplatform models generated from the protobuf schema in this repository using [Square Wire](https://square.github.io/wire/).

## What this provides

- A single generated-model source of truth for downstream Kotlin and KMP clients.
- Kotlin/Android, Kotlin/JVM, and Kotlin/Native (iOS) artifacts from the same protobuf schema.
- Wire runtime-based models in the existing protobuf namespace (`meshtastic` package from `.proto`).
- Wire reads schema sources from `packages/kmp/proto/`, which symlinks back to the repo-root proto files.

> This package publishes Kotlin/KMP artifacts to Maven repositories. Native Swift-only distribution (for example an XCFramework/SPM package) is a separate delivery path and is not part of this module.

## Versioning

The SDK version is derived automatically from the latest git tag — no manual version file to maintain.

| Context | Version | Source |
|---------|---------|--------|
| Release CI (`v2.7.23` tag push) | `2.7.23` | Tag stripped of `v` prefix, passed as `-PVERSION_NAME` |
| Snapshot CI (master push) | `2.7.24-SNAPSHOT` | Latest tag + patch bump, computed in workflow |
| Local dev (no flag) | `2.7.24-SNAPSHOT` | `git describe --tags --abbrev=0` + patch bump |
| Local override | any | `./gradlew build -PVERSION_NAME=x.y.z` |

If no `-PVERSION_NAME` is supplied and no tag can be resolved (git missing, or a
shallow/tagless clone), the fallback degrades to `0.0.1-SNAPSHOT` rather than
failing the build.

## Maven coordinates

```kotlin
// build.gradle.kts
implementation("org.meshtastic:protobufs:2.7.23")

// Platform-specific artifacts (resolved automatically by Gradle KMP):
//   org.meshtastic:protobufs-android
//   org.meshtastic:protobufs-jvm
//   org.meshtastic:protobufs-iosx64
//   org.meshtastic:protobufs-iosarm64
//   org.meshtastic:protobufs-iossimulatorarm64
```

### Snapshots

Snapshot builds (published from `master`) live in the Central Portal snapshots
repository, not on the main Maven Central CDN. To consume them, add that
repository alongside `mavenCentral()` and depend on a `-SNAPSHOT` version:

```kotlin
// settings.gradle.kts (or build.gradle.kts)
repositories {
  mavenCentral()
  maven("https://central.sonatype.com/repository/maven-snapshots/") {
        mavenContent { snapshotsOnly() }
  }
}

// build.gradle.kts
implementation("org.meshtastic:protobufs:2.7.24-SNAPSHOT")
```

## Local build

```bash
packages/kmp/gradlew -p packages/kmp clean build
```

## Publish locally

```bash
packages/kmp/gradlew -p packages/kmp publishToMavenLocal -PVERSION_NAME=2.7.23
```

## Publish to Maven Central

Set these environment variables:

- `ORG_GRADLE_PROJECT_mavenCentralUsername`
- `ORG_GRADLE_PROJECT_mavenCentralPassword`
- `ORG_GRADLE_PROJECT_signingInMemoryKey` (ASCII-armored private key)

Then run:

```bash
packages/kmp/gradlew -p packages/kmp publishAllPublicationsToMavenCentralRepository -PVERSION_NAME=2.7.23
```
