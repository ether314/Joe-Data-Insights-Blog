import type { Metadata } from "next";
import Link from "next/link";
import { DisableAutoAds } from "@/components/DisableAutoAds";
import { SocialOutreachDesk } from "@/components/SocialOutreachDesk";
import { SOCIAL_METRICS } from "@/data/social-metrics";
import {
  buildSocialOutreachCatalog,
  topSocialPosts,
} from "@/lib/social-outreach";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES } from "@/types/post";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Social outreach desk",
  description: "Internal Reddit / social targeting for Theta Scribe articles.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export default async function SocialOutreachPage() {
  const posts = await getAllPosts();
  const rows = buildSocialOutreachCatalog(posts);
  const topFive = topSocialPosts(rows, 5);
  const avgScore =
    rows.length === 0
      ? 0
      : rows.reduce((sum, r) => sum + r.socialScore, 0) / rows.length;

  return (
    <div className="w-full bg-slate-100">
      <DisableAutoAds />
      <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-950">
        Internal ops page — noindex, not in nav or sitemap. Bookmark{" "}
        <code className="rounded bg-amber-50 px-1">/ops/social-outreach</code>
      </div>

      <header className="bg-[#0f1629] text-white">
        <div className="site-container py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            Hidden ops · auto-updates with new posts
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Social & Reddit outreach desk
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            Every published article gets five blog-tolerant subreddit targets and a 1–5 social
            score. Catalog regenerates from the post database at build time — no manual row
            maintenance when workers ship new stories.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Weekly readers
              </p>
              <p className="mt-1 font-serif text-3xl font-bold tabular-nums">
                {formatCount(SOCIAL_METRICS.weeklyReaders)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Week of {SOCIAL_METRICS.weekOf} · {SOCIAL_METRICS.source}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Subscribers
              </p>
              <p className="mt-1 font-serif text-3xl font-bold tabular-nums">
                {formatCount(SOCIAL_METRICS.subscribers)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                List / Linktree / newsletter headcount
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Articles scored
              </p>
              <p className="mt-1 font-serif text-3xl font-bold tabular-nums">
                {formatCount(rows.length)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Avg score {avgScore.toFixed(1)} / 5
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Weekly pageviews
              </p>
              <p className="mt-1 font-serif text-3xl font-bold tabular-nums">
                {formatCount(SOCIAL_METRICS.weeklyPageviews ?? 0)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Updated {new Date(SOCIAL_METRICS.updatedAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>

          {SOCIAL_METRICS.notes ? (
            <p className="mt-4 text-xs text-slate-400">{SOCIAL_METRICS.notes}</p>
          ) : null}

          <p className="mt-4 text-xs text-slate-500">
            Update counts weekly via{" "}
            <code className="text-slate-400">node scripts/update-social-metrics.mjs --readers N --subs M</code>{" "}
            after each GA4 pull.
          </p>
        </div>
      </header>

      <div className="site-container py-10 sm:py-12">
        <SocialOutreachDesk
          rows={rows}
          topFive={topFive}
          categories={[...CATEGORIES]}
          siteUrl={SITE_URL}
        />

        <p className="mt-12 text-center text-xs text-slate-500">
          <Link href="/" className="hover:underline">
            ← Site home
          </Link>
          {" · "}
          Not linked from public navigation
        </p>
      </div>
    </div>
  );
}
