import { chromium } from "playwright";

const BASE = process.env.SMOKE_BASE_URL || "https://ether-data-insights-blog.web.app";

const SLUGS = [
  { slug: "ai-gpu-packaging-memory-bottleneck-2025", expectedCellText: "CoWoS demand" },
  { slug: "deflationary-growth-economies-2025", expectedCellText: "Vietnam" },
];

const SEPARATOR_RE = /\|[-]{3,}\|/;

let failed = 0;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage();

  for (const { slug, expectedCellText } of SLUGS) {
    const url = `${BASE}/blog/${slug}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    const prose = page.locator(".prose-content");
    await prose.waitFor({ state: "visible", timeout: 20000 });

    const table = prose.locator("table").first();
    const tableVisible = await table.isVisible().catch(() => false);
    const thCount = tableVisible ? await table.locator("th").count() : 0;
    const tdCount = tableVisible ? await table.locator("td").count() : 0;
    const proseText = (await prose.innerText().catch(() => "")) ?? "";
    const separatorVisible = SEPARATOR_RE.test(proseText);
    const hasExpectedCell = await prose
      .getByText(expectedCellText, { exact: false })
      .first()
      .isVisible()
      .catch(() => false);

    const checks = [
      ["table visible in .prose-content", tableVisible],
      [">=1 th in table", thCount >= 1],
      [">=1 td in table", tdCount >= 1],
      ["no raw |---| separator in .prose-content", !separatorVisible],
      [`cell text "${expectedCellText}" visible`, hasExpectedCell],
    ];

    console.log(`\n--- LIVE ${slug} ---`);
    for (const [name, ok] of checks) {
      console.log(ok ? "✓" : "✗", name);
      if (!ok) failed++;
    }
  }
} finally {
  await browser.close();
}

if (failed > 0) process.exit(1);
console.log("\nAll LIVE blog prose table checks passed.");
