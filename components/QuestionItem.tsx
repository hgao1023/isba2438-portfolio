"use client";

import { useState, type FormEvent } from "react";
import {
  MAX_QUESTION_LENGTH,
  questionCategories,
  validateQuestionText,
  type Question,
  type QuestionCategory,
} from "@/lib/questions";
import type { Language } from "@/lib/content";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type QuestionItemLabels = {
  categories: Record<QuestionCategory, string>;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  errors: { empty: string; tooLong: string };
};

export default function QuestionItem({
  lang,
  question,
  labels,
  onSave,
  onDelete,
}: {
  lang: Language;
  question: Question;
  labels: QuestionItemLabels;
  onSave: (id: string, text: string, category: QuestionCategory) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [category, setCategory] = useState<QuestionCategory>(question.category);
  const [error, setError] = useState("");

  const locale = lang === "zh" ? "zh-CN" : "en-US";

  function startEdit() {
    setText(question.text);
    setCategory(question.category);
    setError("");
    setEditing(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateQuestionText(text);

    if (!result.ok) {
      setError(labels.errors[result.error]);
      return;
    }

    onSave(question.id, result.text, category);
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-[#38383a]">
        <form onSubmit={handleSave} noValidate className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <textarea
              rows={3}
              maxLength={MAX_QUESTION_LENGTH}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              className={inputClasses}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as QuestionCategory)
            }
            className={inputClasses}
          >
            {questionCategories.map((value) => (
              <option key={value} value={value}>
                {labels.categories[value]}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white hover:bg-zinc-700 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
            >
              {labels.save}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-[#38383a]">
      <p className="text-sm">{question.text}</p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-[#86868b]">
        {labels.categories[question.category]} ·{" "}
        {new Date(question.createdAt).toLocaleString(locale)}
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={startEdit}
          className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
        >
          {labels.edit}
        </button>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className="text-sm text-red-600 hover:underline"
        >
          {labels.delete}
        </button>
      </div>
    </li>
  );
}
