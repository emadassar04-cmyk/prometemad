# برومبتلي (Promptly)

منصة عربية-إنجليزية لمكتبة برومبتات صور احترافية مع توليد فعلي داخل المنصة — Next.js 15 + Supabase + n8n.

## البنية التقنية

| الطبقة | التقنية |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS v4 + `next-intl` (ar/en, RTL/LTR) |
| Backend/DB | Supabase (Postgres + Auth + Storage + RLS) |
| Automation | n8n (توليد الصور) |
| توليد الصور | مزود قابل للتبديل خلف `lib/providers/` — Pollinations.ai (مجاني، افتراضي) أو fal.ai FLUX.1 [schnell] |
| الاختبارات | Vitest |

## البدء محلياً

```bash
npm install
cp .env.example .env.local   # املأ القيم (انظر أدناه)
npm run dev
```

يفتح على `http://localhost:3000` ويحوّل تلقائياً إلى `/ar` أو `/en`.

### متغيرات البيئة (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=            # من إعدادات مشروع Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=       # المفتاح العام (publishable/anon)
N8N_GENERATE_IMAGE_WEBHOOK_URL=      # رابط ويب هوك workflow "Generate Image" في n8n
N8N_WEBHOOK_SECRET=                  # سر مشترك بين المنصة و n8n
SUPABASE_SERVICE_ROLE_KEY=           # فقط لتشغيل scripts/seed-preview-images.ts محلياً — لا يُستخدم في التطبيق نفسه
```

## قاعدة البيانات (Supabase)

المخطط والـ migrations في `supabase/migrations/`. الجداول: `profiles`, `categories`, `prompts`, `generations`, `favorites`, `daily_usage`، جميعها بـ Row Level Security مفعّل:

- قراءة عامة للبرومبتات المنشورة والفئات.
- `generations` و`favorites` لصاحبها فقط.
- الكتابة على `prompts`/`categories` للأدمن فقط (`profiles.role = 'admin'`).
- الحد اليومي (10 صور/مستخدم) مفروض ذرياً عبر دالة `try_increment_daily_usage` (RPC، security definer).

لترقية مستخدم إلى أدمن، نفّذ في Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where id = '<user-uuid>';
```

(الكتابة المباشرة عبر SQL تتجاوز الحماية التي تمنع المستخدم العادي من تغيير هذا الحقل بنفسه.)

### إعادة توليد أنواع TypeScript بعد أي migration جديد

```bash
# عبر Supabase MCP tool: mcp__Supabase__generate_typescript_types
# أو عبر Supabase CLI محلياً:
supabase gen types typescript --project-id <project-ref> > src/lib/supabase/types.ts
```

## توليد الصور — n8n

تدفق التوليد: المستخدم يضغط "ولّد الصورة" → `POST /api/generate` (يتحقق من الجلسة، يفرض الحد اليومي عبر RPC، يُدرج صف في `generations`) → يستدعي webhook workflow **"Generate Image"** في n8n (مُنشأ مسبقاً) → n8n يولّد الصورة (Pollinations افتراضياً)، يرفعها لـ Supabase Storage bucket `generations`، يحدّث الصف، ويرجع الرابط.

قبل التفعيل، اضبط في n8n (Settings → Environment Variables):

- `WEBHOOK_SECRET` — يطابق `N8N_WEBHOOK_SECRET` أعلاه.
- `SUPABASE_URL` — نفس `NEXT_PUBLIC_SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY` — مفتاح service_role (من Supabase → Settings → API). **لا يوضع في `.env.local` للتطبيق أبداً.**

ثم فعّل (Publish/Activate) الـ workflow وانسخ رابط الـ webhook إلى `N8N_GENERATE_IMAGE_WEBHOOK_URL`.

للتبديل إلى fal.ai FLUX.1 [schnell] في الإنتاج (أرخص وأسرع من Pollinations للحجم الكبير)، عدّل عقدة "Generate Image (Pollinations)" في n8n لتستدعي `https://fal.run/fal-ai/flux/schnell` بمفتاح `FAL_KEY` (نفس منطق `src/lib/providers/fal.ts`).

## المصادقة

Supabase Auth (بريد/كلمة مرور + Google). لتفعيل Google OAuth: Supabase Dashboard → Authentication → Providers → Google، أدخل Client ID/Secret، واضبط Authorized redirect URI على:

```
https://<project-ref>.supabase.co/auth/v1/callback
```

## المحتوى الأولي (Seed)

- **البرومبتات**: `scripts/seed-data.ts` يحتوي 60 برومبتاً موزعة على 7 فئات تسويقية (تصوير منتجات، إعلانات سوشيال ميديا، هوية بصرية، بورتريه، أنماط فنية، أغلفة ومنشورات، مناسبات). لتوليد/تحديث SQL من هذا الملف: `npm run seed:sql` (يكتب `supabase/seed.sql`)، ثم نفّذه على المشروع.
- **صور المعاينة**: `npm run seed:images` يمر على البرومبتات المنشورة بلا صورة معاينة، يولّدها عبر Pollinations.ai، يرفعها لـ bucket `prompt-previews`، ويحدّث `preview_image_url`. يتطلب `SUPABASE_SERVICE_ROLE_KEY` في `.env.local` (محلياً فقط، غير مُستخدم من التطبيق).

## الاختبارات

```bash
npm test
```

تغطي: استبدال المتغيرات في البرومبت (`{{key}}`)، تعقيم قيم المتغيرات القادمة من العميل قبل إرسالها للنموذج، واختيار مزود التوليد.

## هيكل المجلدات (أبرز الملفات)

```
src/
  app/[locale]/            # كل الصفحات (مكتبة، صفحة برومبت، صوري، مفضلتي، إدارة، دخول)
  app/api/generate/        # مسار التوليد (يفرض الحد اليومي + يستدعي n8n)
  components/              # مكونات الواجهة
  i18n/                    # next-intl routing/navigation
  messages/{ar,en}.json    # كل نصوص الواجهة (بدون hardcoding)
  lib/providers/           # واجهة موحدة generateImage() — pollinations.ts / fal.ts
  lib/supabase/            # عملاء Supabase (server/client) + الأنواع المولّدة
  lib/data/                # استعلامات القراءة (prompts, user, admin)
supabase/migrations/       # كل الـ SQL migrations (تُطبَّق بالترتيب الزمني)
scripts/                   # seed-data.ts, generate-seed-sql.ts, seed-preview-images.ts
```

## ما يحتاج إعداداً يدوياً قبل الإطلاق

1. تفعيل Google OAuth provider في Supabase (أعلاه).
2. ضبط متغيرات البيئة في n8n وتفعيل (Publish) workflow "Generate Image"، ثم نسخ رابط الـ webhook.
3. (اختياري) تشغيل `npm run seed:images` لتوليد صور معاينة حقيقية للبرومبتات الستين.
4. للانتقال من Pollinations إلى fal.ai في الإنتاج: مفتاح `FAL_KEY` يوضع في n8n فقط (أبداً في متغيرات الواجهة).
