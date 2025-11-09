# Meshtastic Protobuf Definitions

[![CI](https://img.shields.io/github/actions/workflow/status/meshtastic/protobufs/ci.yml?branch=master&label=actions&logo=github&color=yellow)](https://github.com/meshtastic/protobufs/actions/workflows/ci.yml)
[![CLA assistant](https://cla-assistant.io/readme/badge/meshtastic/protobufs)](https://cla-assistant.io/meshtastic/protobufs)
[![Fiscal Contributors](https://opencollective.com/meshtastic/tiers/badge.svg?label=Fiscal%20Contributors&color=deeppink)](https://opencollective.com/meshtastic/)
[![Vercel](https://img.shields.io/static/v1?label=Powered%20by&message=Vercel&style=flat&logo=vercel&color=000000)](https://vercel.com?utm_source=meshtastic&utm_campaign=oss)

## Overview

The [Protobuf](https://developers.google.com/protocol-buffers) message definitions for the Meshtastic project (used by apps and the device firmware).

**[Documentation/API Reference](https://buf.build/meshtastic/protobufs)**

## Local Builds

Use `scripts/build.sh` to generate C, Rust, and TypeScript artifacts via Buf (nanopb plugin) in `build/c`, `build/rust`, `build/ts`.

- Prerequisites: `node` (including `npm`/`npx`) and `git` (used to infer the latest tag when `VERSION` is not supplied). `buf` is fetched via `npx @bufbuild/buf`.
- Optional environment variables:
  - `VERSION`: override the auto-detected tag (a leading `v` is stripped automatically).
- Run: `./scripts/build.sh`
- Result: the script wipes any previous `build` directory, copies the packages tree, replaces `__PACKAGE_VERSION__` placeholders, invokes Buf via `npx @bufbuild/buf generate`, and then runs `npm install` followed by `npm run build` inside `build/ts`. Outputs land under `build/ts` and `build/c` along with the copied package metadata.

## Stats

![Alt](https://repobeats.axiom.co/api/embed/47e9ee1d81d9c0fdd2b4b5b4c673adb1756f6db5.svg "Repobeats analytics image")
