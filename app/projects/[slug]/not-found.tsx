import Link from "next/link";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function ProjectNotFound() {
  const lang = await getLanguage();
  const t = content[lang].projectNotFound;

  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.body}</p>
      <p className="mt-6">
        <Link href="/projects" className="hover:underline">
          {t.back}
        </Link>
      </p>
    </section>
  );
}
