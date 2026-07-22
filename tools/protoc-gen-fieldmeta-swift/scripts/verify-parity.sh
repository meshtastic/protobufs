#!/usr/bin/env bash
#
# Verifies that the two field-metadata generators emit BYTE-IDENTICAL output
# over the repo's real schema:
#
#   - protoc-gen-fieldmeta       (Go, `target=swift`)  ../protoc-gen-fieldmeta
#   - protoc-gen-fieldmeta-swift (pure Swift)          this directory
#
# They are advertised as interchangeable; this turns that promise into an
# enforced check (CI runs it; run it locally after touching either generator).
#
# Requires `buf`, `go`, and `swift` on PATH. Safe to run from any directory.
set -euo pipefail

repo_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
cd "$repo_root"

swift_pkg="tools/protoc-gen-fieldmeta-swift"
swift_bin="$repo_root/$swift_pkg/.build/release/protoc-gen-fieldmeta-swift"

echo "==> Building protoc-gen-fieldmeta-swift (release)"
swift build -c release --package-path "$swift_pkg"

workdir=$(mktemp -d)
trap 'rm -rf "$workdir"' EXIT
mkdir -p "$workdir/go" "$workdir/swift"

# Two throwaway buf templates, each running one generator. `--path meshtastic`
# (below) scopes generation to the schema and keeps buf from scanning the Swift
# package's SwiftPM checkout under .build/, which contains unrelated test protos.
cat > "$workdir/go.gen.yaml" <<EOF
version: v2
plugins:
  - local: ["go", "run", "-C", "tools/protoc-gen-fieldmeta", "."]
    out: $workdir/go
    opt: target=swift
EOF
cat > "$workdir/swift.gen.yaml" <<EOF
version: v2
plugins:
  - local: ["$swift_bin"]
    out: $workdir/swift
EOF

echo "==> Generating with the Go plugin (target=swift)"
buf generate --template "$workdir/go.gen.yaml" --path meshtastic
echo "==> Generating with the pure-Swift plugin"
buf generate --template "$workdir/swift.gen.yaml" --path meshtastic

echo "==> Diffing"
if diff -u "$workdir/go/FieldMetadataRegistry.swift" "$workdir/swift/FieldMetadataRegistry.swift"; then
  echo "✅ Go and Swift generators are byte-identical"
else
  echo "❌ Generators diverged — update whichever plugin changed so their output matches." >&2
  exit 1
fi
