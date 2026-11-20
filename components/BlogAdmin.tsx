"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogInputErrors, BlogPost } from "@/lib/blog-posts";
import type { Language } from "@/lib/content";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type BlogAdminLabels = {
  title: string;
  content: string;
  publish: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  success: string;
  successUpdate: string;
  successDelete: string;
  errorBanner: string;
  listLoading: string;
  listError: string;
  listEmpty: string;
};

type StatusMessage = { type: "success" | "error"; text: string };

type FormValues = { title: string; content: string };

const emptyValues: FormValues = { title: "", content: "" };

export default function BlogAdmin({
  lang,
  labels,
}: {
  lang: Language;
  labels: BlogAdminLabels;
}) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<BlogInputErrors>({});
  const [pending, setPending] = useState(false);

  const reload = useCallback(() => {
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
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

  function startEdit(post: BlogPost) {
    setEditingSlug(post.slug);
    setValues({ title: post.title, content: post.content });
    setFieldErrors({});
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasEditing = editingSlug !== null;
    const url = wasEditing ? `/api/blogs/${editingSlug}` : "/api/blogs";

    setPending(true);
    try {
      const response = await fetch(url, {
        method: wasEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: unknown = await response.json().catch(() => null);

      if (response.ok) {
        setStatus({
          type: "success",
          text: wasEditing ? labels.successUpdate : labels.success,
        });
        resetForm();
        reload();
      } else if (
        response.status === 400 &&
        data !== null &&
        typeof data === "object" &&
        "errors" in data
      ) {
        const errorData = data as { message?: unknown; errors?: BlogInputErrors };
        setStatus({
          type: "error",
          text:
            typeof errorData.message === "string"
              ? errorData.message
              : labels.errorBanner,
        });
        setFieldErrors(errorData.errors ?? {});
      } else {
        setStatus({ type: "error", text: labels.errorBanner });
      }
    } catch {
      setStatus({ type: "error", text: labels.errorBanner });
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
      const response = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      setStatus({
        type: response.ok ? "success" : "error",
        text: response.ok ? labels.successDelete : labels.errorBanner,
      });
    } catch {
      setStatus({ type: "error", text: labels.errorBanner });
    } finally {
      setPending(false);
    }
    reload();
  }

  const sorted =
    posts === null
      ? []
      : [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

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
          <label htmlFor="post-title" className="text-sm font-medium">
            {labels.title}
          </label>
          <input
            id="post-title"
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
          <label htmlFor="post-content" className="text-sm font-medium">
            {labels.content}
          </label>
          <textarea
            id="post-content"
            rows={8}
            value={values.content}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, content: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.content && (
            <p className="text-sm text-red-600">{fieldErrors.content}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
          >
            {editingSlug !== null ? labels.save : labels.publish}
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
      ) : posts === null ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listLoading}
        </p>
      ) : sorted.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listEmpty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((post) => (
            <BlogCard key={post.slug} post={post} lang={lang}>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
                >
                  {labels.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {labels.delete}
                </button>
              </div>
            </BlogCard>
          ))}
        </div>
      )}
    </div>
  );
}
