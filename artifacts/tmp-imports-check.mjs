import fs from "node:fs";

// Does the data module exist for the missing posts' viz?
const candidates = fs.readdirSync("src/data").filter((f) =>
  [
    "women-and-men-in-apprentice-trades",
    "office-vacancy-versus-conversion-pipelines",
    "hospital-system-clout-vs-commercial-prices",
    "institutional-share-of-single-family-rentals",
  ].some((s) => f.startsWith(s)),
);
console.log("matching src/data files:", candidates);

// What does one of the dashboards import?
for (const f of ["WomenAndMenInApprenticeTrades2026Dashboard.tsx"]) {
  const t = fs.readFileSync(`src/components/visualizations/${f}`, "utf8");
  const imports = [...t.matchAll(/import\s+.*from\s+"([^"]+)"/g)].map((m) => m[1]);
  console.log(`\n${f} imports:`);
  for (const i of imports) console.log("  ", i);
}
