/**
 * QA: demographic-cash-flows-research-2026
 * // viz-types: dependency×remittance scatter, cohort dependency lines, remittance area + employment dual-line, ranked GDP-share bars, corridor bars, flow compare | layout: canvas
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  COUNTRY_PROFILES,
  TOP_CORRIDORS,
  rankedByRemittanceGdp,
} from "../src/data/demographic-cash-flows-research-2026-data.ts";

assert.equal(HEADLINE.lmicRemittances2024Bn, 685);
assert.equal(HEADLINE.topCorridorUsMxBn, 52);
assert.equal(HEADLINE.tajikistanRemitGdpPct, 45);
assert.ok(COUNTRY_PROFILES.length >= 12);
assert.equal(TOP_CORRIDORS[0].id, "us-mx");
const dep = rankedByRemittanceGdp();
assert.equal(dep[0].id, "tajikistan");

const root = process.cwd();
const slug = "demographic-cash-flows-research-2026";
const markers = [
  "Demographic cash flows — age, migration, and money",
  "Old-age dependency vs remittance intensity",
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
      "Age × remittance map",
      "Aging paths",
      "Dependence ranks",
      "Corridors",
      "Flow engines",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Dependence ranks" }).first().click();
    await page.getByRole("button", { name: "Pension / GDP" }).first().click();
    await page.getByText("Public pension spending", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("✓ Pension metric toggle");
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

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
