"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { ContactSubmission } from "@/lib/contact-submissions";
import type { ContactFormErrors } from "@/lib/contact-validation";
import type { Language } from "@/lib/content";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type ContactAdminLabels = {
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  confirmDelete: string;
  successEdit: string;
  successDelete: string;
  serverError: string;
  contactPageNote: string;
  contactPageLink: string;
  name: string;
  email: string;
  message: string;
  listLoading: string;
  listError: string;
  listEmpty: string;
};

type StatusMessage = { type: "success" | "error"; text: string };

type FormValues = { name: string; email: string; message: string };

const emptyValues: FormValues = { name: "", email: "", message: "" };

export default function ContactAdmin({
  lang,
  labels,
}: {
  lang: Language;
  labels: ContactAdminLabels;
}) {
  const [submissions, setSubmissions] = useState<ContactSubmission[] | null>(
    null,
  );
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});
  const [pending, setPending] = useState(false);

  const reload = useCallback(() => {
    fetch("/api/contacts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        setSubmissions(data);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function cancelEdit() {
    setEditingId(null);
    setValues(emptyValues);
    setFieldErrors({});
  }

  function startEdit(submission: ContactSubmission) {
    setEditingId(submission.id);
    setValues({
      name: submission.name,
      email: submission.email,
      message: submission.message,
    });
    setFieldErrors({});
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (editingId === null) {
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/contacts/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setStatus({ type: "success", text: labels.successEdit });
        cancelEdit();
        reload();
      } else if (
        response.status === 400 &&
        data !== null &&
        typeof data === "object" &&
        "errors" in data
      ) {
        const errorData = data as { message?: unknown; errors?: ContactFormErrors };
        setStatus({
          type: "error",
          text:
            typeof errorData.message === "string"
              ? errorData.message
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

  async function handleDelete(id: string) {
    if (!window.confirm(labels.confirmDelete)) {
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`/api/contacts/${id}`, {
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

  const locale = lang === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="mt-6 flex flex-col gap-10">
      <p className="text-sm text-zinc-500 dark:text-[#86868b]">
        {labels.contactPageNote}{" "}
        <Link
          href="/contact-me"
          className="underline hover:text-zinc-900 dark:hover:text-white"
        >
          {labels.contactPageLink}
        </Link>
      </p>

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

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex max-w-md flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="admin-contact-name" className="text-sm font-medium">
              {labels.name}
            </label>
            <input
              id="admin-contact-name"
              type="text"
              value={values.name}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, name: event.target.value }))
              }
              className={inputClasses}
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="admin-contact-email" className="text-sm font-medium">
              {labels.email}
            </label>
            <input
              id="admin-contact-email"
              type="text"
              value={values.email}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, email: event.target.value }))
              }
              className={inputClasses}
            />
            {fieldErrors.email && (
              <p className="text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="admin-contact-message"
              className="text-sm font-medium"
            >
              {labels.message}
            </label>
            <textarea
              id="admin-contact-message"
              rows={5}
              value={values.message}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, message: event.target.value }))
              }
              className={inputClasses}
            />
            {fieldErrors.message && (
              <p className="text-sm text-red-600">{fieldErrors.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
            >
              {labels.save}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
            >
              {labels.cancel}
            </button>
          </div>
        </form>
      )}

      {failed ? (
        <p className="text-sm text-red-600">{labels.listError}</p>
      ) : submissions === null ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listLoading}
        </p>
      ) : submissions.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listEmpty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {submissions.map((submission) => (
            <li
              key={submission.id}
              className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-[#38383a]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm font-medium">{submission.name}</p>
                <p className="text-xs text-zinc-500 dark:text-[#86868b]">
                  {new Date(submission.sentAt).toLocaleString(locale)}
                </p>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-[#a1a1a6]">
                {submission.email}
              </p>
              <p className="mt-2 text-sm">{submission.message}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(submission)}
                  className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
                >
                  {labels.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(submission.id)}
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
