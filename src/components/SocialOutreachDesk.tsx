"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SocialOutreachRow } from "@/lib/social-outreach";
import { POST_STYLE_LABEL } from "@/lib/social-outreach";
import type { Category } from "@/types/post";

interface Props {
  rows: SocialOutreachRow[];
  topFive: SocialOutreachRow[];
  categories: Category[];
  siteUrl: string;
}

function scoreBadgeClass(score: number): string {
  if (score >= 5) return "bg-emerald-600 text-white";
  if (score >= 4) return "bg-cyan-700 text-white";
  if (score >= 3) return "bg-slate-700 text-white";
  if (score >= 2) return "bg-slate-400 text-white";
  return "bg-slate-200 text-slate-700";
}

export function SocialOutreachDesk({ rows, topFive, categories, siteUrl }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category !== "all" && row.category !== category) return false;
      if (row.socialScore < minScore) return false;
      if (!q) return true;
      const blob = `${row.title} ${row.slug} ${row.excerpt} ${row.subreddits.map((s) => s.name).join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [rows, query, category, minScore]);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          Top 5 for social (auto-ranked)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Highest expected reach this week based on title hook, category breadth, topic
          virality, and recency. Recomputed whenever posts are added.
        </p>
        <ol className="mt-4 space-y-3">
          {topFive.map((row, i) => (
            <li
              key={row.slug}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0f1629] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${scoreBadgeClass(row.socialScore)}`}
                  >
                    Score {row.socialScore}/5
                  </span>
                  <span className="text-xs font-medium text-slate-500">{row.category}</span>
                </div>
                <Link
                  href={row.href}
                  className="mt-2 block font-serif text-lg font-semibold text-slate-900 hover:text-cyan-800"
                >
                  {row.title}
                </Link>
                <p className="mt-1 text-sm text-slate-600">{row.socialRankReason}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Best subs:{" "}
                  {row.subreddits.map((s) => `r/${s.name}`).join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <Link
                  href={row.href}
                  className="text-sm font-semibold text-cyan-800 hover:underline"
                >
                  Open article →
                </Link>
                <a
                  href={`${siteUrl}${row.href}`}
                  className="text-xs text-slate-500 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live URL
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-semibold">Reddit posting rules of thumb (stay unbanned)</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Prefer communities marked <strong>OC chart + link in comment</strong> for{" "}
            r/dataisbeautiful / r/MapPorn — title the chart, not the domain.
          </li>
          <li>
            On large finance / politics subs, use a <strong>discussion</strong> post with
            the key figure and one link — do not dump raw blogspam.
          </li>
          <li>
            Rotate accounts/subs; read each sub&apos;s sidebar the day you post; disclose if asked.
          </li>
          <li>
            Avoid r/news and r/worldnews for blog URLs — they remove publisher sites aggressively.
          </li>
        </ul>
      </section>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              All articles ({filtered.length})
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Five blog-tolerant subreddit targets each. Updates automatically from{" "}
              <code className="text-xs">samplePosts</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, slug, sub…"
              className="min-w-[12rem] flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value={1}>Score ≥ 1</option>
              <option value={2}>Score ≥ 2</option>
              <option value={3}>Score ≥ 3</option>
              <option value={4}>Score ≥ 4</option>
              <option value={5}>Score = 5</option>
            </select>
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {filtered.map((row) => (
            <li
              key={row.slug}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${scoreBadgeClass(row.socialScore)}`}
                    >
                      {row.socialScore}/5
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {row.category}
                    </span>
                    <time
                      className="text-xs text-slate-400"
                      dateTime={row.publishedAt}
                    >
                      {new Date(row.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <Link
                    href={row.href}
                    className="mt-1 block font-serif text-lg font-semibold text-slate-900 hover:text-cyan-800"
                  >
                    {row.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.excerpt}</p>
                  <p className="mt-1 text-xs text-slate-500">{row.socialRankReason}</p>
                </div>
                <Link
                  href={row.href}
                  className="shrink-0 text-sm font-semibold text-cyan-800 hover:underline"
                >
                  Article →
                </Link>
              </div>

              <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {row.subreddits.map((sub, idx) => (
                  <li
                    key={`${row.slug}-${sub.name}`}
                    className="rounded-md border border-slate-100 bg-slate-50 p-2.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <a
                        href={sub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-900 hover:text-cyan-800"
                      >
                        {idx + 1}. r/{sub.name}
                      </a>
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        {sub.size}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-cyan-900">
                      {POST_STYLE_LABEL[sub.postStyle]}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-600">{sub.fit}</p>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
