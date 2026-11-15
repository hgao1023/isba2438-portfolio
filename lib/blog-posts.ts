import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "blogs.json");

export type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

function slugify(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "post";
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return JSON.parse(await readFile(dataFile, "utf8"));
  } catch {
    return [];
  }
}

export async function addBlogPost(
  title: string,
  content: string,
): Promise<BlogPost> {
  await mkdir(dataDir, { recursive: true });
  const posts = await getBlogPosts();

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 2;
  while (posts.some((post) => post.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const post: BlogPost = {
    slug,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  posts.push(post);

  await writeFile(dataFile, JSON.stringify(posts, null, 2), "utf8");
  return post;
}
