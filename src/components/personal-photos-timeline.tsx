import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShareButtons } from "@/components/share-buttons";

const OWNER_PHOTO_URL =
  "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/before-v2.jpg";

const ERAS = [
  {
    slug: "ottoman-classic",
    labelAr: "١٨٩٠",
    imageUrl: "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/ottoman-classic-after.png",
  },
  {
    slug: "bw-drama",
    labelAr: "١٩٤٠",
    imageUrl: "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/bw-drama-after.png",
  },
  {
    slug: "retro-90s",
    labelAr: "١٩٩٥",
    imageUrl: "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/retro-90s-after.png",
  },
  {
    slug: "today",
    labelAr: "اليوم",
    imageUrl: OWNER_PHOTO_URL,
  },
  {
    slug: "cyberpunk",
    labelAr: "٢٠٧٧",
    imageUrl: "https://ocbexnlvopobemvzqsjd.supabase.co/storage/v1/object/public/personal-style-examples/cyberpunk-after.png",
  },
] as const;

export function PersonalPhotosTimeline({ referralLink }: { referralLink: string }) {
  const t = useTranslations("personalPhotos");

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold">{t("timelineTitle")}</h2>
        <p className="text-sm text-muted">{t("timelineSubtitle")}</p>
      </div>

      <div dir="ltr" className="flex gap-3 overflow-x-auto pb-2">
        {ERAS.map((era, i) => (
          <div key={era.slug} className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative h-28 w-24 overflow-hidden rounded-xl border border-border sm:h-36 sm:w-28">
                <Image src={era.imageUrl} alt={era.labelAr} fill sizes="112px" className="object-cover" loading="lazy" />
              </div>
              <span className="text-xs font-medium text-muted">{era.labelAr}</span>
            </div>
            {i < ERAS.length - 1 && <span className="text-muted">←</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm font-medium">{t("timelineCta")}</span>
        <ShareButtons url={referralLink} text={t("timelineTitle")} />
      </div>
    </section>
  );
}
