/**
 * QA: adaptation-economics-research-2026
 * // viz-types: needs-vs-flows bars, area+line flows, stacked mitigation/adaptation, pie residual bearers, scatter resilience×gap | layout: canvas
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  INTL_PUBLIC_ADAPT_FLOWS,
  gapBn,
  needsBn,
} from "../src/data/adaptation-economics-research-2026-data.ts";

assert.equal(HEADLINE.intlPublicAdapt2022Bn, 28);
assert.equal(HEADLINE.needsLowBn, 215);
assert.equal(HEADLINE.needsHighBn, 387);
assert.equal(HEADLINE.gapLowBn, 187);
assert.equal(HEADLINE.trackedAdapt2024Bn, 64);
assert.equal(HEADLINE.protectionGap2025Bn, 424);
assert.ok(INTL_PUBLIC_ADAPT_FLOWS.length >= 5);
assert.equal(needsBn("low"), 215);
assert.equal(gapBn("low"), 215 - 28);

const root = process.cwd();
const slug = "adaptation-economics-research-2026";
const markers = [
  "Adaptation economics — who pays before policy catches up",
  "Adaptation finance gap",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4180);
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
      console.log(`ok ${m}`);
    }
    for (const label of [
      "Needs vs flows",
      "Public flows",
      "Mitigation vs adapt",
      "Who pays",
      "Protection map",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Needs vs flows" }).first().click();
    await page.getByRole("button", { name: "High $387B" }).first().click();
    await page.getByText("Finance gap", { exact: false }).first().waitFor({
      timeout: 10000,
    });
    console.log("ok Needs scenario toggle");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("warnings:", audit.warnings.join("; "));
    }
    console.log(`QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
