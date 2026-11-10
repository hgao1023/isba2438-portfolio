import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InlineScript from "@/components/InlineScript";
import NavBar from "@/components/NavBar";
import { getLanguage } from "@/lib/language";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return lang === "zh"
    ? { title: "Heliang Gao (Tony) - 个人作品集", description: "Heliang Gao (Tony) 的个人作品集网站" }
    : { title: "Heliang Gao (Tony) - Portfolio", description: "Personal portfolio of Heliang Gao (Tony)" };
}

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const lang = await getLanguage();

  return (
    <html
      lang={lang === "zh" ? "zh-CN" : "en"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-200 py-4 text-center text-sm text-zinc-500 dark:border-[#38383a] dark:text-[#86868b]">
          Heliang Gao (Tony) © 2026
        </footer>
      </body>
    </html>
  );
}
