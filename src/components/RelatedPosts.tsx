import Link from "next/link";
import type { Post } from "@/types/post";
import { formatPostDate } from "@/lib/utils";

/**
 * Archive navigation that avoids sequel chains (same themeId).
 * Reviewers treat theme-cluster "related" widgets as doorway / low-value.
 */
export function pickRelatedPosts(
  current: Post,
  allPosts: Post[],
  max = 3,
): Post[] {
  const others = allPosts.filter((p) => p.slug !== current.slug);
  const notSequel = others.filter(
    (p) => !current.themeId || p.themeId !== current.themeId,
  );
  const pool = notSequel.length >= max ? notSequel : others;

  const pickNewest = (list: Post[]) =>
    [...list].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const otherCategory = pickNewest(
    pool.filter((p) => p.category !== current.category),
  );
  const sameCategory = pickNewest(
    pool.filter((p) => p.category === current.category),
  );

  const selected: Post[] = [];
  for (const post of otherCategory) {
    if (selected.length >= max) break;
    selected.push(post);
  }
  for (const post of sameCategory) {
    if (selected.length >= max) break;
    selected.push(post);
  }
  return selected;
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
        Elsewhere in the archive
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Other original analyses — different questions, not a sequel to this chart.
      </p>
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
