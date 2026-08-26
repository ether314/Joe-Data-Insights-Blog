import fs from "node:fs";

const routes = [
  "/categories",
  "/category/consumer-finance",
  "/blog/us-share-of-global-source-plasma-2026",
];

for (const route of routes) {
  const dir = "out" + route;
  console.log(`\n== ${route} ==`);
  if (!fs.existsSync(dir)) {
    console.log("  (no dir)");
    continue;
  }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      // nested dir => broken emission
      const inner = fs
        .readdirSync(`${dir}/${e.name}`, { recursive: true })
        .join(", ");
      console.log("  [NESTED DIR]", e.name, "->", inner.slice(0, 100));
    } else if (e.name.startsWith("__next")) {
      console.log("  [FLAT FILE]", e.name);
    }
  }
}
