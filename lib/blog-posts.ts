import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";

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
  return readJsonFile<BlogPost[]>(dataFilePath("blogs.json"), []);
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
