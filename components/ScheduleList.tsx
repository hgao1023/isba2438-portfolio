"use client";

import { useEffect, useState } from "react";
import ScheduleItem from "@/components/ScheduleItem";
import { sortScheduleSlots, type ScheduleSlot } from "@/lib/schedule";
import type { Language } from "@/lib/content";

export default function ScheduleList({
  lang,
  labels,
}: {
  lang: Language;
  labels: { loading: string; error: string; empty: string };
}) {
  const [slots, setSlots] = useState<ScheduleSlot[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/schedule")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      })
      .then((data) => {
        if (active) {
          setSlots(data);
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (failed) {
    return <p className="mt-6 text-sm text-red-600">{labels.error}</p>;
  }

  if (slots === null) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-[#86868b]">
        {labels.loading}
      </p>
    );
  }

  const sorted = sortScheduleSlots(slots);

  if (sorted.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-[#86868b]">
        {labels.empty}
      </p>
    );
  }

  return (
    <ul className="mt-6 flex flex-col gap-3">
      {sorted.map((slot) => (
        <ScheduleItem key={slot.id} slot={slot} lang={lang} />
      ))}
    </ul>
  );
}
