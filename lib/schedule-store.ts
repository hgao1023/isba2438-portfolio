import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";
import type { ScheduleSlot, ScheduleSlotInput } from "@/lib/schedule";

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
