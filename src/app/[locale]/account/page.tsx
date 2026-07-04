import { redirect } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

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
      <SignOutButton />
    </div>
  );
}
