import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHeader } from "@/components/SitePageHeader";
import { SITE_LINKTREE, SITE_LINKTREE_LABEL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for reading Theta Scribe: original analysis of public data, no warranty, and how reuse works.",
};

export default function TermsPage() {
  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="Legal"
        title="Terms of Use"
        lede="Short terms for an independent research site. Read them as a publication policy, not a fictional corporate contract."
      />

      <article className="site-container py-12 sm:py-16">
        <div className="prose-content">
          <p>Last updated: September 13, 2026. These terms apply to {SITE_URL}.</p>

          <h2>The site</h2>
          <p>
            {SITE_NAME} publishes original charts and written analysis of public datasets. Using
            the site means you may read, share links, and cite the work with attribution. It does
            not transfer ownership of our figures, prose, or code.
          </p>

          <h2>Public data vs our work</h2>
          <p>
            Underlying statistics remain the work of the agencies that publish them. Our
            contribution is the visualization, the selection, and the surrounding analysis.
            Republishing an official table is not the same as republishing a {SITE_NAME} chart.
            For permissions, use <Link href="/contact">Contact</Link>.
          </p>

          <h2>No warranty</h2>
          <p>
            Stories are research commentary. They can contain errors, lag a later official
            revision, or depend on definitions that change. Nothing here is investment, legal, or
            medical advice. Official series can be revised after we chart them; check the
            originating agency before you rely on a number for a decision.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not scrape the site in a way that degrades service, misrepresent our charts as
            official agency graphics, or use the publication to impersonate {SITE_NAME}. Automated
            access should respect {SITE_URL}/robots.txt.
          </p>

          <h2>Advertising</h2>
          <p>
            Pages may display Google AdSense ads. Ad content is served by Google and its partners,
            not written by this desk. See the <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>Contact</h2>
          <p>
            Questions: <Link href="/contact">Contact</Link> or{" "}
            <a href={SITE_LINKTREE} target="_blank" rel="noopener noreferrer">
              {SITE_LINKTREE_LABEL}
            </a>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
