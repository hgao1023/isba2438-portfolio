import {
  getContactSubmissions,
  saveContactSubmission,
} from "@/lib/contact-store";
import { logApiResponse } from "@/lib/api-log";
import { parseContactInput } from "@/lib/contact-validation";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function GET(request: Request) {
  const submissions = await getContactSubmissions();
  return logApiResponse(request, Response.json(submissions));
}

export async function POST(request: Request) {
  const lang = await getLanguage();
  const t = content[lang].contact;

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

  await saveContactSubmission({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    sentAt: new Date().toISOString(),
  });

  return logApiResponse(
    request,
    Response.json({ status: "success", message: t.success }, { status: 201 }),
  );
}
