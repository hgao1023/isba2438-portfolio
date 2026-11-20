import { addBlogPost, getBlogPosts } from "@/lib/blog-posts";
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

  const obj = body as Record<string, unknown>;
  const data = {
    title: String(obj.title ?? "").trim(),
    content: String(obj.content ?? "").trim(),
  };

  const errors: { title?: string; content?: string } = {};
  if (data.title.length === 0) {
    errors.title = t.errors.title;
  }
  if (data.content.length === 0) {
    errors.content = t.errors.content;
  }

  if (Object.keys(errors).length > 0) {
    return logApiResponse(
      request,
      Response.json(
        { status: "error", message: t.errorBanner, errors },
        { status: 400 },
      ),
    );
  }

  const post = await addBlogPost(data.title, data.content);
  return logApiResponse(
    request,
    Response.json({ status: "success", message: t.success, post }, { status: 201 }),
  );
}
