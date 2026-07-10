import Link from "next/link";
import type { Post } from "@/types/post";
import { formatPostDate } from "@/lib/utils";
import { PostImage } from "./PostImage";
import { BrokerageBonusesThumbnail } from "./visualizations/BrokerageBonusesThumbnail";
import { AiDataCentersThumbnail } from "./visualizations/AiDataCentersThumbnail";
import { GdpPostThumbnail } from "./visualizations/GdpPostThumbnail";
import { CcpNomenklaturaThumbnail } from "./visualizations/CcpNomenklaturaThumbnail";
import { ChinaFiscalRevenueThumbnail } from "./visualizations/ChinaFiscalRevenueThumbnail";
import { SubsidiesTariffsThumbnail } from "./visualizations/SubsidiesTariffsThumbnail";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact" | "featured";
}

function PostThumbnail({
  post,
  className,
  sizes,
  priority,
}: {
  post: Post;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const useHeroImage =
    post.imageUrl.endsWith(".png") ||
    post.imageUrl.endsWith(".jpg") ||
    post.imageUrl.endsWith(".jpeg") ||
    post.imageUrl.endsWith(".webp");

  if (useHeroImage) {
    return (
      <PostImage
        src={post.imageUrl}
        alt={post.imageAlt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (post.visualization === "gdp-analysis") {
    return <GdpPostThumbnail />;
  }
  if (post.visualization === "subsidies-tariffs") {
    return <SubsidiesTariffsThumbnail />;
  }
  if (post.visualization === "brokerage-bonuses") {
    return <BrokerageBonusesThumbnail />;
  }
  if (post.visualization === "ai-data-centers") {
    return <AiDataCentersThumbnail />;
  }
  if (post.visualization === "ccp-nomenklatura") {
    return <CcpNomenklaturaThumbnail />;
  }
  if (post.visualization === "china-fiscal-revenue") {
    return <ChinaFiscalRevenueThumbnail />;
  }
  return (
    <PostImage
      src={post.imageUrl}
      alt={post.imageAlt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl bg-slate-900 shadow-xl transition hover:shadow-2xl hover:-translate-y-1"
      >
        <div className="relative aspect-[16/10] flex-1 overflow-hidden">
          <PostThumbnail
            post={post}
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="mb-2 inline-block rounded-full bg-cyan-500/90 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#0f1629]">
            {post.category}
          </span>
          <h3 className="text-xl font-bold leading-snug text-white sm:text-2xl">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-slate-300">{formatPostDate(post.publishedAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 border-b border-slate-100 py-4 transition hover:bg-slate-50"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
          <PostThumbnail post={post} className="object-cover" sizes="96px" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-cyan-600">
            {post.category}
          </span>
          <h4 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-cyan-700">
            {post.title}
          </h4>
          <p className="mt-1 text-xs text-slate-500">
            {formatPostDate(post.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-cyan-200 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <PostThumbnail
          post={post}
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 w-fit text-xs font-semibold uppercase tracking-wide text-cyan-600">
          {post.category}
        </span>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 group-hover:text-cyan-800">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
        <p className="mt-3 text-xs font-medium text-slate-400">
          {formatPostDate(post.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
