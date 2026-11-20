import type { ReactNode } from "react";
import type { ScheduleSlot } from "@/lib/schedule";
import type { Language } from "@/lib/content";

export default function ScheduleItem({
  slot,
  lang,
  children,
}: {
  slot: ScheduleSlot;
  lang: Language;
  children?: ReactNode;
}) {
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const start = new Date(`${slot.date}T${slot.startTime}:00`);
  const end = new Date(`${slot.date}T${slot.endTime}:00`);

  const dateDisplay = start.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeDisplay = `${start.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })} – ${end.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}`;

  return (
    <li className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-[#38383a]">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium">{slot.title}</p>
        <p className="text-sm text-zinc-600 dark:text-[#a1a1a6]">
          {timeDisplay}
        </p>
      </div>
      <p className="mt-1 text-xs text-zinc-500 dark:text-[#86868b]">
        {dateDisplay}
      </p>
      {children}
    </li>
  );
}
