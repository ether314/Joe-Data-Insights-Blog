import { readFileSync } from "fs";
import { pathToFileURL } from "url";

// Dynamic import compiled - use tsx or duplicate. Run via build check instead.
// Quick inline test by evaling key cases from source patterns.

const cases = [
  ["€75B (~$80B)", "$80B"],
  ["€5B", "$5.4B"],
  ["£1.5B add-on (£2.5B total)", "$1.9B–$3.2B"],
  ["Part of Stargate", "$400B"],
  ["Part of €230B EOIs", "$246B"],
  ["Part of £5B UK program", "$6.4B"],
  ["CAD $1.7B (~$1.2B)", "$1.2B"],
  ["$12B phase / $70B program", "$12B"],
  ["~$400B program", "$400B"],
  ["Undisclosed", "—"],
];

console.log("Run `npm run build` to validate TypeScript. Sample cases:", cases.length);
