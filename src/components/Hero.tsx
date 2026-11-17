import { HeroDataBackground } from "@/components/HeroDataBackground";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1c] text-white">
      <HeroDataBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(10,15,28,0.82)_100%)]" />
      <div className="relative z-10 site-container py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Theta Scribe · Research desk
        </p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
          Public data,{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            charted in public
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          We build original interactive figures from official datasets, then write the analysis
          those figures support — units, vintages, and caveats included. This is a research
          publication, not a scraped-stats gallery or an ads-first doorway.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#0a0f1c] transition hover:bg-cyan-300"
          >
            About the desk
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
          >
            Editorial standards
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-2 py-2.5 text-sm font-semibold text-slate-300 underline-offset-4 hover:text-cyan-300 hover:underline"
          >
            Browse the archive
          </Link>
        </div>
      </div>
    </section>
  );
}
