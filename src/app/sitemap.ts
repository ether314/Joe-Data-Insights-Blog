import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { CATEGORIES, categorySlug } from "@/types/post";

const BASE_URL = "https://ether-data-insights-blog.web.app";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${BASE_URL}/category/${categorySlug(category)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const staticEntries: MetadataRoute.Sitemap = ["", "/blog", "/categories"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    }),
  );

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
