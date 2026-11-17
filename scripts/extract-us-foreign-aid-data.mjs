import fs from "fs";
import path from "path";

const canvasPath =
  "C:/Users/ether/.cursor/projects/empty-window/canvases/us-foreign-aid.canvas.tsx";
const outPath = path.resolve(
  "src/data/us-foreign-aid-obligations-fy1946-fy2025-data.ts",
);

const src = fs.readFileSync(canvasPath, "utf8");
const dataMatch = src.match(
  /const DATA: Payload = (\{[\s\S]*?\});[\r\n]+function fmtM/,
);
if (!dataMatch) {
  console.error("DATA not found");
  process.exit(1);
}

const header = `/** US foreign assistance obligations FY1946–FY2025 — frozen Aug 2026 ForeignAssistance.gov extract */

export type Meta = {
  id: string;
  n: string;
  r: string;
  t: string;
  xy?: [number, number];
};

export type Payload = {
  unit: string;
  source: string;
  years: [number, number];
  meta: Meta[];
  annual: Record<string, { e: number; m: number }>;
  byCountry: Record<string, { e: Record<string, number>; m: Record<string, number> }>;
};

export const DATA: Payload = `;

const footer = `;

export const SOURCE_NOTE = DATA.source;
`;

fs.writeFileSync(outPath, header + dataMatch[1] + footer);
console.log("Wrote", outPath, "bytes:", fs.statSync(outPath).size);
