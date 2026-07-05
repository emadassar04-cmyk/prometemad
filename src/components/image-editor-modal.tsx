"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, FabricImage, IText } from "fabric";
import {
  Download,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Type,
  X,
} from "lucide-react";

const EDIT_CANVAS_MAX_WIDTH = 480;

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
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const exportScaleRef = useRef(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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

        const originalWidth = bgImage.width || EDIT_CANVAS_MAX_WIDTH;
        const scale = Math.min(1, EDIT_CANVAS_MAX_WIDTH / originalWidth);
        const displayWidth = originalWidth * scale;
        const displayHeight = (bgImage.height || originalWidth) * scale;

        canvas = new Canvas(canvasElRef.current, {
          width: displayWidth,
          height: displayHeight,
        });
        fabricCanvasRef.current = canvas;
        exportScaleRef.current = scale > 0 ? 1 / scale : 1;

        bgImage.scaleToWidth(displayWidth);
        canvas.backgroundImage = bgImage;
        canvas.renderAll();
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
    };
  }, [imageUrl]);

  function handleAddText() {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const text = new IText(t("defaultText"), {
      left: 30,
      top: 30,
      fontFamily: "var(--font-ibm-plex-arabic), sans-serif",
      fontSize: 28,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 0.5,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }

  async function handleAddLogo() {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !logoUrl) return;
    const logo = await FabricImage.fromURL(logoUrl, { crossOrigin: "anonymous" });
    logo.scaleToWidth(80);
    logo.set({ left: 20, top: 20 });
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

        <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
          {loading && !loadError && (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          )}
          {loadError && (
            <p className="p-6 text-sm text-red-400">{t("loadError")}</p>
          )}
          <canvas ref={canvasElRef} className={loading || loadError ? "hidden" : ""} />
        </div>

        {!loading && !loadError && (
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
        )}
      </div>
    </div>
  );
}
