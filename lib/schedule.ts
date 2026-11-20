import { content, type Language } from "@/lib/content";

export type ScheduleSlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
};

export type ScheduleSlotInput = Omit<ScheduleSlot, "id">;

export type ScheduleSlotField = "date" | "startTime" | "endTime" | "title";

export type ScheduleSlotErrors = Partial<Record<ScheduleSlotField, string>>;

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function parseScheduleInput(
  obj: Record<string, unknown>,
  lang: Language,
): { ok: true; data: ScheduleSlotInput } | { ok: false; errors: ScheduleSlotErrors } {
  const messages = content[lang].scheduleAdmin.errors;
  const errors: ScheduleSlotErrors = {};

  const rawDate = obj.date;
  const rawStart = obj.startTime;
  const rawEnd = obj.endTime;
  const rawTitle = obj.title;

  if (typeof rawDate !== "string") {
    errors.date = messages.dateString;
  }
  if (typeof rawStart !== "string") {
    errors.startTime = messages.startString;
  }
  if (typeof rawEnd !== "string") {
    errors.endTime = messages.endString;
  }
  if (typeof rawTitle !== "string") {
    errors.title = messages.slotString;
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const data = {
    date: (rawDate as string).trim(),
    startTime: (rawStart as string).trim(),
    endTime: (rawEnd as string).trim(),
    title: (rawTitle as string).trim(),
  };

  if (data.date === "") {
    errors.date = messages.dateEmpty;
  } else if (!isValidDate(data.date)) {
    errors.date = messages.dateFormat;
  }

  if (data.startTime === "") {
    errors.startTime = messages.startEmpty;
  } else if (!isValidTime(data.startTime)) {
    errors.startTime = messages.startFormat;
  }

  if (data.endTime === "") {
    errors.endTime = messages.endEmpty;
  } else if (!isValidTime(data.endTime)) {
    errors.endTime = messages.endFormat;
  }

  if (data.title === "") {
    errors.title = messages.slotEmpty;
  }

  if (Object.keys(errors).length === 0 && data.endTime <= data.startTime) {
    errors.endTime = messages.endOrder;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

export function sortScheduleSlots(slots: ScheduleSlot[]): ScheduleSlot[] {
  return [...slots].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
  );
}
