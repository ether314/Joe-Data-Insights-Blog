# Site QA Audit — 2026-08-23

- Base URL: `http://127.0.0.1:4173` (static export in `out/`)
- Pages tested: **255** (posts, blog index, categories, homepage, legacy routes)
- Passed all checks: **255** (100.0%)
- Internal links checked: **248** unique, **0** broken
- Hero images: 240 posts scanned, 240 with custom image, **2 missing on disk**, 0 without custom hero (SVG/chart fallback)

## Error classes

| Class | Pages affected | Example URL(s) |
|---|---|---|
| (none) | 0 | |

## Console error signatures

- None.

## Failed subresource classes

- **HTTP 404: 1 requests** — e.g. http://127.0.0.1:4173/blog
  - on page: /blog

## Missing hero images (referenced in posts.ts, absent on disk)

- `oecd-strike-days-per-1-000-employees-2026`: `/images/economics-oecd-strike-days-per-1-000-employees-2026-hero.png` (public: true, out: false)
- `trade-wages-versus-college-majors-2026`: `/images/labor-skills-trade-wages-versus-college-majors-2026-hero.png` (public: true, out: false)

## Notes

- Audit-only pass; no fixes applied.
- `no_viz_root` is a warning-level class: post rendered but exposed no `[data-viz]` container (prose-only or layout regression).