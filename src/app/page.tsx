import { Hero } from "@/components/Hero";
import { ExploreCategoriesSection } from "@/components/ExploreCategoriesSection";
import { PostCard } from "@/components/PostCard";
import {
  getFeaturedPosts,
  getPostsGroupedByCategory,
  getRecentPosts,
} from "@/lib/posts";
import { CATEGORIES } from "@/types/post";

export default async function HomePage() {
  const [featured, recent, grouped] = await Promise.all([
    getFeaturedPosts(3),
    getRecentPosts(6),
    getPostsGroupedByCategory(),
  ]);

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((cat) => [cat, grouped[cat]?.length ?? 0]),
  );

  return (
    <>
      <Hero />

      {featured.length > 0 && (
        <section className="bg-white py-12">
          <div className="site-container">
            <h2 className="mb-8 text-2xl font-bold text-slate-900">
              Featured Visualizations
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((post) => (
                <PostCard key={post.id} post={post} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <ExploreCategoriesSection counts={categoryCounts} />

      <section id="latest" className="py-12">
        <div className="site-container">
          <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Latest</h2>
              <p className="mt-1 text-sm text-slate-500">
                Most recent data stories and visualizations
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
