"use server";

import { saveContactSubmission } from "@/lib/contact-submissions";
import {
  validateContactForm,
  type ContactFormState,
} from "@/lib/contact-validation";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export async function submitContactForm(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const lang = await getLanguage();
  const t = content[lang].contact;

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? "").trim(),
  };

  const errors = validateContactForm(data, lang);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: t.errorBanner, errors, values: data };
  }

  await saveContactSubmission({
    name: data.name,
    email: data.email,
    message: data.message,
    sentAt: new Date().toISOString(),
  });

  return {
    status: "success",
    message: t.success,
    errors: {},
    values: { name: "", email: "", message: "" },
  };
}
