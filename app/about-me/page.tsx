import Image from "next/image";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AboutMe() {
  const lang = await getLanguage();
  const t = content[lang].about;

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{t.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-700 dark:text-[#d1d1d6]">
            {t.bio}
          </p>
          <p className="mt-4 text-sm">
            <a
              href="/Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {t.resumeLink}
            </a>
          </p>
        </div>
        <Image
          src="/profile.jpg"
          alt={t.photoAlt}
          width={400}
          height={600}
          className="h-56 w-56 flex-none rounded-lg border border-zinc-200 object-cover dark:border-[#38383a]"
        />
      </header>

      <section>
        <h2 className="text-2xl font-semibold">{t.education}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {t.educationEntries.map((entry) => (
            <div
              key={entry.school}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]"
            >
              <h3 className="font-semibold">{entry.school}</h3>
              <p className="text-sm text-zinc-600 dark:text-[#a1a1a6]">
                {entry.degree} · {entry.dates} · {entry.location}
              </p>
              {entry.details && (
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
                  {entry.details}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t.experience}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {t.experienceEntries.map((job) => (
            <div
              key={job.role}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-[#38383a] dark:bg-[#2c2c2e]"
            >
              <h3 className="font-semibold">{job.role}</h3>
              <p className="text-sm text-zinc-600 dark:text-[#a1a1a6]">
                {job.company} · {job.location} · {job.dates}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600 dark:text-[#a1a1a6]">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">{t.skills}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {t.skillGroups.map((group) => (
            <div key={group.group}>
              <h3 className="text-sm font-semibold">{group.group}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 dark:border-[#38383a] dark:bg-[#2c2c2e] dark:text-[#d1d1d6]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
