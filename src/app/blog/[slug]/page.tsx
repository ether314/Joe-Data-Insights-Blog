import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AnalysisNote } from "@/components/AnalysisNote";
import { ArticleTrustFooter } from "@/components/ArticleTrustFooter";
import { Byline } from "@/components/Byline";
import { FullscreenShell } from "@/components/FullscreenShell";
import { ArticleJsonLd } from "@/components/JsonLd";
import { PostImage } from "@/components/PostImage";
import { PostVisualization } from "@/components/PostVisualization";
import { RelatedPosts } from "@/components/RelatedPosts";
import { countCitedSources, renderPostContent } from "@/lib/markdown";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";
import { categorySlug } from "@/types/post";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Hand-built articles ship as ready-made HTML in public/blog/<slug>.html. Next must not
 * generate a competing page for them, but the post entry still feeds the archive, search,
 * related posts and the sitemap.
 */
function hasStaticArticle(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "blog", `${slug}.html`));
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.filter((post) => !hasStaticArticle(post.slug)).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: SITE_NAME }],
    publisher: SITE_NAME,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [SITE_NAME],
      images: [{ url: post.imageUrl, alt: post.imageAlt }],
    },
  };
}

function renderContent(content: string) {
  return renderPostContent(content);
}

/** Rough reading time: strip markdown syntax, then words/200. */
function estimateReadingMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_`|-]/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const allPosts = await getAllPosts();

  const hasVisualization = Boolean(post.visualization);
  const isFullscreenLayout = post.layout === "fullscreen";
  const isCanvasLayout = post.layout === "canvas" || isFullscreenLayout;
  const sourceCount = countCitedSources(post.content);
  const readingMinutes = estimateReadingMinutes(post.content);

  if (isFullscreenLayout && hasVisualization) {
    return (
      <FullscreenShell>
        <ArticleJsonLd post={post} />
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
                  <span className="blog-header-meta shrink-0 text-slate-400">Visual essay</span>
                  <span className="blog-header-meta text-slate-600">·</span>
                  <h1 className="site-page-title min-w-0">{post.title}</h1>
                  <span className="blog-header-meta hidden text-slate-600 sm:inline">·</span>
                  <Byline
                    publishedAt={post.publishedAt}
                    className="blog-header-meta hidden text-slate-400 sm:inline"
                    compact
                  />
                </div>
                <Link
                  href="/blog"
                  className="shrink-0 text-sm font-medium text-slate-400 hover:text-cyan-300"
                >
                  ← Archive
                </Link>
              </div>
            </div>
          </div>
          <div className="site-viz-frame site-content flex min-h-0 flex-1 flex-col site-container py-2">
            <PostVisualization type={post.visualization!} />
          </div>
          <div className="shrink-0 border-t border-slate-200 bg-white">
            <div className="site-container py-4">
              <ArticleTrustFooter category={post.category} compact />
            </div>
          </div>
        </article>
      </FullscreenShell>
    );
  }

  return (
    <article className="w-full">
      <ArticleJsonLd post={post} />
      <div className="w-full bg-[#0f1629] text-white">
        <div className="blog-header site-container">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/category/${categorySlug(post.category)}`}
              className="blog-header-meta font-semibold uppercase text-cyan-400 hover:text-cyan-300"
            >
              {post.category}
            </Link>
            <span className="blog-header-meta text-slate-600">·</span>
            <span className="blog-header-meta rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-slate-300">
              Visual essay · original analysis
            </span>
          </div>
          <h1 className="site-page-title mt-2">{post.title}</h1>
          {isCanvasLayout ? (
            <p className="blog-header-meta mt-1 max-w-none leading-snug text-slate-400">{post.excerpt}</p>
          ) : null}
          <Byline
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
            readingMinutes={readingMinutes}
            className="blog-header-meta mt-1.5 text-slate-400"
            showIntent
          />
        </div>
      </div>

      <div className="site-content site-container py-8">
        {(post.format || (post.tags && post.tags.length > 0)) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {post.format ? (
              <span className="rounded-full border border-cyan-600/30 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                {post.format}
              </span>
            ) : null}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <AnalysisNote hasVisualization={hasVisualization} sourceCount={sourceCount} />

        {post.keyPoints && post.keyPoints.length > 0 && !isCanvasLayout && (
          <aside className="key-takeaways mb-8 rounded-xl border-l-4 border-cyan-500 bg-slate-50 p-5">
            <h2 className="key-takeaways-title">Key takeaways</h2>
            <ul className="mt-3 space-y-2">
              {post.keyPoints.slice(0, 3).map((point, j) => (
                <li key={j} className="text-sm leading-relaxed text-slate-700">
                  {point}
                </li>
              ))}
            </ul>
          </aside>
        )}
        {!isCanvasLayout && (
          <p className="mb-8 max-w-none text-xl leading-relaxed text-slate-600">{post.excerpt}</p>
        )}

        {hasVisualization ? (
          <div
            className={`site-viz-frame site-content w-full min-w-0 ${isCanvasLayout ? "mb-8" : "mb-12"}`}
          >
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
          <div className="prose-content border-t border-slate-200 pt-8">
            {renderContent(post.content)}
          </div>
        )}

        {!isCanvasLayout && post.content.trim() && (
          <div className="prose-content border-t border-slate-200 pt-8">
            {renderContent(post.content)}
          </div>
        )}

        <div className={`${isCanvasLayout ? "mt-8" : "mt-12"} space-y-8 border-t border-slate-200 pt-8`}>
          <ArticleTrustFooter category={post.category} />
          <RelatedPosts current={post} posts={allPosts} />
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-800"
          >
            ← Back to the archive
          </Link>
        </div>
      </div>
    </article>
  );
}
