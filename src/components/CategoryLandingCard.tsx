import Link from "next/link";
import type { Category, Post } from "@/types/post";
import { categorySlug } from "@/types/post";
import { CATEGORY_THEMES } from "@/lib/category-themes";
import { PostCard } from "./PostCard";

interface CategoryLandingCardProps {
  category: Category;
  posts: Post[];
}

export function CategoryLandingCard({ category, posts }: CategoryLandingCardProps) {
  const theme = CATEGORY_THEMES[category];
  const preview = posts.slice(0, 2);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-200 hover:shadow-lg">
      <Link
        href={`/category/${categorySlug(category)}`}
        className={`relative block overflow-hidden bg-gradient-to-br ${theme.gradient} px-8 py-10 sm:px-10 sm:py-12`}
      >
        <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl ${theme.glow}`} />
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden>
            <defs>
              <pattern id={`grid-${category}`} width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="400" height="200" fill={`url(#grid-${category})`} />
          </svg>
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
              Category
            </p>
            <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{category}</h2>
            <p className="mt-2 max-w-md text-base text-white/85">{theme.tagline}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start sm:items-end">
            <p className="text-5xl font-bold tabular-nums text-white">{posts.length}</p>
            <p className="text-sm font-medium text-white/80">
              {posts.length === 1 ? "story" : "stories"}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition group-hover:bg-white/25">
              View all
              <span aria-hidden>→</span>
            </span>
          </div>
        </div>

        <div className="relative mt-8 flex gap-2">
          {posts.slice(0, 4).map((post, i) => (
            <div
              key={post.id}
              className="h-1.5 flex-1 rounded-full bg-white/25"
              style={{ maxWidth: `${Math.max(20, 100 - i * 12)}%` }}
            />
          ))}
        </div>
      </Link>

      {preview.length > 0 && (
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {preview.map((post) => (
            <PostCard key={post.id} post={post} variant="compact" />
          ))}
        </div>
      )}
    </article>
  );
}
