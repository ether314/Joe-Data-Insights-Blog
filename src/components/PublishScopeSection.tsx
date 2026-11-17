import Link from "next/link";

const WE_PUBLISH = [
  "Standalone visual essays: one question, one original figure set, one sourced argument.",
  "Interactive charts built for the story from public statistical products.",
  "Named agencies, vintages, and definitions next to the claim — not a naked KPI.",
  "Corrections when a number or framing is wrong, documented on the story.",
] as const;

const WE_DO_NOT = [
  "Scraped ranking galleries or screenshot farms from other outlets.",
  "Sequel chains that restate the same chart with a new quarter stamp.",
  "Placeholder copy, invented comments, or fake social proof.",
  "Doorway pages whose only job is to host ads around thin text.",
] as const;

/** Clear “what this publication is / isn’t” — high-signal for human reviewers. */
export function PublishScopeSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-14">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            Editorial scope
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            What we publish — and what we refuse
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Reviewers should be able to tell a research desk from a chart mill in one scroll.
            This is the short version; the full policy lives on{" "}
            <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
              editorial standards
            </Link>
            .
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 sm:p-7">
            <h3 className="text-lg font-bold text-emerald-900">We publish</h3>
            <ul className="mt-4 space-y-3">
              {WE_PUBLISH.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h3 className="text-lg font-bold text-slate-900">We do not publish</h3>
            <ul className="mt-4 space-y-3">
              {WE_DO_NOT.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
