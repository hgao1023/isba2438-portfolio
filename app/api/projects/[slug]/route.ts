import {
  deleteProject,
  getProjectBySlug,
  updateProject,
} from "@/lib/project-store";
import { parseProjectInput } from "@/lib/projects";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug);
  if (!project) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(project));
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

  const existing = await getProjectBySlug(slug);
  if (!existing) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  const parsed = parseProjectInput(body as Record<string, unknown>, lang, existing);
  if (!parsed.ok) {
    return logApiResponse(
      request,
      Response.json(
        {
          error: content[lang].projectAdmin.errors.banner,
          errors: parsed.errors,
        },
        { status: 400 },
      ),
    );
  }

  const project = await updateProject(slug, parsed.data);
  return logApiResponse(request, Response.json(project));
}

export async function DELETE(request: Request, { params }: Context) {
  const { slug } = await params;

  const deleted = await deleteProject(slug);
  if (!deleted) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json({ status: "success" }));
}
