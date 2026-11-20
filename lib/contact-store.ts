import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";
import type { ContactSubmission } from "@/lib/contact-submissions";

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return readJsonFile<ContactSubmission[]>(
    dataFilePath("contact-submissions.json"),
    [],
  );
}

export async function getContactSubmission(
  id: string,
): Promise<ContactSubmission | undefined> {
  const submissions = await getContactSubmissions();
  return submissions.find((submission) => submission.id === id);
}

export async function saveContactSubmission(
  data: Omit<ContactSubmission, "id">,
): Promise<void> {
  const dataFile = dataFilePath("contact-submissions.json");
  const submissions = await getContactSubmissions();

  const submission: ContactSubmission = { id: crypto.randomUUID(), ...data };
  submissions.push(submission);

  await writeJsonFile(dataFile, submissions);
}

export async function updateContactSubmission(
  id: string,
  data: Omit<ContactSubmission, "id" | "sentAt">,
): Promise<ContactSubmission | null> {
  const dataFile = dataFilePath("contact-submissions.json");
  const submissions = await getContactSubmissions();

  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) {
    return null;
  }

  const updated: ContactSubmission = { ...submissions[index], ...data };
  submissions[index] = updated;

  await writeJsonFile(dataFile, submissions);
  return updated;
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const dataFile = dataFilePath("contact-submissions.json");
  const submissions = await getContactSubmissions();

  const next = submissions.filter((submission) => submission.id !== id);
  if (next.length === submissions.length) {
    return false;
  }

  await writeJsonFile(dataFile, next);
  return true;
}
