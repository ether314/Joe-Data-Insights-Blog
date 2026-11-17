import type { Metadata } from "next";
import Link from "next/link";
import { SitePageHeader } from "@/components/SitePageHeader";
import {
  ADSENSE_PUB_ID,
  GA_MEASUREMENT_ID_PUBLIC,
  SITE_LINKTREE,
  SITE_LINKTREE_LABEL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Theta Scribe uses cookies, Google Analytics, and Google AdSense, and how Google uses data on this site.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <SitePageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        lede="This independent publication uses Google Analytics and Google AdSense. This page describes what that means for readers — without inventing a corporate legal entity we do not have."
      />

      <article className="site-container py-12 sm:py-16">
        <div className="prose-content">
          <p>
            Last updated: September 13, 2026. This policy applies to {SITE_URL} (the “site”),
            published as {SITE_NAME}.
          </p>

          <h2>Who we are</h2>
          <p>
            {SITE_NAME} is an independent research and visual analytics publication. It is not
            operated under a separate registered company name on this page. The public operator
            identity is{" "}
            <a href={SITE_LINKTREE} target="_blank" rel="me noopener noreferrer">
              {SITE_LINKTREE_LABEL}
            </a>
            . Questions about privacy: <Link href="/contact">Contact</Link>.
          </p>

          <h2>What this site is</h2>
          <p>
            The site is a statically hosted blog. Pages are HTML files with original articles and
            interactive charts. We do not run user accounts, and we do not ask you to create a
            login to read.
          </p>

          <h2>Information we collect</h2>
          <p>
            We do not operate our own membership database. Usage data is collected by Google
            services described below when you load a page. If you contact us through the public
            profile, you choose what to send (typically a name, reply email, and message).
          </p>

          <h2>Google Analytics</h2>
          <p>
            The site uses Google Analytics 4 (measurement ID {GA_MEASUREMENT_ID_PUBLIC}) to
            understand aggregate traffic: pages viewed, approximate geography, device type, and
            referral source. Google Analytics uses cookies and similar identifiers. Google’s
            explanation of how it uses data is in{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google’s Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses information from sites or apps that use our services
            </a>
            .
          </p>

          <h2>Google AdSense and advertising cookies</h2>
          <p>
            This site uses Google AdSense (publisher ID {ADSENSE_PUB_ID}) with Auto ads. Google
            may show ads on pages. We do not pick individual advertisers by hand.
          </p>
          <p>
            Third party vendors, including Google, use cookies to serve ads based on a user’s prior
            visits to this website or other websites. Google’s use of advertising cookies enables
            it and its partners to serve ads to users based on their visit to this site and/or
            other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of some third-party vendors’ use of cookies for
            personalized advertising at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>
            .
          </p>
          <p>
            Learn more from Google:
          </p>
          <ul>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses cookies in advertising
              </a>
            </li>
            <li>
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses data on partner sites
              </a>
            </li>
          </ul>
          <p>
            An ads.txt file at {SITE_URL}/ads.txt authorizes Google to sell inventory for this
            publisher ID.
          </p>

          <h2>Cookies</h2>
          <p>
            Cookies are small text files stored on your device. This site and its Google partners
            may set cookies for:
          </p>
          <ul>
            <li>Analytics (Google Analytics) — to measure how the publication is read.</li>
            <li>
              Advertising (Google AdSense) — to serve and, where allowed, personalize ads, and to
              limit how often you see the same ad.
            </li>
          </ul>
          <p>
            You can block or delete cookies in your browser. Blocking advertising cookies may mean
            you still see ads, but they may be less relevant. Blocking analytics cookies limits
            what we can see about aggregate readership.
          </p>

          <h2>What we do not do</h2>
          <p>
            We do not sell a subscriber list. We do not run a first-party comment host that stores
            public identities on our servers. We do not ask for payment card numbers.
          </p>

          <h2>Children</h2>
          <p>
            The site is a research publication aimed at a general adult audience. It is not
            directed at children under 13, and we do not knowingly collect personal information
            from children.
          </p>

          <h2>Changes</h2>
          <p>
            If analytics or advertising practices change in a material way, this page will be
            updated with a new “last updated” date.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions: <Link href="/contact">Contact</Link>, or the public profile{" "}
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
