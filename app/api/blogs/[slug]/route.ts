import {
  deleteBlogPost,
  getBlogPost,
  updateBlogPost,
} from "@/lib/blog-store";
import { parseBlogInput } from "@/lib/blog-posts";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params;

  const post = await getBlogPost(slug);
  if (!post) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(post));
}

export async function PUT(request: Request, { params }: Context) {
  const { slug } = await params;
  const lang = await getLanguage();

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

  const post = await updateBlogPost(slug, parsed.data.title, parsed.data.content);
  if (!post) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(post));
}

export async function DELETE(request: Request, { params }: Context) {
  const { slug } = await params;

  const deleted = await deleteBlogPost(slug);
  if (!deleted) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json({ status: "success" }));
}
