import { Link } from "@/i18n/navigation";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  message,
  ctaLabel,
  ctaHref = "/",
}: {
  icon: LucideIcon;
  message: string;
  ctaLabel: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
        <Icon className="h-6 w-6" />
      </div>
      <p className="max-w-xs text-muted">{message}</p>
      <Link
        href={ctaHref}
        className="accent-gradient-bg rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
