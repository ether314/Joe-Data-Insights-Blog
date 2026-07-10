import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "out/_next/static/chunks");
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".js")) continue;
  const c = fs.readFileSync(path.join(dir, f), "utf8");
  if (!c.includes("sortBillions")) continue;
  console.log("===", f);
  console.log("part of", c.indexOf("part of"));
  console.log("sortBillions", c.indexOf("sortBillions"));
  console.log("fmtBillionsUsd export", c.indexOf("fmtBillionsUsd"));
  const fmtFn = c.search(/function \w\(e\)\{return e>=1e3/);
  console.log("fmt fn pattern", fmtFn);
  if (fmtFn >= 0 && c.indexOf("part of") >= 0) {
    console.log("fmt before part of", fmtFn < c.indexOf("part of"));
  }
}
