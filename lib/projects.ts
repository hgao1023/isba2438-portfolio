import { content } from "@/lib/content";

export type Language = "en" | "zh";

export type Localized = { en: string; zh?: string };

export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  dates: string;
  tech: string[];
  description: Localized;
  contributions: Localized[];
  outcome?: Localized;
};

export function pickLocalized(value: Localized, lang: Language): string {
  return value[lang] ?? value.en;
}

export type ProjectField =
  | "title"
  | "summary"
  | "dates"
  | "tech"
  | "description"
  | "contributions"
  | "outcome";

export type ProjectInputErrors = Partial<Record<ProjectField, string>>;

export type ProjectInput = {
  title: Localized;
  summary: Localized;
  dates: string;
  tech: string[];
  description: Localized;
  contributions: Localized[];
  outcome: Localized | null;
};

function parseLocalized(
  value: unknown,
  existing: Localized | undefined,
  messages: {
    label: string;
    empty: string;
    needsEn: string;
    zhString: string;
    mustBeText: string;
  },
  optional: boolean,
): { value?: Localized; error?: string } {
  if (value === undefined) {
    if (existing === undefined && !optional) {
      return { error: messages.label + messages.empty };
    }
    return { value: existing };
  }
  if (typeof value === "string") {
    const en = value.trim();
    if (en.length === 0) {
      if (optional) {
        return { value: undefined };
      }
      return { error: messages.label + messages.empty };
    }
    const result: Localized = { en };
    if (existing?.zh) {
      result.zh = existing.zh;
    }
    return { value: result };
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as { en?: unknown; zh?: unknown };
    if (typeof obj.en !== "string" || obj.en.trim().length === 0) {
      return { error: messages.label + messages.needsEn };
    }
    const result: Localized = { en: obj.en.trim() };
    if (obj.zh !== undefined) {
      if (typeof obj.zh !== "string") {
        return { error: messages.label + messages.zhString };
      }
      const zh = obj.zh.trim();
      if (zh.length > 0) {
        result.zh = zh;
      }
    } else if (existing?.zh) {
      result.zh = existing.zh;
    }
    return { value: result };
  }
  return { error: messages.label + messages.mustBeText };
}

export function parseProjectInput(
  obj: Record<string, unknown>,
  lang: Language,
  existing?: Project,
): { ok: true; data: ProjectInput } | { ok: false; errors: ProjectInputErrors } {
  const e = content[lang].projectAdmin.errors;
  const msg = (label: string) => ({
    label,
    empty: e.phrases.empty,
    needsEn: e.phrases.needsEn,
    zhString: e.phrases.zhString,
    mustBeText: e.phrases.mustBeText,
  });

  const errors: ProjectInputErrors = {};

  const title = parseLocalized(obj.title, existing?.title, msg(e.labels.title), false);
  if (title.error) errors.title = title.error;
  const summary = parseLocalized(obj.summary, existing?.summary, msg(e.labels.summary), false);
  if (summary.error) errors.summary = summary.error;
  const description = parseLocalized(obj.description, existing?.description, msg(e.labels.description), false);
  if (description.error) errors.description = description.error;

  let dates: string | undefined;
  if (obj.dates === undefined) {
    dates = existing?.dates;
  } else if (typeof obj.dates === "string" && obj.dates.trim().length > 0) {
    dates = obj.dates.trim();
  } else {
    errors.dates = e.dates;
  }

  let tech: string[] | undefined;
  if (obj.tech === undefined) {
    tech = existing?.tech;
  } else if (
    Array.isArray(obj.tech) &&
    obj.tech.length > 0 &&
    obj.tech.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    tech = obj.tech.map((item) => (item as string).trim());
  } else {
    errors.tech = e.tech;
  }

  let contributions: Localized[] | undefined;
  if (Array.isArray(obj.contributions)) {
    contributions = [];
    for (let index = 0; index < obj.contributions.length; index += 1) {
      const raw = obj.contributions[index];
      let match: Localized | undefined;
      const rawEn =
        typeof raw === "string"
          ? raw.trim()
          : typeof raw === "object" &&
              raw !== null &&
              !Array.isArray(raw) &&
              typeof (raw as { en?: unknown }).en === "string"
            ? ((raw as { en: string }).en).trim()
            : null;
      if (rawEn !== null && rawEn.length > 0) {
        match = existing?.contributions.find(
          (contribution) => contribution.en === rawEn,
        );
      }
      const parsed = parseLocalized(
        raw,
        match,
        msg(`${e.labels.contribution} ${index + 1}`),
        false,
      );
      if (parsed.error || !parsed.value) {
        errors.contributions =
          parsed.error ??
          `${e.labels.contribution} ${index + 1}${e.phrases.empty}`;
        break;
      }
      contributions.push(parsed.value);
    }
    if (contributions.length === 0 && !errors.contributions) {
      errors.contributions = e.contributionsEmpty;
    }
  } else if (obj.contributions === undefined) {
    contributions = existing?.contributions;
  } else {
    errors.contributions = e.contributionsList;
  }

  let outcome: Localized | null;
  if (obj.outcome === undefined) {
    outcome = existing?.outcome ?? null;
  } else if (obj.outcome === null) {
    outcome = null;
  } else {
    const parsed = parseLocalized(obj.outcome, existing?.outcome, msg(e.labels.outcome), true);
    if (parsed.error) {
      errors.outcome = parsed.error;
      outcome = null;
    } else {
      outcome = parsed.value ?? null;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      title: title.value as Localized,
      summary: summary.value as Localized,
      dates: dates as string,
      tech: tech as string[],
      description: description.value as Localized,
      contributions: contributions as Localized[],
      outcome,
    },
  };
}
