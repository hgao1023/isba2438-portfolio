import { saveContactSubmission } from "@/lib/contact-submissions";
import { validateContactForm } from "@/lib/contact-validation";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function POST(request: Request) {
  const lang = await getLanguage();
  const t = content[lang].contact;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const obj = body as Record<string, unknown>;
  const data = {
    name: String(obj.name ?? "").trim(),
    email: String(obj.email ?? ""),
    message: String(obj.message ?? "").trim(),
  };

  const errors = validateContactForm(data, lang);
  if (Object.keys(errors).length > 0) {
    return Response.json(
      { status: "error", message: t.errorBanner, errors },
      { status: 400 },
    );
  }

  await saveContactSubmission({
    name: data.name,
    email: data.email,
    message: data.message,
    sentAt: new Date().toISOString(),
  });

  return Response.json(
    { status: "success", message: t.success },
    { status: 201 },
  );
}
