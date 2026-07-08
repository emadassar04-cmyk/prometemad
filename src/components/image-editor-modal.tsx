"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, FabricImage, IText, Shadow, type FabricObject } from "fabric";
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Type,
  X,
} from "lucide-react";

const EDIT_CANVAS_MAX_WIDTH = 480;

// Concrete font-family names, not CSS custom properties: canvas 2D's `font`
// property can't resolve var(--...) references at all (unlike regular DOM
// styles), so a Fabric text object given "var(--font-amiri)" silently falls
// back to the browser default font every time, with no error.
const FONT_OPTIONS = [
  { id: "ibm-plex", family: "IBM Plex Sans Arabic, sans-serif" },
  { id: "amiri", family: "Amiri, serif" },
  { id: "lalezar", family: "Lalezar, sans-serif" },
  { id: "aref-ruqaa", family: "Aref Ruqaa, serif" },
  { id: "reem-kufi", family: "Reem Kufi, sans-serif" },
] as const;

const STYLE_PRESETS = [
  {
    id: "classic",
    swatchClass: "bg-white text-black",
    style: { fill: "#ffffff", stroke: "#000000", strokeWidth: 1, shadow: null },
  },
  {
    id: "gold",
    swatchClass: "bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950",
    style: {
      fill: "#d4af37",
      stroke: "#3a2a00",
      strokeWidth: 0.5,
      shadow: new Shadow({ color: "rgba(0,0,0,0.6)", blur: 6, offsetX: 2, offsetY: 2 }),
    },
  },
  {
    id: "neon",
    swatchClass: "bg-black text-cyan-300",
    style: {
      fill: "#22d3ee",
      stroke: "#0e7490",
      strokeWidth: 0.5,
      shadow: new Shadow({ color: "#22d3ee", blur: 14, offsetX: 0, offsetY: 0 }),
    },
  },
  {
    id: "ink",
    swatchClass: "bg-white text-black border border-black/20",
    style: { fill: "#111111", stroke: null, strokeWidth: 0, shadow: null },
  },
] as const;

const QUICK_PHRASES_KEYS = [
  "phraseSpecialOffer",
  "phraseDiscount",
  "phraseNewLaunch",
  "phraseEidMubarak",
  "phraseCongrats",
] as const;

