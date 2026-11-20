import { content, type Language } from "@/lib/content";

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: ContactFormErrors;
  values: ContactFormData;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", email: "", message: "" },
};

function isValidEmail(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2) {
    return false;
  }

  const [beforeAt, afterAt] = parts;
  if (beforeAt.length === 0) {
    return false;
  }

  if (!afterAt.includes(".")) {
    return false;
  }

  if (afterAt.startsWith(".") || afterAt.endsWith(".") || afterAt.includes("..")) {
    return false;
  }

  if (/\s/.test(email)) {
    return false;
  }

  return true;
}

export function validateContactForm(
  data: ContactFormData,
  lang: Language,
): ContactFormErrors {
  const messages = content[lang].contact.errors;
  const errors: ContactFormErrors = {};

  if (data.name.trim().length === 0) {
    errors.name = messages.name;
  }

  if (!isValidEmail(data.email)) {
    errors.email = messages.email;
  }

  if (data.message.trim().length === 0) {
    errors.message = messages.message;
  }

  return errors;
}

export function parseContactInput(
  obj: Record<string, unknown>,
  lang: Language,
): { ok: true; data: ContactFormData } | {
  ok: false;
  body: { status: "error"; message: string; errors: ContactFormErrors };
} {
  const t = content[lang].contact;

  const rawName = obj.name;
  const rawEmail = obj.email;
  const rawMessage = obj.message;

  const errors: ContactFormErrors = {};
  if (
    typeof rawName !== "string" ||
    typeof rawEmail !== "string" ||
    typeof rawMessage !== "string"
  ) {
    if (typeof rawName !== "string") {
      errors.name = t.errors.nameString;
    }
    if (typeof rawEmail !== "string") {
      errors.email = t.errors.emailString;
    }
    if (typeof rawMessage !== "string") {
      errors.message = t.errors.messageString;
    }
    return {
      ok: false,
      body: { status: "error", message: t.errorBanner, errors },
    };
  }

  const data = {
    name: rawName.trim(),
    email: rawEmail,
    message: rawMessage.trim(),
  };

  const fieldErrors = validateContactForm(data, lang);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      body: { status: "error", message: t.errorBanner, errors: fieldErrors },
    };
  }

  return { ok: true, data };
}
