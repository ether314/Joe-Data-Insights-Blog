/**
 * QA: Geopolitics institutions research 2026 post.
 * // viz-types: scatter, diverging-bar, stacked-area, donut, horizontal-bar | layout: default
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";
import { auditVizInteractions } from "./lib/viz-interaction-qa.mjs";

const root = process.cwd();
const slug = "geopolitics-institutions-research-2026";
const markers = [
  "Who holds the keys: voting power vs economic weight",
  "Votes vs GDP: who is over- and under-represented?",
  "Representation gap: votes minus GDP share",
  "Authority layers: how decisions are structured",
  "IMF quota reform path: shares barely moved",
  "IMF board compression: 190 members → 24 chairs",
  "UNSC vetoes in practice: negative power used",
];

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
  try {
    await page.goto(`http://127.0.0.1:${port}/blog/${slug}.html`, {
      waitUntil: "networkidle",
      timeout: 45000,
    });
    for (const m of markers) {
      await page.getByText(m, { exact: false }).first().waitFor({ timeout: 20000 });
      console.log(`✓ ${m}`);
    }
    const audit = await auditVizInteractions(page, { slug });
    if (audit.issues?.length) {
      console.error("✗ Viz interaction audit failed", audit);
      process.exit(1);
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
