import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blog-posts";
import { formatPostDate } from "@/lib/blog-format";
import type { Language } from "@/lib/content";

export default function BlogCard({
  post,
  lang,
  children,
}: {
  post: BlogPost;
  lang: Language;
  children?: ReactNode;
}) {
  const excerpt =
    post.content.length > 140
      ? `${post.content.slice(0, 140)}…`
      : post.content;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]">
      <h3 className="font-semibold">
        <Link href={`/blogs/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-[#86868b]">
        {formatPostDate(post.createdAt, lang)}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
        {excerpt}
      </p>
      {children}
    </div>
  );
}
