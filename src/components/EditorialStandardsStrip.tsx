import Link from "next/link";

const PILLARS = [
  {
    title: "Original charts",
    body: "Figures are built for the story they sit in. We do not paste another outlet’s graphic or publish a screenshot gallery.",
  },
  {
    title: "Named public sources",
    body: "Numbers come from statistical agencies, regulators, and official ledgers. The originating file is cited so you can check it.",
  },
  {
    title: "Analysis, not a dump",
    body: "A KPI without a definition is advertising copy. We state what is being counted, for whom, and in which vintage.",
  },
] as const;

export function EditorialStandardsStrip() {
  return (
    <section className="border-b border-slate-200 bg-white py-12 sm:py-14">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            Why this desk exists
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            Visual essays with a paper trail
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Theta Scribe publishes standalone analyses. Each piece is meant to be read as original
            work — a chart you will not find copied from a ranking mill, plus the argument that
            makes the chart usable.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">
          Full policy:{" "}
          <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
            editorial standards
          </Link>
          . Publisher identity:{" "}
          <Link href="/about" className="font-semibold text-cyan-800 underline underline-offset-2">
            About Theta Scribe
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
