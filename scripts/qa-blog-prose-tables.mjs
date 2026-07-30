import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { startStaticServer, stopStaticServer } from "./lib/static-server.mjs";

const root = process.cwd();
const port = 4174;

const SLUGS = [
  {
    slug: "ai-gpu-packaging-memory-bottleneck-2025",
    expectedCellText: "CoWoS demand",
  },
  {
    slug: "deflationary-growth-economies-2025",
    expectedCellText: "Vietnam",
  },
];

const SEPARATOR_RE = /\|[-]{3,}\|/;

async function verifyProseTable(page, { slug, expectedCellText }) {
  const url = `http://127.0.0.1:${port}/blog/${slug}`;
  const results = [];

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  const prose = page.locator(".prose-content");
  await prose.waitFor({ state: "visible", timeout: 20000 });

  const table = prose.locator("table").first();
  const tableVisible = await table.isVisible().catch(() => false);
  results.push(["table visible in .prose-content", tableVisible]);

  const thCount = tableVisible ? await table.locator("th").count() : 0;
  results.push([">=1 th in table", thCount >= 1]);

  const tdCount = tableVisible ? await table.locator("td").count() : 0;
  results.push([">=1 td in table", tdCount >= 1]);

  const proseText = (await prose.innerText().catch(() => "")) ?? "";
  const separatorVisible = SEPARATOR_RE.test(proseText);
  results.push(["no raw |---| separator in .prose-content", !separatorVisible]);

  const hasExpectedCell = await prose.getByText(expectedCellText, { exact: false }).first().isVisible().catch(() => false);
  results.push([`cell text "${expectedCellText}" visible`, hasExpectedCell]);

  return { slug, results };
}

function staticExportChecks() {
  const checks = [];
  for (const { slug } of SLUGS) {
    const htmlPath = path.join(root, "out", "blog", `${slug}.html`);
    const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
    checks.push([`${slug} HTML exists`, fs.existsSync(htmlPath)]);
    checks.push([`${slug} has <table> in export`, html.includes("<table")]);
    checks.push([`${slug} no raw separator in export`, !SEPARATOR_RE.test(html)]);
  }
  return checks;
}

let failed = 0;

for (const [name, ok] of staticExportChecks()) {
  console.log(ok ? "✓" : "✗", name);
  if (!ok) failed++;
}

if (failed > 0) {
  process.exit(1);
}

let server;
const browser = await chromium.launch({ headless: true });
try {
  server = await startStaticServer(path.join(root, "out"), port);
  const page = await browser.newPage();

  for (const spec of SLUGS) {
    const { slug, results } = await verifyProseTable(page, spec);
    console.log(`\n--- ${slug} ---`);
    for (const [name, ok] of results) {
      console.log(ok ? "✓" : "✗", name);
      if (!ok) failed++;
    }
  }
} finally {
  await browser.close();
  await stopStaticServer(server);
}

if (failed > 0) process.exit(1);
console.log("\nAll blog prose table QA checks passed.");
