"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function LibraryFilters({
  categories,
  styles,
  models,
}: {
  categories: { slug: string; name_ar: string; name_en: string }[];
  styles: string[];
  models: string[];
}) {
  const t = useTranslations("home");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 transition-opacity sm:flex-row sm:items-center",
        isPending && "opacity-60",
      )}
    >
      <div className="relative flex-1">
        {isPending ? (
          <Loader2 className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted" />
        ) : (
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        )}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("q", q);
          }}
          onBlur={() => updateParam("q", q)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-full border border-border bg-surface py-2.5 ps-9 pe-4 text-sm outline-none focus:border-accent"
        />
      </div>

      <select
        defaultValue={searchParams.get("category") ?? ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
      >
        <option value="">{t("filters.category")}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name_ar} / {c.name_en}
          </option>
        ))}
      </select>

      {styles.length > 0 && (
        <select
          defaultValue={searchParams.get("style") ?? ""}
          onChange={(e) => updateParam("style", e.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">{t("filters.style")}</option>
          {styles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {models.length > 0 && (
        <select
          defaultValue={searchParams.get("model") ?? ""}
          onChange={(e) => updateParam("model", e.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          <option value="">{t("filters.model")}</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
