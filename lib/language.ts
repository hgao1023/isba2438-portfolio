import { cookies } from "next/headers";
import type { Language } from "@/lib/content";

export async function getLanguage(): Promise<Language> {
  const store = await cookies();
  return store.get("language")?.value === "zh" ? "zh" : "en";
}
