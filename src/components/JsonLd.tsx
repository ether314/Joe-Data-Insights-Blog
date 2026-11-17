import { SITE_DESCRIPTION, SITE_LINKTREE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { Post } from "@/types/post";

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": ["Organization", "NewsMediaOrganization"],
            "@id": `${SITE_URL}/#organization`,
            name: SITE_NAME,
            url: SITE_URL,
            logo: absoluteUrl("/images/theta-scribe-icon.png"),
            sameAs: [SITE_LINKTREE],
            description: SITE_DESCRIPTION,
            publishingPrinciples: absoluteUrl("/methodology"),
            ethicsPolicy: absoluteUrl("/methodology"),
            correctionsPolicy: absoluteUrl("/methodology"),
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "editorial",
              url: absoluteUrl("/contact"),
            },
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            publisher: { "@id": `${SITE_URL}/#organization` },
            inLanguage: "en-US",
            about: {
              "@type": "Thing",
              name: "Public-data visual analysis and research essays",
            },
          },
        ],
      }}
    />
  );
}

export function ArticleJsonLd({ post }: { post: Post }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        image: absoluteUrl(post.imageUrl),
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        inLanguage: "en-US",
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/images/theta-scribe-icon.png"),
          },
        },
        isAccessibleForFree: true,
        about: post.category,
      }}
    />
  );
}
