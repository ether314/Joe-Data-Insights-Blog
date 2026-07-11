import { samplePosts } from "@/data/posts";
import type { Category, Post } from "@/types/post";
import { categorySlug } from "@/types/post";

/**
 * Static-export blog: posts always come from local `samplePosts`.
 * Live Firestore is intentionally not used at build/export time (API may be
 * disabled; static hosting must not depend on it).
 */

function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getAllPosts(): Promise<Post[]> {
  return sortByDate(samplePosts);
}

export async function getRecentPosts(limit = 8): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((p) => p.featured);
  return (featured.length ? featured : posts).slice(0, limit);
}

export async function getPostsByCategory(category: Category): Promise<Post[]> {
  return sortByDate(samplePosts.filter((p) => p.category === category));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return samplePosts.find((p) => p.slug === slug);
}

export async function getPostsGroupedByCategory(): Promise<
  Record<Category, Post[]>
> {
  const posts = await getAllPosts();
  const grouped = {} as Record<Category, Post[]>;

  for (const post of posts) {
    if (!grouped[post.category]) grouped[post.category] = [];
    grouped[post.category].push(post);
  }

  return grouped;
}

export { categorySlug };
