export type QuestionCategory = "project" | "experience" | "internship" | "other";

export const questionCategories: QuestionCategory[] = [
  "project",
  "experience",
  "internship",
  "other",
];

export const MAX_QUESTION_LENGTH = 300;

export type QuestionTextError = "empty" | "tooLong";

export function validateQuestionText(
  raw: string,
): { ok: true; text: string } | { ok: false; error: QuestionTextError } {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "empty" };
  }
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    return { ok: false, error: "tooLong" };
  }
  return { ok: true, text: trimmed };
}

export type Question = {
  id: string;
  text: string;
  category: QuestionCategory;
  createdAt: string;
};
