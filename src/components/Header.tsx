import Link from "next/link";
import { CATEGORIES, categorySlug } from "@/types/post";
import { DataInsightsLogo } from "./DataInsightsLogo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1629] text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-none items-center justify-between site-container py-4">
        <Link href="/" className="group flex items-center gap-3">
          <DataInsightsLogo size={36} className="shrink-0 shadow-md transition group-hover:scale-105" />
          <div>
            <span className="text-lg font-bold tracking-tight group-hover:text-cyan-300 transition-colors">
              Data Insights
            </span>
            <p className="hidden text-xs text-slate-400 sm:block">
              Visual analytics for the curious
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${categorySlug(cat)}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {cat}
            </Link>
          ))}
        </nav>

        <Link
          href="/categories"
          aria-label="Explore categories"
          className="flex items-center gap-2 rounded-xl bg-cyan-500/10 p-1.5 ring-1 ring-cyan-500/30 transition hover:bg-cyan-500/20 hover:ring-cyan-400/50 sm:gap-2.5 sm:rounded-full sm:px-4 sm:py-2"
        >
          <DataInsightsLogo size={28} className="shrink-0 shadow-sm" />
          <span className="hidden pr-1 text-sm font-semibold text-cyan-300 sm:inline">
            Explore
          </span>
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-white/5 px-4 py-2 md:hidden">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/category/${categorySlug(cat)}`}
            className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
          >
            {cat}
          </Link>
        ))}
      </nav>
    </header>
  );
}
