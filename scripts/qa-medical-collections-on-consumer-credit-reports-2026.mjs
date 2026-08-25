/**
 * QA: medical-collections-on-consumer-credit-reports-2026
 * // smoke-marker: Medical share of collections — 57%→36%
 * // viz-types: medical-share composed, prevalence path, state ladder bars,
 * // score-band bars, prevalence×share scatter, age dual bars | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  AGE_PREVALENCE,
  HEADLINE,
  MEDICAL_SHARE_VINTAGE,
  PREVALENCE_VINTAGE,
  SCORE_BANDS,
  STATE_PANEL,
  VIZ_MARKERS,
} from "../src/data/medical-collections-on-consumer-credit-reports-2026-data.ts";

assert.equal(HEADLINE.medicalShareQ1_2022, 57);
assert.equal(HEADLINE.medicalShareQ1_2023, 36);
assert.equal(HEADLINE.medicalShareDropPp, 21);
assert.equal(HEADLINE.prevalenceAug2024, 4.1);
assert.equal(HEADLINE.meanScoreJun2023, 582);
assert.equal(HEADLINE.oklahomaRate2024, 8.8);
assert.ok(STATE_PANEL.length >= 20);
assert.ok(PREVALENCE_VINTAGE.length >= 6);
assert.ok(MEDICAL_SHARE_VINTAGE.length >= 4);
assert.ok(SCORE_BANDS.length >= 4);
assert.ok(AGE_PREVALENCE.length >= 4);
assert.equal(
  SCORE_BANDS.reduce((s, b) => s + b.shareOfHolders, 0),
  100,
);

const root = process.cwd();
const slug = "medical-collections-on-consumer-credit-reports-2026";
const markers = [...VIZ_MARKERS];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(200);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4184);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.waitForSelector(`[data-viz="${slug}"]`, { timeout: 20000 });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({
        state: "attached",
        timeout: 20000,
      });
      console.log(`✓ ${m}`);
    }

    await clickBtn(page, "Medical share");
    await clickBtn(page, "Prevalence path");
    await clickBtn(page, "State ladder");
    await clickBtn(page, "South");
    await clickBtn(page, "Sort by med. share");
    await clickBtn(page, "Sort by balance");
    await clickBtn(page, "All regions");
    await clickBtn(page, "Score bands");
    await clickBtn(page, "Prevalence in band");
    await clickBtn(page, "Medical share of collections");
    await clickBtn(page, "Share × prevalence");
    await clickBtn(page, "Midwest");
    await clickBtn(page, "Age mix");

    const audit = await auditVizInteractions(page, { slug });
    console.log("interaction audit:", JSON.stringify(audit));
    assert.equal(audit.issues?.length ?? 0, 0, "viz interaction audit failed");

    console.log(`✓ QA passed: ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error("✗ QA failed:", err);
  process.exit(1);
});
