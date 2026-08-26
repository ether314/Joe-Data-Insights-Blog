#!/usr/bin/env node
/**
 * Full-site QA audit (read-only): crawls every built page headlessly and
 * reports HTTP errors, failed subresources, JS console/page errors,
 * blank/broken viz containers, stuck loading states, broken internal links,
 * and missing hero images.
 *
 * Usage: node scripts/qa-site-audit.mjs [--base http://127.0.0.1:4173]
 * Writes: artifacts/qa-site-audit-<date>.json and .md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(REPO_ROOT, "out");
const ARTIFACTS_DIR = path.join(REPO_ROOT, "artifacts");
const PUBLIC_DIR = path.join(REPO_ROOT, "public");
const DATE_TAG = "2026-08-23";
const BASE_URL = (
  process.argv.includes("--base")
    ? process.argv[process.argv.indexOf("--base") + 1]
    : process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173"
).replace(/\/$/, "");
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || 4);

function existsOnDisk(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(urlPath, BASE_URL).pathname);
  } catch {
    return false;
  }
  let rel = pathname.replace(/^\/+/, "");
  if (!rel) rel = "index.html";
  const candidates = [path.join(OUT_DIR, rel)];
  if (!path.extname(rel)) {
    candidates.push(path.join(OUT_DIR, `${rel}.html`));
    candidates.push(path.join(OUT_DIR, rel, "index.html"));
  }
  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) return true;
    } catch {
      /* next */
    }
  }
  return false;
}

function buildJobs() {
  const jobs = [];
  const blogDir = path.join(OUT_DIR, "blog");
  if (fs.existsSync(path.join(blogDir, "index.html"))) {
    jobs.push({ url: `${BASE_URL}/blog`, kind: "blog-index", slug: "(blog index)" });
  } else {
    jobs.push({ url: `${BASE_URL}/blog`, kind: "blog-index-missing-probe", slug: "(blog index)" });
  }
  const slugs = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => f.slice(0, -5))
    .sort();
  for (const slug of slugs) {
    jobs.push({ url: `${BASE_URL}/blog/${slug}`, kind: "post", slug });
  }
  const catDir = path.join(OUT_DIR, "category");
  if (fs.existsSync(catDir)) {
    for (const f of fs.readdirSync(catDir).filter((f) => f.endsWith(".html")).sort()) {
      jobs.push({
        url: `${BASE_URL}/category/${f.slice(0, -5)}`,
        kind: "category",
        slug: `(category ${f.slice(0, -5)})`,
      });
    }
  }
  jobs.push({ url: `${BASE_URL}/categories`, kind: "categories-index", slug: "(categories)" });
  jobs.push({ url: `${BASE_URL}/`, kind: "homepage", slug: "(homepage)" });
  const legacy = path.join(OUT_DIR, "politics", "global-refugee-hosting-burden-2024", "index.html");
  if (fs.existsSync(legacy)) {
    jobs.push({
      url: `${BASE_URL}/politics/global-refugee-hosting-burden-2024`,
      kind: "legacy-route",
      slug: "global-refugee-hosting-burden-2024 (legacy)",
    });
  }
  return jobs;
}

const HOMEPAGE_EXPECTED = [
  "migration-humanitarian-research-2026",
  "fiscal-industrial-policy-research-2026",
  "ai-power-grid-research-2026",
];

