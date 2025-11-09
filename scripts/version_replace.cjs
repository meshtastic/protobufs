#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PLACEHOLDER = "__PACKAGE_VERSION__";

function replaceInFile(filePath, sanitizedVersion) {
  try {
    const text = fs.readFileSync(filePath, "utf8");
    if (text.includes(PLACEHOLDER)) {
      fs.writeFileSync(
        filePath,
        text.split(PLACEHOLDER).join(sanitizedVersion),
        "utf8"
      );
    }
  } catch (err) {
    if (err.code === "ENOENT" || err.code === "EISDIR") {
      return;
    }
    if (
      err instanceof SyntaxError ||
      err.code === "ERR_INVALID_ARG_TYPE" ||
      err.code === "EBADF"
    ) {
      return;
    }
    throw err;
  }
}

function walkDir(dir, sanitizedVersion) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, sanitizedVersion);
    } else if (entry.isFile()) {
      replaceInFile(fullPath, sanitizedVersion);
    }
  }
}

function main() {
  const [, , version, targetDir] = process.argv;
  if (!version || !targetDir) {
    console.error("usage: version_replace.cjs VERSION DIRECTORY");
    process.exit(1);
  }

  const sanitized = version.replace(/\//g, "-");
  if (!fs.existsSync(targetDir)) {
    console.error(`error: ${targetDir} does not exist`);
    process.exit(1);
  }

  walkDir(targetDir, sanitized);
}

main();
