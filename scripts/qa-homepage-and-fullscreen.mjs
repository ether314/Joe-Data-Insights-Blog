#!/usr/bin/env node
/**
 * QA: homepage sort, fullscreen prose, and page scroll (Playwright).
 * Usage: node scripts/qa-homepage-and-fullscreen.mjs [--live]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditPageScroll } from "./lib/viz-interaction-qa.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const live = process.argv.includes("--live");
const baseUrl = live
  ? process.env.SMOKE_BASE_URL || "https://ether-data-insights-blog.web.app"
  : `http://127.0.0.1:${process.env.SMOKE_PORT || 4174}`;

const EXPECTED_HOMEPAGE = [
  "oecd-dac-oda-first-drop-2024",
  "money-market-funds-vs-deposits-2026",
  "commercial-aircraft-final-assembly-2025",
];

const SCROLL_POSTS = [
  {
    slug: "oecd-dac-oda-first-drop-2024",
    proseMarker: "Foreign-aid debates usually start with moral language",
    layout: "default",
  },
  {
    slug: "money-market-funds-vs-deposits-2026",
    proseMarker: "Bank deposit rates get the headlines",
    layout: "canvas",
  },
  {
    slug: "natural-graphite-mine-concentration-2024",
    proseMarker: "Battery narratives talk endlessly",
    layout: "default",
  },
  {
    slug: "bank-loan-chargeoffs-2026",
    proseMarker: "Office vacancies",
    layout: "default",
  },
  {
    slug: "irena-renewable-capacity-record-2024",
    proseMarker: "Energy headlines love generation",
    layout: "default",
  },
];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

let server = null;

async function main() {
  if (!live) {
    const outDir = path.join(REPO_ROOT, "out");
    if (!fs.existsSync(path.join(outDir, "index.html"))) {
      fail("missing out/index.html — run npm run build first");
    }
    server = await startStaticServer(outDir, Number(process.env.SMOKE_PORT || 4174));
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    // --- Homepage: newest posts ---
    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded", timeout: 60_000 });
    const homeHtml = await page.content();
    for (const slug of EXPECTED_HOMEPAGE) {
      if (!homeHtml.includes(slug)) {
        fail(`homepage missing ${slug}`);
      }
    }
    ok(`homepage lists newest posts (${EXPECTED_HOMEPAGE.join(", ")})`);

    // --- Fullscreen/canvas post: viz present; prose when layout allows ---
    const fullscreenSlug = "commercial-aircraft-final-assembly-2025";
    await page.goto(`${baseUrl}/blog/${fullscreenSlug}`, {
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    if ((await page.locator("[data-viz], [data-viz-dashboard]").count()) === 0) {
      fail(`post ${fullscreenSlug} missing visualization`);
    }
    const prose = page.locator(".prose-content").first();
    if ((await prose.count()) > 0) {
      const proseText = await prose.innerText();
      if (
        !proseText.toLowerCase().includes("airbus") &&
        !proseText.toLowerCase().includes("assembly")
      ) {
        fail(`post ${fullscreenSlug} missing article body`);
      }
    }
    ok(`post ${fullscreenSlug} has visualization`);

    // --- Scroll QA on newest posts ---
    for (const post of SCROLL_POSTS) {
      await page.goto(`${baseUrl}/blog/${post.slug}`, {
        waitUntil: "networkidle",
        timeout: 90_000,
      });
      await page.waitForSelector(".prose-content", { timeout: 30_000 }).catch(() => {});

      const result = await auditPageScroll(page, {
        slug: post.slug,
        minScrollPx: 300,
        bottomSelector: "text=Back to all posts",
      });

      for (const w of result.warnings) console.log(`  ⚠ ${w}`);
      if (!result.ok) {
        for (const i of result.issues) console.error(`  ✗ ${i}`);
        fail(`scroll QA failed for ${post.slug}`);
      }

      const proseLocator = page.locator(".prose-content").first();
      if ((await proseLocator.count()) > 0) {
        const text = await proseLocator.innerText();
        if (!text.toLowerCase().includes(post.proseMarker.toLowerCase().split(" ")[0])) {
          fail(`${post.slug}: prose marker "${post.proseMarker}" not found`);
        }
      }

      ok(
        `${post.slug} scrolls (${Math.round(result.metrics.scrollMoved)}px moved, layout=${post.layout})`,
      );
    }

    // --- Lock file sanity (local only) — conveyor may be running/idle/paused ---
    const lockPath = path.join(REPO_ROOT, "artifacts", "blog-production-lock.json");
    if (fs.existsSync(lockPath)) {
      const raw = fs.readFileSync(lockPath, "utf8").replace(/^\uFEFF/, "");
      const lock = JSON.parse(raw);
      const allowed = new Set(["paused", "running", "idle"]);
      if (!allowed.has(lock.status)) {
        fail(`unexpected lock status=${lock.status}`);
      }
      ok(`automation lock status=${lock.status}`);
    }

    console.log("\nAll homepage + fullscreen + scroll QA checks passed.");
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
