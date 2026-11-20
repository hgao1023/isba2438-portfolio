import { content, type Language } from "@/lib/content";

export type BlogPost = {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
};

export type BlogInputErrors = { title?: string; content?: string };

export function parseBlogInput(
  obj: Record<string, unknown>,
  lang: Language,
): { ok: true; data: { title: string; content: string } } | {
  ok: false;
  body: { status: "error"; message: string; errors: BlogInputErrors };
} {
  const t = content[lang].blog;

  const rawTitle = obj.title;
  const rawContent = obj.content;

  const errors: BlogInputErrors = {};
  if (typeof rawTitle !== "string" || typeof rawContent !== "string") {
    if (typeof rawTitle !== "string") {
      errors.title = t.errors.titleString;
    }
    if (typeof rawContent !== "string") {
      errors.content = t.errors.contentString;
    }
    return {
      ok: false,
      body: { status: "error", message: t.errorBanner, errors },
    };
  }

  const data = {
    title: rawTitle.trim(),
    content: rawContent.trim(),
  };

  if (data.title.length === 0) {
    errors.title = t.errors.title;
  }
  if (data.content.length === 0) {
    errors.content = t.errors.content;
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      body: { status: "error", message: t.errorBanner, errors },
    };
  }

  return { ok: true, data };
}
