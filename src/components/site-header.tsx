import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderAuth } from "@/components/header-auth";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { MobileNav } from "@/components/mobile-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const t = await getTranslations();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <header className="header-border-glow sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold">
          <span className="accent-gradient-text">{t("brand.name")}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link href="/" className="transition-colors hover:text-foreground">
            {t("nav.library")}
          </Link>
          <Link
            href="/showcase"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.showcase")}
          </Link>
          <Link
            href="/image-to-prompt"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.imageToPrompt")}
          </Link>
          <Link
            href="/my-images"
            className="transition-colors hover:text-foreground"
          >
            {t("nav.myImages")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <WhatsAppButton label={t("nav.whatsapp")} />
          <ThemeToggle />
          <LocaleSwitcher />
          <HeaderAuth />
          <MobileNav isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
