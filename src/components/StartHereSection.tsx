import Link from "next/link";

const STEPS = [
  {
    href: "/about",
    label: "Who publishes this",
    body: "Meet the desk: independent operator, original figures, named public sources.",
  },
  {
    href: "/methodology",
    label: "How numbers are handled",
    body: "Source hierarchy, vintages, comparability rules, and the corrections path.",
  },
  {
    href: "/blog",
    label: "Read a full essay",
    body: "Open any archive piece for the chart, the argument, and the cited agencies.",
  },
] as const;

/** Guided entry so the first impression is a publication, not a 300-card dump. */
export function StartHereSection() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="site-container">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50/40 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            Start here
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
            New to Theta Scribe?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            The archive is large because each story is a separate research question — not because
            we recycle the same template. Three short stops before you browse by date:
          </p>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.href}>
                <Link
                  href={step.href}
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-md"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                    {index + 1}. {step.label}
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{step.body}</p>
                  <span className="mt-4 text-sm font-semibold text-cyan-800 group-hover:underline">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
