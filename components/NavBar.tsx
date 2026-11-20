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
    { href: "/blogs", label: t.blogs },
    { href: "/contact-me-server-form", label: t.contact },
    { href: "/contact-me", label: t.contactApi },
    { href: "/questions", label: t.questions },
    { href: "/schedule", label: t.schedule },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-[#38383a] dark:bg-[#1d1d1f]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="whitespace-nowrap text-lg font-semibold">
          Heliang Gao (Tony)
        </Link>
        <div className="flex items-center gap-3">
          <ul className="flex flex-nowrap items-center gap-3 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap hover:underline"
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
