import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { getPostsByCategory } from "@/lib/posts";
import { CATEGORIES, categorySlug, slugToCategory } from "@/types/post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: categorySlug(cat) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: category,
    description: `Theta Scribe — original visual analysis in ${category}. Public datasets, cited sources.`,
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
            Research desk
          </p>
          <h1 className="site-category-title">{category}</h1>
          <p className="mt-1.5 max-w-2xl text-slate-400">
            {posts.length} original visual {posts.length === 1 ? "essay" : "essays"} in this beat —
            each with its own figure and sourced argument, not a sequel of the last chart.
          </p>
        </div>
      </div>

      <div className="site-content site-container py-12">
        {posts.length === 0 ? (
          <p className="text-center text-slate-600">
            No stories in this topic in the current archive. Browse{" "}
            <Link href="/categories" className="font-semibold text-cyan-800 underline underline-offset-2">
              all topics
            </Link>{" "}
            or the{" "}
            <Link href="/blog" className="font-semibold text-cyan-800 underline underline-offset-2">
              full catalog
            </Link>
            .
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
