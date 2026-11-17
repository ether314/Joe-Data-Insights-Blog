import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHeader } from "@/components/SitePageHeader";
import { SITE_LINKTREE, SITE_LINKTREE_LABEL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Theta Scribe is an independent research and visual analytics desk. We publish original interactive charts and written analysis of public datasets — not scraped galleries or uncredited reprints.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="The desk"
        title="About Theta Scribe"
        lede="An independent research publication. We chart official data, write the argument the figures support, and cite the agencies that produced the numbers."
      />

      <article className="site-container py-12 sm:py-16">
        <div className="prose-content">
          <h2>Mission</h2>
          <p>
            {SITE_NAME} exists to make public statistical products usable as arguments — not as
            decorative charts. Official datasets are often released as spreadsheets, dashboards, or
            dense statistical annexes. Our job is to build an original interactive figure from that
            material, then write the analysis that states what is being counted, for whom, in which
            vintage, and what a careful reader should not infer.
          </p>
          <p>
            The publication is meant to be read like a research magazine: each story is a
            standalone visual essay. The archive is large because the questions are different —
            freshwater, fiscal plumbing, clinical trial geography, energy systems — not because we
            stamp a new quarter onto the same template.
          </p>

          <h2>What this publication is</h2>
          <p>
            Each story starts from a public dataset — statistical agencies, regulators,
            international organizations, and other official ledgers — and turns it into an
            interactive figure plus written analysis. The charts are built for the piece. The prose
            is written to interpret those charts, not to decorate a card grid.
          </p>
          <p>
            This is not a Made-for-Ads doorway, a scraped-stats gallery, or a reprint mill. The
            value is the original visualization and the sourced argument around it: what the series
            actually measures, where it concentrates, and which caveats belong next to the headline.
          </p>

          <h2>Who publishes it</h2>
          <p>
            The site is published under the {SITE_NAME} name by an independent operator. There is
            no invented corporate letterhead and no fictional newsroom byline farm. The public
            identity for this desk is{" "}
            <a href={SITE_LINKTREE} target="_blank" rel="me noopener noreferrer">
              {SITE_LINKTREE_LABEL}
            </a>
            . Corrections, permissions, and questions go through{" "}
            <Link href="/contact">Contact</Link> — a working channel, not a dead form.
          </p>

          <h2>How a story is made</h2>
          <ol>
            <li>
              <strong>Start from the originating file.</strong> Prefer the agency product over a
              secondary summary that already decided the framing.
            </li>
            <li>
              <strong>Build the figure for the question.</strong> The chart is authored for the
              story; it is not a hot-linked image from another outlet.
            </li>
            <li>
              <strong>Write the argument the figure supports.</strong> Definitions, coverage, and
              time windows sit next to the claim.
            </li>
            <li>
              <strong>Cite so a reader can check.</strong> Source blocks name the producer and,
              where possible, the vintage.
            </li>
          </ol>

          <h2>What you will find in a story</h2>
          <ul>
            <li>An original interactive chart or dashboard, not a hot-linked image from another outlet.</li>
            <li>Written analysis that explains definitions, vintages, and what the figure does not show.</li>
            <li>Named originating sources so a reader can go back to the agency file.</li>
            <li>Publisher chrome that links to this About page and to editorial standards.</li>
          </ul>
          <p>
            How we handle numbers, source hierarchy, and corrections is documented on the{" "}
            <Link href="/methodology">editorial standards</Link> page. Browse the{" "}
            <Link href="/blog">archive</Link> or <Link href="/categories">topics</Link> for the
            published work.
          </p>

          <h2>Independence &amp; advertising</h2>
          <p>
            {SITE_NAME} is not affiliated with the statistical agencies whose data we chart. Those
            datasets remain the work of their publishers; our contribution is the figure, the
            framing, and the cited interpretation. Advertising, when shown, is Google AdSense and
            is disclosed in the <Link href="/privacy">Privacy Policy</Link>. Ads are secondary to
            the essay; thin error pages suppress auto-placed units so a missing URL is not an ads
            doorway.
          </p>
        </div>
      </article>
    </div>
  );
}
