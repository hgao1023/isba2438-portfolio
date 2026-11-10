import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "contact-submissions.json");

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  sentAt: string;
};

export async function saveContactSubmission(
  submission: ContactSubmission,
): Promise<void> {
  await mkdir(dataDir, { recursive: true });

  let submissions: ContactSubmission[] = [];
  try {
    submissions = JSON.parse(await readFile(dataFile, "utf8"));
  } catch {
    submissions = [];
  }

  submissions.push(submission);

  await writeFile(dataFile, JSON.stringify(submissions, null, 2), "utf8");
}
