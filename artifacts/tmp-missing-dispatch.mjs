import fs from "node:fs";

// Check whether the four missing viz ids have dispatch entries + components
const pv = fs.readFileSync("src/components/PostVisualization.tsx", "utf8");
const ids = [
  "employer-coverage-of-glp-1-weight-loss-drugs-2026",
  "farm-share-of-the-food-dollar-2026",
  "us-cattle-herd-at-seventy-year-lows-2026",
  "us-generic-sterile-injectable-shortages-2026",
];
for (const id of ids) {
  const dispatched = new RegExp(`type === "${id}"`).test(pv);
  console.log(`${id}\n  dispatched: ${dispatched}`);
}
console.log("\ncomponents on disk:");
for (const f of fs.readdirSync("src/components/visualizations")) {
  for (const id of ids) {
    if (f.toLowerCase().includes(id.split("-")[0]) && /glp|food-dollar|cattle|injectable/i.test(f)) {
      console.log(" ", f);
    }
  }
}
