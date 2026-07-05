"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Check, Loader2, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/types";

const FONT_OPTIONS = ["Cairo", "Tajawal", "Amiri", "Almarai"];
const DEFAULT_COLORS = ["#D4AF37", "#1E3A5F"];
const MAX_COLORS = 3;

export function BrandKitForm({
  initialBrandKit,
}: {
  initialBrandKit: Tables<"brand_kits"> | null;
}) {
  const t = useTranslations("brandKit");
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState(
    initialBrandKit?.business_name ?? "",
  );
  const [colors, setColors] = useState<string[]>(() => {
    const saved = Array.isArray(initialBrandKit?.colors)
      ? (initialBrandKit.colors as string[])
      : [];
    return saved.length > 0 ? saved : DEFAULT_COLORS;
  });
  const [font, setFont] = useState(initialBrandKit?.font ?? FONT_OPTIONS[0]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    initialBrandKit?.logo_url ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLogoChange(file: File | null) {
    setLogoFile(file);
    if (file) setLogoPreviewUrl(URL.createObjectURL(file));
  }

  function handleColorChange(index: number, value: string) {
    setColors((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function addColor() {
    if (colors.length >= MAX_COLORS) return;
    setColors((prev) => [...prev, "#888888"]);
  }

  function removeColor(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("not signed in");

      let logoUrl = initialBrandKit?.logo_url ?? null;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop() ?? "png";
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("brand-logos")
          .upload(path, logoFile, { upsert: true });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("brand-logos").getPublicUrl(path);
        logoUrl = publicUrl;
      }

      const { error: upsertError } = await supabase.from("brand_kits").upsert(
        {
          user_id: user.id,
          business_name: businessName || null,
          colors,
          font,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (upsertError) throw upsertError;

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-muted">
          {t("businessName")}
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={t("businessNamePlaceholder")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-muted">{t("logo")}</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          {logoPreviewUrl ? (
            <span className="relative h-16 w-16 overflow-hidden rounded-lg bg-background">
              <Image
                src={logoPreviewUrl}
                alt=""
                fill
                sizes="64px"
                className="object-contain"
              />
            </span>
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {t("chooseLogo")}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-muted">{t("colors")}</label>
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent p-0"
              />
              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-xs text-muted hover:text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {colors.length < MAX_COLORS && (
            <button
              type="button"
              onClick={addColor}
              className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted hover:border-accent hover:text-foreground"
            >
              + {t("addColor")}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-muted">{t("font")}</label>
        <select
          value={font}
          onChange={(e) => setFont(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="accent-gradient-bg flex items-center justify-center gap-2 self-start rounded-full px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="h-4 w-4" />
        ) : null}
        {saving ? t("saving") : saved ? t("saved") : t("save")}
      </button>
    </div>
  );
}
