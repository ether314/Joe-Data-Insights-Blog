import Link from "next/link";
import { SITE_NAME, SITE_PUBLISHER, SITE_TAGLINE } from "@/lib/site";

/**
 * End-of-article publisher chrome — visible authorship, methodology, and contact
 * without rewriting individual post bodies.
 */
export function ArticleTrustFooter({
  category,
  compact = false,
}: {
  category?: string;
  compact?: boolean;
}) {
  return (
    <aside
      className={`rounded-2xl border border-slate-200 bg-slate-50 ${compact ? "p-4" : "p-6 sm:p-7"}`}
    >
      <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-cyan-800">
        Publisher
      </p>
      <p className={`mt-1 font-serif font-bold text-slate-900 ${compact ? "text-lg" : "text-xl"}`}>
        {SITE_PUBLISHER}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">{SITE_TAGLINE}</p>
      <p className={`mt-3 leading-relaxed text-slate-600 ${compact ? "text-xs" : "text-sm"}`}>
        This piece was published by {SITE_NAME}
        {category ? ` under the ${category} desk` : ""}. Charts on this site are original figures
        built for the story from public datasets. How we cite sources, label vintages, and handle
        corrections is documented in our editorial standards.
      </p>
      <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 ${compact ? "text-xs" : "text-sm"}`}>
        <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
          How this analysis was made
        </Link>
        <Link href="/about" className="font-semibold text-cyan-800 underline underline-offset-2">
          About the desk
        </Link>
        <Link href="/contact" className="font-semibold text-cyan-800 underline underline-offset-2">
          Corrections &amp; contact
        </Link>
      </div>
    </aside>
  );
}
