import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const lang = await getLanguage();
  const t = content[lang].project;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold">{project.title[lang]}</h1>
        <p className="mt-2 text-zinc-500 dark:text-[#86868b]">
          {project.dates}
        </p>
        <p className="mt-2 max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]">
          {project.summary[lang]}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <li
              key={item}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 dark:border-[#38383a] dark:bg-[#2c2c2e] dark:text-[#d1d1d6]"
            >
              {item}
            </li>
          ))}
        </ul>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">{t.about}</h2>
        <p className="mt-2 max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]">
          {project.description[lang]}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t.contributions}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 leading-7 text-zinc-700 dark:text-[#d1d1d6]">
          {project.contributions.map((contribution) => (
            <li key={contribution.en}>{contribution[lang]}</li>
          ))}
        </ul>
      </section>

      {project.outcome && (
        <section>
          <h2 className="text-2xl font-semibold">{t.outcome}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]">
            {project.outcome[lang]}
          </p>
        </section>
      )}

      <p>
        <Link href="/projects" className="hover:underline">
          {t.back}
        </Link>
      </p>
    </section>
  );
}
