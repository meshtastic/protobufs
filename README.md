# Meshtastic-protobufs
[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/meshtastic/Meshtastic-protobufs)
[![CI](https://github.com/meshtastic/Meshtastic-protobufs/actions/workflows/ci.yml/badge.svg)](https://github.com/meshtastic/Meshtastic-protobufs/actions/workflows/ci.yml)
[![CLA assistant](https://cla-assistant.io/readme/badge/meshtastic/Meshtastic-protobufs)](https://cla-assistant.io/meshtastic/Meshtastic-protobufs)

The protobuf definitions for the Meshtastic project (used by apps and the device code)

For questions on using these protobufs please post in our [forum](meshtastic.discourse.group). We are friendly and we love people building/extending this work.

For documentation please visit:
* [Meshtastic Docs](https://meshtastic.org/docs/developers/protobufs/api).

For more information on protobufs (and tools to use them with the language of your choice) see
* https://developers.google.com/protocol-buffers/docs/proto3

We are not placing any of these defs inside a package, because if you do the
resulting nanopb version is super verbose package mesh.

Protobuf build instructions:
* To build java classes for reading writing:
* protoc -I=. --java_out /tmp mesh.proto

To generate Nanopb c code:
* /home/kevinh/packages/nanopb-0.4.4-linux-x86/generator-bin/protoc --nanopb_out=/tmp -I=app/src/main/proto mesh.proto

Nanopb binaries available here:
* https://jpa.kapsi.fi/nanopb/download/ use nanopb 0.4.4

To lint:
* Install protolint: brew tap yoheimuta/protolint; brew install protolint
* Run it from the main directory: *protolint* lint .
* (optional) Have it fix the mundane warnings: *protolint* lint -fix .
* See https://github.com/yoheimuta/protolint for more info
