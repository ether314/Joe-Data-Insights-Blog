/**
 * QA: adaptation-economics-update-2026
 * // viz-types: vintage dumbbell bars, area+line flows w/ Glasgow ref, gap-lever bars, residual pie, NCQG compare bars | layout: default
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
} from "../src/data/adaptation-economics-update-2026-data.ts";

assert.equal(HEADLINE.flows2023Bn, 26);
assert.equal(HEADLINE.flows2022Bn, 28);
assert.equal(HEADLINE.flowsYoYDeltaBn, -2);
assert.equal(HEADLINE.needsLowBn, 310);
assert.equal(HEADLINE.needsHighBn, 365);
assert.equal(HEADLINE.gapLowBn, 284);
assert.equal(HEADLINE.gapHighBn, 339);
assert.equal(HEADLINE.privatePotentialBn, 50);
assert.ok(INTL_PUBLIC_ADAPT_FLOWS.some((r) => r.year === 2023 && r.intlPublicBn === 26));
assert.equal(needsBn("low"), 310);
assert.equal(gapBn("low"), 310 - 26);

const root = process.cwd();
const slug = "adaptation-economics-update-2026";
const markers = [
  "Vintage delta — AGR 2024 research → AGR 2025",
  "Adaptation Flows Fall to $26B",
];

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("Missing out/ — run npm run build first");
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
      console.log(`ok ${m}`);
    }
    for (const label of [
      "Vintage delta",
      "Public flows",
      "Gap levers",
      "Who pays",
      "NCQG arithmetic",
    ]) {
      const btn = page.getByRole("button", { name: label });
      if (await btn.count()) {
        await btn.first().click();
        await page.waitForTimeout(400);
      }
    }
    await page.getByRole("button", { name: "Vintage delta" }).first().click();
    await page.getByRole("button", { name: /High \$365B/ }).first().click();
    await page.getByText("Prior vs newest", { exact: false }).first().waitFor({
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
