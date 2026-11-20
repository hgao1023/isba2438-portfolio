import Link from "next/link";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AdminPage() {
  const lang = await getLanguage();
  const t = content[lang].admin;

  const links = [
    { href: "/admin/blogs", label: t.blogs },
    { href: "/admin/contacts", label: t.contacts },
    { href: "/admin/projects", label: t.projects },
    { href: "/admin/schedule", label: t.schedule },
  ];

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium hover:border-zinc-400 dark:border-[#38383a] dark:bg-[#2c2c2e] dark:hover:border-[#636366]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
