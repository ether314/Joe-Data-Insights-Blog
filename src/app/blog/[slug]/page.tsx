import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FullscreenShell } from "@/components/FullscreenShell";
import { PostImage } from "@/components/PostImage";
import { PostVisualization } from "@/components/PostVisualization";
import { renderPostContent } from "@/lib/markdown";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatPostDate } from "@/lib/utils";
import { categorySlug } from "@/types/post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.imageUrl }],
    },
  };
}

function renderContent(content: string) {
  return renderPostContent(content);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const hasVisualization = Boolean(post.visualization);
  const isFullscreenLayout = post.layout === "fullscreen";
  const isCanvasLayout = post.layout === "canvas" || isFullscreenLayout;

  if (isFullscreenLayout && hasVisualization) {
    return (
      <FullscreenShell>
        <article className="flex h-full min-h-0 w-full flex-col">
          <div className="blog-header-compact shrink-0 w-full border-b border-white/10 bg-[#0f1629] text-white">
            <div className="site-container">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0">
                  <Link
                    href={`/category/${categorySlug(post.category)}`}
                    className="blog-header-meta shrink-0 font-semibold uppercase text-cyan-400 hover:text-cyan-300"
                  >
                    {post.category}
                  </Link>
                  <span className="blog-header-meta text-slate-600">·</span>
                  <h1 className="site-page-title min-w-0">{post.title}</h1>
                  <span className="blog-header-meta hidden text-slate-600 sm:inline">·</span>
                  <p className="blog-header-meta hidden text-slate-400 sm:inline">
                    {formatPostDate(post.publishedAt)}
                  </p>
                </div>
                <Link
                  href="/"
                  className="shrink-0 text-sm font-medium text-slate-400 hover:text-cyan-300"
                >
                  ← All posts
                </Link>
              </div>
            </div>
          </div>
          <div className="site-content flex min-h-0 flex-1 flex-col site-container py-2">
            <PostVisualization type={post.visualization!} />
          </div>
        </article>
      </FullscreenShell>
    );
  }

  return (
    <article className="w-full">
      <div className="w-full bg-[#0f1629] text-white">
        <div className="blog-header site-container">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <Link
              href={`/category/${categorySlug(post.category)}`}
              className="blog-header-meta font-semibold uppercase text-cyan-400 hover:text-cyan-300"
            >
              {post.category}
            </Link>
            <span className="blog-header-meta text-slate-600">·</span>
            <h1 className="site-page-title">{post.title}</h1>
          </div>
          {isCanvasLayout ? (
            <p className="blog-header-meta mt-1 max-w-none leading-snug text-slate-400">{post.excerpt}</p>
          ) : null}
          <p className="blog-header-meta mt-0.5 text-slate-500">{formatPostDate(post.publishedAt)}</p>
        </div>
      </div>

      <div className="site-content site-container py-8">
        {!isCanvasLayout && (
          <p className="mb-8 max-w-none text-xl leading-relaxed text-slate-600">{post.excerpt}</p>
        )}

        {hasVisualization ? (
          <div className={`site-content w-full min-w-0 ${isCanvasLayout ? "mb-8" : "mb-12"}`}>
            <PostVisualization type={post.visualization!} embedded={isCanvasLayout} />
          </div>
        ) : (
          <div className="relative mb-10 w-full overflow-hidden rounded-2xl shadow-xl">
            <PostImage
              src={post.imageUrl}
              alt={post.imageAlt}
              width={1200}
              height={675}
              className="h-auto w-full"
              priority
            />
          </div>
        )}

        {isCanvasLayout && post.layout === "canvas" && post.content.trim() && (
          <div className="prose-content max-w-none border-t border-slate-200 pt-8">
            {renderContent(post.content)}
          </div>
        )}

        {!isCanvasLayout && post.content.trim() && (
          <div className="prose-content max-w-none border-t border-slate-200 pt-8">
            {renderContent(post.content)}
          </div>
        )}

        <div className={`${isCanvasLayout ? "mt-8" : "mt-12"} border-t border-slate-200 pt-8`}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-800"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
