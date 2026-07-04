"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  promptId,
  initialFavorited,
  isSignedIn,
}: {
  promptId: string;
  initialFavorited: boolean;
  isSignedIn: boolean;
}) {
  const t = useTranslations("prompt");
  const locale = useLocale();
  const supabase = createSupabaseBrowserClient();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  async function toggle() {
    if (!isSignedIn) {
      window.location.href = `/${locale}/sign-in`;
      return;
    }

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (favorited) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("prompt_id", promptId);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: user.id, prompt_id: promptId });
      }
      setFavorited(!favorited);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-label={favorited ? t("removeFromFavorites") : t("addToFavorites")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/80 backdrop-blur transition-colors hover:border-accent",
        favorited && "border-accent text-accent",
      )}
    >
      <Heart className="h-4 w-4" fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
