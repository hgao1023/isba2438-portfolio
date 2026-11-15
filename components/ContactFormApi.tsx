"use client";

import { useState, type FormEvent } from "react";
import type { ContactFormData, ContactFormErrors } from "@/lib/contact-validation";

type ApiFormState = {
  status: "idle" | "success" | "error" | "unreachable";
  message: string;
  errors: ContactFormErrors;
  values: ContactFormData;
};

const initialApiFormState: ApiFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", email: "", message: "" },
};

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

export default function ContactFormApi({
  labels,
}: {
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    serverError: string;
  };
}) {
  const [state, setState] = useState<ApiFormState>(initialApiFormState);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setPending(true);
    try {
      const response = await fetch("/api/contacts", {
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
          values: { name: "", email: "", message: "" },
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
          status: "unreachable",
          message: labels.serverError,
          errors: {},
          values,
        });
      }
    } catch {
      setState({
        status: "unreachable",
        message: labels.serverError,
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
              : state.status === "error"
                ? "rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800"
                : "rounded-lg border border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="api-name" className="text-sm font-medium">
          {labels.name}
        </label>
        <input
          id="api-name"
          name="name"
          type="text"
          className={inputClasses}
          defaultValue={state.values.name}
        />
        {state.errors.name && (
          <p className="text-sm text-red-600">{state.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="api-email" className="text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="api-email"
          name="email"
          type="text"
          className={inputClasses}
          defaultValue={state.values.email}
        />
        {state.errors.email && (
          <p className="text-sm text-red-600">{state.errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="api-message" className="text-sm font-medium">
          {labels.message}
        </label>
        <textarea
          id="api-message"
          name="message"
          rows={5}
          className={inputClasses}
          defaultValue={state.values.message}
        />
        {state.errors.message && (
          <p className="text-sm text-red-600">{state.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
      >
        {labels.send}
      </button>
    </form>
  );
}
