import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";
import { slugify } from "@/lib/slugify";
import type { BlogPost } from "@/lib/blog-posts";

export async function getBlogPosts(): Promise<BlogPost[]> {
  return readJsonFile<BlogPost[]>(dataFilePath("blogs.json"), []);
}

export async function getBlogPost(
  slug: string,
): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function addBlogPost(
  title: string,
  content: string,
): Promise<BlogPost> {
  const dataFile = dataFilePath("blogs.json");
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

  await writeJsonFile(dataFile, posts);
  return post;
}

export async function updateBlogPost(
  slug: string,
  title: string,
  content: string,
): Promise<BlogPost | null> {
  const dataFile = dataFilePath("blogs.json");
  const posts = await getBlogPosts();

  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) {
    return null;
  }

  const updated: BlogPost = { ...posts[index], title, content };
  posts[index] = updated;

  await writeJsonFile(dataFile, posts);
  return updated;
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const dataFile = dataFilePath("blogs.json");
  const posts = await getBlogPosts();

  const next = posts.filter((post) => post.slug !== slug);
  if (next.length === posts.length) {
    return false;
  }

  await writeJsonFile(dataFile, next);
  return true;
}
