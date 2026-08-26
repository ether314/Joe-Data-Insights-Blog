import fs from "node:fs";

// Are these 3 posts in out/blog? And does the smoke list include them?
const slugs = [
  "industrial-robotics-research-2026",
  "ai-supply-chain-research-2026",
  "us-billion-dollar-weather-disasters-ms94skof",
];
for (const s of slugs) {
  const html = `out/blog/${s}.html`;
  const dir = `out/blog/${s}`;
  console.log(
    s,
    "| flat html:",
    fs.existsSync(html),
    "| dir:",
    fs.existsSync(dir),
    "| index:",
    fs.existsSync(`${dir}/index.html`)
  );
}

const sm = fs.readFileSync("scripts/smoke-test-viz-posts.mjs", "utf8");
const m = sm.match(/visualization posts passed|posts to smoke/i);
console.log("\nsmoke total line:", m?.[0]);
