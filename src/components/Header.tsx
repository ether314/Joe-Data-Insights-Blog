import Link from "next/link";
import { getPostSearchIndex } from "@/lib/posts";
import { CATEGORIES, categorySlug } from "@/types/post";
import { SiteSearch } from "./SiteSearch";
import { ThetaScribeLogo } from "./ThetaScribeLogo";

const PRIMARY_NAV_CATEGORIES = CATEGORIES.slice(0, 2);

export async function Header() {
  const searchIndex = await getPostSearchIndex();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1629] text-white shadow-lg">
      <div className="relative mx-auto flex w-full max-w-none items-center justify-between gap-3 site-container py-2.5">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <ThetaScribeLogo size={32} className="shrink-0 shadow-md transition group-hover:scale-105" />
          <div className="min-w-0">
            <span className="text-base font-bold tracking-tight group-hover:text-cyan-300 transition-colors">
              Theta Scribe
            </span>
            <p className="hidden text-[11px] leading-tight text-slate-400 sm:block">
              Research &amp; visual analytics
            </p>
          </div>
        </Link>

        <nav
          aria-label="Publication"
          className="flex min-w-0 flex-nowrap items-center justify-end gap-0.5"
        >
          <Link
            href="/about"
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 hover:text-cyan-300"
          >
            About
          </Link>
          <Link
            href="/methodology"
            className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            Standards
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white md:inline-flex"
          >
            Contact
          </Link>
          {PRIMARY_NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/category/${categorySlug(cat)}`}
              className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white xl:inline-flex"
            >
              {cat}
            </Link>
          ))}
          <Link
            href="/categories"
            className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-white/10 hover:text-white"
          >
            Topics
          </Link>
          <Link
            href="/blog"
            className="hidden rounded-md px-2 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Archive
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SiteSearch posts={searchIndex} />
        </div>
      </div>
    </header>
  );
}
