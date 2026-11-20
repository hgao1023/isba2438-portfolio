import Link from "next/link";
import BlogAdmin from "@/components/BlogAdmin";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AdminBlogs() {
  const lang = await getLanguage();
  const t = content[lang].blog;
  const admin = content[lang].admin;
  const p = content[lang].blogsPage;

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
      <BlogAdmin
        lang={lang}
        labels={{
          title: t.postTitle,
          content: t.postContent,
          publish: t.publish,
          save: t.save,
          cancel: t.cancel,
          edit: t.edit,
          delete: t.delete,
          confirmDelete: t.confirmDelete,
          success: t.success,
          successUpdate: t.successUpdate,
          successDelete: t.successDelete,
          errorBanner: t.errorBanner,
          listLoading: p.loading,
          listError: p.error,
          listEmpty: p.empty,
        }}
      />
    </section>
  );
}
