import {
  createProject,
  getAllProjects,
} from "@/lib/project-store";
import { parseProjectInput } from "@/lib/projects";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function GET(request: Request) {
  const projects = await getAllProjects();
  return logApiResponse(request, Response.json(projects));
}

export async function POST(request: Request) {
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

  const parsed = parseProjectInput(body as Record<string, unknown>, lang);
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

  const project = await createProject(parsed.data);
  return logApiResponse(request, Response.json(project, { status: 201 }));
}
