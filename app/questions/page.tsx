import QuestionsBoard from "@/components/QuestionsBoard";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function QuestionsPage() {
  const lang = await getLanguage();
  const t = content[lang].questions;

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-[#86868b]">
        {t.privacyNote}
      </p>
      <QuestionsBoard lang={lang} labels={t} />
    </section>
  );
}
