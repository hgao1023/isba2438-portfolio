"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/lib/contact-action";
import { initialContactFormState } from "@/lib/contact-validation";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

export default function ContactForm({
  labels,
}: {
  labels: { name: string; email: string; message: string; send: string };
}) {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialContactFormState,
  );

  return (
    <form
      action={formAction}
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
        <label htmlFor="name" className="text-sm font-medium">
          {labels.name}
        </label>
        <input
          id="name"
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
        <label htmlFor="email" className="text-sm font-medium">
          {labels.email}
        </label>
        <input
          id="email"
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
        <label htmlFor="message" className="text-sm font-medium">
          {labels.message}
        </label>
        <textarea
          id="message"
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
