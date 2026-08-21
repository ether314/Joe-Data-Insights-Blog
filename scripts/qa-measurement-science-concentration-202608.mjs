/**
 * QA: measurement-science-concentration-202608
 * // viz-types: HHI bars, Top-1/Top-3 grouped bars, Lorenz area+line, ladder bars, intensity multi-line, flow dumbbell bars, CET field bars, patent-ledger bars, KTI split bars, volume×impact scatter, Top-3 donut | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  HEADLINE,
  SCOREBOARD,
  GERD_LADDER,
  CET_FIELDS,
  FLOW_SIGNALS,
} from "../src/data/measurement-science-concentration-202608-data.ts";

assert.equal(HEADLINE.gerdTop1Pct, 29.4);
assert.equal(HEADLINE.gerdTop3Pct, 65.2);
assert.equal(HEADLINE.gerdGapPp, 0.3);
assert.equal(HEADLINE.cetAiTop1Pct, 75);
assert.equal(HEADLINE.china2025YoyPct, 8.1);
assert.equal(HEADLINE.usptoUsApplicantSharePct, 47);
assert.equal(SCOREBOARD[0].id, "gerd");
assert.equal(GERD_LADDER[0].name, "China");
assert.equal(CET_FIELDS[0].chinaSharePct, 75);
assert.ok(FLOW_SIGNALS[0].value > 3.9);

const root = process.cwd();
const slug = "measurement-science-concentration-202608";
const markers = [
  "Measurement & science — August 2026 concentration lens",
  "HHI by concentration lens",
];

async function clickBtn(page, name) {
  console.log(`→ click ${name}`);
  await page.locator("button", { hasText: name }).first().click({ timeout: 8000 });
  await page.waitForTimeout(150);
}

async function main() {
  const outDir = path.join(root, "out");
  if (!fs.existsSync(outDir)) {
    console.error("✗ Missing out/ — run npm run build first");
    process.exit(1);
  }
  const port = Number(process.env.SMOKE_PORT || 4180);
  const server = await startStaticServer(outDir, port);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  try {
    const candidates = [
      `http://127.0.0.1:${port}/blog/${slug}/`,
      `http://127.0.0.1:${port}/blog/${slug}.html`,
      `http://127.0.0.1:${port}/blog/${slug}`,
    ];
    let loaded = false;
    for (const url of candidates) {
      const res = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (res && res.ok()) {
        loaded = true;
        break;
      }
    }
    if (!loaded) {
      console.error("✗ Failed to load post HTML");
      process.exit(1);
    }
    await page.waitForSelector(
      '[data-viz="measurement-science-concentration-202608"]',
      { timeout: 20000 },
    );
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    await clickBtn(page, "Ladder + Lorenz");
    await page
      .getByText("Lorenz-style concentration curve", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ Lorenz-style concentration curve");
    await clickBtn(page, "S&E publication");
    await clickBtn(page, "Cumulative %");
    await clickBtn(page, "CET AI");
    await clickBtn(page, "Flow + intensity");
    await page
      .getByText("China 2025 domestic flow signals", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ China 2025 domestic flow signals");
    await clickBtn(page, "Patents + KTI");
    await page
      .getByText("CET field concentration", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    console.log("✓ CET field concentration");
    await clickBtn(page, "HHI / scoreboard");
    console.log("→ auditVizInteractions");
    const audit = await auditVizInteractions(page);
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
    }
    if (audit.warnings?.length) {
      console.log("⚠ warnings:", audit.warnings.join("; "));
    }
    console.log(`qa-${slug}: PASS`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
