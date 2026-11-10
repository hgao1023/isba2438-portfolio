import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function Home() {
  const lang = await getLanguage();
  const t = content[lang].home;
  const projects = getAllProjects();

  return (
    <section className="flex flex-col gap-12">
      <header>
        <h1 className="text-4xl font-bold">{t.name}</h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-[#a1a1a6]">
          {t.tagline}
        </p>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]">
          {t.bio}
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold">{t.whatIDo}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {t.skills.map((skill) => (
            <div
              key={skill.title}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]"
            >
              <h3 className="font-semibold">{skill.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t.featured}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]"
            >
              <h3 className="font-semibold">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline"
                >
                  {project.title[lang]}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
                {project.summary[lang]}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <Link href="/projects" className="hover:underline">
            {t.viewAll}
          </Link>
        </p>
      </section>

      <section className="text-center">
        <Link
          href="/contact-me-server-form"
          className="inline-flex h-12 items-center rounded-full bg-zinc-900 px-8 text-sm text-white hover:bg-zinc-700 dark:bg-[#0a84ff] dark:hover:bg-[#409cff]"
        >
          {t.cta}
        </Link>
      </section>
    </section>
  );
}
