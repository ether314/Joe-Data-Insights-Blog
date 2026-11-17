import { Hero } from "@/components/Hero";
import { EditorialStandardsStrip } from "@/components/EditorialStandardsStrip";
import { ExploreCategoriesSection } from "@/components/ExploreCategoriesSection";
import { LatestPostsSection } from "@/components/LatestPostsSection";
import { PostCard } from "@/components/PostCard";
import { PublishScopeSection } from "@/components/PublishScopeSection";
import { StartHereSection } from "@/components/StartHereSection";
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
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
              Featured original work
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
              Start with these visual essays
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Curated from the desk — not a chronological dump of the full library. Each piece has
              an original figure and a sourced argument you can check against the agency file.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featured.map((post) => (
                <PostCard key={post.id} post={post} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <LatestPostsSection
        posts={allPosts}
        title="From the desk"
        description="Newest original stories. The homepage is a magazine front — the full catalog is the archive."
        maxVisible={9}
        archiveHref="/blog"
        archiveLabel="Open the full archive"
      />

      <ExploreCategoriesSection counts={categoryCounts} />

      <StartHereSection />
      <EditorialStandardsStrip />
      <PublishScopeSection />
    </>
  );
}
