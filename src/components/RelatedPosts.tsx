import Link from "next/link";
import type { Post } from "@/types/post";
import { formatPostDate } from "@/lib/utils";

/**
 * Navigational (not editorial) related-posts picker:
 * same themeId first, then same category, newest first, max 3, never self.
 */
export function pickRelatedPosts(
  current: Post,
  allPosts: Post[],
  max = 3,
): Post[] {
  const others = allPosts.filter((p) => p.slug !== current.slug);
  const sameTheme = current.themeId
    ? others.filter((p) => p.themeId === current.themeId)
    : [];
  const themeSlugs = new Set(sameTheme.map((p) => p.slug));
  const sameCategory = others.filter(
    (p) => p.category === current.category && !themeSlugs.has(p.slug),
  );

  return [...sameTheme, ...sameCategory]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, max);
}

export function RelatedPosts({
  current,
  posts,
}: {
  current: Post;
  posts: Post[];
}) {
  const related = pickRelatedPosts(current, posts);
  if (related.length === 0) return null;

  return (
    <section className="related-posts mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-[color:var(--brand-navy)]">
        Related data stories
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-cyan-200 hover:shadow-md"
          >
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-cyan-600">
              {post.category}
            </span>
            <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-slate-900 group-hover:text-cyan-800">
              {post.title}
            </h3>
            <p className="mt-2 text-xs text-slate-400">
              {formatPostDate(post.publishedAt)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
