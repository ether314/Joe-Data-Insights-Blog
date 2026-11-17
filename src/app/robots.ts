import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ops/", "/ops/social-outreach"],
    },
    sitemap: "https://ether-data-insights-blog.web.app/sitemap.xml",
    host: "https://ether-data-insights-blog.web.app",
  };
}
