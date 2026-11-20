"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import ScheduleItem from "@/components/ScheduleItem";
import {
  sortScheduleSlots,
  type ScheduleSlot,
  type ScheduleSlotErrors,
} from "@/lib/schedule";
import type { Language } from "@/lib/content";

const inputClasses =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-[#48484a] dark:bg-[#2c2c2e] dark:focus:ring-[#0a84ff]";

type ScheduleAdminLabels = {
  date: string;
  startTime: string;
  endTime: string;
  slotTitle: string;
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
};

type StatusMessage = { type: "success" | "error"; text: string };

type FormValues = {
  date: string;
  startTime: string;
  endTime: string;
  title: string;
};

const emptyValues: FormValues = {
  date: "",
  startTime: "",
  endTime: "",
  title: "",
};

export default function ScheduleAdmin({
  lang,
  labels,
}: {
  lang: Language;
  labels: ScheduleAdminLabels;
}) {
  const [slots, setSlots] = useState<ScheduleSlot[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<ScheduleSlotErrors>({});

  const reload = useCallback(() => {
    fetch("/api/schedule")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        setSlots(sortScheduleSlots(data));
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function resetForm() {
    setEditingId(null);
    setValues(emptyValues);
    setFieldErrors({});
  }

  function startEdit(slot: ScheduleSlot) {
    setEditingId(slot.id);
    setValues({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      title: slot.title,
    });
    setFieldErrors({});
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasEditing = editingId !== null;
    const url = wasEditing ? `/api/schedule/${editingId}` : "/api/schedule";

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
        const errorData = data as { error?: unknown; errors: ScheduleSlotErrors };
        setStatus({
          type: "error",
          text: typeof errorData.error === "string" ? errorData.error : "",
        });
        setFieldErrors(errorData.errors);
      } else {
        setStatus({ type: "error", text: labels.serverError });
      }
    } catch {
      setStatus({ type: "error", text: labels.serverError });
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(labels.confirmDelete)) {
      return;
    }
    try {
      const response = await fetch(`/api/schedule/${id}`, { method: "DELETE" });
      setStatus({
        type: response.ok ? "success" : "error",
        text: response.ok ? labels.successDelete : labels.serverError,
      });
    } catch {
      setStatus({ type: "error", text: labels.serverError });
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
          <label htmlFor="admin-slot-date" className="text-sm font-medium">
            {labels.date}
          </label>
          <input
            id="admin-slot-date"
            type="date"
            value={values.date}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, date: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.date && (
            <p className="text-sm text-red-600">{fieldErrors.date}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-slot-start" className="text-sm font-medium">
            {labels.startTime}
          </label>
          <input
            id="admin-slot-start"
            type="time"
            value={values.startTime}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, startTime: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.startTime && (
            <p className="text-sm text-red-600">{fieldErrors.startTime}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-slot-end" className="text-sm font-medium">
            {labels.endTime}
          </label>
          <input
            id="admin-slot-end"
            type="time"
            value={values.endTime}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, endTime: event.target.value }))
            }
            className={inputClasses}
          />
          {fieldErrors.endTime && (
            <p className="text-sm text-red-600">{fieldErrors.endTime}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-slot-title" className="text-sm font-medium">
            {labels.slotTitle}
          </label>
          <input
            id="admin-slot-title"
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

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm text-white hover:bg-zinc-700 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
          >
            {editingId !== null ? labels.save : labels.add}
          </button>
          {editingId !== null && (
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
      ) : slots === null ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listLoading}
        </p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-[#86868b]">
          {labels.listEmpty}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {slots.map((slot) => (
            <ScheduleItem key={slot.id} slot={slot} lang={lang}>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(slot)}
                  className="text-sm text-zinc-600 hover:underline dark:text-[#a1a1a6]"
                >
                  {labels.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slot.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  {labels.delete}
                </button>
              </div>
            </ScheduleItem>
          ))}
        </ul>
      )}
    </div>
  );
}
