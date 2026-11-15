import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBlogPosts } from "@/lib/blog-api";
import { formatPostDate } from "@/lib/blog-format";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function BlogPostPage({
  params,
}: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const lang = await getLanguage();
  const t = content[lang].blogPost;
  const posts = await fetchBlogPosts();
  const post =
    posts.find((p) => p.slug === slug) ??
    posts.find((p) => p.slug === decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="mt-2 text-zinc-500 dark:text-[#86868b]">
          {formatPostDate(post.createdAt, lang)}
        </p>
      </header>

      <article className="flex flex-col gap-4">
        {post.content
          .split(/\n+/)
          .filter((paragraph) => paragraph.length > 0)
          .map((paragraph, index) => (
            <p
              key={index}
              className="max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]"
            >
              {paragraph}
            </p>
          ))}
      </article>

      <p>
        <Link href="/blogs" className="hover:underline">
          {t.back}
        </Link>
      </p>
    </section>
  );
}
