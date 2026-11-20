"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/blog-posts";
import type { Language } from "@/lib/content";

export default function BlogList({
  lang,
  labels,
}: {
  lang: Language;
  labels: { loading: string; error: string; empty: string };
}) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/blogs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (active) {
          setPosts(data);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return <p className="mt-6 text-sm text-red-600">{labels.error}</p>;
  }

  if (posts === null) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-[#86868b]">
        {labels.loading}
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-[#86868b]">
        {labels.empty}
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {[...posts]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((post) => (
          <BlogCard key={post.slug} post={post} lang={lang} />
        ))}
    </div>
  );
}
