#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BUILD_DIR="$REPO_DIR/build"
VERSION="${VERSION:-__PACKAGE_VERSION__}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "error: required command '$1' not found in PATH" >&2
    exit 1
  fi
}

require_cmd npx
require_cmd node
require_cmd git

resolve_version() {
  if [[ -n "$VERSION" && "$VERSION" != "__PACKAGE_VERSION__" ]]; then
    echo "${VERSION#v}"
    return 0
  fi

  if git -C "$REPO_DIR" describe --tags --abbrev=0 >/dev/null 2>&1; then
    local latest
    latest=$(git -C "$REPO_DIR" describe --tags --abbrev=0)
    echo "${latest#v}"
    return 0
  fi

  echo "error: VERSION is not set and no git tags were found. Set VERSION=... ./scripts/build.sh" >&2
  exit 1
}

VERSION="$(resolve_version)"

rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/c"

cp -R "$REPO_DIR/packages/." "$BUILD_DIR/"

node "$SCRIPT_DIR/version_replace.cjs" "$VERSION" "$BUILD_DIR"

echo "Generating artifacts with buf (via npx)..."
(cd "$REPO_DIR" && npx -y @bufbuild/buf generate)

(cd "$BUILD_DIR/ts" && npm install && npm run build)

echo "Build artifacts are available under $BUILD_DIR"

