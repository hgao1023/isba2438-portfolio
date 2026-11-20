import Link from "next/link";
import ContactAdmin from "@/components/ContactAdmin";
import { getLanguage } from "@/lib/language";
import { content } from "@/lib/content";

export default async function AdminContactsPage() {
  const lang = await getLanguage();
  const t = content[lang].contactAdmin;
  const admin = content[lang].admin;
  const c = content[lang].contact;

  return (
    <section>
      <p className="text-sm">
        <Link
          href="/admin"
          className="text-zinc-600 hover:underline dark:text-[#a1a1a6]"
        >
          {admin.back}
        </Link>
      </p>
      <h1 className="mt-2 text-4xl font-bold">{t.title}</h1>
      <p className="mt-2 text-zinc-600 dark:text-[#a1a1a6]">{t.intro}</p>
      <ContactAdmin
        lang={lang}
        labels={{
          edit: t.edit,
          delete: t.delete,
          save: t.save,
          cancel: t.cancel,
          confirmDelete: t.confirmDelete,
          successEdit: t.successEdit,
          successDelete: t.successDelete,
          serverError: t.serverError,
          contactPageNote: t.contactPageNote,
          contactPageLink: t.contactPageLink,
          name: c.name,
          email: c.email,
          message: c.message,
          listLoading: t.listLoading,
          listError: t.listError,
          listEmpty: t.listEmpty,
        }}
      />
    </section>
  );
}
