import Link from "next/link";
import type { Category } from "@/types/post";
import { CATEGORIES, categorySlug } from "@/types/post";
import { CATEGORY_THEMES } from "@/lib/category-themes";
import { CATEGORY_ICONS } from "./CategoryIcons";

interface ExploreCategoriesSectionProps {
  counts: Partial<Record<Category, number>>;
}

function CategoryExploreCard({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  const theme = CATEGORY_THEMES[category];
  const Icon = CATEGORY_ICONS[category];

  return (
    <Link
      href={`/category/${categorySlug(category)}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${theme.glow}`}
      />

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg transition group-hover:scale-105 group-hover:shadow-xl`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="relative mt-5 text-xl font-bold text-slate-900 transition group-hover:text-slate-800">
        {category}
      </h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-slate-500">
        {theme.tagline}
      </p>

      <div className="relative mt-5 flex items-center justify-between">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: `${theme.accent}18`,
            color: theme.accent,
          }}
        >
          {count} {count === 1 ? "story" : "stories"}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-cyan-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
          Explore
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${theme.gradient} transition-all duration-300 group-hover:w-full`}
      />
    </Link>
  );
}

export function ExploreCategoriesSection({ counts }: ExploreCategoriesSectionProps) {
  return (
    <section id="categories" className="relative overflow-hidden py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1629] via-[#131d35] to-[#0f1629]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-cyan-500 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-600 blur-[100px]" />
      </div>

      <div className="relative site-container">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Browse topics
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Explore by Category
            </h2>
            <p className="mt-3 max-w-xl text-slate-400">
              Dive into economics, politics, finance, and technology — each with
              interactive charts and data-driven stories.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            View all categories
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <CategoryExploreCard key={cat} category={cat} count={counts[cat] ?? 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
