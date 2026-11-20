import { addBlogPost, getBlogPosts } from "@/lib/blog-store";
import { parseBlogInput } from "@/lib/blog-posts";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function GET(request: Request) {
  const posts = await getBlogPosts();
  return logApiResponse(request, Response.json(posts));
}

export async function POST(request: Request) {
  const lang = await getLanguage();
  const t = content[lang].blog;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return logApiResponse(
      request,
      Response.json({ error: "Request body must be valid JSON." }, { status: 400 }),
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return logApiResponse(
      request,
      Response.json({ error: "Request body must be a JSON object." }, { status: 400 }),
    );
  }

  const parsed = parseBlogInput(body as Record<string, unknown>, lang);
  if (!parsed.ok) {
    return logApiResponse(
      request,
      Response.json(parsed.body, { status: 400 }),
    );
  }

  const post = await addBlogPost(parsed.data.title, parsed.data.content);
  return logApiResponse(
    request,
    Response.json({ status: "success", message: t.success, post }, { status: 201 }),
  );
}
