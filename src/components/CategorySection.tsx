import Link from "next/link";
import type { Post } from "@/types/post";
import { categorySlug } from "@/types/post";
import { PostCard } from "./PostCard";

interface CategorySectionProps {
  category: string;
  posts: Post[];
}

export function CategorySection({ category, posts }: CategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {posts.length} visual {posts.length === 1 ? "story" : "stories"}
          </p>
        </div>
        <Link
          href={`/category/${categorySlug(category as Parameters<typeof categorySlug>[0])}`}
          className="text-sm font-semibold text-cyan-600 transition hover:text-cyan-800"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
