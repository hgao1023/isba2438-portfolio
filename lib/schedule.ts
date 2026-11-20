import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";

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
): { ok: true; data: ScheduleSlotInput } | { ok: false; errors: ScheduleSlotErrors } {
  const errors: ScheduleSlotErrors = {};

  for (const field of ["date", "startTime", "endTime", "title"] as const) {
    if (typeof obj[field] !== "string") {
      errors[field] = `${field} must be a string.`;
    }
  }
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const data = {
    date: (obj.date as string).trim(),
    startTime: (obj.startTime as string).trim(),
    endTime: (obj.endTime as string).trim(),
    title: (obj.title as string).trim(),
  };

  if (data.date === "") {
    errors.date = "date can't be empty.";
  } else if (!isValidDate(data.date)) {
    errors.date = "date must be a real date in YYYY-MM-DD format.";
  }

  if (data.startTime === "") {
    errors.startTime = "startTime can't be empty.";
  } else if (!isValidTime(data.startTime)) {
    errors.startTime = "startTime must be a time in HH:MM format.";
  }

  if (data.endTime === "") {
    errors.endTime = "endTime can't be empty.";
  } else if (!isValidTime(data.endTime)) {
    errors.endTime = "endTime must be a time in HH:MM format.";
  }

  if (data.title === "") {
    errors.title = "title can't be empty.";
  }

  if (Object.keys(errors).length === 0 && data.endTime <= data.startTime) {
    errors.endTime = "endTime must be after startTime.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}

export async function getScheduleSlots(): Promise<ScheduleSlot[]> {
  return readJsonFile<ScheduleSlot[]>(dataFilePath("schedule.json"), []);
}

export async function getScheduleSlot(
  id: string,
): Promise<ScheduleSlot | undefined> {
  const slots = await getScheduleSlots();
  return slots.find((slot) => slot.id === id);
}

export async function addScheduleSlot(
  data: ScheduleSlotInput,
): Promise<ScheduleSlot> {
  const dataFile = dataFilePath("schedule.json");
  const slots = await getScheduleSlots();

  const slot: ScheduleSlot = { id: crypto.randomUUID(), ...data };
  slots.push(slot);

  await writeJsonFile(dataFile, slots);
  return slot;
}

export async function updateScheduleSlot(
  id: string,
  data: ScheduleSlotInput,
): Promise<ScheduleSlot | null> {
  const dataFile = dataFilePath("schedule.json");
  const slots = await getScheduleSlots();

  const index = slots.findIndex((slot) => slot.id === id);
  if (index === -1) {
    return null;
  }

  const updated: ScheduleSlot = { id, ...data };
  slots[index] = updated;

  await writeJsonFile(dataFile, slots);
  return updated;
}

export async function deleteScheduleSlot(id: string): Promise<boolean> {
  const dataFile = dataFilePath("schedule.json");
  const slots = await getScheduleSlots();

  const next = slots.filter((slot) => slot.id !== id);
  if (next.length === slots.length) {
    return false;
  }

  await writeJsonFile(dataFile, next);
  return true;
}
