"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Project, ProjectInputErrors } from "@/lib/projects";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type ProjectAdminLabels = {
  add: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  successAdd: string;
  successEdit: string;
  successDelete: string;
  serverError: string;
  listLoading: string;
  listError: string;
  listEmpty: string;
  titleLabel: string;
  titleZhLabel: string;
  summaryLabel: string;
  summaryZhLabel: string;
  datesLabel: string;
  techLabel: string;
  descriptionLabel: string;
  descriptionZhLabel: string;
  contributionsLabel: string;
  contributionsZhLabel: string;
  outcomeLabel: string;
  outcomeZhLabel: string;
};

type StatusMessage = { type: "success" | "error"; text: string };

type FormValues = {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  dates: string;
  tech: string;
  description: string;
  descriptionZh: string;
  contributions: string;
  contributionsZh: string;
  outcome: string;
  outcomeZh: string;
};

const emptyValues: FormValues = {
  title: "",
  titleZh: "",
  summary: "",
  summaryZh: "",
  dates: "",
  tech: "",
  description: "",
  descriptionZh: "",
  contributions: "",
  contributionsZh: "",
  outcome: "",
  outcomeZh: "",
};

export default function ProjectAdmin({
  labels,
}: {
  labels: ProjectAdminLabels;
}) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<ProjectInputErrors>({});
  const [pending, setPending] = useState(false);

  const reload = useCallback(() => {
    fetch("/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function resetForm() {
    setEditingSlug(null);
    setValues(emptyValues);
    setFieldErrors({});
  }

  function startEdit(project: Project) {
    setEditingSlug(project.slug);
    setValues({
      title: project.title.en,
      titleZh: project.title.zh ?? "",
      summary: project.summary.en,
      summaryZh: project.summary.zh ?? "",
      dates: project.dates,
      tech: project.tech.join(", "),
      description: project.description.en,
      descriptionZh: project.description.zh ?? "",
      contributions: project.contributions.map((c) => c.en).join("\n"),
      contributionsZh: project.contributions.map((c) => c.zh ?? "").join("\n"),
      outcome: project.outcome?.en ?? "",
      outcomeZh: project.outcome?.zh ?? "",
    });
    setFieldErrors({});
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasEditing = editingSlug !== null;
    const url = wasEditing ? `/api/projects/${editingSlug}` : "/api/projects";

    const techList = values.tech
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    const contributionLines = values.contributions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const zhLines = values.contributionsZh
      .split("\n")
      .map((line) => line.trim());
    const outcome = values.outcome.trim();

    setPending(true);
    try {
      const response = await fetch(url, {
        method: wasEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: { en: values.title, zh: values.titleZh },
          summary: { en: values.summary, zh: values.summaryZh },
          dates: values.dates,
          tech: techList,
          description: { en: values.description, zh: values.descriptionZh },
          contributions: contributionLines.map((line, index) => ({
            en: line,
            zh: zhLines[index] ?? "",
          })),
          outcome:
            outcome.length > 0
              ? { en: outcome, zh: values.outcomeZh }
              : null,
        }),
      });
      const data: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setStatus({
          type: "success",
          text: wasEditing ? labels.successEdit : labels.successAdd,
        });
        resetForm();
        reload();
      } else if (
        response.status === 400 &&
        data !== null &&
        typeof data === "object" &&
        "errors" in data
      ) {
        const errorData = data as {
          error?: unknown;
          errors?: ProjectInputErrors;
        };
        setStatus({
          type: "error",
          text:
            typeof errorData.error === "string"
              ? errorData.error
              : labels.serverError,
        });
        setFieldErrors(errorData.errors ?? {});
      } else {
        setStatus({ type: "error", text: labels.serverError });
      }
    } catch {
      setStatus({ type: "error", text: labels.serverError });
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!window.confirm(labels.confirmDelete)) {
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/projects/${slug}`, {
        method: "DELETE",
      });
      setStatus({
        type: response.ok ? "success" : "error",
        text: response.ok ? labels.successDelete : labels.serverError,
      });
    } catch {
      setStatus({ type: "error", text: labels.serverError });
    } finally {
      setPending(false);
    }
    reload();
  }

  return (
    <div className="mt-6 flex flex-col gap-10">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex max-w-md flex-col gap-4"
      >
        {status && (
          <p
            className={
              status.type === "success"
                ? "rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-sm text-green-800"
                : "rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
            }
          >
            {status.text}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-project-title" className="text-sm font-medium">
            {labels.titleLabel}
          </label>
          <input
            id="admin-project-title"
            type="text"
            value={values.title}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, title: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.title && (
            <p className="text-sm text-red-600">{fieldErrors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-title-zh"
            className="text-sm font-medium"
          >
            {labels.titleZhLabel}
          </label>
          <input
            id="admin-project-title-zh"
            type="text"
            value={values.titleZh}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, titleZh: event.target.value }))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-summary"
            className="text-sm font-medium"
          >
            {labels.summaryLabel}
          </label>
          <textarea
            id="admin-project-summary"
            rows={2}
            value={values.summary}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, summary: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.summary && (
            <p className="text-sm text-red-600">{fieldErrors.summary}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-summary-zh"
            className="text-sm font-medium"
          >
            {labels.summaryZhLabel}
          </label>
          <textarea
            id="admin-project-summary-zh"
            rows={2}
            value={values.summaryZh}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                summaryZh: event.target.value,
              }))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-project-dates" className="text-sm font-medium">
            {labels.datesLabel}
          </label>
          <input
            id="admin-project-dates"
            type="text"
            value={values.dates}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, dates: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.dates && (
            <p className="text-sm text-red-600">{fieldErrors.dates}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-project-tech" className="text-sm font-medium">
            {labels.techLabel}
          </label>
          <input
            id="admin-project-tech"
            type="text"
            value={values.tech}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, tech: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.tech && (
            <p className="text-sm text-red-600">{fieldErrors.tech}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-description"
            className="text-sm font-medium"
          >
            {labels.descriptionLabel}
          </label>
          <textarea
            id="admin-project-description"
            rows={5}
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className={inputClasses}
          />
          {fieldErrors.description && (
            <p className="text-sm text-red-600">{fieldErrors.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-description-zh"
            className="text-sm font-medium"
          >
            {labels.descriptionZhLabel}
          </label>
          <textarea
            id="admin-project-description-zh"
            rows={5}
            value={values.descriptionZh}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                descriptionZh: event.target.value,
              }))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-contributions"
            className="text-sm font-medium"
          >
            {labels.contributionsLabel}
          </label>
          <textarea
            id="admin-project-contributions"
            rows={5}
            value={values.contributions}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                contributions: event.target.value,
              }))
            }
            className={inputClasses}
          />
          {fieldErrors.contributions && (
            <p className="text-sm text-red-600">{fieldErrors.contributions}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-contributions-zh"
            className="text-sm font-medium"
          >
            {labels.contributionsZhLabel}
          </label>
          <textarea
            id="admin-project-contributions-zh"
            rows={5}
            value={values.contributionsZh}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                contributionsZh: event.target.value,
              }))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-outcome"
            className="text-sm font-medium"
          >
            {labels.outcomeLabel}
          </label>
          <textarea
            id="admin-project-outcome"
            rows={2}
            value={values.outcome}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, outcome: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.outcome && (
            <p className="text-sm text-red-600">{fieldErrors.outcome}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="admin-project-outcome-zh"
            className="text-sm font-medium"
          >
            {labels.outcomeZhLabel}
          </label>
          <textarea
            id="admin-project-outcome-zh"
            rows={2}
            value={values.outcomeZh}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                outcomeZh: event.target.value,
              }))
            }
            className={inputClasses}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
          >
            {editingSlug !== null ? labels.save : labels.add}
          </button>
          {editingSlug !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
            >
              {labels.cancel}
            </button>
          )}
        </div>
      </form>

      {failed ? (
        <p className="text-sm text-red-600">{labels.listError}</p>
      ) : projects === null ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listLoading}
        </p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listEmpty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-[#38383a]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{project.title.en}</p>
                <p className="text-xs text-zinc-500 dark:text-[#86868b]">
                  {project.dates}
                </p>
              </div>
              {project.title.zh && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-[#86868b]">
                  中文：{project.title.zh}
                </p>
              )}
              <p className="mt-1 text-sm text-zinc-600 dark:text-[#a1a1a6]">
                {project.summary.en}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(project)}
                  className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
                >
                  {labels.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.slug)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {labels.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
