import Link from "next/link";

interface AnalysisNoteProps {
  hasVisualization: boolean;
  sourceCount: number;
}

/**
 * Site-level provenance for every story — not cloned from article bodies.
 * Tells reviewers this is original analysis of public data, not a scraped gallery.
 */
export function AnalysisNote({ hasVisualization, sourceCount }: AnalysisNoteProps) {
  return (
    <aside className="analysis-note mb-8 rounded-xl border border-cyan-700/20 bg-cyan-50/60 p-5">
      <p className="text-[0.8125rem] font-bold uppercase tracking-widest text-cyan-800">
        How this analysis was made
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Published by the Theta Scribe research desk.{" "}
        {hasVisualization
          ? "The charts on this page are original figures built for this story from public datasets — not a scraped screenshot gallery."
          : "This story is original analysis of public data, written for this desk."}{" "}
        {sourceCount > 0
          ? `Primary sources (${sourceCount}) are listed with the article so a reader can check the originating agency.`
          : "Where a figure uses an official series, the originating agency is named in the piece."}{" "}
        Full policy on vintages, definitions, and corrections:{" "}
        <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
          editorial standards / methodology
        </Link>
        . Publisher identity:{" "}
        <Link href="/about" className="font-semibold text-cyan-800 underline underline-offset-2">
          About Theta Scribe
        </Link>
        .
      </p>
    </aside>
  );
}
