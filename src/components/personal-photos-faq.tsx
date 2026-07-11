"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_KEYS = [1, 2, 3, 4] as const;

export function PersonalPhotosFaq() {
  const t = useTranslations("personalPhotos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold">{t("faqTitle")}</h2>
      <div className="flex flex-col gap-2">
        {FAQ_KEYS.map((i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="rounded-xl border border-border bg-surface">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-2 p-4 text-start font-medium"
              >
                <span>{t(`faq${i}Q` as Parameters<typeof t>[0])}</span>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>
              {isOpen && (
                <p className="px-4 pb-4 text-sm text-muted">{t(`faq${i}A` as Parameters<typeof t>[0])}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
