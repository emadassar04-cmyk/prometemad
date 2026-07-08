"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { getShowcaseLikes, setShowcaseLikes } from "@/lib/showcase-likes";
import { cn } from "@/lib/utils";

export function ShowcaseLikeButton({
  generationId,
  initialLikeCount,
}: {
  generationId: string;
  initialLikeCount: number;
}) {
  const t = useTranslations("showcase");
  const [liked, setLiked] = useState(() => getShowcaseLikes().includes(generationId));
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (pending) return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((count) => Math.max(0, count + (nextLiked ? 1 : -1)));

    startTransition(async () => {
      try {
        const res = await fetch("/api/showcase/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId }),
        });
        if (!res.ok) throw new Error("like_failed");
        const data = (await res.json()) as { liked: boolean; like_count: number };

        setLiked(data.liked);
        setLikeCount(data.like_count);

        const current = getShowcaseLikes();
        setShowcaseLikes(
          data.liked
            ? [...current.filter((id) => id !== generationId), generationId]
            : current.filter((id) => id !== generationId),
        );
      } catch {
        // Roll back the optimistic update on failure.
        setLiked(!nextLiked);
        setLikeCount((count) => Math.max(0, count + (nextLiked ? -1 : 1)));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={liked ? t("unlike") : t("like")}
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-xs font-medium backdrop-blur transition-colors hover:border-accent",
        liked && "border-accent text-accent",
      )}
    >
      <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
      <span>{likeCount}</span>
    </button>
  );
}
