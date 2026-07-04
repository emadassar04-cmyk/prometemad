import { getTranslations } from "next-intl/server";
import { savePromptAction } from "@/app/[locale]/admin/prompts/actions";
import type { Tables } from "@/lib/supabase/types";

export async function PromptForm({
  locale,
  prompt,
  categories,
}: {
  locale: string;
  prompt?: Tables<"prompts"> | null;
  categories: { id: string; name_ar: string; name_en: string }[];
}) {
  const t = await getTranslations("admin");

  return (
    <form action={savePromptAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      {prompt && <input type="hidden" name="id" value={prompt.id} />}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Slug" name="slug" defaultValue={prompt?.slug} required />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted">{t("statusPublished")}</label>
          <select
            name="status"
            defaultValue={prompt?.status ?? "draft"}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="draft">{t("statusDraft")}</option>
            <option value="published">{t("statusPublished")}</option>
            <option value="archived">{t("statusArchived")}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Title (AR)" name="title_ar" defaultValue={prompt?.title_ar} required />
        <Field label="Title (EN)" name="title_en" defaultValue={prompt?.title_en} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Description (AR)"
          name="description_ar"
          defaultValue={prompt?.description_ar ?? ""}
          textarea
        />
        <Field
          label="Description (EN)"
          name="description_en"
          defaultValue={prompt?.description_en ?? ""}
          textarea
        />
      </div>

      <Field
        label="Prompt display (AR)"
        name="prompt_display_ar"
        defaultValue={prompt?.prompt_display_ar}
        textarea
        required
      />
      <Field
        label="Prompt text (EN, sent to model)"
        name="prompt_text_en"
        defaultValue={prompt?.prompt_text_en}
        textarea
        required
      />

      <Field
        label='Variables (JSON array: [{"key","label_ar","label_en","default","type"}])'
        name="variables"
        defaultValue={JSON.stringify(prompt?.variables ?? [], null, 2)}
        textarea
        mono
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted">Category</label>
          <select
            name="category_id"
            defaultValue={prompt?.category_id ?? ""}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">—</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_ar} / {c.name_en}
              </option>
            ))}
          </select>
        </div>
        <Field label="Style" name="style" defaultValue={prompt?.style ?? ""} />
        <Field label="Model" name="model" defaultValue={prompt?.model ?? ""} />
      </div>

      <Field
        label="Tags (comma separated)"
        name="tags"
        defaultValue={(prompt?.tags ?? []).join(", ")}
      />
      <Field
        label="Preview image URL"
        name="preview_image_url"
        defaultValue={prompt?.preview_image_url ?? ""}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={prompt?.is_featured ?? false}
        />
        Featured
      </label>

      <button
        type="submit"
        className="accent-gradient-bg w-fit rounded-full px-6 py-2.5 text-sm font-medium text-white"
      >
        {t("save")}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea,
  mono,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  textarea?: boolean;
  mono?: boolean;
}) {
  const inputClass = `rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent ${mono ? "font-mono" : ""}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-muted">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          rows={4}
          className={inputClass}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue ?? ""}
          required={required}
          className={inputClass}
        />
      )}
    </div>
  );
}
