import { headers } from "next/headers";
import type { BlogPost } from "@/lib/blog-posts";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const response = await fetch(`${proto}://${host}/api/blogs`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
}
