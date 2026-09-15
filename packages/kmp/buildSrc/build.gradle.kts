plugins {
    `kotlin-dsl`
}

repositories {
    google()
    mavenCentral()
}

dependencies {
    // Build-time only: lets the custom Wire SchemaHandler walk the parsed schema and read
    // the (meshtastic.field_metadata) field options. NOT shipped in any published artifact.
    implementation("com.squareup.wire:wire-schema:6.4.0")
}
