# Meshtastic Protobuf Definitions

[![CI](https://img.shields.io/github/actions/workflow/status/meshtastic/protobufs/ci.yml?branch=master&label=actions&logo=github&color=yellow)](https://github.com/meshtastic/protobufs/actions/workflows/ci.yml)
[![CLA assistant](https://cla-assistant.io/readme/badge/meshtastic/protobufs)](https://cla-assistant.io/meshtastic/protobufs)
[![Fiscal Contributors](https://opencollective.com/meshtastic/tiers/badge.svg?label=Fiscal%20Contributors&color=deeppink)](https://opencollective.com/meshtastic/)
[![Vercel](https://img.shields.io/static/v1?label=Powered%20by&message=Vercel&style=flat&logo=vercel&color=000000)](https://vercel.com?utm_source=meshtastic&utm_campaign=oss)

## Overview

The [Protobuf](https://developers.google.com/protocol-buffers) message definitions for the Meshtastic project (used by apps and the device firmware).

**[Documentation/API Reference](https://buf.build/meshtastic/protobufs)**

## Local Builds

Use `scripts/build.sh` to generate TypeScript, Rust, and (optionally) nanopb C artifacts in `.build/ts`, `.build/rust`, and `.build/c` without touching the repository source files.

- Prerequisites: `node` (providing `npx`) and `git` (used to infer the latest tag when `VERSION` is not supplied). `buf` is fetched via `npx @bufbuild/buf`.
- Optional environment variables:
  - `VERSION`: override the auto-detected tag (a leading `v` is stripped automatically).
  - `ENABLE_PROST_CRATE=1`: re-enable the `neoeinstein-prost-crate` plugin if you need its outputs.
  - `NANOPB_PROTOC`: path to the nanopb `protoc` wrapper; if unset, nanopb codegen is skipped unless a local `nanopb-*/generator-bin/protoc` is found.
- Run: `./scripts/build.sh`
- Result: generated code and packaging metadata are copied into `.build/*`, with `__PACKAGE_VERSION__` placeholders replaced across the copied packages tree. The script writes Buf outputs directly into `.build`, copies `LICENSE`/`README.md`, and (when configured) produces nanopb C sources.

## Stats

![Alt](https://repobeats.axiom.co/api/embed/47e9ee1d81d9c0fdd2b4b5b4c673adb1756f6db5.svg "Repobeats analytics image")
