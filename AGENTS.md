<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy policy

**Always deploy to Firebase after making changes.** Run `npm run deploy` before finishing any task. Live site: https://ether-data-insights-blog.web.app

**Always smoke-test before and after deploy.** `npm run deploy` runs Playwright against the local static build, deploys, then re-tests production. Do not skip this — a passing `npm run build` is not enough; client-side viz bundles can fail at runtime (e.g. TDZ / init order bugs) while the build still succeeds.

## Blog post hero / thumbnail images

When creating or updating a blog post, **always generate a beautiful hero/thumbnail image** using the post content as context (title, excerpt, category, key data themes, and visualization subject).

1. Use the **GenerateImage** tool with a detailed prompt derived from the post — do not hand-code SVG placeholders or skip the image.
2. Save as **PNG** at `public/images/{category-slug}-{topic-slug}-hero.png` (16:9 aspect ratio).
3. Wire in `src/data/posts.ts`: set `imageUrl` to `/images/...` and write a descriptive `imageAlt`.
4. Record in `artifacts/backend-manifest.json`: `heroImage` and `heroImageUrl`.
5. Style: Visual Capitalist–inspired — dark navy palette, cinematic data-viz aesthetic, bold and readable at card thumbnail size, no clutter or illegible micro-text.

`PostCard` uses PNG/JPG/WebP heroes directly on listing cards; SVG-only posts fall back to chart thumbnails instead of a custom image.
