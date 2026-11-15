import type { Language } from "@/lib/content";

export function formatPostDate(iso: string, lang: Language): string {
  return new Date(iso).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
