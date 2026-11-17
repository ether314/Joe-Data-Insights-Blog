import type { Metadata } from "next";
import Link from "next/link";
import { LatestPostsSection } from "@/components/LatestPostsSection";
import { SitePageHeader } from "@/components/SitePageHeader";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "The Theta Scribe archive: original visual analyses of public datasets, organized from newest to oldest. Each story is written to stand on its own.",
};

export default async function ArchivePage() {
  const posts = await getAllPosts();

  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="Publication archive"
        title="Research essays & visual analyses"
        lede={`This is the library of original chart-and-analysis pieces — ${posts.length} stories, newest first. Each entry is a standalone research essay with its own figure and sourced argument, not a feed of recycled dashboards.`}
      />

      <div className="site-container border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-slate-900">How to read this archive</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Open any title for the interactive figure, the written argument, named sources, and
            publisher standards. Prefer browsing by{" "}
            <Link href="/categories" className="font-semibold text-cyan-800 underline underline-offset-2">
              topic
            </Link>{" "}
            if you want a beat rather than a date sort. New readers can start with{" "}
            <Link href="/about" className="font-semibold text-cyan-800 underline underline-offset-2">
              About
            </Link>{" "}
            and{" "}
            <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
              editorial standards
            </Link>{" "}
            before diving the full catalog.
          </p>
        </div>
      </div>

      <LatestPostsSection
        posts={posts}
        title="Newest first"
        description="Each card opens a full essay — figure, argument, and cited agencies — not a thumbnail-only doorway."
        pageSize={12}
      />
    </div>
  );
}
