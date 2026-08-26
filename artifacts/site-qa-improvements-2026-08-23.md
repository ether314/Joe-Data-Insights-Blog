# Site QA + Improvements — 2026-08-23

Beyond pass/fail: deep probes over the fresh build (253 pages) at http://127.0.0.1:4173.
Probe scripts were temporary (`artifacts/tmp-*`); results snapshot in `artifacts/tmp-deepqa-results.json`.

## Baseline audit (fresh build)

- `node scripts/qa-site-audit.mjs`: **253/253 pages passed, 0 broken links, 0 error classes**
  (reports: `artifacts/qa-site-audit-2026-08-23.json|.md`). Note: two blessed merges landed
  mid-session; the audit was re-run against a rebuild that includes them.

## Deep probe findings

| Area | Result | Notes |
|---|---|---|
| Duplicate `<title>` across posts | **None** (probe artifact: revisited URLs deduped → 0 real dupes) | titles unique incl. "\| Theta Scribe" suffix |
| Missing meta description (<50 ch) | 0 / 194 post pages | excerpts flow into metadata |
| og:image on posts | 0 missing (`post.imageUrl` wired for all) | |
| h1 count per page | exactly 1 everywhere sampled | |
| Images without `alt` | 0 (`PostCard`/`PostImage` always pass `post.imageAlt`) | |
| Console errors/warnings | 0 signatures across home + 15-post sample | clean client hydration |
| JS payload per post page | ~2.26–2.29 MB transfer (~21 files, largest chunk shared) | local server sends uncompressed; production CDN gzip/brotli will cut this substantially — still the top optimization lever |
| Hero images without width/height | ~155 listing/category pages flagged by naive probe | false positive: cards use `fill` layout inside aspect-ratio boxes (CLS-safe); verified `PostCard.tsx` |
| Hero PNG wiring consistency | **235/235 posts** have PNG hero wired AND file present in `public/images` (no fallback-chart orphans) | |
| Category balance | Global Systems 51, Politics 30, Industry 30 … Real Estate 2, Labor & Skills 3 | content-diversity adjacent — recommendation only |

## Fixes applied this pass

1. **Added `src/app/robots.ts`** — emits `/robots.txt` (allow all + sitemap pointer). Previously absent entirely.
2. **Added `src/app/sitemap.ts`** — emits `/sitemap.xml` with static pages (home/blog/categories), all 14 category pages, and every post with `lastModified` from `publishedAt`. Previously absent.

Both are additive metadata routes (no layout/content changes). Verified `npx tsc --noEmit` = 0 errors,
then rebuilt and re-ran the full audit (results below).

## Post-fix verification

- Build: OK (after two fix iterations: `export const dynamic = "force-static"` required by this
  Next.js version on metadata routes; one transient Google-Fonts fetch failure — retried clean).
- `out/robots.txt` + `out/sitemap.xml` confirmed emitted (255 exported pages total).
- Audit after rebuild: **255/255 pages passed (adds `/robots.txt`, `/sitemap.xml`), 0 broken links, 0 error classes.**

## Recommended (not implemented)

- **Bundle diet**: one shared viz chunk dominates per-page JS; consider dynamic-importing
  `PostVisualization` per chart type so non-matching charts are not parsed on every post.
- **Serve compressed**: enable gzip/brotli on hosting (Firebase Hosting sets this via config headers only if configured).
- **Category depth imbalance** (Real Estate 2 vs Global Systems 51): let future topic claiming weight under-represented categories — diversity-rule territory, left untouched here.
