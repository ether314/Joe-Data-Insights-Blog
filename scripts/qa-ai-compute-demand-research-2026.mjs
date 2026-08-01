/**
 * QA: ai-compute-demand-research-2026
 * // viz-types: ownership horizontal bars, hyperscaler-share area, geography bars, power composed (GW+AI%), workload stacked bars, own-vs-use scatter | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  OWNERS,
  REGION_CAPACITY,
  HYPERSCALER_SHARE_PATH,
  rankedOwners,
} from "../src/data/ai-compute-demand-research-2026-data.ts";

assert.equal(HEADLINE.hyperscalerShareQ4_2025Pct, 71);
assert.equal(HEADLINE.hyperscalerShareQ1_2024Pct, 63);
assert.equal(HEADLINE.googleSharePct, 25);
assert.equal(HEADLINE.dcCapacityGw2026, 132);
assert.equal(HEADLINE.usAiDcCapacitySharePct, 45);
assert.equal(HEADLINE.aiServerShareOfDcPower2026Pct, 31);
assert.ok(OWNERS.some((o) => o.id === "google" && o.sharePct === 25));
const big5 = OWNERS.filter((o) => o.group === "hyperscaler").reduce(
  (s, o) => s + o.sharePct,
  0,
);
assert.equal(big5, 71);
assert.ok(REGION_CAPACITY[0].sharePct >= 40);
assert.ok(HYPERSCALER_SHARE_PATH.at(-1)?.sharePct === 71);
assert.equal(rankedOwners()[0].id, "google");

const root = process.cwd();
const slug = "ai-compute-demand-research-2026";
const markers = [
  "Who owns AI compute",
  "Compute ownership leaderboard",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4182);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    for (const label of [
      "Who owns compute",
      "Hyperscaler share",
      "Where it sits",
      "Power capacity",
      "Train vs infer",
      "Own vs use",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    const stuck = await page
      .getByText("Loading interactive charts…")
      .isVisible()
      .catch(() => false);
    if (stuck) {
      console.error("✗ Viz stuck on loading");
      process.exit(1);
    }
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
