import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "out/_next/static/chunks/3t6ek4dpfqdac.js");
const c = fs.readFileSync(file, "utf8");
const start = c.indexOf("37792,e=>");
const chunk = c.slice(start, start + 15000);
// Find export assignments
for (const name of ["fmtBillionsUsd", "formatCostDisplay", "parseCostToBillions"]) {
  const idx = chunk.indexOf(name);
  console.log(name, idx);
}
// Show region around formatCostDisplay definition
const fd = chunk.indexOf("formatCostDisplay");
console.log("\n--- around formatCostDisplay export ---");
console.log(chunk.slice(fd - 50, fd + 200));
const ff = chunk.search(/function \w+\(\w+\)\{if\(\w>=1e3\)/);
console.log("\nfmt fn at", ff);
if (ff >= 0) console.log(chunk.slice(ff, ff + 120));
