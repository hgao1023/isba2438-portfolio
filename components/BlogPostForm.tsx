"use client";

import { useState, type FormEvent } from "react";

type BlogFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: { title?: string; content?: string };
  values: { title: string; content: string };
};

const initialBlogFormState: BlogFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { title: "", content: "" },
};

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

export default function BlogPostForm({
  labels,
}: {
  labels: {
    title: string;
    content: string;
    publish: string;
    errorBanner: string;
  };
}) {
  const [state, setState] = useState<BlogFormState>(initialBlogFormState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
    };

    setPending(true);
    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.status === 201) {
        setState({
          status: "success",
          message: data.message,
          errors: {},
          values: { title: "", content: "" },
        });
        form.reset();
      } else if (response.status === 400 && data.status === "error") {
        setState({
          status: "error",
          message: data.message,
          errors: data.errors ?? {},
          values,
        });
      } else {
        setState({
          status: "error",
          message: labels.errorBanner,
          errors: {},
          values,
        });
      }
    } catch {
      setState({
        status: "error",
        message: labels.errorBanner,
        errors: {},
        values,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 flex max-w-md flex-col gap-4"
    >
      {state.status !== "idle" && (
        <p
          className={
            state.status === "success"
              ? "rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-sm text-green-800"
              : "rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="post-title" className="text-sm font-medium">
          {labels.title}
        </label>
        <input
          id="post-title"
          name="title"
          type="text"
          className={inputClasses}
          defaultValue={state.values.title}
        />
        {state.errors.title && (
          <p className="text-sm text-red-600">{state.errors.title}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="post-content" className="text-sm font-medium">
          {labels.content}
        </label>
        <textarea
          id="post-content"
          name="content"
          rows={8}
          className={inputClasses}
          defaultValue={state.values.content}
        />
        {state.errors.content && (
          <p className="text-sm text-red-600">{state.errors.content}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
      >
        {labels.publish}
      </button>
    </form>
  );
}
