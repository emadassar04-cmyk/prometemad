"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ShowcaseToggle({
  generationId,
  initialIsPublic,
}: {
  generationId: string;
  initialIsPublic: boolean;
}) {
  const t = useTranslations("myImages");
  const supabase = createSupabaseBrowserClient();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    const next = !isPublic;
    const { error } = await supabase
      .from("generations")
      .update({ is_public: next })
      .eq("id", generationId);
    if (!error) setIsPublic(next);
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      title={isPublic ? t("shared") : t("shareToShowcase")}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors",
        isPublic ? "text-accent" : "text-muted hover:text-foreground",
      )}
    >
      {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
    </button>
  );
}
