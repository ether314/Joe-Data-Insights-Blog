/**
 * Fix Next.js static-export RSC segment payload filenames on Windows.
 *
 * Next 16.2.10's exporter derives each payload filename from a path produced
 * with `path.relative`, which yields backslashes on win32. The subsequent
 * `convertSegmentPathToStaticExportFilename` only replaces "/" with ".", so
 * dynamic-segment payloads end up written as NESTED directories
 * (e.g. `out/category/x/__next.category/$d$slug/__PAGE__.txt`) while the
 * client router fetches the dot-flattened name
 * (`__next.category.$d$slug.__PAGE__.txt`) — every such prefetch 404s.
 *
 * This script walks `out/`, finds any `__next*` DIRECTORY (a misplaced
 * payload tree), and copies each contained payload to its correctly
 * flattened sibling filename at the route level. Nested leftovers are kept
 * (harmless); idempotent across repeated runs.
 *
 * Usage: node scripts/fix-segment-payloads.mjs [outDir]
 */
import fs from "node:fs";
import path from "node:path";

const outDir = process.argv[2] || "out";

if (!fs.existsSync(outDir)) {
  console.error(`fix-segment-payloads: ${outDir} does not exist; nothing to do.`);
  process.exit(1);
}

let fixed = 0;
let scannedDirs = 0;

/** Recursively flatten a misplaced `__next*` payload directory. */
function flattenPayloadDir(routeDir, dirName, relParts, absDir) {
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      flattenPayloadDir(routeDir, dirName, [...relParts, entry.name], path.join(absDir, entry.name));
    } else if (entry.isFile() && entry.name.endsWith(".txt")) {
      const stem = entry.name.slice(0, -".txt".length);
      const flattened = [dirName, ...relParts, stem].join(".") + ".txt";
      const src = path.join(absDir, entry.name);
      const dest = path.join(routeDir, flattened);
      // Copy only when missing or different, so repeated builds stay cheap.
      let needsCopy = true;
      try {
        needsCopy =
          !fs.existsSync(dest) || !fs.readFileSync(src).equals(fs.readFileSync(dest));
      } catch {
        needsCopy = true;
      }
      if (needsCopy) {
        fs.copyFileSync(src, dest);
        fixed++;
      }
    }
  }
}

function walk(current) {
  scannedDirs++;
  let entries;
  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next")) {
        flattenPayloadDir(current, entry.name, [], abs);
      } else {
        walk(abs);
      }
    }
  }
}

walk(outDir);
console.log(
  `fix-segment-payloads: scanned ${scannedDirs} dirs under ${outDir}; wrote ${fixed} flattened RSC segment payload file(s).`,
);
