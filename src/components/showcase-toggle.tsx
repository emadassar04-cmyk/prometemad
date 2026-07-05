"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Globe, Lock, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ModerationStatus = "none" | "pending" | "approved" | "rejected";

export function ShowcaseToggle({
  generationId,
  initialIsPublic,
  initialModerationStatus,
}: {
  generationId: string;
  initialIsPublic: boolean;
  initialModerationStatus: string;
}) {
  const t = useTranslations("myImages");
  const supabase = createSupabaseBrowserClient();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [status, setStatus] = useState<ModerationStatus>(
    (initialModerationStatus as ModerationStatus) ?? "none",
  );
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    if (isPublic) {
      // Unshare — allowed instantly, no re-approval needed to take it down.
      const { error } = await supabase
        .from("generations")
        .update({ is_public: false })
        .eq("id", generationId);
      if (!error) {
        setIsPublic(false);
        setStatus("none");
      }
    } else if (status !== "pending") {
      // Submit (or resubmit after rejection) for admin review.
      const { error } = await supabase
        .from("generations")
        .update({ moderation_status: "pending" })
        .eq("id", generationId);
      if (!error) setStatus("pending");
    }
    setPending(false);
  }

  const label = isPublic
    ? t("shared")
    : status === "pending"
      ? t("pendingReview")
      : status === "rejected"
        ? t("rejected")
        : t("shareToShowcase");

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending || status === "pending"}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors",
        isPublic
          ? "text-accent"
          : status === "pending"
            ? "text-muted"
            : status === "rejected"
              ? "text-red-400"
              : "text-muted hover:text-foreground",
      )}
    >
      {isPublic ? (
        <Globe className="h-4 w-4" />
      ) : status === "pending" ? (
        <Clock className="h-4 w-4" />
      ) : status === "rejected" ? (
        <X className="h-4 w-4" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
    </button>
  );
}
