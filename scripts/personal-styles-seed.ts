// Seed data for the "الصور الشخصية" (Personal Photos) feature.
// The identity-preservation guardrail is appended at generation time in
// /api/personal/generate, not stored here, so prompt_body stays clean and
// editable from the admin panel.
export type PersonalStyleSeed = {
  slug: string;
  title_ar: string;
  title_en: string;
  tagline_ar: string;
  prompt_body: string;
  share_text_ar: string;
  category: "professional" | "cinematic" | "heritage" | "art" | "fun";
  sort_order: number;
};

const GENERIC_SHARE = (titleAr: string) =>
  `جرّبت ستايل "${titleAr}" على صورتي والنتيجة خيال 🤯 المنصة عربية ومجانية — ارفع صورتك وشوف بنفسك 👇`;

export const PERSONAL_STYLES: PersonalStyleSeed[] = [
  {
    slug: "linkedin-executive",
    title_ar: "هيدشوت لينكدإن الملياردير",
    title_en: "The Billionaire LinkedIn Headshot",
    tagline_ar: "صورة بروفايل تخلّي مدير التوظيف يوقف عندك.",
    prompt_body:
      "Transform the uploaded photo into a premium corporate headshot: tailored charcoal suit, crisp white shirt, soft studio key light with subtle rim light, blurred modern office background, shallow depth of field, shot on 85mm f/1.4, editorial retouching.",
    share_text_ar: "غيّرت صورة اللينكدإن… وبدأت الرسائل توصل 👔✨ اعملها لصورتك مجاناً في دقيقتين 👇",
    category: "professional",
    sort_order: 1,
  },
  {
    slug: "magazine-cover",
    title_ar: "غلاف مجلة رجال الأعمال",
    title_en: "Business Magazine Cover",
    tagline_ar: "أنت على غلاف فوربس القادم.",
    prompt_body:
      "Put the person from the uploaded photo on a luxury business magazine cover: confident pose, dark editorial background, dramatic Rembrandt lighting, bold masthead typography space at top, high-end fashion magazine color grading.",
    share_text_ar: "طلعت على غلاف مجلة 😎🔥 جرّب صورتك وشوف نفسك نجم الغلاف 👇",
    category: "professional",
    sort_order: 2,
  },
  {
    slug: "black-suit-luxury",
    title_ar: "بدلة سوداء وفخامة سينمائية",
    title_en: "Black Suit Cinematic Luxury",
    tagline_ar: "ستايل الأفلام… بوجهك أنت.",
    prompt_body:
      "Dress the person from the uploaded photo in a perfectly fitted black tuxedo, standing in a dim luxury hotel lobby with warm golden bokeh lights, cinematic teal-and-orange grade, confident subtle smirk, ultra realistic.",
    share_text_ar: "من سيلفي عادية → لقطة من فيلم 🎬 دورك: ارفع صورتك واختار الستايل 👇",
    category: "professional",
    sort_order: 3,
  },
  {
    slug: "golden-hour",
    title_ar: "بورتريه الساعة الذهبية",
    title_en: "Golden Hour Portrait",
    tagline_ar: "إضاءة الغروب اللي المصورين يدفعون عليها آلاف.",
    prompt_body:
      "Recreate the uploaded photo as a golden hour portrait: warm sunset backlight creating a glowing hair rim, sun flare, soft haze, rooftop city background, film grain, Kodak Portra 400 look.",
    share_text_ar: GENERIC_SHARE("بورتريه الساعة الذهبية"),
    category: "cinematic",
    sort_order: 4,
  },
  {
    slug: "bw-drama",
    title_ar: "أبيض وأسود درامي",
    title_en: "Dramatic Black & White",
    tagline_ar: "بورتريه فخم يشبه بوسترات هوليوود الكلاسيكية.",
    prompt_body:
      "Convert the uploaded photo into a dramatic black and white studio portrait: single hard side light, deep shadows, dark background, visible skin texture, fine art photography style, 4x5 large format look.",
    share_text_ar: GENERIC_SHARE("أبيض وأسود درامي"),
    category: "cinematic",
    sort_order: 5,
  },
  {
    slug: "night-rain",
    title_ar: "مشهد مطر ليلي",
    title_en: "Night Rain Scene",
    tagline_ar: "أنت بطل المشهد الأخير من الفيلم.",
    prompt_body:
      "Place the person from the uploaded photo in a cinematic night scene: standing under light rain, wet asphalt reflecting neon city lights, dark coat, moody blue-green grade, anamorphic lens flares, movie still frame.",
    share_text_ar: GENERIC_SHARE("مشهد مطر ليلي"),
    category: "cinematic",
    sort_order: 6,
  },
  {
    slug: "action-poster",
    title_ar: "بوستر فيلم أكشن",
    title_en: "Action Movie Poster",
    tagline_ar: "اسمك على البوستر… حرفياً.",
    prompt_body:
      "Design a blockbuster action movie poster starring the person from the uploaded photo: intense look, dust and sparks in the air, dramatic backlight, epic orange-teal grading, space for a bold movie title at the bottom.",
    share_text_ar: GENERIC_SHARE("بوستر فيلم أكشن"),
    category: "cinematic",
    sort_order: 7,
  },
  {
    slug: "gulf-royal",
    title_ar: "الزي الخليجي الملكي",
    title_en: "Royal Gulf Attire",
    tagline_ar: "كندورة وبشت وفخامة القصور.",
    prompt_body:
      "Dress the person from the uploaded photo in an elegant white kandura with a black and gold bisht, standing in a majestic Arabian palace hall with warm chandelier light, proud confident posture, ultra realistic royal portrait.",
    share_text_ar: GENERIC_SHARE("الزي الخليجي الملكي"),
    category: "heritage",
    sort_order: 8,
  },
  {
    slug: "desert-knight",
    title_ar: "فارس الصحراء",
    title_en: "Desert Knight",
    tagline_ar: "أنت وحصان أصيل وغروب الصحراء.",
    prompt_body:
      "Epic desert scene: the person from the uploaded photo in traditional Arabian attire standing beside a black Arabian horse at sunset, golden dunes, wind-blown fabric, cinematic wide shot, National Geographic quality.",
    share_text_ar: GENERIC_SHARE("فارس الصحراء"),
    category: "heritage",
    sort_order: 9,
  },
  {
    slug: "ottoman-classic",
    title_ar: "بورتريه عثماني كلاسيكي",
    title_en: "Classic Ottoman Portrait",
    tagline_ar: "لوحة تاريخية… بملامحك.",
    prompt_body:
      "Paint the person from the uploaded photo as a classical 19th century oil painting portrait: ornate traditional outfit, dark museum background, visible brush strokes, gilded frame vibe, Rembrandt lighting.",
    share_text_ar: GENERIC_SHARE("بورتريه عثماني كلاسيكي"),
    category: "heritage",
    sort_order: 10,
  },
  {
    slug: "ghibli",
    title_ar: "أسلوب استوديو جيبلي",
    title_en: "Studio Ghibli Style",
    tagline_ar: "الستايل اللي كسّر الإنترنت.",
    prompt_body:
      "Redraw the uploaded photo in Studio Ghibli anime style: soft watercolor backgrounds, gentle expression matching the original face, warm afternoon light, hand-drawn detail, keep recognizable facial likeness.",
    share_text_ar: GENERIC_SHARE("أسلوب استوديو جيبلي"),
    category: "art",
    sort_order: 11,
  },
  {
    slug: "pixar-3d",
    title_ar: "شخصية بيكسار 3D",
    title_en: "Pixar 3D Character",
    tagline_ar: "نسختك الكرتونية جاهزة لفيلمها الخاص.",
    prompt_body:
      "Turn the person from the uploaded photo into a Pixar-style 3D character: big expressive eyes keeping the original eye color, soft subsurface skin, cheerful studio lighting, movie-quality render, keep clear facial likeness.",
    share_text_ar: GENERIC_SHARE("شخصية بيكسار 3D"),
    category: "art",
    sort_order: 12,
  },
  {
    slug: "pop-art",
    title_ar: "بوب آرت جريء",
    title_en: "Bold Pop Art",
    tagline_ar: "أندي وارهول كان يتمنى صورتك.",
    prompt_body:
      "Convert the uploaded photo into bold pop art: high contrast posterized colors, halftone dots, comic outlines, 4-panel Warhol-style grid with different color schemes, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("بوب آرت جريء"),
    category: "art",
    sort_order: 13,
  },
  {
    slug: "watercolor",
    title_ar: "لوحة ألوان مائية",
    title_en: "Watercolor Painting",
    tagline_ar: "بورتريه رقيق يستحق الإطار.",
    prompt_body:
      "Repaint the uploaded photo as a delicate watercolor portrait: loose expressive brush strokes, paint drips, white paper background, soft pastel palette, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("لوحة ألوان مائية"),
    category: "art",
    sort_order: 14,
  },
  {
    slug: "cyberpunk",
    title_ar: "سايبربانك نيون",
    title_en: "Neon Cyberpunk",
    tagline_ar: "نسختك من عام 2077.",
    prompt_body:
      "Transform the person from the uploaded photo into a cyberpunk scene: neon pink and cyan rim lights on the face, futuristic jacket with glowing accents, rainy neon city street background, blade-runner mood, photorealistic.",
    share_text_ar: GENERIC_SHARE("سايبربانك نيون"),
    category: "art",
    sort_order: 15,
  },
  {
    slug: "action-figure",
    title_ar: "فيغرين أكشن فيجر",
    title_en: "Action Figure Toy",
    tagline_ar: "نسختك لعبة داخل علبة… التريند الأشهر.",
    prompt_body:
      "Create a realistic boxed action figure of the person from the uploaded photo: toy packaging with transparent window, accessories beside the figure (phone, coffee cup, laptop), product photography lighting, name label on the box, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("فيغرين أكشن فيجر"),
    category: "fun",
    sort_order: 16,
  },
  {
    slug: "retro-90s",
    title_ar: "ريترو التسعينات",
    title_en: "90s Retro Portrait",
    tagline_ar: "صورتك من ألبوم العيلة سنة 1995.",
    prompt_body:
      "Restyle the uploaded photo as a 1990s studio portrait: vintage airbrushed laser background, retro outfit, soft focus, slight film fade and grain, authentic 90s mall photography vibe, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("ريترو التسعينات"),
    category: "fun",
    sort_order: 17,
  },
  {
    slug: "astronaut",
    title_ar: "رائد فضاء",
    title_en: "Astronaut",
    tagline_ar: "أول سيلفي من المريخ باسمك.",
    prompt_body:
      "Put the person from the uploaded photo inside a realistic astronaut suit, helmet visor open showing the face clearly, Mars surface and orange sky behind, NASA photography realism, dramatic sunlight.",
    share_text_ar: GENERIC_SHARE("رائد فضاء"),
    category: "fun",
    sort_order: 18,
  },
  {
    slug: "superhero",
    title_ar: "البطل الخارق",
    title_en: "Superhero",
    tagline_ar: "مدينتك تحتاجك.",
    prompt_body:
      "Turn the person from the uploaded photo into an original cinematic superhero: sleek armored suit with subtle emblem, wind-blown cape, night city skyline behind, heroic low-angle shot, movie CGI quality, keep the real face.",
    share_text_ar: GENERIC_SHARE("البطل الخارق"),
    category: "fun",
    sort_order: 19,
  },
  // "football-star" (generic, no named team) was superseded by the five
  // team-specific styles below — it produced an arbitrary kit design since
  // nothing told the model which team to draw. Deactivated in the DB
  // rather than removed, so past generations still resolve.
  {
    slug: "football-star",
    title_ar: "لاعب كرة محترف",
    title_en: "Pro Football Player",
    tagline_ar: "صورتك الرسمية في النادي… وقّع العقد.",
    prompt_body:
      "Create an official football club player portrait of the person from the uploaded photo: professional kit, arms crossed, stadium tunnel background with dramatic spotlights, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("لاعب كرة محترف"),
    category: "fun",
    sort_order: 20,
  },
  {
    slug: "real-madrid-star",
    title_ar: "نجم ريال مدريد",
    title_en: "Real Madrid Star",
    tagline_ar: "قميص الملكي الأبيض... وأنت بطل الملعب.",
    prompt_body:
      "Create an official Real Madrid football club player portrait of the person from the uploaded photo: iconic all-white home kit with subtle navy and gold trim, arms crossed, confident pose, stadium tunnel background with dramatic spotlights and blurred crowd, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: "من سيلفي عادية لنجم ريال مدريد 👑⚽ جرّب صورتك بنفسك 👇",
    category: "fun",
    sort_order: 21,
  },
  {
    slug: "barcelona-star",
    title_ar: "نجم برشلونة",
    title_en: "Barcelona Star",
    tagline_ar: "الألوان البرشلونية... وأنت النجم.",
    prompt_body:
      "Create an official FC Barcelona football club player portrait of the person from the uploaded photo: iconic blue and garnet striped home kit, arms crossed, confident pose, stadium tunnel background with dramatic spotlights and blurred crowd, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: "من سيلفي عادية لنجم برشلونة 🔵🔴⚽ جرّب صورتك بنفسك 👇",
    category: "fun",
    sort_order: 22,
  },
  {
    slug: "morocco-star",
    title_ar: "نجم المنتخب المغربي",
    title_en: "Morocco National Team Star",
    tagline_ar: "أسود الأطلس... وأنت واحد منهم.",
    prompt_body:
      "Create an official Morocco national football team player portrait of the person from the uploaded photo: red kit with green trim, national team crest, arms crossed, confident pose, stadium background with Moroccan flag colors and blurred cheering crowd, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: "من سيلفي عادية لنجم المنتخب المغربي 🇲🇦⚽ جرّب صورتك بنفسك 👇",
    category: "fun",
    sort_order: 23,
  },
  {
    slug: "egypt-star",
    title_ar: "نجم المنتخب المصري",
    title_en: "Egypt National Team Star",
    tagline_ar: "الفراعنة... وأنت نجمهم الجديد.",
    prompt_body:
      "Create an official Egypt national football team player portrait of the person from the uploaded photo: red kit with black and white trim, national team crest, arms crossed, confident pose, stadium background with Egyptian flag colors and blurred cheering crowd, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: "من سيلفي عادية لنجم المنتخب المصري 🇪🇬⚽ جرّب صورتك بنفسك 👇",
    category: "fun",
    sort_order: 24,
  },
  {
    slug: "palestine-star",
    title_ar: "نجم منتخب فلسطين",
    title_en: "Palestine National Team Star",
    tagline_ar: "الكوفية والعلم... وأنت نجم المنتخب.",
    prompt_body:
      "Create a dignified official Palestine national football team player portrait of the person from the uploaded photo: kit in the colors of the Palestinian flag (black, white, green, red), national team crest, arms crossed, confident proud pose, stadium background with Palestinian flag colors and blurred cheering crowd, sports magazine retouching, keep exact facial likeness.",
    share_text_ar: "من سيلفي عادية لنجم منتخب فلسطين 🇵🇸⚽ جرّب صورتك بنفسك 👇",
    category: "fun",
    sort_order: 25,
  },
];
