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
