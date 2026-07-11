"use client";

import { useState } from "react";
import Image from "next/image";

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [value, setValue] = useState(50);

  return (
    <div
      dir="ltr"
      className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-xl select-none sm:max-w-md"
    >
      <Image src={afterUrl} alt={afterLabel} fill sizes="400px" className="object-cover" priority />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={beforeUrl} alt={beforeLabel} fill sizes="400px" className="object-cover" priority />
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-xs font-medium text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-navy">
        {afterLabel}
      </span>
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        style={{ left: `${value}%` }}
      >
        <span className="absolute top-1/2 h-9 w-9 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-accent shadow-lg" />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label={`${beforeLabel} / ${afterLabel}`}
      />
    </div>
  );
}
