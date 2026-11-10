import ContactForm from "@/components/ContactForm";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function ContactMe() {
  const lang = await getLanguage();
  const t = content[lang].contact;

  return (
    <section>
      <h1 className="text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <ContactForm
        labels={{
          name: t.name,
          email: t.email,
          message: t.message,
          send: t.send,
        }}
      />
    </section>
  );
}
