import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories } from "@/lib/data/prompts";
import { NewsletterForm } from "@/components/newsletter-form";
import { WhatsAppButton } from "@/components/whatsapp-button";

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = (await getLocale()) as "ar" | "en";
  const categories = await getCategories();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
            <span className="accent-gradient-text text-lg font-bold">
              {t("brand.name")}
            </span>
            <p className="max-w-xs text-sm text-muted">{t("brand.tagline")}</p>
          </div>

          <div className="flex flex-col gap-2.5 text-sm text-muted">
            <span className="text-xs font-semibold text-foreground">
              {t("footer.product")}
            </span>
            <Link href="/" className="transition-colors hover:text-foreground">
              {t("nav.library")}
            </Link>
            <Link href="/showcase" className="transition-colors hover:text-foreground">
              {t("nav.showcase")}
            </Link>
            <Link
              href="/image-to-prompt"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.imageToPrompt")}
            </Link>
            <Link
              href="/personal-photos"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.personalPhotos")}
            </Link>
            <Link href="/nano-banana" className="transition-colors hover:text-foreground">
              Nano Banana
            </Link>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-col gap-2.5 text-sm text-muted">
              <span className="text-xs font-semibold text-foreground">
                {t("footer.categories")}
              </span>
              {categories.slice(0, 5).map((category) => (
                <Link
                  key={category.slug}
                  href={`/prompts/${category.slug}`}
                  className="transition-colors hover:text-foreground"
                >
                  {locale === "ar" ? category.name_ar : category.name_en}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2.5 text-sm text-muted">
            <span className="text-xs font-semibold text-foreground">
              {t("footer.contact")}
            </span>
            <div className="flex items-center gap-2">
              <WhatsAppButton label={t("nav.whatsapp")} />
              <span>{t("nav.whatsapp")}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-8 sm:items-start">
          <span className="text-xs font-semibold text-muted">
            {t("newsletter.title")}
          </span>
          <NewsletterForm />
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          © {year} {t("brand.name")}
        </div>
      </div>
    </footer>
  );
}
