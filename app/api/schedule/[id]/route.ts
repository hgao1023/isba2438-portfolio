import {
  deleteScheduleSlot,
  getScheduleSlot,
  updateScheduleSlot,
} from "@/lib/schedule-store";
import { parseScheduleInput } from "@/lib/schedule";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;

  const slot = await getScheduleSlot(id);
  if (!slot) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(slot));
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

  const parsed = parseScheduleInput(body as Record<string, unknown>, lang);
  if (!parsed.ok) {
    return logApiResponse(
      request,
      Response.json(
        {
          error: content[lang].scheduleAdmin.errors.banner,
          errors: parsed.errors,
        },
        { status: 400 },
      ),
    );
  }

  const slot = await updateScheduleSlot(id, parsed.data);
  if (!slot) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json(slot));
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;

  const deleted = await deleteScheduleSlot(id);
  if (!deleted) {
    return logApiResponse(
      request,
      Response.json({ error: "Not found." }, { status: 404 }),
    );
  }

  return logApiResponse(request, Response.json({ status: "success" }));
}
