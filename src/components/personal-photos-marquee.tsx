"use client";

import Image from "next/image";

type MarqueeItem = {
  slug: string;
  title: string;
  imageUrl: string;
};

export function PersonalPhotosMarquee({ items }: { items: MarqueeItem[] }) {
  if (items.length === 0) return null;
  const track = [...items, ...items];

  function scrollToCard(slug: string) {
    const el = document.getElementById(`style-${slug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-highlight");
    setTimeout(() => el.classList.remove("ring-highlight"), 1600);
  }

  return (
    <div dir="ltr" className="group relative overflow-hidden rounded-2xl border border-border bg-surface py-3">
      <div className="animate-marquee group-hover:[animation-play-state:paused] flex w-max gap-3 px-3">
        {track.map((item, i) => (
          <button
            key={`${item.slug}-${i}`}
            type="button"
            onClick={() => scrollToCard(item.slug)}
            className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg transition-transform hover:-translate-y-1 sm:h-24 sm:w-20"
          >
            <Image src={item.imageUrl} alt={item.title} fill sizes="80px" className="object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
