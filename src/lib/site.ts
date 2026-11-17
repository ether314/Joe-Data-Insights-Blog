/** Public identity for Theta Scribe — keep these accurate; do not invent a legal entity. */
export const SITE_NAME = "Theta Scribe";
export const SITE_TAGLINE = "Research & visual analytics";
export const SITE_PUBLISHER = "Theta Scribe Research Desk";
export const SITE_URL = "https://ether-data-insights-blog.web.app";
export const SITE_LOGO_PATH = "/images/theta-scribe-icon.png";
export const SITE_LINKTREE = "https://linktr.ee/ether690";
export const SITE_LINKTREE_LABEL = "linktr.ee/ether690";

export const SITE_DESCRIPTION =
  "Theta Scribe is an independent research desk that builds original interactive charts from public datasets and writes the analysis those figures support. Sources are cited to the agencies that publish the numbers.";

export const GA_MEASUREMENT_ID_PUBLIC = "G-JMB4RQFS95";
export const ADSENSE_PUB_ID = "ca-pub-9801744293963656";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
