plugins {
    kotlin("multiplatform") version "2.3.21"
    id("com.android.kotlin.multiplatform.library") version "9.2.1"
    id("com.squareup.wire") version "6.4.0"
    id("com.vanniktech.maven.publish") version "0.36.0"
}

group = providers.gradleProperty("GROUP").get()
version = providers.gradleProperty("version").orElse("0.0.0-SNAPSHOT").get()

repositories {
    google()
    mavenCentral()
}

kotlin {
    android {
        namespace = "org.meshtastic.proto"
        compileSdk = 37
        minSdk = 24
    }
    jvm()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        commonMain.dependencies {
            api("com.squareup.wire:wire-runtime:6.4.0")
        }
    }

    // Suppress warnings in Wire-generated code
    compilerOptions {
        freeCompilerArgs.add("-Xwarning-level=UNNECESSARY_NOT_NULL_ASSERTION:disabled")
    }
}

wire {
    sourcePath {
        srcDir("proto")
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

mavenPublishing {
    if (providers.gradleProperty("signingInMemoryKey").isPresent) {
        signAllPublications()
    }
}
