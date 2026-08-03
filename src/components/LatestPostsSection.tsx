"use client";

import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/post";

const PAGE_SIZE = 6;

interface LatestPostsSectionProps {
  posts: Post[];
}

export function LatestPostsSection({ posts }: LatestPostsSectionProps) {
  const initial = Math.min(PAGE_SIZE, posts.length);
  const [visibleCount, setVisibleCount] = useState(initial);

  const visiblePosts = posts.slice(0, visibleCount);
  const remaining = Math.max(posts.length - visibleCount, 0);
  const hasMore = remaining > 0;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  return (
    <section id="latest" className="py-12">
      <div className="site-container">
        <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest</h2>
            <p className="mt-1 text-sm text-slate-500">
              Most recent data stories and visualizations
            </p>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            {visibleCount} of {posts.length}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {hasMore ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500 sm:hidden">
              Showing {visibleCount} of {posts.length} stories
            </p>
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + PAGE_SIZE, posts.length),
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            >
              Load more
              <span className="font-medium text-slate-500">
                ({nextBatch} more)
              </span>
            </button>
          </div>
        ) : posts.length > initial ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            All {posts.length} stories loaded
          </p>
        ) : null}
      </div>
    </section>
  );
}
