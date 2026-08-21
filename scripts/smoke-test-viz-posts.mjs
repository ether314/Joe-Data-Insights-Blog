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
    slug: "fiscal-plumbing-update-2026",
    marker: "Fiscal plumbing — vintage delta",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "consumer-finance-markets-update-202608",
    marker: "Aug 202608 vintage · vs Q3 theme print",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-compute-demand-update-202608",
    marker: "Vintage delta — Q3 2026 site ledger",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-intensity-update-2026q3",
    marker: "Vintage delta — Aug intensity update",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "macro-growth-trade-update-2026q3",
    marker: "Hard-data check — Jul 2026 IMF baseline",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-supply-chain-update-2026q3",
    marker: "Vintage delta — Aug WWSEMS Q1 update → Q3 CoWoS tracker",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-financing-update-202608",
    marker: "Vintage delta — Q3 2026 flow print",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "adaptation-economics-update-202608",
    marker: "Vintage delta — OECD $34.7B (2024) → MDB LMIC $35B (2025, +31% YoY)",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-power-grid-update-2026q3",
    marker: "Vintage delta — Key Questions Apr 2026 → Gartner Jun 2026",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-spend-update-202608",
    marker: "202608 vintage delta — mid-Q3",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "chokepoint-commodities-update-202608",
    marker: "Vintage delta — IEA GCMO 2026 / Q3 midstream → Pink Sheet Aug 2026 (Jul monthly)",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "geopolitics-institutions-update-202608",
    marker: "87 Days to IMF Consent",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "fiscal-industrial-policy-update-202608",
    marker: "Vintage change (counts / percentage points)",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "energy-systems-update-2026q3",
    marker: "Renewables overtake coal in electricity",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "industrial-robotics-update-202608",
    marker: "August 2026 vintage · A3 North America orders vs IFR prelim lens",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "adaptation-economics-update-2026q3",
    marker: "Vintage delta — AGR 2025 / UNEP $26B → OECD May 2026 $34.7B",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "measurement-science-update-2026q3",
    marker: "PPP overtake gap narrows to 0.3 pp",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "heavy-industrial-capacity-research-2026",
    marker: "Yards, dry docks, and the forge base",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "demographic-cash-flows-update-2026q3",
    marker: "Q3 vintage delta — Aug Banxico 2025 update → Banxico June 2026",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "chokepoint-commodities-update-2026q3",
    marker: "Vintage delta — MCS 2026 update / secondary midstream → IEA GCMO 2026",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "consumer-finance-markets-update-2026q3",
    marker: "Q3 vintage update · vs Aug update print",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "industrial-robotics-update-2026q3",
    marker: "Q3 vintage delta — IFR prelim 2025 vs WR 2025 update",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-financing-update-2026q3",
    marker: "Vintage delta — Aug mid-year",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-power-grid-update-2026",
    marker: "Vintage delta — Energy and AI research → Key Questions 2026",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-spend-update-2026q3",
    marker: "Q3 vintage delta — Aug post-Q2",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "fiscal-industrial-policy-update-2026q3",
    marker: "Vintage change (percentage points / counts)",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-compute-demand-update-2026q3",
    marker: "Vintage delta — Aug 2026 update",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "geopolitics-institutions-update-2026q3",
    marker: "Q3 vintage delta — Oct 2025",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "consumer-finance-markets-update-2026",
    marker: "Vintage update · vs research print",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "chokepoint-commodities-update-2026",
    marker: "Vintage delta — MCS 2025 / 2024e → MCS 2026 / 2025e",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "energy-systems-update-2026",
    marker: "Renewables lead TES growth outside a recession",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "industrial-robotics-update-2026",
    marker: "Industrial robot installations — IFR World Robotics 2025 update",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "adaptation-economics-update-2026",
    marker: "Vintage delta — AGR 2024 research → AGR 2025",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "demographic-cash-flows-update-2026",
    marker: "Vintage delta — Brief 41 → Banxico 2025",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "measurement-science-update-2026",
    marker: "China overtakes the US on PPP R&D share",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "geopolitics-institutions-update-2026",
    marker: "Vintage delta — research stock",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "fiscal-plumbing-research-2026",
    marker: "Fiscal plumbing — trust funds",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "commercial-aircraft-final-assembly-geography-2026",
    marker: "Assembly-line share by final-assembly site",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "fiscal-industrial-policy-update-2026",
    marker: "Vintage change (percentage points / counts)",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-financing-update-2026",
    marker: "Vintage delta — Jul research",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-spend-update-2026",
    marker: "Vintage delta — Jul research",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-compute-demand-update-2026",
    marker: "Vintage delta — Jul research",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "macro-growth-trade-update-2026",
    marker: "Vintage delta — Apr 2026 WEO",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "bank-commercial-credit-research-2026",
    marker: "Bank & commercial credit — Fed · FDIC · CMBS",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-power-grid-concentration-2026",
    marker: "AI power & grid — concentration lens",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-supply-chain-update-2026",
    marker: "Vintage delta — Jul research",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-capex-intensity-update-2026",
    marker: "Vintage delta — Jul research",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "consumer-finance-markets-research-2026",
    marker: "Consumer finance & household balance sheets — BEA · NY Fed · Z.1",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "energy-systems-research-2026",
    marker: "How countries source, mix, and trade energy",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "adaptation-economics-research-2026",
    marker: "Adaptation economics — who pays before policy catches up",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "chokepoint-commodities-research-2026",
    marker: "Where supply is thin",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "geopolitics-institutions-research-2026",
    marker: "Who holds the keys: voting power vs economic weight",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "global-shipbuilding-gt-delivery-concentration-2026",
    marker: "Global shipbuilding · GT deliveries",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "copper-mine-vs-refinery-geography-2026",
    marker: "Copper mine vs refinery geography",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "demographic-cash-flows-research-2026",
    marker: "Demographic cash flows — age, migration, and money",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "measurement-science-research-2026",
    marker: "Where progress is funded and published",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "us-tax-expenditure-catalog-2026",
    marker: "Tax expenditures as % of GDP",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "migration-humanitarian-research-2026",
    marker: "Record displacement, collapsing coverage",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "fiscal-industrial-policy-research-2026",
    marker: "Jurisdiction coverage: who is intervening?",
    forbidden: "Loading interactive charts",
  },
  {
    slug: "ai-power-grid-research-2026",
    marker: "AI power & grid — IEA global frame",
    forbidden: "Loading interactive charts",
  },
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
