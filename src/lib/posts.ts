import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { samplePosts } from "@/data/posts";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Category, Post } from "@/types/post";
import { categorySlug } from "@/types/post";

const COLLECTION = "posts";

function sortByDate(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

async function fetchFromFirestore(): Promise<Post[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy("publishedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
}

export async function getAllPosts(): Promise<Post[]> {
  if (isFirebaseConfigured()) {
    try {
      return await fetchFromFirestore();
    } catch {
      return sortByDate(samplePosts);
    }
  }
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
  if (isFirebaseConfigured()) {
    try {
      const db = getDb();
      const q = query(
        collection(db, COLLECTION),
        where("category", "==", category),
        orderBy("publishedAt", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Post);
    } catch {
      return sortByDate(
        samplePosts.filter((p) => p.category === category),
      );
    }
  }
  return sortByDate(samplePosts.filter((p) => p.category === category));
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (isFirebaseConfigured()) {
    try {
      const posts = await fetchFromFirestore();
      return posts.find((p) => p.slug === slug);
    } catch {
      return samplePosts.find((p) => p.slug === slug);
    }
  }
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
