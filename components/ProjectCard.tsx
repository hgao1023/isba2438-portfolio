import Link from "next/link";
import type { Project } from "@/lib/projects";
import type { Language } from "@/lib/content";

export default function ProjectCard({
  project,
  lang,
}: {
  project: Project;
  lang: Language;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]">
      <h3 className="font-semibold">
        <Link href={`/projects/${project.slug}`} className="hover:underline">
          {project.title[lang]}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-[#86868b]">
        {project.dates}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
        {project.summary[lang]}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <li
            key={item}
            className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-[#38383a] dark:text-[#d1d1d6]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
