import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function Projects() {
  const lang = await getLanguage();
  const t = content[lang].projectsPage;
  const projects = getAllProjects();

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} lang={lang} />
        ))}
      </div>
    </section>
  );
}