async function auditPage(context, job, extra = {}) {
  const page = await context.newPage();
  const rec = {
    url: job.url,
    kind: job.kind,
    slug: job.slug,
    httpStatus: null,
    gotoError: null,
    pageErrors: [],
    consoleErrors: [],
    failedSubresources: [],
    viz: null,
    internalLinks: [],
    ...extra,
  };
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.removeAllListeners("requestfailed");
  page.removeAllListeners("response");
  page.on("pageerror", (err) => rec.pageErrors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") rec.consoleErrors.push(msg.text());
  });
  // Next.js prefetches abort when the user never navigates, RSC .txt payloads
  // 404 on the static server by design, and analytics beacons abort in
  // headless/offline runs. All crawl noise, not site bugs.
  job.path = job.path || new URL(job.url).pathname;
  const isNoiseRequest = (url) => {
    if (/google-analytics\.com|googletagmanager\.com|analytics|\/collect\?/i.test(url)) {
      return true;
    }
    if (!url.startsWith(BASE_URL)) return false;
    const p = url.slice(BASE_URL.length).split("?")[0];
    return p.endsWith(".txt") || existsOnDisk(p);
  };
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (isNoiseRequest(url)) {
      rec.prefetchAborted = (rec.prefetchAborted || 0) + 1;
      return;
    }
    rec.failedSubresources.push({ url, failure: req.failure()?.errorText || "failed" });
  });
  page.on("response", (res) => {
    if (res.status() < 400) return;
    const url = res.url();
    if (isNoiseRequest(url)) {
      rec.rscPrefetch404 = (rec.rscPrefetch404 || 0) + 1;
      return;
    }
    rec.failedSubresources.push({ url, status: res.status() });
  });

  try {
    const resp = await page.goto(job.url, { waitUntil: "networkidle", timeout: 25_000 });
    rec.httpStatus = resp ? resp.status() : null;
  } catch (err) {
    rec.gotoError = String(err).slice(0, 300);
    try {
      const resp = await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 25_000 });
      rec.httpStatus = resp ? resp.status() : null;
      rec.gotoError += " (retry domcontentloaded ok)";
    } catch (err2) {
      rec.gotoError += " | retry failed: " + String(err2).slice(0, 200);
    }
  }

  await page.waitForTimeout(3_000);

  try {
    rec.viz = await page.evaluate(() => {
      const roots = Array.from(document.querySelectorAll("[data-viz],[data-viz-dashboard]"));
      let emptyRoots = 0;
      for (const r of roots) {
        const text = (r.textContent || "").trim();
        const hasRenderable = r.querySelector("svg,canvas,table,iframe");
        if (text.length < 12 && !hasRenderable) emptyRoots++;
      }
      const bodyText = document.body ? document.body.innerText || "" : "";
      return {
        vizRoots: roots.length,
        emptyRoots,
        stuckLoading: /loading interactive charts/i.test(bodyText),
        bodyTextLen: bodyText.length,
      };
    });
  } catch (err) {
    rec.viz = { error: String(err).slice(0, 200) };
  }

  try {
    rec.internalLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href") || "")
        .filter((h) => h.startsWith("/"))
        .map((h) => h.split("#")[0])
        .filter(Boolean),
    );
  } catch {
    /* keep empty */
  }

  if (job.kind === "homepage") {
    const html = (await page.content().catch(() => "")) || "";
    rec.homepageMissingSlugs = HOMEPAGE_EXPECTED.filter((s) => !html.includes(s));
  }

  await page.close();
  return rec;
}

function classifyIssues(rec) {
  const issues = [];
  // The app intentionally has no /blog index route (homepage is the listing);
  // when out/blog/index.html is absent we probe /blog anyway and a 404 is the
  // expected, correct result — don't report it as an error.
  if (rec.kind === "blog-index-missing-probe" && rec.httpStatus === 404) {
    return { issues, otherConsole: [] };
  }
  if (rec.httpStatus !== 200) issues.push(`http_${rec.httpStatus ?? "error"}`);
  if (rec.gotoError && !String(rec.gotoError).includes("(retry domcontentloaded ok)")) {
    issues.push("goto_failed");
  }
  for (const e of rec.pageErrors) issues.push("js_page_error");
  const resourceLoadNoise = rec.consoleErrors.filter(
    (e) =>
      e.includes("Failed to load resource") ||
      /404|500\b/.test(e),
  );
  const otherConsole = rec.consoleErrors.filter((e) => !resourceLoadNoise.includes(e));
  if (otherConsole.length) issues.push("js_console_error");
  if (rec.failedSubresources.length) issues.push("failed_subresource");
  if (rec.viz?.stuckLoading) issues.push("stuck_loading");
  if (typeof rec.viz?.emptyRoots === "number" && rec.viz.emptyRoots > 0) issues.push("empty_viz_root");
  if (
    rec.kind === "post" &&
    rec.viz &&
    rec.viz.vizRoots === 0 &&
    !rec.viz.error &&
    (rec.viz.bodyTextLen ?? 0) < 400
  ) {
    issues.push("no_viz_root");
  }
  if (rec.brokenOutgoingLinks?.length) issues.push("broken_internal_link");
  if (rec.homepageMissingSlugs?.length) issues.push("homepage_missing_expected_post");
  return { issues, otherConsole };
}

