<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Deploy policy

**Always deploy to Firebase after making changes.** Run `npm run deploy` before finishing any task. Live site: https://ether-data-insights-blog.web.app

**Always smoke-test before and after deploy.** `npm run deploy` runs Playwright against the local static build, deploys, then re-tests production. Do not skip this — a passing `npm run build` is not enough; client-side viz bundles can fail at runtime (e.g. TDZ / init order bugs) while the build still succeeds.
