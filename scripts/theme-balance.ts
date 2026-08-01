#!/usr/bin/env npx tsx
/**
 * Print theme/lane balance from posts.ts for autonomous production.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BALANCE_CONFIG,
  LANE_LABELS,
  computeLaneBalance,
  computeThemeBalance,
  getEligibleThemes,
  type ThemeLane,
} from "../src/data/theme-registry";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const postsSrc = readFileSync(join(root, "src/data/posts.ts"), "utf8");

const blocks = postsSrc.split(/\n\s*},\s*\n\s*{/);
const pairs: Array<{ slug: string; themeId?: string }> = [];

for (const block of blocks) {
  const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
  if (!slug) continue;
  const themeId = block.match(/themeId:\s*"([^"]+)"/)?.[1];
  pairs.push({ slug, themeId });
}

const window = BALANCE_CONFIG.rollingWindow;
const laneBalance = computeLaneBalance(pairs, window);
const themeBalance = computeThemeBalance(pairs, window);
const eligible = getEligibleThemes(pairs);

console.log(`\nTheme balance (last ${Math.min(pairs.length, window)} posts, newest first)\n`);

console.log("Lanes:");
for (const lane of Object.keys(LANE_LABELS) as ThemeLane[]) {
  const row = laneBalance[lane];
  const label = LANE_LABELS[lane];
  const flag =
    row.sharePct > BALANCE_CONFIG.laneHardCapPct
      ? " OVER CAP"
      : row.sharePct < BALANCE_CONFIG.laneStarvationPct
        ? " STARVED"
        : "";
  console.log(`  ${label.padEnd(28)} ${String(row.count).padStart(2)}  ${row.sharePct.toFixed(0).padStart(3)}%${flag}`);
}

console.log("\nThemes (active, non-zero or on streak):");
for (const row of themeBalance.filter((r) => r.count > 0 || r.consecutive > 0)) {
  const flags = [row.overCap && "OVER", row.consecutive >= 1 && `streak:${row.consecutive}`]
    .filter(Boolean)
    .join(" ");
  console.log(`  ${row.label.padEnd(32)} ${String(row.count).padStart(2)}  ${row.sharePct.toFixed(0).padStart(3)}%  ${flags}`);
}

console.log(`\nEligible themes for next post (${eligible.length}):`);
for (const t of eligible.slice(0, 8)) {
  const cand = t.candidates.length ? ` (${t.candidates.length} candidates)` : "";
  console.log(`  • ${t.id} — ${t.label}${cand}`);
}
if (eligible.length > 8) console.log(`  … +${eligible.length - 8} more`);
console.log("");
