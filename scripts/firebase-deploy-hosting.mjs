#!/usr/bin/env node
/**
 * Deploy the static `out/` export to Firebase Hosting.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("Missing out/ — run npm run build first.");
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["firebase-tools@latest", "deploy", "--only", "hosting", "--non-interactive"],
  {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);

process.exit(result.status ?? 1);
