/**
 * QA: median-age-at-first-marriage-versus-never-married-share-2026
 * // smoke-marker: First-marriage age vs never-married share
 * // viz-types: dual-track composed, median age path, never-married bars,
 * // age×share scatter, state ladder bars, sex-gap/education composed
 * // | layout: default
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";
import {
  DUAL_TRACK,
  HEADLINE,
  MEDIAN_AGE_SERIES,
  NEVER_MARRIED_25_34,
  STATE_MEDIAN_AGES,
  VIZ_MARKERS,
} from "../src/data/median-age-at-first-marriage-versus-never-married-share-2026-data.ts";

assert.equal(HEADLINE.medianAgeMen2025, 30.8);
assert.equal(HEADLINE.medianAgeWomen2025, 28.4);
assert.equal(HEADLINE.troughMen1956, 22.5);
assert.equal(HEADLINE.troughWomen1956, 20.1);
assert.equal(HEADLINE.riseMenYears, 8.3);
assert.equal(HEADLINE.neverMarried2534_1960Pct, 12);
assert.equal(HEADLINE.neverMarriedMen2010Pct, 52);
assert.equal(HEADLINE.neverMarriedWomen2010Pct, 42);
assert.ok(MEDIAN_AGE_SERIES.length >= 20);
assert.ok(NEVER_MARRIED_25_34.length >= 8);
assert.ok(DUAL_TRACK.length >= 8);
assert.ok(STATE_MEDIAN_AGES.length >= 10);
assert.ok(
  Math.abs(HEADLINE.medianAgeMen2025 - HEADLINE.troughMen1956 - HEADLINE.riseMenYears) < 0.05,
);

const root = process.cwd();
const slug = "median-age-at-first-marriage-versus-never-married-share-2026";
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
  const port = Number(process.env.SMOKE_PORT || 4180);
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

    await clickBtn(page, "Median age path");
    await page
      .getByText("Median age path", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await clickBtn(page, "Never-married 25–34");
    await clickBtn(page, "Age × share scatter");
    await clickBtn(page, "State marriage-age ladder");
    await page.selectOption("select", "Northeast").catch(() => {});
    await clickBtn(page, "Sex gap & first birth");
    await page
      .getByText("Sex gap & first birth", { exact: false })
      .first()
      .waitFor({ timeout: 10000 });
    await page.selectOption("select", "men").catch(() => {});
    await clickBtn(page, "Dual track");

    const audit = await auditVizInteractions(page, slug);
    console.log("interaction audit", audit);
    assert.ok(audit.ok !== false);

    console.log(`✓ QA passed for ${slug}`);
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
