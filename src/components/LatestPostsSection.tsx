"use client";

import Link from "next/link";
import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/post";

const PAGE_SIZE = 6;

interface LatestPostsSectionProps {
  posts: Post[];
  title?: string;
  description?: string;
  pageSize?: number;
  /** Cap homepage lists so the front does not dump the entire mill-like grid. */
  maxVisible?: number;
  archiveHref?: string;
  archiveLabel?: string;
}

export function LatestPostsSection({
  posts,
  title = "Latest",
  description = "Most recent data stories and visualizations",
  pageSize = PAGE_SIZE,
  maxVisible,
  archiveHref,
  archiveLabel = "Browse the archive",
}: LatestPostsSectionProps) {
  const ceiling = maxVisible != null ? Math.min(maxVisible, posts.length) : posts.length;
  const initial = Math.min(pageSize, ceiling);
  const [visibleCount, setVisibleCount] = useState(initial);

  const visiblePosts = posts.slice(0, visibleCount);
  const remainingOnPage = Math.max(ceiling - visibleCount, 0);
  const hasMoreOnPage = remainingOnPage > 0;
  const nextBatch = Math.min(pageSize, remainingOnPage);
  const archiveRemainder = archiveHref ? Math.max(posts.length - ceiling, 0) : 0;

  return (
    <section id="latest" className="py-12">
      <div className="site-container">
        <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            {visibleCount} of {maxVisible != null ? ceiling : posts.length}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {hasMoreOnPage ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500 sm:hidden">
              Showing {visibleCount} of {ceiling} stories
            </p>
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) => Math.min(count + pageSize, ceiling))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              Load more
              <span className="font-medium text-slate-500">({nextBatch} more)</span>
            </button>
          </div>
        ) : null}

        {archiveHref && (archiveRemainder > 0 || (!hasMoreOnPage && posts.length > 0)) ? (
          <div className="mt-10 flex flex-col items-center gap-2">
            <Link
              href={archiveHref}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0f1629] px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900"
            >
              {archiveLabel}
              {archiveRemainder > 0 ? (
                <span className="font-medium text-slate-300">({archiveRemainder} more)</span>
              ) : null}
            </Link>
          </div>
        ) : null}

        {!archiveHref && !hasMoreOnPage && posts.length > initial ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            All {posts.length} stories loaded
          </p>
        ) : null}
      </div>
    </section>
  );
}
