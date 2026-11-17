import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SitePageHeader } from "@/components/SitePageHeader";
import { SITE_LINKTREE, SITE_LINKTREE_LABEL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Theta Scribe research desk about charts, sources, corrections, or reuse. Public contact is through the operator’s Linktree profile.",
};

export default function ContactPage() {
  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="The desk"
        title="Contact"
        lede="Questions about a figure, a vintage, a correction, or reuse of a chart. This is a static publication — the working channel is the operator’s public profile, not a fictional inbox."
      />

      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Send a note</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Use the form for a structured message. Submitting copies it and opens{" "}
              {SITE_NAME}’s public profile so you can paste it there.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-700">
              Direct channel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Operator profile (the contact method that actually exists):
            </p>
            <a
              href={SITE_LINKTREE}
              target="_blank"
              rel="me noopener noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-cyan-800 underline underline-offset-2"
            >
              {SITE_LINKTREE_LABEL}
            </a>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">
              For how we handle numbers, see{" "}
              <Link href="/methodology" className="font-semibold text-cyan-800 underline underline-offset-2">
                editorial standards
              </Link>
              . For who publishes the desk, see{" "}
              <Link href="/about" className="font-semibold text-cyan-800 underline underline-offset-2">
                About
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
