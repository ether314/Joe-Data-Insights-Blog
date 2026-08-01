/**
 * Post-build smoke test: every visualization post must render (not stuck on loading).
 * Usage:
 *   node scripts/smoke-test-viz-posts.mjs           # test local `out/` via in-process static server
 *   node scripts/smoke-test-viz-posts.mjs --live    # test production after deploy
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const live = process.argv.includes("--live");
const baseUrl = live
  ? process.env.SMOKE_BASE_URL || "https://ether-data-insights-blog.web.app"
  : `http://127.0.0.1:${process.env.SMOKE_PORT || 4173}`;

const POSTS = [
  {
    slug: "ai-financing-research-2026",
    marker: "Hyperscaler IG bond issuance vs debt share of capex",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "china-fiscal-revenue-all-budgets-2024",
    marker: "Granular Revenue by Line Item",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-ai-data-center-build-tracker",
    marker: "Tracked sites",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "china-us-india-gdp-30-years",
    marker: "The Great Divergence",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-industrial-subsidies-vs-tariffs-30-years",
    marker: "Total market support vs customs duties",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-brokerage-fintech-investing-bonuses",
    marker: "programs",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ccp-nomenklatura-hierarchy-2026",
    marker: "Politburo",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-electricity-generation-mix-2024",
    marker: "Generation mix by source",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-refugee-hosting-burden-2024",
    marker: "Hosting burden by country",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-gpu-packaging-memory-bottleneck-2025",
    marker: "CoWoS packaging",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "major-ai-brands-token-consumption-2022-2026",
    marker: "June 2026 provider comparison",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "deflationary-growth-economies-2025",
    marker: "GDP growth vs CPI deflation",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-last-mile-delivery-robotics-2026",
    marker: "Fleet size by company",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "goldman-sachs-ai-capex-chips-data-centers-2027-2028",
    marker: "Baseline AI capex by layer",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-social-security-trust-fund-depletion-path-2026",
    marker: "Trust fund reserves path 2025",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-intensity-research-2026",
    marker: "Capex intensity trajectory",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-spend-research-2026",
    marker: "Big-5 hyperscaler capex stack",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-remittance-corridors-2026",
    marker: "Estimated bilateral corridors",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "phosphate-fertilizer-export-dependence-2026",
    marker: "Top-3 exporter share",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-billion-dollar-weather-disasters-2026",
    marker: "Adaptation economics",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "natural-graphite-mine-concentration-2024",
    marker: "natural graphite",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "bank-loan-chargeoffs-2026",
    marker: "Charge-off",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "irena-renewable-capacity-record-2024",
    marker: "renewable",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "oecd-dac-oda-first-drop-2024",
    marker: "OECD DAC ODA",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "money-market-funds-vs-deposits-2026",
    marker: "money market",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "commercial-aircraft-final-assembly-2025",
    marker: "Final-assembly",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "macro-growth-trade-research-2026",
    marker: "Growth, trade & prices",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-compute-demand-research-2026",
    marker: "Who owns AI compute",
    forbidden: "Loading interactive charts",
  },
];

async function smokePost(page, { slug, marker, forbidden }) {
  const path = live ? `/blog/${slug}` : `/blog/${slug}.html`;
  const url = `${baseUrl}${path}`;
  const consoleErrors = [];
  const pageErrors = [];

  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.getByText(marker, { exact: false }).first().waitFor({ timeout: 25000 });

  const stuck = await page.getByText(forbidden, { exact: false }).isVisible().catch(() => false);

  const relevantConsole = consoleErrors.filter(
    (e) =>
      !e.includes("404") &&
      !e.includes("Failed to load resource") &&
      !e.includes("metamask") &&
      !e.includes("ObjectMultiplex"),
  );

  return { slug, url, stuck, pageErrors, consoleErrors: relevantConsole };
}

async function main() {
  if (!live) {
    const outDir = path.join(root, "out");
    if (!fs.existsSync(outDir)) {
      console.error("Γ£ù Missing out/ ΓÇö run npm run build first");
      process.exit(1);
    }
  }

  let server;
  if (!live) {
    const port = Number(process.env.SMOKE_PORT || 4173);
    server = await startStaticServer(path.join(root, "out"), port);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let failed = 0;
  try {
    for (const post of POSTS) {
      const result = await smokePost(page, post);
      const ok =
        !result.stuck && result.pageErrors.length === 0 && result.consoleErrors.length === 0;

      console.log(ok ? "Γ£ô" : "Γ£ù", post.slug);
      if (result.stuck) {
        console.log("  Dashboard stuck on loading spinner");
        failed++;
      }
      if (result.pageErrors.length) {
        console.log("  Page errors:");
        for (const e of result.pageErrors) console.log("   ", e.slice(0, 300));
        failed++;
      }
      if (result.consoleErrors.length) {
        console.log("  Console errors:");
        for (const e of result.consoleErrors) console.log("   ", e.slice(0, 300));
        failed++;
      }
    }
  } finally {
    await browser.close();
    await stopStaticServer(server);
  }

  if (failed > 0) {
    console.error(`\n${failed} smoke test failure(s).`);
    process.exit(1);
  }
  console.log(`\nAll ${POSTS.length} visualization posts passed smoke test (${live ? "live" : "local"}).`);
}

main().catch((err) => {
  if (String(err).includes("Executable doesn't exist")) {
    console.error("Playwright browsers missing. Run: npx playwright install chromium");
  } else if (err.name === "TimeoutError") {
    console.error("Smoke test timed out ΓÇö dashboard likely stuck on loading or JS error.");
    console.error("Debug: npx tsx scripts/test-all-costs.ts && node scripts/debug-smoke.mjs");
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