function normalizeErrorSignature(text) {
  return text
    .replace(/https?:\/\/\S+/g, "<url>")
    .replace(/\d{2,}/g, "#")
    .slice(0, 220);
}

function auditHeroImages() {
  const result = { postsTotal: 0, withCustomImage: 0, missingOnDisk: [], postsWithoutCustomImage: [] };
  const postsTsPath = path.join(REPO_ROOT, "src", "data", "posts.ts");
  let raw = "";
  try {
    raw = fs.readFileSync(postsTsPath, "utf8");
  } catch (err) {
    result.error = `cannot read posts.ts: ${err}`;
    return result;
  }
  // Slice per-post regions between consecutive slug declarations; imageUrl
  // sits inside its own entry region regardless of key ordering.
  const slugRe = /slug:\s*["'`]([^"'`]+)["'`]/g;
  const marks = [];
  let m;
  while ((m = slugRe.exec(raw)) !== null) {
    marks.push({ slug: m[1], start: m.index, end: raw.length });
  }
  for (let i = 0; i < marks.length; i++) {
    marks[i].end = i + 1 < marks.length ? marks[i + 1].start : raw.length;
  }
  for (const mark of marks) {
    result.postsTotal++;
    const body = raw.slice(mark.start, mark.end);
    const imgMatch = body.match(/imageUrl:\s*["'`]([^"'`]+)["'`]/);
    if (imgMatch) {
      result.withCustomImage++;
      const urlPath = imgMatch[1];
      const onPublic = fs.existsSync(path.join(PUBLIC_DIR, urlPath.replace(/^\//, "")));
      const onOut = fs.existsSync(path.join(OUT_DIR, urlPath.replace(/^\//, "")));
      if (!onPublic || !onOut) {
        result.missingOnDisk.push({ slug: mark.slug, imageUrl: urlPath, onPublic, onOut });
      }
    } else {
      result.postsWithoutCustomImage.push(mark.slug);
    }
  }
  return result;
}

async function main() {
  if (process.argv.includes("--hero-only")) {
    console.log(JSON.stringify(auditHeroImages(), null, 2));
    return;
  }
  if (!fs.existsSync(path.join(OUT_DIR, "index.html"))) {
    console.error("missing out/index.html — run npm run build first");
    process.exit(1);
  }
  const jobs = buildJobs();
  console.log(`auditing ${jobs.length} pages at ${BASE_URL} (concurrency ${CONCURRENCY})`);

  const records = [];
  const linkSources = new Map(); // href -> Set(source urls)
  const browser = await chromium.launch({ headless: true });
  let cursor = 0;

  async function worker(id) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      process.stdout.write(`[${id}] (${cursor}/${jobs.length}) ${job.url}\r`);
      let rec;
      try {
        rec = await auditPage(context, job);
      } catch (err) {
        rec = {
          url: job.url,
          kind: job.kind,
          slug: job.slug,
          httpStatus: null,
          gotoError: String(err).slice(0, 300),
          pageErrors: [],
          consoleErrors: [],
          failedSubresources: [],
          viz: null,
          internalLinks: [],
        };
      }
      const { issues, otherConsole } = classifyIssues(rec);
      rec.issues = issues;
      rec.otherConsoleErrors = otherConsole;
      for (const href of new Set(rec.internalLinks)) {
        if (!linkSources.has(href)) linkSources.set(href, new Set());
        linkSources.get(href).add(rec.url);
      }
      records.push(rec);
    }
    await context.close();
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1)));
  await browser.close();
  console.log("\ncrawl complete, checking links...");

  const brokenLinks = [];
  for (const [href, sources] of [...linkSources.entries()].sort()) {
    if (!existsOnDisk(href)) {
      brokenLinks.push({ href, sources: [...sources].slice(0, 5) });
    }
  }
  for (const rec of records) {
    rec.brokenOutgoingLinks = brokenLinks
      .filter((b) => b.sources.includes(rec.url))
      .map((b) => b.href);
    rec.issues = [...new Set([...classifyIssues(rec).issues])].filter(Boolean);
  }

  const heroImages = auditHeroImages();

  const errorClassCounts = {};
  for (const rec of records) {
    for (const issue of rec.issues) {
      errorClassCounts[issue] = (errorClassCounts[issue] || 0) + 1;
    }
  }
  const passed = records.filter((r) => r.issues.length === 0).length;

  const consoleSignatures = {};
  for (const rec of records) {
    for (const e of rec.otherConsoleErrors) {
      const sig = normalizeErrorSignature(e);
      (consoleSignatures[sig] ||= { count: 0, example: e, exampleUrl: rec.url });
      consoleSignatures[sig].count++;
    }
  }
  const subresourceSignatures = {};
  for (const rec of records) {
    for (const f of rec.failedSubresources) {
      const key = f.status ? `HTTP ${f.status}` : (f.failure || "network error");
      (subresourceSignatures[key] ||= { count: 0, examples: [] });
      subresourceSignatures[key].count++;
      if (subresourceSignatures[key].examples.length < 5) {
        subresourceSignatures[key].examples.push({ url: f.url, onPage: rec.url });
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalPagesTested: records.length,
    pagesPassedAllChecks: passed,
    passRate: `${((passed / records.length) * 100).toFixed(1)}%`,
    errorClassCounts,
    consoleErrorSignatures: consoleSignatures,
    failedSubresourceClasses: subresourceSignatures,
    brokenInternalLinks: brokenLinks,
    heroImages,
    pages: records.sort((a, b) => b.issues.length - a.issues.length || a.url.localeCompare(b.url)),
  };

  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  const jsonPath = path.join(ARTIFACTS_DIR, `qa-site-audit-${DATE_TAG}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const mdLines = [];
  mdLines.push(`# Site QA Audit — ${DATE_TAG}`);
  mdLines.push("");
  mdLines.push(`- Base URL: \`${BASE_URL}\` (static export in \`out/\`)`);
  mdLines.push(`- Pages tested: **${records.length}** (posts, blog index, categories, homepage, legacy routes)`);
  mdLines.push(`- Passed all checks: **${passed}** (${report.passRate})`);
  mdLines.push(`- Internal links checked: **${linkSources.size}** unique, **${brokenLinks.length}** broken`);
  mdLines.push(`- Hero images: ${heroImages.postsTotal} posts scanned, ${heroImages.withCustomImage} with custom image, **${heroImages.missingOnDisk.length} missing on disk**, ${heroImages.postsWithoutCustomImage.length} without custom hero (SVG/chart fallback)`);
  mdLines.push("");
  mdLines.push("## Error classes");
  mdLines.push("");
  mdLines.push("| Class | Pages affected | Example URL(s) |");
  mdLines.push("|---|---|---|");
  const sortedClasses = Object.entries(errorClassCounts).sort((a, b) => b[1] - a[1]);
  for (const [cls, count] of sortedClasses) {
    const examples = records
      .filter((r) => r.issues.includes(cls))
      .slice(0, 3)
      .map((r) => r.url.replace(BASE_URL, ""))
      .join(", ");
    mdLines.push(`| \`${cls}\` | ${count} | ${examples} |`);
  }
  if (!sortedClasses.length) mdLines.push("| (none) | 0 | |");
  mdLines.push("");
  mdLines.push("## Console error signatures");
  mdLines.push("");
  const sigEntries = Object.entries(consoleSignatures).sort((a, b) => b[1].count - a[1].count);
  if (sigEntries.length) {
    for (const [sig, info] of sigEntries.slice(0, 15)) {
      mdLines.push(`- **${info.count}×** \`${sig}\` — e.g. ${info.exampleUrl.replace(BASE_URL, "")}`);
    }
  } else {
    mdLines.push("- None.");
  }
  mdLines.push("");
  mdLines.push("## Failed subresource classes");
  mdLines.push("");
  const subEntries = Object.entries(subresourceSignatures).sort((a, b) => b[1].count - a[1].count);
  if (subEntries.length) {
    for (const [cls, info] of subEntries) {
      mdLines.push(`- **${cls}: ${info.count} requests** — e.g. ${info.examples[0].url}`);
      mdLines.push(`  - on page: ${info.examples[0].onPage.replace(BASE_URL, "")}`);
    }
  } else {
    mdLines.push("- None.");
  }
  mdLines.push("");
  if (heroImages.missingOnDisk.length) {
    mdLines.push("## Missing hero images (referenced in posts.ts, absent on disk)");
    mdLines.push("");
    for (const m of heroImages.missingOnDisk) {
      mdLines.push(`- \`${m.slug}\`: \`${m.imageUrl}\` (public: ${m.onPublic}, out: ${m.onOut})`);
    }
    mdLines.push("");
  }
  if (brokenLinks.length) {
    mdLines.push("## Broken internal links");
    mdLines.push("");
    for (const b of brokenLinks.slice(0, 50)) {
      mdLines.push(`- \`${b.href}\` linked from ${b.sources.map((s) => s.replace(BASE_URL, "")).join(", ")}`);
    }
    if (brokenLinks.length > 50) mdLines.push(`- …and ${brokenLinks.length - 50} more`);
    mdLines.push("");
  }
  const problemPages = records.filter((r) => r.issues.length > 0);
  if (problemPages.length) {
    mdLines.push("## Pages with issues (prioritized)");
    mdLines.push("");
    const sevOrder = ["http_500", "http_404", "goto_failed", "js_page_error", "stuck_loading", "empty_viz_root", "js_console_error", "failed_subresource", "broken_internal_link", "no_viz_root", "homepage_missing_expected_post"];
    problemPages.sort((a, b) => {
      const sa = Math.min(...a.issues.map((i) => (sevOrder.indexOf(i) === -1 ? 99 : sevOrder.indexOf(i))));
      const sb = Math.min(...b.issues.map((i) => (sevOrder.indexOf(i) === -1 ? 99 : sevOrder.indexOf(i))));
      return sa - sb || a.url.localeCompare(b.url);
    });
    for (const rec of problemPages.slice(0, 60)) {
      mdLines.push(`### ${rec.url.replace(BASE_URL, "")}`);
      mdLines.push(`- issues: ${rec.issues.join(", ")}`);
      if (rec.gotoError) mdLines.push(`- goto: ${rec.gotoError}`);
      for (const e of rec.pageErrors.slice(0, 3)) mdLines.push(`- pageError: ${e.slice(0, 250)}`);
      for (const e of rec.otherConsoleErrors.slice(0, 3)) mdLines.push(`- console: ${e.slice(0, 250)}`);
      if (rec.failedSubresources.length) {
        for (const f of rec.failedSubresources.slice(0, 3)) {
          mdLines.push(`- subresource: ${f.status || f.failure} ${f.url}`);
        }
      }
      if (rec.brokenOutgoingLinks?.length) mdLines.push(`- broken outgoing links: ${rec.brokenOutgoingLinks.join(", ")}`);
      if (rec.homepageMissingSlugs?.length) mdLines.push(`- homepage missing: ${rec.homepageMissingSlugs.join(", ")}`);
      mdLines.push("");
    }
  }
  mdLines.push("## Notes");
  mdLines.push("");
  mdLines.push("- Audit-only pass; no fixes applied.");
  mdLines.push("- `no_viz_root` is a warning-level class: post rendered but exposed no `[data-viz]` container (prose-only or layout regression).");

  const mdPath = path.join(ARTIFACTS_DIR, `qa-site-audit-${DATE_TAG}.md`);
  fs.writeFileSync(mdPath, mdLines.join("\n"));

  console.log(`\nwrote ${jsonPath}`);
  console.log(`wrote ${mdPath}`);
  console.log(`pages: ${records.length}, passed: ${passed} (${report.passRate}), broken links: ${brokenLinks.length}`);
  console.log("error classes:", JSON.stringify(errorClassCounts));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
