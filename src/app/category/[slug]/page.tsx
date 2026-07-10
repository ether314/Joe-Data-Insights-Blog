import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostCard } from "@/components/PostCard";
import { getPostsByCategory } from "@/lib/posts";
import { CATEGORIES, slugToCategory } from "@/types/post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category,
    description: `Visual analytics and data stories in ${category}.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const posts = await getPostsByCategory(category);

  return (
    <div className="w-full">
      <div className="bg-[#0f1629] text-white">
        <div className="blog-header site-container">
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-cyan-400">
            Category
          </p>
          <h1 className="site-category-title">{category}</h1>
          <p className="mt-1.5 text-slate-400">
            {posts.length} visual {posts.length === 1 ? "story" : "stories"}
          </p>
        </div>
      </div>

      <div className="site-content site-container py-12">
        {posts.length === 0 ? (
          <p className="text-center text-slate-500">
            No posts in this category yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
