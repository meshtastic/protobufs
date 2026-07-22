# Meshtastic Protobufs (KMP)

This package publishes Kotlin Multiplatform models generated from the protobuf schema in this repository using [Square Wire](https://square.github.io/wire/).

## What this provides

- A single generated-model source of truth for downstream Kotlin and KMP clients.
- Kotlin/Android, Kotlin/JVM, Kotlin/JS, Kotlin/Wasm (`wasmJs` and `wasmWasi`), and Kotlin/Native artifacts from the same protobuf schema.
- Wire runtime-based models in the existing protobuf namespace (`meshtastic` package from `.proto`).
- Wire reads schema sources from `packages/kmp/proto/`, which symlinks back to the repo-root proto files.

> This package publishes Kotlin/KMP artifacts to Maven repositories. Native Swift-only distribution (for example an XCFramework/SPM package) is a separate delivery path and is not part of this module.

## Field metadata

Fields in the schema can carry app/UI-relevant metadata via the `(meshtastic.field_metadata)`
field option (see `meshtastic/field_metadata.proto`). For example, GPIO pins that only matter on
DIY hardware are annotated:

```proto
uint32 rx_gpio = 8 [(meshtastic.field_metadata) = { diy_only: true }];
```

At build time a custom Wire `SchemaHandler` (in `buildSrc`) generates a reflection-free
`FieldMetadataRegistry` into the published artifact — plain Kotlin, queryable on **every** target
(JVM, Android, JS, Wasm, Native) with no reflection and no runtime cost.

Prefer the **typed accessors**, generated as extension properties on each message's companion
object — they hang directly off the real message type, so they're autocomplete-friendly with no
magic strings or field tags (the IDE auto-imports the extension on use):

```kotlin
import org.meshtastic.proto.rx_gpio // companion extension on Config.PositionConfig

// e.g. hide a DIY-only setting unless the connected device is a DIY build
if (!Config.PositionConfig.rx_gpio.diy_only || deviceIsDiy) {
    /* show the GPIO setting */
}
```

Each typed accessor is a per-field extension on the message companion, so it carries its own
import (the IDE auto-imports on use). To **enumerate** what's annotated on a message — e.g. a
settings screen iterating a message's fields — use the dynamic lookups keyed by proto message
name: `forType` returns every annotated field (keyed by tag) and `get` looks up one field:

```kotlin
// all annotated fields on a message: tag -> FieldMetadata
for ((tag, meta) in FieldMetadataRegistry.forType("meshtastic.Config.PositionConfig")) { /* … */ }

// a single field
val isDiyOnly = FieldMetadataRegistry.get("meshtastic.Config.PositionConfig", tag = 8)?.diy_only == true
```

Adding a new **scalar** attribute to the `FieldMetadata` message (e.g. `admin_only`, `unit`) is a
schema-only change — the generator serializes whatever sub-fields are set, so no build code needs
to change.

## Versioning

The SDK version is derived automatically from the latest git tag — no manual version file to maintain.

| Context | Version | Source |
|---------|---------|--------|
| Release CI (`v2.7.23` tag push) | `2.7.23` | Tag stripped of `v` prefix, passed as `-PVERSION_NAME` |
| Snapshot CI (`master` push) | `2.7.23.42-g497cd88-SNAPSHOT` | `git describe --tags --long`, `v`-stripped, count after a dot, passed as `-PVERSION_NAME` |
| Local dev (no flag) | `2.7.24-SNAPSHOT` | `git describe --tags --abbrev=0` + patch bump |
| Local override | any | `./gradlew build -PVERSION_NAME=x.y.z` |

CI snapshots keep the tag and append the commit count since it (`N`) plus the
SHA; local builds instead patch-bump. The count goes after a *dot* (`{tag}.{N}`),
which is deliberate: in Maven's ordering a dot-separated numeric segment outranks
any hyphen-nested token, so a newer commit's higher count sorts above older
snapshots — including legacy `{tag}-{sha}-SNAPSHOT` builds still in the repo whose
SHA can tokenize to a large integer — while the whole coordinate still sorts
*above* its base release and *below* the next one. Dependency bots therefore pick
the newest. A *bare* `-SNAPSHOT` sorts *below* its base, so the local fallback
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
form `{latest-tag}.{N}-g{short-sha}-SNAPSHOT` (e.g. `2.7.23.42-g497cd88-SNAPSHOT`):
`git describe --tags --long` with the `v` stripped — the latest release tag, the
commit count `N` since that tag (after a **dot**), and the 7-char commit SHA. The
dot-separated numeric `N` outranks any hyphen-nested token in Maven's ordering, so
newer commits sort *above* older snapshots — including legacy `{tag}-{sha}` builds
still in the repo — letting dependency bots pick the newest and never downgrade,
while each snapshot still sorts *above* the release it was built from yet *below*
the next release. They live in the Central Portal snapshots repository,
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
implementation("org.meshtastic:protobufs:2.7.23.42-g497cd88-SNAPSHOT")
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
