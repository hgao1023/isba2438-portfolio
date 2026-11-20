import { addScheduleSlot, getScheduleSlots, parseScheduleInput } from "@/lib/schedule";
import { logApiResponse } from "@/lib/api-log";

export async function GET(request: Request) {
  const slots = await getScheduleSlots();
  return logApiResponse(request, Response.json(slots));
}

export async function POST(request: Request) {
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

  const parsed = parseScheduleInput(body as Record<string, unknown>);
  if (!parsed.ok) {
    return logApiResponse(
      request,
      Response.json(
        { error: "Invalid schedule slot.", errors: parsed.errors },
        { status: 400 },
      ),
    );
  }

  const slot = await addScheduleSlot(parsed.data);
  return logApiResponse(request, Response.json(slot, { status: 201 }));
}
