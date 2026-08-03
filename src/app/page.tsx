import { Hero } from "@/components/Hero";
import { ExploreCategoriesSection } from "@/components/ExploreCategoriesSection";
import { LatestPostsSection } from "@/components/LatestPostsSection";
import { PostCard } from "@/components/PostCard";
import {
  getAllPosts,
  getFeaturedPosts,
  getPostsGroupedByCategory,
} from "@/lib/posts";
import { CATEGORIES } from "@/types/post";

export default async function HomePage() {
  const [featured, allPosts, grouped] = await Promise.all([
    getFeaturedPosts(3),
    getAllPosts(),
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

      <LatestPostsSection posts={allPosts} />
    </>
  );
}
