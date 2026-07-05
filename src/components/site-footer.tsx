import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="accent-gradient-text text-lg font-bold">
              {t("brand.name")}
            </span>
            <p className="max-w-xs text-center text-sm text-muted sm:text-start">
              {t("brand.tagline")}
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
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
              href="/my-images"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.myImages")}
            </Link>
            <Link
              href="/favorites"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.favorites")}
            </Link>
            <Link
              href="/image-to-prompt"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.imageToPrompt")}
            </Link>
            <Link
              href="/nano-banana"
              className="transition-colors hover:text-foreground"
            >
              🍌 Nano Banana
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {year} {t("brand.name")}
        </div>
      </div>
    </footer>
  );
}
