import { redirect, Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Heart, Palette, Users } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

const QUICK_LINKS = [
  { href: "/favorites", labelKey: "favorites", icon: Heart },
  { href: "/brand", labelKey: "brandKit", icon: Palette },
  { href: "/invite", labelKey: "invite", icon: Users },
] as const;

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/sign-in", locale });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, plan, credits")
    .eq("id", user!.id)
    .single();

  const t = await getTranslations("nav");

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-16">
      <h1 className="text-xl font-semibold">{t("account")}</h1>
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm text-muted">{user!.email}</p>
        <p className="mt-2 text-sm">
          {profile?.username ?? "—"} · {profile?.plan} · {profile?.credits}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {QUICK_LINKS.map(({ href, labelKey, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3.5 text-sm transition-colors hover:border-accent"
          >
            <Icon className="h-4 w-4 text-navy" />
            {t(labelKey)}
          </Link>
        ))}
      </div>

      <SignOutButton />
    </div>
  );
}
