# Meshtastic Protobufs (KMP)

This package publishes Kotlin Multiplatform models generated from the protobuf schema in this repository using [Square Wire](https://square.github.io/wire/).

## What this provides

- A single generated-model source of truth for downstream Kotlin and KMP clients.
- Kotlin/Android, Kotlin/JVM, Kotlin/JS, Kotlin/Wasm (`wasmJs` and `wasmWasi`), and Kotlin/Native artifacts from the same protobuf schema.
- Wire runtime-based models in the existing protobuf namespace (`meshtastic` package from `.proto`).
- Wire reads schema sources from `packages/kmp/proto/`, which symlinks back to the repo-root proto files.

> This package publishes Kotlin/KMP artifacts to Maven repositories. Native Swift-only distribution (for example an XCFramework/SPM package) is a separate delivery path and is not part of this module.

## Versioning

The SDK version is derived automatically from the latest git tag — no manual version file to maintain.

| Context | Version | Source |
|---------|---------|--------|
| Release CI (`v2.7.23` tag push) | `2.7.23` | Tag stripped of `v` prefix, passed as `-PVERSION_NAME` |
| Snapshot CI (`master` push) | `2.7.23-497cd88-SNAPSHOT` | Latest tag, `v`-stripped + short commit SHA, passed as `-PVERSION_NAME` |
| Local dev (no flag) | `2.7.24-SNAPSHOT` | `git describe --tags --abbrev=0` + patch bump |
| Local override | any | `./gradlew build -PVERSION_NAME=x.y.z` |

CI snapshots keep the tag and append the SHA; local builds instead patch-bump.
The difference is deliberate: a `-<sha>` suffix is a build qualifier that sorts
*above* its base version, so CI can name the current tag and still land above
the release. A *bare* `-SNAPSHOT` sorts *below* its base, so the local fallback
names the next version to stay ahead of the last release. Both land between the
last and next release.

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
//   org.meshtastic:protobufs-js
//   org.meshtastic:protobufs-wasm-js
//   org.meshtastic:protobufs-wasm-wasi
//   org.meshtastic:protobufs-iosx64
//   org.meshtastic:protobufs-iosarm64
//   org.meshtastic:protobufs-iossimulatorarm64
//   org.meshtastic:protobufs-tvosarm64
//   org.meshtastic:protobufs-tvossimulatorarm64
//   org.meshtastic:protobufs-macosarm64
//   org.meshtastic:protobufs-linuxx64
//   org.meshtastic:protobufs-linuxarm64
//   org.meshtastic:protobufs-mingwx64
```

### Snapshots

Every push to `master` publishes a snapshot under a unique coordinate of the
form `{latest-tag}-{short-sha}-SNAPSHOT` (e.g. `2.7.23-497cd88-SNAPSHOT`): the
latest release tag with its `v` stripped, plus the 7-char commit SHA. The
`-<sha>` suffix is a build qualifier, so Maven sorts each snapshot *above* the
release it was built from (dependency bots never propose a downgrade) yet
*below* the next release. They live in the Central Portal snapshots repository,
not on the main Maven Central CDN. To consume them, add that repository
alongside `mavenCentral()`:

```kotlin
// settings.gradle.kts (or build.gradle.kts)
repositories {
  mavenCentral()
  maven("https://central.sonatype.com/repository/maven-snapshots/") {
        mavenContent { snapshotsOnly() }
  }
}

// build.gradle.kts — pin a specific published snapshot
implementation("org.meshtastic:protobufs:2.7.23-497cd88-SNAPSHOT")
```

Each `master` push produces a new coordinate, so pin a specific one and bump it
(e.g. via Renovate) as newer snapshots publish.

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
