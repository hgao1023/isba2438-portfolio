"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  MAX_QUESTION_LENGTH,
  questionCategories,
  validateQuestionText,
  type Question,
  type QuestionCategory,
} from "@/lib/questions";
import { loadQuestions, saveQuestions } from "@/lib/question-storage";
import QuestionItem from "@/components/QuestionItem";
import type { Language } from "@/lib/content";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type QuestionsBoardLabels = {
  question: string;
  category: string;
  add: string;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  emptyState: string;
  resetNotice: string;
  categories: Record<QuestionCategory, string>;
  errors: { empty: string; tooLong: string };
};

export default function QuestionsBoard({
  lang,
  labels,
}: {
  lang: Language;
  labels: QuestionsBoardLabels;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<QuestionCategory>("project");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve(loadQuestions()).then((parsed) => {
      setQuestions(parsed.questions);
      setShowResetNotice(parsed.reset);
      setLoaded(true);
    });
  }, []);

  function persist(next: Question[]) {
    if (!loaded) {
      return;
    }
    setQuestions(next);
    saveQuestions(next);
    setShowResetNotice(false);
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateQuestionText(text);

    if (!result.ok) {
      setError(labels.errors[result.error]);
      return;
    }

    const question: Question = {
      id: crypto.randomUUID(),
      text: result.text,
      category,
      createdAt: new Date().toISOString(),
    };

    persist([question, ...questions]);
    setText("");
    setError("");
  }

  function handleSave(id: string, text: string, category: QuestionCategory) {
    persist(
      questions.map((question) =>
        question.id === id ? { ...question, text, category } : question,
      ),
    );
  }

  function handleDelete(id: string) {
    persist(questions.filter((question) => question.id !== id));
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      <form
        onSubmit={handleAdd}
        noValidate
        className="flex max-w-md flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="question-text" className="text-sm font-medium">
            {labels.question}
          </label>
          <textarea
            id="question-text"
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

        <div className="flex flex-col gap-1">
          <label htmlFor="question-category" className="text-sm font-medium">
            {labels.category}
          </label>
          <select
            id="question-category"
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
        </div>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
        >
          {labels.add}
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {showResetNotice && (
          <p className="rounded-lg border border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {labels.resetNotice}
          </p>
        )}
        {loaded && questions.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-[#86868b]">
            {labels.emptyState}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                lang={lang}
                question={question}
                labels={{
                  categories: labels.categories,
                  edit: labels.edit,
                  save: labels.save,
                  cancel: labels.cancel,
                  delete: labels.delete,
                  errors: labels.errors,
                }}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
