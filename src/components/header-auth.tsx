import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function HeaderAuth() {
  const t = await getTranslations("nav");
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="accent-gradient-bg rounded-full px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {t("signIn")}
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent"
    >
      {t("account")}
    </Link>
  );
}
