import BlogPostForm from "@/components/BlogPostForm";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AdminBlogs() {
  const lang = await getLanguage();
  const t = content[lang].blog;

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <BlogPostForm
        labels={{
          title: t.postTitle,
          content: t.postContent,
          publish: t.publish,
          errorBanner: t.errorBanner,
        }}
      />
    </section>
  );
}
