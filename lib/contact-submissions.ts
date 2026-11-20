import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  sentAt: string;
};

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return readJsonFile<ContactSubmission[]>(
    dataFilePath("contact-submissions.json"),
    [],
  );
}

export async function saveContactSubmission(
  submission: ContactSubmission,
): Promise<void> {
  const dataFile = dataFilePath("contact-submissions.json");
  const submissions = await getContactSubmissions();

  submissions.push(submission);

  await writeJsonFile(dataFile, submissions);
}
