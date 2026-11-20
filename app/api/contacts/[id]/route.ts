import {
  deleteContactSubmission,
  getContactSubmission,
  updateContactSubmission,
} from "@/lib/contact-store";
import { logApiResponse } from "@/lib/api-log";
import { parseContactInput } from "@/lib/contact-validation";
import { getLanguage } from "@/lib/language";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;

  const submission = await getContactSubmission(id);
  if (!submission) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(submission));
}

export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
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

  const parsed = parseContactInput(body as Record<string, unknown>, lang);
  if (!parsed.ok) {
    return logApiResponse(
      request,
      Response.json(parsed.body, { status: 400 }),
    );
  }

  const submission = await updateContactSubmission(id, parsed.data);
  if (!submission) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(submission));
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;

  const deleted = await deleteContactSubmission(id);
  if (!deleted) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json({ status: "success" }));
}
