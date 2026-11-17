import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHeader } from "@/components/SitePageHeader";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial standards",
  description:
    "How Theta Scribe builds original charts, cites public datasets, handles vintages and definitions, and treats corrections. Not a scraped-stats gallery.",
};

export default function MethodologyPage() {
  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="How we work"
        title="Editorial standards"
        lede="Original figures, named sources, and caveats next to the numbers. This page is the desk policy — not a slogan on a template."
      />

      <article className="site-container py-12 sm:py-16">
        <div className="prose-content">
          <h2>The job of a Theta Scribe story</h2>
          <p>
            A piece earns its place when it does two things: it shows an original chart built from
            a public dataset, and it explains what that chart is actually counting. Headlines
            compress. The analysis is where units, coverage, and time windows get stated so a
            reader is not asked to trust a naked KPI.
          </p>
          <p>
            Every story page carries a short “how this analysis was made” note and a publisher
            block linking here. That chrome is deliberate: authorship and methodology should be
            visible without hunting through a footer.
          </p>

          <h2>Original work</h2>
          <p>
            Charts and dashboards on {SITE_NAME} are produced for the story they sit in. We do not
            paste another publication’s graphic, scrape a ranking site into a thin page, or publish
            an uncredited screenshot gallery. Written analysis is drafted for the same page as the
            figure. If a story links elsewhere on this site, it is navigational — not a chain of
            “update” pages restating the last cut.
          </p>

          <h2>Source hierarchy</h2>
          <p>
            Prefer the originating statistical product: a national statistical office, a regulator,
            a central bank, a UN or OECD file, an official dashboard with a documented definition.
            Secondary journalism can point us to a series; it is not a substitute for the
            underlying table. Source blocks at the end of a story name the producer and, where
            possible, the vintage so a reader can reconcile our figure with the agency’s current
            release.
          </p>
          <ul>
            <li>
              <strong>Primary.</strong> Agency tables, statistical annexes, official APIs, and
              documented public dashboards.
            </li>
            <li>
              <strong>Secondary.</strong> Reputable reporting that identifies a series — used to
              find the file, not to replace it.
            </li>
            <li>
              <strong>Constructed.</strong> When a figure uses an editorial composite (for example
              a tightness score), the piece says so and does not present it as an official print.
            </li>
          </ul>

          <h2>How numbers are handled</h2>
          <ul>
            <li>
              <strong>Definitions before drama.</strong> What is in the numerator and denominator,
              who is covered, and which fiscal or calendar year is in view belong next to the
              claim.
            </li>
            <li>
              <strong>Vintages.</strong> Official series revise. We label the release we used rather
              than implying a number is frozen forever.
            </li>
            <li>
              <strong>Comparability.</strong> Breaks in methodology, inflation adjustments, and
              geography changes are called out when they would change the read.
            </li>
            <li>
              <strong>Uncertainty.</strong> Incomplete coverage, modeled fills, and suppressed
              cells are described as such. We do not invent precision the file does not support.
            </li>
          </ul>

          <h2>What we do not do</h2>
          <ul>
            <li>Publish placeholder or lorem copy.</li>
            <li>Invent comments, traffic, or engagement as social proof.</li>
            <li>Present another outlet’s article as our own analysis.</li>
            <li>Use official data without saying whose ledger it is.</li>
            <li>Ship thin doorway pages whose only purpose is to host advertising.</li>
            <li>Mint sequel posts that only restamp the same theme with a new date label.</li>
          </ul>

          <h2>Corrections policy</h2>
          <p>
            If a chart or sentence is wrong, we want the originating file and the error. Use{" "}
            <Link href="/contact">Contact</Link>. Substantive corrections are made on the story
            itself; we do not silently swap a number without a trail when the change would alter
            the claim. When a vintage revision changes the read, the piece should say which release
            was used.
          </p>
          <p>
            Permissions and reuse questions also go through Contact. Official data remains the
            work of its publishers; our contribution is the figure and the cited interpretation.
          </p>

          <h2>Advertising</h2>
          <p>
            When ads appear, they are Google AdSense, disclosed in the{" "}
            <Link href="/privacy">Privacy Policy</Link>. Content pages are written to stand without
            ads. Error pages suppress auto-placed units so a broken URL is not an ads-first shell.
          </p>

          <p>
            For who publishes this desk, see <Link href="/about">About</Link>. For the full story
            catalog framed as research essays, see the <Link href="/blog">archive</Link>.
          </p>
        </div>
      </article>
    </div>
  );
}
