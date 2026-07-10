import fs from "fs";

const src = fs.readFileSync(
  "C:/Users/ether/.cursor/projects/empty-window/canvases/global-ai-data-center-builds.canvas.tsx",
  "utf8",
);
const m = src.match(/const SITES: Site\[\] = \[([\s\S]*?)\];\n\nconst REGION_ORDER/);
if (!m) throw new Error("no match");

const header = `export type ProjectStatus = "Operational" | "Under Construction" | "Planned" | "Partially Live";
export type BuildPhase = "Not Started" | "Started";

export type Site = {
  site: string;
  country: string;
  developer: string;
  costUsd: string;
  powerMw: number;
  completion: string;
  status: ProjectStatus;
  region: string;
};

export const SITES: Site[] = [
${m[1]}];
`;

const DATA_OUT = "src/data/ai-data-centers-data.ts";
const existing = fs.readFileSync(DATA_OUT, "utf8");
const footerStart = existing.indexOf("\nexport const REGION_ORDER");
if (footerStart < 0) throw new Error("Could not find REGION_ORDER footer in existing data file");
const footer = existing.slice(footerStart);

fs.writeFileSync(DATA_OUT, header + footer);
const count = (header + footer).match(/\{ site:/g)?.length ?? 0;
console.log("Extracted", count, "sites");
