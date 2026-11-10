import { getLanguage } from "@/lib/language";
import { setLanguage } from "@/lib/language-action";

export default async function LanguageToggle() {
  const lang = await getLanguage();

  return (
    <form action={setLanguage}>
      <input type="hidden" name="lang" value={lang === "en" ? "zh" : "en"} />
      <button
        type="submit"
        className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-[#48484a] dark:hover:bg-[#2c2c2e]"
      >
        {lang === "en" ? "中文" : "English"}
      </button>
    </form>
  );
}
