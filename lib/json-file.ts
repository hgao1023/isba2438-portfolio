import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

export function dataFilePath(fileName: string): string {
  return path.join(dataDir, fileName);
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }
    throw error;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`Could not parse ${filePath} as JSON.`);
  }
}

export async function writeJsonFile(
  filePath: string,
  value: unknown,
): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}
