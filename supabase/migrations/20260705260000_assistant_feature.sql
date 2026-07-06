-- AI chat assistant: recommends an existing published prompt from the
-- library based on a short conversation, then hands off to the prompt
-- detail page with variables pre-filled.

-- Generic per-feature admin-configurable JSON config. Doesn't replace
-- site_settings (flat marketing copy key/value) — this is for structured
-- feature toggles/limits/prompts that a future feature can also reuse.
create table if not exists public.feature_settings (
  key text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.feature_settings enable row level security;

create policy "feature settings are publicly readable"
  on public.feature_settings for select
  using (true);

create policy "only admins can write feature settings"
  on public.feature_settings for insert
  with check (is_admin());

create policy "only admins can update feature settings"
  on public.feature_settings for update
  using (is_admin());

insert into public.feature_settings (key, config) values (
  'assistant',
  jsonb_build_object(
    'is_enabled', true,
    'daily_limit', 20,
    'max_questions', 2,
    'system_prompt', 'أنت "مساعد التصميم" في منصة برومبتلي. مهمتك تساعد مستخدم عربي مبتدئ يوصل لأفضل برومبت من المكتبة.
القواعد:
- اسأل سؤال واحد أو اتنين كحد أقصى لتحديد: المناسبة/الغرض، والستايل المطلوب.
- بعدها رشّح برومبت واحد فقط من القائمة المرفقة (استخدم الـslug كما هو).
- ممنوع تخترع برومبت أو slug غير موجود في القائمة.
- لو مفيش برومبت مناسب إطلاقاً، رجّع type=fallback مع fallback_action=enhancer.
- املأ متغيرات البرومبت بقيم منطقية حسب كلام المستخدم.
- ردودك دايماً بالعربي، ودّية ومختصرة.
- أرجع JSON فقط بالشكل المحدد.',
    'starter_suggestions', jsonb_build_array('إعلان لمطعمي للعيد', 'لوجو لمتجر ملابس', 'بوست تخفيضات')
  )
)
on conflict (key) do nothing;

-- Conversation tracking, for the admin conversion-rate view. Requires
-- sign-in (consistent with every other AI feature in this app — enhancer,
-- image-to-prompt, generate — none support anonymous usage).
create table if not exists public.assistant_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  recommended_slug text,
  led_to_generation boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.assistant_sessions enable row level security;

create policy "own sessions"
  on public.assistant_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "admin reads all sessions"
  on public.assistant_sessions for select
  using (is_admin());

-- Daily usage, same shape/pattern as enhance_usage / image_to_prompt_usage.
create table if not exists public.assistant_usage (
  user_id uuid not null references public.profiles (id) on delete cascade,
  usage_date date not null default current_date,
  usage_count integer not null default 0,
  primary key (user_id, usage_date)
);

alter table public.assistant_usage enable row level security;

create or replace function public.try_increment_assistant_usage(
  p_user_id uuid,
  p_daily_limit integer default 20
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not authorized';
  end if;

  insert into public.assistant_usage (user_id, usage_date, usage_count)
  values (p_user_id, current_date, 0)
  on conflict (user_id, usage_date) do nothing;

  select usage_count into current_count
  from public.assistant_usage
  where user_id = p_user_id and usage_date = current_date
  for update;

  if current_count >= p_daily_limit then
    return false;
  end if;

  update public.assistant_usage
  set usage_count = usage_count + 1
  where user_id = p_user_id and usage_date = current_date;

  return true;
end;
$$;