export function ImageEditorModal({
  imageUrl,
  logoUrl,
  onClose,
}: {
  imageUrl: string;
  logoUrl?: string | null;
  onClose: () => void;
}) {
  const t = useTranslations("editor");
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const exportScaleRef = useRef(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeText, setActiveText] = useState<IText | null>(null);

  useEffect(() => {
    let disposed = false;
    let canvas: Canvas | null = null;

    async function init() {
      if (!canvasElRef.current) return;

      try {
        const bgImage = await FabricImage.fromURL(imageUrl, {
          crossOrigin: "anonymous",
        });
        if (disposed || !canvasElRef.current) return;

        // The container's real width can be much narrower than
        // EDIT_CANVAS_MAX_WIDTH on mobile — sizing the canvas off the fixed
        // constant alone let it overflow the container and get clipped by
        // its overflow-hidden instead of shrinking to fit.
        const containerWidth = canvasContainerRef.current?.clientWidth || EDIT_CANVAS_MAX_WIDTH;
        const maxWidth = Math.min(EDIT_CANVAS_MAX_WIDTH, containerWidth);
        const originalWidth = bgImage.width || maxWidth;
        const scale = Math.min(1, maxWidth / originalWidth);
        const displayWidth = originalWidth * scale;
        const displayHeight = (bgImage.height || originalWidth) * scale;

        canvas = new Canvas(canvasElRef.current, {
          width: displayWidth,
          height: displayHeight,
        });
        fabricCanvasRef.current = canvas;
        exportScaleRef.current = scale > 0 ? 1 / scale : 1;

        // Fabric v6+ defaults new objects to originX/originY "center"
        // instead of the old "left"/"top" — left at (0,0) with the default
        // origin anchors the image's *center* there, so only its
        // bottom-right quarter ever fell inside the canvas. Anchoring
        // explicitly by the top-left corner is what "left:0, top:0" is
        // actually meant to mean here.
        bgImage.set({ originX: "left", originY: "top", left: 0, top: 0 });
        bgImage.scaleToWidth(displayWidth);
        canvas.backgroundImage = bgImage;
        canvas.renderAll();

        const syncActiveText = (target: FabricObject | undefined) => {
          setActiveText(target instanceof IText ? target : null);
        };
        canvas.on("selection:created", (e) => syncActiveText(e.selected?.[0]));
        canvas.on("selection:updated", (e) => syncActiveText(e.selected?.[0]));
        canvas.on("selection:cleared", () => setActiveText(null));

        // IText's built-in "enter editing" trigger is a native browser
        // dblclick event, which mobile touchscreens don't synthesize from
        // two taps — typing silently did nothing on phones. Detect the
        // double-tap ourselves and drive edit mode manually.
        let lastTapTarget: FabricObject | null = null;
        let lastTapTime = 0;
        canvas.on("mouse:down", (e) => {
          const target = e.target;
          const now = Date.now();
          if (
            target instanceof IText &&
            target === lastTapTarget &&
            now - lastTapTime < 400 &&
            !target.isEditing
          ) {
            target.enterEditing();
            target.selectAll();
            canvas?.renderAll();
          }
          lastTapTarget = target ?? null;
          lastTapTime = now;
        });

        setLoading(false);
      } catch {
        if (!disposed) setLoadError(true);
      }
    }

    void init();

    return () => {
      disposed = true;
      void canvas?.dispose();
      fabricCanvasRef.current = null;
      setActiveText(null);
    };
  }, [imageUrl]);

  function addText(content: string) {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const text = new IText(content, {
      left: 30,
      top: 30,
      originX: "left",
      originY: "top",
      fontFamily: FONT_OPTIONS[0].family,
      fontSize: 28,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 0.5,
      textAlign: "right",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setActiveText(text);

    // Custom web fonts (curated Arabic display fonts, loaded via next/font)
    // may still be downloading when the text object first measures itself,
    // leaving it sized for a fallback font — visually it repaints correctly
    // once the real font swaps in, but its stored hit-box/width never gets
    // recalculated, so clicks and drags on the text silently miss it.
    // Re-measuring once the font is confirmed loaded fixes both up.
    document.fonts.ready.then(() => {
      if (fabricCanvasRef.current !== canvas) return;
      text.initDimensions();
      canvas.requestRenderAll();
    });
  }

  function handleAddText() {
    addText(t("defaultText"));
  }

  function handleSetFont(family: string) {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeText) return;
    const text = activeText;
    text.set({ fontFamily: family });
    canvas.renderAll();

    // Same fallback-font hit-box issue as addText() — re-measure once the
    // newly-picked font is actually loaded.
    document.fonts.ready.then(() => {
      if (fabricCanvasRef.current !== canvas) return;
      text.initDimensions();
      canvas.requestRenderAll();
    });
  }

  function handleSetStyle(style: (typeof STYLE_PRESETS)[number]["style"]) {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !activeText) return;
    activeText.set(style);
    canvas.renderAll();
  }

  async function handleAddLogo() {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !logoUrl) return;
    const logo = await FabricImage.fromURL(logoUrl, { crossOrigin: "anonymous" });
    logo.set({ originX: "left", originY: "top", left: 20, top: 20 });
    logo.scaleToWidth(80);
    canvas.add(logo);
    canvas.setActiveObject(logo);
    canvas.renderAll();
  }

  function handleDeleteSelected() {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      canvas.renderAll();
    }
  }

  function handleExport() {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: exportScaleRef.current,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "promptly-design.png";
    link.click();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 overflow-auto rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted">{t("title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={canvasContainerRef}
          className="flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-background"
        >
          {loading && !loadError && (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          )}
          {loadError && (
            <p className="p-6 text-sm text-red-400">{t("loadError")}</p>
          )}
          {/*
            Fabric clones this canvas element's className onto the
            interactive "upper-canvas" layer it creates internally, at the
            moment the Canvas is constructed — putting a conditional
            "hidden" class directly on the canvas itself got permanently
            baked into that clone (construction happens while still
            loading), leaving the whole interactive layer non-clickable
            forever after. Hiding via a wrapper div sidesteps that.
          */}
          <div className={loading || loadError ? "hidden" : ""}>
            <canvas ref={canvasElRef} />
          </div>
        </div>

        {!loading && !loadError && (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddText}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:border-accent"
              >
                <Type className="h-4 w-4" /> {t("addText")}
              </button>
              {logoUrl && (
                <button
                  type="button"
                  onClick={handleAddLogo}
                  className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:border-accent"
                >
                  <ImageIcon className="h-4 w-4" /> {t("addLogo")}
                </button>
              )}
              <button
                type="button"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:border-red-400"
              >
                <Trash2 className="h-4 w-4" /> {t("deleteSelected")}
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="accent-gradient-bg ms-auto flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium text-white"
              >
                <Download className="h-4 w-4" /> {t("export")}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {QUICK_PHRASES_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => addText(t(key))}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-foreground"
                >
                  {t(key)}
                </button>
              ))}
            </div>

            {activeText && (
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3">
                <div>
                  <p className="mb-1.5 text-xs text-muted">{t("fontLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => handleSetFont(font.family)}
                        style={{ fontFamily: font.family }}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent"
                      >
                        {t("defaultText")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-1.5 text-xs text-muted">{t("styleLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSetStyle(preset.style)}
                        aria-label={t(`stylePreset_${preset.id}`)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${preset.swatchClass}`}
                      >
                        أ
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
