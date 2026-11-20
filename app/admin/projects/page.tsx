import Link from "next/link";
import ProjectAdmin from "@/components/ProjectAdmin";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AdminProjectsPage() {
  const lang = await getLanguage();
  const t = content[lang].projectAdmin;
  const admin = content[lang].admin;

  return (
    <section>
      <p className="text-sm">
        <Link
          href="/admin"
          className="text-zinc-600 hover:underline dark:text-[#a1a1a6]"
        >
          {admin.back}
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <ProjectAdmin labels={t} />
    </section>
  );
}
