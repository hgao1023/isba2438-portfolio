import {
  questionCategories,
  validateQuestionText,
  type Question,
  type QuestionCategory,
} from "@/lib/questions";

const STORAGE_KEY = "portfolio.questions";

export type ParsedQuestions = {
  questions: Question[];
  reset: boolean;
};

function isQuestionCategory(value: unknown): value is QuestionCategory {
  return questionCategories.includes(value as QuestionCategory);
}

function parseQuestion(item: unknown): Question | null {
  if (typeof item !== "object" || item === null || Array.isArray(item)) {
    return null;
  }
  const record = item as Record<string, unknown>;

  const textResult =
    typeof record.text === "string" ? validateQuestionText(record.text) : null;
  if (!textResult || !textResult.ok) {
    return null;
  }

  if (
    typeof record.id !== "string" ||
    record.id.length === 0 ||
    !isQuestionCategory(record.category) ||
    typeof record.createdAt !== "string" ||
    Number.isNaN(Date.parse(record.createdAt))
  ) {
    return null;
  }

  return {
    id: record.id,
    text: textResult.text,
    category: record.category,
    createdAt: record.createdAt,
  };
}

export function parseQuestions(raw: string | null): ParsedQuestions {
  if (raw === null || raw.trim() === "") {
    return { questions: [], reset: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { questions: [], reset: true };
  }

  if (!Array.isArray(parsed)) {
    return { questions: [], reset: true };
  }

  const questions: Question[] = [];
  let reset = false;
  for (const item of parsed) {
    const question = parseQuestion(item);
    if (question) {
      questions.push(question);
    } else {
      reset = true;
    }
  }

  return { questions, reset };
}

export function loadQuestions(): ParsedQuestions {
  try {
    return parseQuestions(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return { questions: [], reset: false };
  }
}

export function saveQuestions(questions: Question[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch {
    return;
  }
}
