import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function NavBar() {
  const lang = await getLanguage();
  const t = content[lang].nav;

  const links = [
    { href: "/", label: t.home },
    { href: "/about-me", label: t.about },
    { href: "/projects", label: t.projects },
    { href: "/contact-me-server-form", label: t.contact },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-[#38383a] dark:bg-[#1d1d1f]">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Heliang Gao (Tony)
        </Link>
        <div className="flex items-center gap-4">
          <ul className="flex items-center gap-4 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {t.resume}
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
