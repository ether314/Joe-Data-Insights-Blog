<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy policy

**Interactive main-repo edits:** publish with `npm run deploy:firebase` (local build + smoke + Firebase Hosting + live re-smoke). Live site: https://ether-data-insights-blog.web.app

**Parallel Docker-isolated conveyor (orchestrator + workers):** each worker edits its own git clone in `blog-worker-N` (never the main checkout, never `master`/`main`). Workers run local `npm run deploy` only — never Firebase / `deploy:hosting` / `deploy:firebase`. When a job is `ready`, the **orchestrator blesses** it: other workers pause, the job branch is merged into main, remaining clones sync (fetch/rebase), then workers resume. Hosting publish stays operator-gated unless re-enabled.

**Always smoke-test.** `npm run deploy` is local build + Playwright smoke. A passing `npm run build` alone is not enough; client-side viz bundles can fail at runtime (e.g. TDZ / init order bugs) while the build still succeeds.

## Blog post hero / thumbnail images

When creating or updating a blog post, **always generate a beautiful hero/thumbnail image** using the post content as context (title, excerpt, category, key data themes, and visualization subject).

1. Use the **GenerateImage** tool with a detailed prompt derived from the post — do not hand-code SVG placeholders or skip the image.
2. Save as **PNG** at `public/images/{category-slug}-{topic-slug}-hero.png` (16:9 aspect ratio).
3. Wire in `src/data/posts.ts`: set `imageUrl` to `/images/...` and write a descriptive `imageAlt`.
4. Record in `artifacts/backend-manifest.json`: `heroImage` and `heroImageUrl`.
5. Style: Visual Capitalist–inspired — dark navy palette, cinematic data-viz aesthetic, bold and readable at card thumbnail size, no clutter or illegible micro-text.

`PostCard` uses PNG/JPG/WebP heroes directly on listing cards; SVG-only posts fall back to chart thumbnails instead of a custom image.
