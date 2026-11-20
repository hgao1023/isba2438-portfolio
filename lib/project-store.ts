import { dataFilePath, readJsonFile, writeJsonFile } from "@/lib/json-file";
import { slugify } from "@/lib/slugify";
import type { Project, ProjectInput } from "@/lib/projects";

function toProject(slug: string, data: ProjectInput): Project {
  return {
    slug,
    title: data.title,
    summary: data.summary,
    dates: data.dates,
    tech: data.tech,
    description: data.description,
    contributions: data.contributions,
    ...(data.outcome ? { outcome: data.outcome } : {}),
  };
}

export async function getAllProjects(): Promise<Project[]> {
  return readJsonFile<Project[]>(dataFilePath("projects.json"), []);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug);
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const dataFile = dataFilePath("projects.json");
  const projects = await getAllProjects();

  const baseSlug = slugify(data.title.en);
  let slug = baseSlug;
  let counter = 2;
  while (projects.some((project) => project.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const project = toProject(slug, data);
  projects.push(project);

  await writeJsonFile(dataFile, projects);
  return project;
}

export async function updateProject(
  slug: string,
  data: ProjectInput,
): Promise<Project | null> {
  const dataFile = dataFilePath("projects.json");
  const projects = await getAllProjects();

  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return null;
  }

  const updated = toProject(slug, data);
  projects[index] = updated;

  await writeJsonFile(dataFile, projects);
  return updated;
}

export async function deleteProject(slug: string): Promise<boolean> {
  const dataFile = dataFilePath("projects.json");
  const projects = await getAllProjects();

  const next = projects.filter((project) => project.slug !== slug);
  if (next.length === projects.length) {
    return false;
  }

  await writeJsonFile(dataFile, next);
  return true;
}
