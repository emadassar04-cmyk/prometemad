"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function PromptRating({
  promptId,
  average,
  count,
  initialUserRating,
  isSignedIn,
}: {
  promptId: string;
  average: number;
  count: number;
  initialUserRating: number | null;
  isSignedIn: boolean;
}) {
  const t = useTranslations("prompt");
  const locale = useLocale();
  const supabase = createSupabaseBrowserClient();
  const [userRating, setUserRating] = useState(initialUserRating);
  const [hovered, setHovered] = useState<number | null>(null);
  const [displayAverage, setDisplayAverage] = useState(average);
  const [displayCount, setDisplayCount] = useState(count);

  async function handleRate(value: number) {
    if (!isSignedIn) {
      window.location.assign(`/${locale}/sign-in`);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const previousRating = userRating;
    setUserRating(value);
    if (previousRating === null) {
      setDisplayAverage((displayAverage * displayCount + value) / (displayCount + 1));
      setDisplayCount(displayCount + 1);
    } else {
      setDisplayAverage((displayAverage * displayCount - previousRating + value) / displayCount);
    }

    await supabase
      .from("prompt_ratings")
      .upsert(
        { user_id: user.id, prompt_id: promptId, rating: value },
        { onConflict: "user_id,prompt_id" },
      );
  }

  const activeValue = hovered ?? userRating ?? 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHovered(value)}
            onClick={() => handleRate(value)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "h-4 w-4",
                value <= activeValue ? "fill-accent text-accent" : "text-muted",
              )}
            />
          </button>
        ))}
      </div>
      <span className="text-xs text-muted">
        {displayCount > 0
          ? `${displayAverage.toFixed(1)} (${displayCount})`
          : t("noRatingsYet")}
      </span>
    </div>
  );
}
