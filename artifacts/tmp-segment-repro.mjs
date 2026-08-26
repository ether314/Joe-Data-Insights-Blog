import fs from "node:fs";
import path from "node:path";

function convertSegmentPathToStaticExportFilename(segmentPath) {
  return `__next${segmentPath.replaceAll("/", ".")}.txt`;
}

// Reproduce the exporter's logic for /category/consumer-finance
const route = "/category/consumer-finance";
const segmentsDir = `.next/server/app/category/consumer-finance.segments`;

if (fs.existsSync(segmentsDir)) {
  const results = [];
  const walk = (dir, rel = "") => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(path.join(dir, e.name), r);
      else if (r.endsWith(".segment.rsc")) results.push(r);
      else console.log("NON-SEGMENT FILE in .segments dir:", r);
    }
  };
  walk(segmentsDir);
  console.log("== raw segment files ==");
  for (const r of results) console.log(" ", r);

  console.log("\n== computed static export filenames (what SHOULD be emitted) ==");
  for (const r of results) {
    const segmentPath = "/" + r.slice(0, -".segment.rsc".length);
    // NOTE: path.relative uses backslashes on Windows!
    console.log("  segmentPath:", JSON.stringify(segmentPath));
    console.log("  filename:", convertSegmentPathToStaticExportFilename(segmentPath).replaceAll("\\", "/"));
  }
} else {
  console.log("segments dir missing:", segmentsDir);
  const parent = ".next/server/app/category";
  if (fs.existsSync(parent)) {
    for (const f of fs.readdirSync(parent)) console.log(" has:", f);
  }
}
