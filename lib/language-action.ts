"use server";

import { cookies } from "next/headers";

export async function setLanguage(formData: FormData) {
  const lang = formData.get("lang") === "zh" ? "zh" : "en";
  const store = await cookies();
  store.set("language", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
