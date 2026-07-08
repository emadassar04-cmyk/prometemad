"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const links: { href: "/" | "/showcase" | "/image-to-prompt" | "/personal-photos" | "/my-images" | "/favorites" | "/invite" | "/workspace" | "/admin"; label: string }[] = [
    { href: "/", label: t("library") },
    { href: "/showcase", label: t("showcase") },
    { href: "/image-to-prompt", label: t("imageToPrompt") },
    { href: "/personal-photos", label: t("personalPhotos") },
    { href: "/my-images", label: t("myImages") },
    { href: "/favorites", label: t("favorites") },
    { href: "/invite", label: t("invite") },
    { href: "/workspace", label: t("workspace") },
    ...(isAdmin ? [{ href: "/admin" as const, label: t("admin") }] : []),
  ];

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-foreground"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-background px-4 py-3 shadow-lg">
          <nav className="flex flex-col gap-1 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
