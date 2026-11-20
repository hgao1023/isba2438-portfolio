import { addScheduleSlot, getScheduleSlots } from "@/lib/schedule-store";
import { parseScheduleInput } from "@/lib/schedule";
import { logApiResponse } from "@/lib/api-log";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function GET(request: Request) {
  const slots = await getScheduleSlots();
  return logApiResponse(request, Response.json(slots));
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

  const slot = await addScheduleSlot(parsed.data);
  return logApiResponse(request, Response.json(slot, { status: 201 }));
}
