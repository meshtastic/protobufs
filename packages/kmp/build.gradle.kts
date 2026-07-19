plugins {
    kotlin("multiplatform") version "2.4.10"
    id("com.android.kotlin.multiplatform.library") version "9.2.1"
    id("com.squareup.wire") version "6.4.5"
    id("com.vanniktech.maven.publish") version "0.36.0"
}

group = providers.gradleProperty("GROUP").get()
version = providers.gradleProperty("VERSION_NAME").orElse(
    providers.provider {
        // Fallback for local builds with no -PVERSION_NAME (CI always passes it):
        // derive a snapshot version by patch-bumping the latest git tag. Any
        // failure — git missing, shallow/tagless clone, or an unexpected tag
        // format — degrades to 0.0.1-SNAPSHOT instead of breaking configuration.
        val tag = runCatching {
            val process = ProcessBuilder("git", "describe", "--tags", "--abbrev=0")
                .directory(rootDir)
                .start()
            val out = process.inputStream.bufferedReader().readText().trim()
            if (process.waitFor() == 0) out else ""
        }.getOrDefault("")

        val parts = tag.removePrefix("v").split(".")
        val major = parts.getOrNull(0)?.toIntOrNull() ?: 0
        val minor = parts.getOrNull(1)?.toIntOrNull() ?: 0
        val patch = parts.getOrNull(2)?.toIntOrNull() ?: 0
        "$major.$minor.${patch + 1}-SNAPSHOT"
    }
).get()

repositories {
    google()
    mavenCentral()
}

@OptIn(org.jetbrains.kotlin.gradle.ExperimentalWasmDsl::class)
kotlin {
    android {
        namespace = "org.meshtastic.proto"
        compileSdk = 37
        minSdk = 24
    }
    jvm()
    js {
        browser()
        nodejs()
    }
    wasmJs {
        browser()
    }
    wasmWasi {
        nodejs()
    }
    macosArm64()
    linuxX64()
    linuxArm64()
    mingwX64()
    iosX64()
    iosArm64()
    iosSimulatorArm64()
    tvosArm64()
    tvosSimulatorArm64()

    sourceSets {
        commonMain {
            dependencies {
                api("com.squareup.wire:wire-runtime:6.4.0")
            }
        }
    }

    // Suppress warnings in Wire-generated code
    compilerOptions {
        freeCompilerArgs.add("-Xwarning-level=UNNECESSARY_NOT_NULL_ASSERTION:disabled")
    }
}

tasks.withType<Jar>().configureEach {
    from(rootProject.layout.projectDirectory.file("../../LICENSE"))
}

val repoRoot = rootProject.layout.projectDirectory.dir("../../")

val syncProtos by tasks.registering(Sync::class) {
    from(repoRoot.dir("meshtastic"))
    into(layout.buildDirectory.dir("protos/meshtastic"))
}

val syncNanopb by tasks.registering(Sync::class) {
    from(repoRoot.file("nanopb.proto"))
    into(layout.buildDirectory.dir("protos"))
}

wire {
    sourcePath {
        srcDir(layout.buildDirectory.dir("protos"))
        include("meshtastic/**/*.proto")
        include("nanopb.proto")
    }
    kotlin {
        includes = listOf("meshtastic.*")

        // Flatten oneof fields into nullable properties on the parent message
        // class instead of generating intermediate sealed classes. All consumers
        // (Meshtastic-Android, TAKPacket-SDK) are written against this shape —
        // e.g. `packet.decoded`, `packet.chat`, `takPacketV2.shape` are all
        // nullable top-level properties, not sealed-class arms.
        boxOneOfsMinSize = 5000

        // Skip defensive immutable copies of repeated/map fields on decode.
        // Reduces allocations on high-frequency decode paths (mesh packets).
        makeImmutableCopies = false
    }
}

// Ensure protos are synced before Wire generates code
afterEvaluate {
    tasks.matching { it.name.startsWith("generate") && it.name.endsWith("Protos") }.configureEach {
        dependsOn(syncProtos, syncNanopb)
    }
}

mavenPublishing {
    publishToMavenCentral(automaticRelease = true)
    if (providers.gradleProperty("signingInMemoryKey").isPresent) {
        signAllPublications()
    }

    pom {
        name.set("Meshtastic Protobufs")
        description.set("Kotlin Multiplatform Wire models generated from Meshtastic protobuf definitions.")
        inceptionYear.set("2025")
        url.set("https://github.com/meshtastic/protobufs")
        licenses {
            license {
                name.set("GNU General Public License, Version 3.0")
                url.set("https://www.gnu.org/licenses/gpl-3.0.html")
                distribution.set("repo")
            }
        }
        developers {
            developer {
                id.set("meshtastic")
                name.set("Meshtastic")
                url.set("https://meshtastic.org")
            }
        }
        scm {
            url.set("https://github.com/meshtastic/protobufs")
            connection.set("scm:git:git://github.com/meshtastic/protobufs.git")
            developerConnection.set("scm:git:ssh://git@github.com/meshtastic/protobufs.git")
        }
    }
}
