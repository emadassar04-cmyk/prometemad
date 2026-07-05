"use client";

import { useId, useState } from "react";

type DayCount = { day: string; count: number };

// Single-series magnitude chart: one hue (the brand accent), thin rounded
// bars, muted axis text, hover tooltip, and a table fallback so the data
// isn't color/shape-only.
export function DailyGenerationsChart({ data }: { data: DayCount[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const titleId = useId();

  const max = Math.max(1, ...data.map((d) => d.count));
  const width = 600;
  const height = 160;
  const barGap = 2;
  const barWidth = data.length > 0 ? width / data.length - barGap : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 id={titleId} className="text-sm font-semibold text-muted">
          التوليد اليومي — آخر 30 يوم
        </h2>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="text-xs text-accent-2 hover:text-accent"
        >
          {showTable ? "عرض كرسم بياني" : "عرض كجدول"}
        </button>
      </div>

      {showTable ? (
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-start text-muted">
                <th className="p-1 text-start">اليوم</th>
                <th className="p-1 text-start">عدد الصور</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.day} className="border-t border-border">
                  <td className="p-1">{d.day}</td>
                  <td className="p-1">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            role="img"
            aria-labelledby={titleId}
            preserveAspectRatio="none"
          >
            <line
              x1={0}
              y1={height - 0.5}
              x2={width}
              y2={height - 0.5}
              stroke="currentColor"
              className="text-border"
              strokeWidth={1}
            />
            {data.map((d, i) => {
              const barHeight = (d.count / max) * (height - 8);
              const x = i * (barWidth + barGap);
              const y = height - barHeight;
              return (
                <rect
                  key={d.day}
                  x={x}
                  y={y}
                  width={Math.max(1, barWidth)}
                  height={barHeight}
                  rx={2}
                  className="fill-accent transition-opacity"
                  opacity={hovered === null || hovered === i ? 1 : 0.35}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          {hovered !== null && data[hovered] && (
            <div className="pointer-events-none absolute start-2 top-0 rounded-lg border border-border bg-background px-2 py-1 text-xs">
              <span className="text-muted">{data[hovered].day}</span>{" "}
              <span className="font-semibold">{data[hovered].count}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
