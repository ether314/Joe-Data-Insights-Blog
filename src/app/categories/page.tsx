import type { Metadata } from "next";
import Link from "next/link";
import { CategoryLandingCard } from "@/components/CategoryLandingCard";
import { getPostsGroupedByCategory } from "@/lib/posts";
import { CATEGORIES } from "@/types/post";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse visual analytics and data stories by topic — Economics, Politics, Finance, and Technology.",
};

export default async function CategoriesPage() {
  const grouped = await getPostsGroupedByCategory();
  const totalPosts = CATEGORIES.reduce(
    (sum, cat) => sum + (grouped[cat]?.length ?? 0),
    0,
  );

  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-[#0f1629] text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-600 blur-3xl" />
        </div>
        <div className="relative site-container py-12 sm:py-16">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to home
          </Link>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Browse by topic
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">All Categories</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            {totalPosts} interactive visual {totalPosts === 1 ? "story" : "stories"}{" "}
            organized across {CATEGORIES.length} topics. Pick a category to see every
            post in that collection.
          </p>
        </div>
      </div>

      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <CategoryLandingCard
              key={cat}
              category={cat}
              posts={grouped[cat] ?? []}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
