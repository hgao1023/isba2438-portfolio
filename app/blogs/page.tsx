import BlogList from "@/components/BlogList";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function Blogs() {
  const lang = await getLanguage();
  const t = content[lang].blogsPage;

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <BlogList
        lang={lang}
        labels={{ loading: t.loading, error: t.error, empty: t.empty }}
      />
    </section>
  );
}
