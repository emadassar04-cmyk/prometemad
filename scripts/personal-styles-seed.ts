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
  category: "professional" | "cinematic" | "heritage" | "art" | "fun" | "trending";
  sort_order: number;
  is_trending?: boolean;
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
  // "hug-younger-self" from the plan is intentionally omitted — it needs
  // two source photos (adult + childhood), which the single-file upload
  // flow and /api/personal-photos/generate don't support yet.
  {
    slug: "polaroid-flash",
    title_ar: "بولارويد الفلاش الليلي",
    title_en: "Night Flash Polaroid",
    tagline_ar: "صورة بولارويد كأنها التقطت أمس في التسعينات.",
    prompt_body:
      "Turn the uploaded photo into a vintage Polaroid picture: harsh direct flash at night, white Polaroid frame with a handwritten caption space, slight blur and film grain, curtain background, authentic instant-photo look, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("بولارويد الفلاش الليلي"),
    category: "trending",
    sort_order: 26,
    is_trending: true,
  },
  {
    slug: "old-money",
    title_ar: "أولد موني أرستقراطي",
    title_en: "Old Money Aesthetic",
    tagline_ar: "فخامة هادئة بلا شعارات… ستايل الطبقة العريقة.",
    prompt_body:
      "Restyle the person from the uploaded photo in old money aesthetic: beige cashmere sweater over shoulders, classic country club garden backdrop, soft overcast light, muted editorial color grade, Ralph Lauren campaign vibe, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("أولد موني أرستقراطي"),
    category: "trending",
    sort_order: 27,
  },
  {
    slug: "billboard-nyc",
    title_ar: "وجهك على بيلبورد تايمز سكوير",
    title_en: "Times Square Billboard",
    tagline_ar: "إعلانك الخاص وسط نيويورك.",
    prompt_body:
      "Show a giant glowing Times Square billboard at night displaying a stylish portrait of the person from the uploaded photo, crowds and yellow cabs below, rain reflections, cinematic wide shot, keep the face on the billboard clearly recognizable.",
    share_text_ar: GENERIC_SHARE("وجهك على بيلبورد تايمز سكوير"),
    category: "trending",
    sort_order: 28,
  },
  {
    slug: "private-jet",
    title_ar: "لايف ستايل الطائرة الخاصة",
    title_en: "Private Jet Lifestyle",
    tagline_ar: "مقعدك في الجيت الخاص جاهز.",
    prompt_body:
      "Place the person from the uploaded photo seated in a luxury private jet cabin: cream leather seats, champagne glass on the table, sunset through the oval window, elegant outfit, warm golden light, photorealistic, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("لايف ستايل الطائرة الخاصة"),
    category: "trending",
    sort_order: 29,
  },
  {
    slug: "marble-statue",
    title_ar: "تمثال رخامي في متحف",
    title_en: "Marble Museum Statue",
    tagline_ar: "خلّدوك في متحف اللوفر.",
    prompt_body:
      "Sculpt the person from the uploaded photo as a classical white marble statue displayed in a grand museum hall: accurate facial features carved in marble, dramatic spotlight, blurred visitors in background, ultra detailed sculpture texture.",
    share_text_ar: GENERIC_SHARE("تمثال رخامي في متحف"),
    category: "trending",
    sort_order: 30,
  },
  {
    slug: "lego-minifig",
    title_ar: "شخصية ليغو بالعلبة",
    title_en: "LEGO Minifigure",
    tagline_ar: "نسختك ليغو رسمية بعلبتها.",
    prompt_body:
      "Create a LEGO minifigure version of the person from the uploaded photo inside official LEGO box packaging: matching hairstyle and outfit, fun accessories, bright product photography, box shows the character name, playful colors, recognizable stylized face.",
    share_text_ar: GENERIC_SHARE("شخصية ليغو بالعلبة"),
    category: "trending",
    sort_order: 31,
  },
  {
    slug: "game-cover",
    title_ar: "غلاف لعبة فيديو",
    title_en: "Video Game Cover",
    tagline_ar: "أنت بطل لعبة العام.",
    prompt_body:
      "Design a AAA video game cover starring the person from the uploaded photo as the main character: stylized realistic game art, dramatic pose, explosive city background, bold game title space at top, console cover layout, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("غلاف لعبة فيديو"),
    category: "trending",
    sort_order: 32,
  },
  {
    slug: "winter-snow",
    title_ar: "بورتريه الثلج السينمائي",
    title_en: "Cinematic Winter Snow",
    tagline_ar: "أجواء الشتاء الأوروبي… معطف طويل وثلج يتساقط.",
    prompt_body:
      "Recreate the uploaded photo as a cinematic winter portrait: long dark wool coat, falling snowflakes, foggy breath, warm street lamps glowing in a European old town at dusk, shallow depth of field, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("بورتريه الثلج السينمائي"),
    category: "trending",
    sort_order: 33,
  },
  {
    slug: "lion-portrait",
    title_ar: "البورتريه الملكي مع الأسد",
    title_en: "Royal Lion Portrait",
    tagline_ar: "أنت والأسد… هيبة ما تتكرر.",
    prompt_body:
      "Epic portrait of the person from the uploaded photo standing calmly beside a majestic lion: dark smoky studio background, dramatic low-key lighting, elegant dark outfit, both looking at the camera, hyper realistic, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("البورتريه الملكي مع الأسد"),
    category: "trending",
    sort_order: 34,
  },
  {
    slug: "paris-film",
    title_ar: "فيلم 35mm في شوارع باريس",
    title_en: "Paris 35mm Film",
    tagline_ar: "لقطة عفوية بكاميرا فيلم من مقهى باريسي.",
    prompt_body:
      "Candid 35mm film photo of the person from the uploaded photo at a Parisian café terrace: morning light, croissant and espresso on the table, Haussmann buildings behind, Kodak Gold 200 film colors, natural grain, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("فيلم 35mm في شوارع باريس"),
    category: "trending",
    sort_order: 35,
  },
  {
    slug: "restore-old-photo",
    title_ar: "ترميم صورة قديمة",
    title_en: "Restore Old Photo",
    tagline_ar: "أعد الحياة لصور عائلتك القديمة — هدية تبكي أهلك.",
    prompt_body:
      "Restore and colorize the uploaded old damaged photo: remove scratches, dust and tears, sharpen facial details, natural realistic skin tones and colors, keep the original faces, clothing and composition exactly the same, museum-quality restoration.",
    share_text_ar: "رمّمت صورة أبوي القديمة ودمعت عيونه ❤️ جرب صور عائلتك 👇",
    category: "trending",
    sort_order: 36,
  },
  {
    slug: "samurai",
    title_ar: "الساموراي",
    title_en: "Samurai Warrior",
    tagline_ar: "محارب من اليابان القديمة… بوجهك.",
    prompt_body:
      "Turn the person from the uploaded photo into a samurai warrior: traditional detailed armor with shoulder guards, katana held with both hands, misty bamboo forest at dawn, cinematic rim light, ultra realistic, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("الساموراي"),
    category: "fun",
    sort_order: 37,
  },
  {
    slug: "medieval-knight",
    title_ar: "فارس العصور الوسطى",
    title_en: "Medieval Knight",
    tagline_ar: "درع كامل وسيف وقلعة خلفك.",
    prompt_body:
      "Dress the person from the uploaded photo as a medieval knight in polished steel plate armor, holding a longsword, stone castle courtyard behind, dramatic torchlight, epic fantasy realism, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("فارس العصور الوسطى"),
    category: "fun",
    sort_order: 38,
  },
  {
    slug: "king-throne",
    title_ar: "الملك على العرش",
    title_en: "King on the Throne",
    tagline_ar: "التاج والعرش… جلالتك.",
    prompt_body:
      "Portray the person from the uploaded photo as a king seated on an ornate golden throne: royal velvet robe, crown, grand palace hall with columns, dramatic cinematic lighting, oil-painting-level detail but photorealistic, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("الملك على العرش"),
    category: "fun",
    sort_order: 39,
  },
  {
    slug: "cowboy",
    title_ar: "كاوبوي الغرب الأمريكي",
    title_en: "Western Cowboy",
    tagline_ar: "غروب، غبار، وحزام مسدس.",
    prompt_body:
      "Restyle the person from the uploaded photo as a western cowboy: leather hat and duster coat, dusty frontier town at sunset, warm orange backlight, squinting confident look, cinematic western film still, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("كاوبوي الغرب الأمريكي"),
    category: "fun",
    sort_order: 40,
  },
  {
    slug: "gangster-1920s",
    title_ar: "غانغستر العشرينات",
    title_en: "1920s Gangster",
    tagline_ar: "بدلة صوفية وقبعة مسطحة وأجواء غامضة.",
    prompt_body:
      "Transform the person from the uploaded photo into a 1920s gangster: tweed three-piece suit, flat cap, pocket watch chain, foggy cobblestone industrial street at night, moody desaturated cinematic grade, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("غانغستر العشرينات"),
    category: "fun",
    sort_order: 41,
  },
  {
    slug: "ufc-poster",
    title_ar: "بوستر نزال UFC",
    title_en: "UFC Fight Poster",
    tagline_ar: "اسمك على بوستر النزال الرئيسي.",
    prompt_body:
      "Create a dramatic MMA fight event poster starring the person from the uploaded photo: fighter stance, subtle sweat and determination, dark arena spotlights, bold event typography space, sports poster grading, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("بوستر نزال UFC"),
    category: "fun",
    sort_order: 42,
  },
  {
    slug: "fighter-pilot",
    title_ar: "طيار حربي",
    title_en: "Fighter Pilot",
    tagline_ar: "توب غن… نسختك.",
    prompt_body:
      "Put the person from the uploaded photo in a fighter pilot flight suit and aviator sunglasses, standing on an aircraft carrier deck beside a fighter jet at golden hour, wind-blown, cinematic movie poster style, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("طيار حربي"),
    category: "fun",
    sort_order: 43,
  },
  {
    slug: "chef",
    title_ar: "شيف المطعم الفاخر",
    title_en: "Executive Chef",
    tagline_ar: "شيف ميشلان… والمطبخ مملكتك.",
    prompt_body:
      "Portray the person from the uploaded photo as an executive chef in a pristine white chef jacket, arms crossed in a high-end restaurant kitchen, flames and steam behind, editorial food-magazine lighting, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("شيف المطعم الفاخر"),
    category: "professional",
    sort_order: 44,
  },
  {
    slug: "neon-gel-studio",
    title_ar: "استوديو نيون ملون",
    title_en: "Neon Gel Studio",
    tagline_ar: "جلسة استوديو بإضاءة ملونة تكسر الفيد.",
    prompt_body:
      "Studio portrait of the person from the uploaded photo with dual color gel lighting: strong blue light from one side and hot pink from the other, dark background, light haze, fashion editorial pose, sharp details, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("استوديو نيون ملون"),
    category: "art",
    sort_order: 45,
  },
  {
    slug: "pencil-sketch",
    title_ar: "رسم قلم رصاص",
    title_en: "Pencil Sketch",
    tagline_ar: "بورتريه مرسوم يدوياً بدقة الفنانين.",
    prompt_body:
      "Convert the uploaded photo into a highly detailed graphite pencil sketch: realistic shading and cross-hatching, textured drawing paper, artist's hand and pencil visible at the corner finishing the drawing, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("رسم قلم رصاص"),
    category: "art",
    sort_order: 46,
  },
  {
    slug: "caricature",
    title_ar: "كاريكاتير احترافي",
    title_en: "Professional Caricature",
    tagline_ar: "نسختك المضحكة… برأس كبير وابتسامة أكبر.",
    prompt_body:
      "Create a friendly professional caricature of the person from the uploaded photo: slightly exaggerated head and features while staying clearly recognizable, vibrant digital painting style, simple color background, fun expression.",
    share_text_ar: GENERIC_SHARE("كاريكاتير احترافي"),
    category: "art",
    sort_order: 47,
  },
  {
    slug: "anime-hero",
    title_ar: "بطل أنمي شونين",
    title_en: "Shonen Anime Hero",
    tagline_ar: "حلقتك الأولى تبدأ الآن.",
    prompt_body:
      "Redraw the person from the uploaded photo as a shonen anime hero: dynamic pose, energy aura, spiky highlights in hair keeping original hairstyle recognizable, dramatic action background with speed lines, high quality anime key visual, keep facial likeness.",
    share_text_ar: GENERIC_SHARE("بطل أنمي شونين"),
    category: "art",
    sort_order: 48,
  },
  {
    slug: "passport-pro",
    title_ar: "صورة رسمية للوثائق",
    title_en: "Professional Passport Photo",
    tagline_ar: "صورة جواز/هوية مثالية بدون استوديو.",
    prompt_body:
      "Turn the uploaded photo into a professional ID/passport photo: plain white background, even soft studio lighting, neutral expression facing camera, formal shirt, sharp focus, official document photo standards, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("صورة رسمية للوثائق"),
    category: "professional",
    sort_order: 49,
  },
  {
    slug: "wedding-groom",
    title_ar: "العريس يوم الزفاف",
    title_en: "Wedding Day Groom",
    tagline_ar: "إطلالة يوم العمر.",
    prompt_body:
      "Portray the person from the uploaded photo as an elegant groom on his wedding day: classic black tuxedo with boutonniere, luxurious wedding venue with warm candlelight and floral arch, cinematic romantic mood, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("العريس يوم الزفاف"),
    category: "cinematic",
    sort_order: 50,
  },
  {
    slug: "graduation",
    title_ar: "يوم التخرج",
    title_en: "Graduation Day",
    tagline_ar: "القبعة والروب ولحظة الفخر.",
    prompt_body:
      "Show the person from the uploaded photo as a university graduate: black cap and gown, holding a diploma, sunlit campus courtyard, confetti in the air, proud smile, warm celebratory tones, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("يوم التخرج"),
    category: "cinematic",
    sort_order: 51,
  },
  {
    slug: "luxury-car",
    title_ar: "مع السيارة الفاخرة",
    title_en: "Luxury Supercar",
    tagline_ar: "أنت ومفتاح اللامبو.",
    prompt_body:
      "Place the person from the uploaded photo leaning on a matte black luxury supercar at night: city lights bokeh, stylish outfit, low cinematic angle, reflections on the car body, high-end automotive photography, keep exact facial likeness.",
    share_text_ar: GENERIC_SHARE("مع السيارة الفاخرة"),
    category: "fun",
    sort_order: 52,
  },
  // Batch 4 — July 2026 trends (49-62 in the source planning doc).
  {
    slug: "funko-pop",
    title_ar: "فانكو بوب بالعلبة",
    title_en: "Funko Pop Figure",
    tagline_ar: "رأس كبير وعيون كرتونية… نسختك المجسّمة الشهيرة.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, create a collectible chibi vinyl figure of this person displayed inside its retail collector box. The figure has the signature oversized head, large round black eyes, and tiny body — but the hairstyle, beard shape, skin tone and outfit must clearly match the person in the photo so the figure is instantly recognizable. The box: premium cardboard with a large transparent window, the person's silhouette icon and a name plate on the front, subtle geometric pattern. Scene: the boxed figure standing on a wooden collector's shelf, soft diffused product-photography lighting, shallow depth of field, blurred shelf of other boxes behind. Ultra sharp render, vertical 3:4 format, no real brand logos anywhere.",
    share_text_ar: GENERIC_SHARE("فانكو بوب بالعلبة"),
    category: "fun",
    sort_order: 53,
    is_trending: true,
  },
  {
    slug: "claymation",
    title_ar: "شخصية صلصال (كلايميشن)",
    title_en: "Claymation Character",
    tagline_ar: "كأنك خرجت من فيلم أنيميشن صلصال.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, sculpt this person as a handcrafted stop-motion clay character. Preserve the exact face structure, hairstyle, beard and skin tone translated into smooth modeling clay with subtle fingerprint impressions and tiny tool marks. Outfit: a miniature fabric-textured version of casual clothes. Set: a charming handbuilt miniature diorama room with cardboard furniture and painted backdrop, warm tungsten studio lighting with soft shadows, gentle depth of field like a real stop-motion film frame. Whimsical, warm and instantly recognizable as the same person. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("شخصية صلصال (كلايميشن)"),
    category: "art",
    sort_order: 54,
  },
  {
    slug: "sticker-pack",
    title_ar: "حزمة ستيكرات تشيبي",
    title_en: "Chibi Sticker Pack",
    tagline_ar: "ستيكراتك الخاصة للواتساب — 6 انفعالات بوجهك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, design a sticker pack sheet of six chibi cartoon versions of this person arranged in a 2x3 grid. Each sticker keeps the same recognizable hairstyle, beard shape, eyebrows and skin tone, with big expressive eyes. Six distinct emotions: laughing hard, angry with steam, crying dramatically, heart eyes in love, confident thumbs up, sleepy with a yawn. Style: clean 2D digital illustration, bold thick white outline around every sticker, soft flat pastel background, consistent character design across all six. High resolution, vertical 3:4 sheet.",
    share_text_ar: GENERIC_SHARE("حزمة ستيكرات تشيبي"),
    category: "fun",
    sort_order: 55,
    is_trending: true,
  },
  {
    slug: "disco-70s",
    title_ar: "ديسكو السبعينات",
    title_en: "70s Disco",
    tagline_ar: "بنطال شارلستون وكرة الديسكو تلمع فوقك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, transport this person into a 1970s disco club — same exact face, hairstyle, beard and skin tone, do not alter identity. Wardrobe: tailored bell-bottom suit in deep burgundy with a wide-collar patterned silk shirt and platform shoes. Scene: mid-dance confident pose under a spinning mirror ball, colorful light beams in pink, orange and teal sweeping across a glowing dance floor, blurred dancers behind. Authentic 1970s film photography look: Kodak-style warm colors, visible grain, slight halation on lights. Shot on 50mm, waist-up composition, vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("ديسكو السبعينات"),
    category: "cinematic",
    sort_order: 56,
  },
  {
    slug: "victorian",
    title_ar: "شوارع لندن الفيكتورية",
    title_en: "Victorian London",
    tagline_ar: "سافر لعام 1890… معطف طويل وشوارع مبللة وفوانيس غاز.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, place this person in a Victorian London street at night, 1890s — same exact face, beard and features, do not change identity or age. Wardrobe: long dark wool overcoat, waistcoat with a silver pocket-watch chain, black top hat held or worn naturally. Scene: fog rolling between gas lamps, wet cobblestones reflecting warm lamplight, a horse carriage silhouette and iron railings in the misty background. Cinematic period-drama realism: moody sepia-leaning grade, soft volumetric light through fog, sharp facial detail against atmospheric depth. 85mm portrait lens look, vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("شوارع لندن الفيكتورية"),
    category: "heritage",
    sort_order: 57,
  },
  {
    slug: "future-2090",
    title_ar: "نسختك من عام 2090",
    title_en: "Year 2090",
    tagline_ar: "كيف ستبدو صورتك بعد 65 سنة من التكنولوجيا؟",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, portray this person as a citizen of the year 2090 — identical face, hairstyle, beard and skin tone, no identity change. Wardrobe: minimalist high-tech jacket with subtle glowing seams in cool white-blue, matte smart fabric. Scene: standing on an elevated walkway of a gleaming utopian city at dusk — flying vehicles streaking light trails, translucent holographic interfaces floating near his hand, soft reflections on glass towers. Clean cinematic sci-fi photography: crisp detail, cool color palette with warm skin tones preserved, gentle rim light from holograms. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("نسختك من عام 2090"),
    category: "cinematic",
    sort_order: 58,
    is_trending: true,
  },
  {
    slug: "film-noir",
    title_ar: "المحقق نوار",
    title_en: "Film Noir Detective",
    tagline_ar: "دخان، ظلال، وقضية غامضة تنتظرك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, create a classic 1940s film noir portrait of this person as a private detective — exact same face and features, no beautifying. Wardrobe: belted trench coat with raised collar, fedora tilted low but keeping the face clearly visible and lit. Scene: dark office at night, dramatic venetian-blind shadow stripes falling across the face and wall, thin smoke curling through a hard beam of light from the side. High-contrast black and white, deep blacks and glowing highlights, sharp skin texture, large-format vintage photography feel. Chest-up composition, vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("المحقق نوار"),
    category: "cinematic",
    sort_order: 59,
  },
  {
    slug: "underwater",
    title_ar: "بورتريه تحت الماء",
    title_en: "Underwater Portrait",
    tagline_ar: "لقطة سريالية تحبس الأنفاس… حرفياً.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, create a surreal fine-art underwater portrait of this person — identical facial features, calm serene expression, eyes open. Scene: suspended in clear turquoise water, golden sun rays piercing down from the surface, tiny air bubbles rising, an elegant white shirt floating and rippling with the current, soft caustic light patterns dancing across the face. Dreamy ethereal mood, realistic water physics, natural skin tones with a subtle cool cast, professional underwater photography with sharp focus on the face. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("بورتريه تحت الماء"),
    category: "art",
    sort_order: 60,
  },
  {
    slug: "double-exposure",
    title_ar: "دبل إكسبوجر فني",
    title_en: "Artistic Double Exposure",
    tagline_ar: "صورتك تحكي قصتين في لقطة واحدة.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, create a fine-art double exposure poster. The sharp side profile silhouette of this person — recognizable nose, beard and hairline — filled with a second exposure: a misty pine forest at dawn, low fog between trees, a flock of birds flying toward the top of the silhouette where the image dissolves into scattered particles. Background: clean minimal off-white with generous negative space. Muted cinematic palette of deep greens and soft grays, gallery-print quality, elegant and emotional. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("دبل إكسبوجر فني"),
    category: "art",
    sort_order: 61,
  },
  {
    slug: "pixel-art",
    title_ar: "بكسل آرت الألعاب القديمة",
    title_en: "Retro Pixel Art",
    tagline_ar: "نسختك من أتاري وسيغا.",
    prompt_body:
      'Using the uploaded photo as the strict identity reference, convert this person into a detailed 16-bit pixel art game character — the pixel face must clearly echo his real hairstyle, beard shape and skin tone. Composition: character select screen of a retro arcade fighting game — the character in a confident idle pose on the left, a pixelated portrait frame of his face on the right, health bar, score counter and "PLAYER 1 — READY" text as UI elements. Vibrant limited retro palette, crisp clean pixels with no blur, subtle CRT scanline effect. Vertical 3:4 format.',
    share_text_ar: GENERIC_SHARE("بكسل آرت الألعاب القديمة"),
    category: "art",
    sort_order: 62,
    is_trending: true,
  },
  {
    slug: "streetwear",
    title_ar: "ستريت وير إديتوريال",
    title_en: "Streetwear Editorial",
    tagline_ar: "إطلالة مجلات الموضة الشبابية.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, shoot a high-fashion streetwear editorial of this person — identical face, beard and hairstyle, confident relaxed expression. Wardrobe: oversized heavyweight hoodie in washed neutral tone, wide cargo pants, clean sneakers, no visible brand logos. Scene: narrow urban alley with colorful graffiti walls, late-afternoon hard sunlight cutting diagonal shadows, light haze in the air. Magazine-quality fashion photography: strong pose, 35mm lens, rich contrast with lifted blacks, sharp fabric texture, editorial color grade. Full-body or three-quarter composition, vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("ستريت وير إديتوريال"),
    category: "professional",
    sort_order: 63,
  },
  {
    slug: "pirate-captain",
    title_ar: "قبطان القراصنة",
    title_en: "Pirate Captain",
    tagline_ar: "سفينتك وكنزك وبحر غاضب خلفك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, transform this person into a legendary pirate captain — exact same facial features and beard, weathered but recognizable. Wardrobe: aged leather tricorn hat, long dark captain's coat with brass buttons, loose linen shirt, leather gloves gripping the ship's wheel. Scene: deck of a wooden galleon in a dramatic storm — rain streaks, torn sails and ropes whipping in the wind, huge waves and lightning on the horizon, lantern glow warming one side of the face. Epic cinematic realism, movie-still quality, dramatic low angle. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("قبطان القراصنة"),
    category: "fun",
    sort_order: 64,
  },
  {
    slug: "f1-driver",
    title_ar: "سائق فورمولا 1",
    title_en: "F1 Driver",
    tagline_ar: "خوذتك تحت إبطك وسيارة السباق خلفك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, portray this person as a professional race driver — identical face, hairstyle and beard, focused confident look. Wardrobe: fitted racing suit in deep red and white with generic geometric patches (no real sponsor or team logos), holding a glossy helmet under one arm. Scene: pit lane at golden hour, a sleek formula race car blurred behind him, heat shimmer over the asphalt, grandstand crowd out of focus in warm light. Sports-magazine photography: 85mm lens, shallow depth of field, crisp detail on the face and suit, dynamic warm grade. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("سائق فورمولا 1"),
    category: "fun",
    sort_order: 65,
  },
  {
    slug: "red-carpet",
    title_ar: "السجادة الحمراء",
    title_en: "Red Carpet Premiere",
    tagline_ar: "فلاشات المصورين كلها عليك.",
    prompt_body:
      "Using the uploaded photo as the strict identity reference, capture this person at a glamorous movie premiere — exact same face and features, confident subtle smile. Wardrobe: impeccably tailored midnight-blue tuxedo with black satin lapels, crisp white shirt, black bow tie, luxury watch. Scene: walking the red carpet, dozens of paparazzi camera flashes freezing the moment from both sides, elegant blurred step-and-repeat backdrop with abstract patterns (no real logos), velvet ropes. Celebrity editorial photography: sharp flash-lit look with glowing highlights, rich contrast, star-quality retouching that keeps real skin texture. Vertical 3:4 format.",
    share_text_ar: GENERIC_SHARE("السجادة الحمراء"),
    category: "cinematic",
    sort_order: 66,
  },
];
