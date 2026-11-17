import Link from "next/link";

interface SitePageHeaderProps {
  eyebrow: string;
  title: string;
  lede: string;
}

/** Navy masthead used on About, methodology, legal, and archive pages. */
export function SitePageHeader({ eyebrow, title, lede }: SitePageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#0f1629] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-600 blur-3xl" />
      </div>
      <div className="relative site-container py-12 sm:py-16">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back to home
        </Link>
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{lede}</p>
      </div>
    </div>
  );
}
