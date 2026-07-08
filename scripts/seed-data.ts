export type SeedVariable = {
  key: string;
  label_ar: string;
  label_en: string;
  default: string;
  type?: "text" | "select";
  options?: string[];
};

export type SeedPrompt = {
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  prompt_text_en: string;
  prompt_display_ar: string;
  variables: SeedVariable[];
  style: string;
  model: string;
  tags: string[];
  is_featured?: boolean;
};

export type SeedCategory = {
  slug: string;
  name_ar: string;
  name_en: string;
  icon: string;
  sort_order: number;
  prompts: SeedPrompt[];
};

const MODEL = "flux-schnell";

export const seedCategories: SeedCategory[] = [
  {
    slug: "product-shots",
    name_ar: "تصوير منتجات",
    name_en: "Product Shots",
    icon: "package",
    sort_order: 1,
    prompts: [
      {
        slug: "amazon-listing-white-bg",
        title_ar: "صورة منتج لمنصات البيع (أمازون ونون)",
        title_en: "Marketplace Listing Photo (Amazon-Style)",
        description_ar: "صورة المنتج الأساسية الأكثر طلباً لأي متجر إلكتروني — خلفية بيضاء نقية تطابق شروط منصات البيع",
        description_en: "The single most-requested product shot for online sellers — pure white background matching marketplace listing requirements",
        prompt_text_en:
          "professional e-commerce product photography of {{product}}, centered composition filling 85% of frame, pure seamless white background (RGB 255,255,255), even three-point studio lighting eliminating harsh shadows, soft contact shadow directly beneath the product only, tack-sharp focus with crisp edge definition, true-to-life color accuracy, marketplace-listing-ready quality, 8k resolution",
        prompt_display_ar:
          "تصوير منتج احترافي لمنصات البيع الإلكتروني لـ{{product}}، تكوين مركزي يملأ 85% من الإطار، خلفية بيضاء نقية متصلة (أبيض كامل)، إضاءة استوديو ثلاثية متساوية بلا ظلال قاسية، ظل تلامس خفيف أسفل المنتج فقط، تركيز حاد جداً مع حواف واضحة، دقة ألوان مطابقة للواقع، جودة جاهزة لإدراج المنتج في المتاجر الإلكترونية، دقة 8K",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a glass perfume bottle" },
        ],
        style: "studio",
        model: MODEL,
        tags: ["منتجات", "متجر إلكتروني", "أمازون"],
        is_featured: true,
      },
      {
        slug: "lifestyle-in-use-scene",
        title_ar: "منتج في مشهد استخدام حقيقي",
        title_en: "Product in a Real-Life Usage Scene",
        description_ar: "المنتج وهو يُستخدم فعلياً ضمن بيئة يومية واقعية — يرفع الثقة ومعدل التحويل",
        description_en: "The product actively in use within an authentic everyday setting — boosts trust and conversion",
        prompt_text_en:
          "lifestyle product photography, {{product}} placed naturally in active use on a {{surface}}, soft directional window light with gentle falloff, warm inviting color grading, shallow depth of field with creamy bokeh, 50mm lens perspective, editorial commercial photography, true-to-life textures, magazine-quality composition, authentic everyday moment",
        prompt_display_ar:
          "تصوير منتج بأسلوب حياتي، {{product}} موضوع بشكل طبيعي أثناء الاستخدام الفعلي على {{surface}}، إضاءة نافذة موجهة ناعمة بتلاشٍ تدريجي، تدرج ألوان دافئ وجذاب، عمق ميدان ضحل مع بوكيه ناعم، منظور عدسة 50 مم، تصوير تجاري تحريري، خامات وملمس واقعي، تكوين بجودة المجلات، لحظة يومية أصيلة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a ceramic coffee cup" },
          { key: "surface", label_ar: "السطح", label_en: "Surface", default: "wooden breakfast table" },
        ],
        style: "lifestyle",
        model: MODEL,
        tags: ["منتجات", "lifestyle"],
      },
      {
        slug: "levitating-hero-ad-shot",
        title_ar: "منتج عائم بتأثير جاذبية صفرية",
        title_en: "Levitating Hero Ad Shot",
        description_ar: "أكثر تأثير بصري طلباً في إعلانات المنتجات — يوقف التمرير فوراً على السوشيال ميديا",
        description_en: "The most-requested visual effect in product ads — an instant scroll-stopper on social media",
        prompt_text_en:
          "{{product}} levitating in mid-air frozen at the peak of motion, zero gravity effect, dynamic scattered elements orbiting around it, dramatic multi-point studio lighting with rim light separation, smooth gradient {{background_color}} background, high-end advertising photography, crisp sharp focus on the product, motion-frozen precision, premium campaign quality",
        prompt_display_ar:
          "{{product}} يطفو في الهواء متجمداً في ذروة الحركة، تأثير انعدام الجاذبية، عناصر متناثرة ديناميكية تدور حوله، إضاءة استوديو درامية متعددة الاتجاهات مع فصل بضوء حافة (rim light)، خلفية متدرجة ناعمة باللون {{background_color}}، تصوير إعلاني راقٍ، تركيز حاد جداً على المنتج، دقة تجميد الحركة، جودة حملة إعلانية فاخرة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a sneaker" },
          { key: "background_color", label_ar: "لون الخلفية", label_en: "Background color", default: "deep purple" },
        ],
        style: "dramatic",
        model: MODEL,
        tags: ["منتجات", "إعلان"],
      },
      {
        slug: "flatlay-instagram-grid",
        title_ar: "تنسيق منتجات من الأعلى لإنستغرام",
        title_en: "Top-Down Flat Lay for Instagram",
        description_ar: "التنسيق الأعلى طلباً لمنشورات الفيد والريلز — ترتيب أنيق من زاوية علوية",
        description_en: "The top-requested layout for feed and Reels posts — elegant top-down arrangement",
        prompt_text_en:
          "flat lay photography shot directly from above at 90 degrees, {{product}} arranged neatly alongside {{props}}, soft {{background_color}} surface, diffused natural light with no harsh shadows, minimal balanced aesthetic, precise symmetrical composition with generous negative space, high resolution, styled editorial flat lay quality",
        prompt_display_ar:
          "تصوير من الأعلى مباشرة بزاوية 90 درجة (Flat Lay)، {{product}} مرتب بعناية مع {{props}}، سطح بلون {{background_color}}، إضاءة طبيعية موزعة بلا ظلال قاسية، تصميم بسيط متوازن، تكوين متماثل دقيق مع مساحات فارغة كافية، دقة عالية، جودة تحريرية منسقة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "skincare bottles" },
          { key: "props", label_ar: "إكسسوارات مرافقة", label_en: "Props", default: "dried flowers and a linen towel" },
          { key: "background_color", label_ar: "لون الخلفية", label_en: "Background color", default: "beige" },
        ],
        style: "minimal",
        model: MODEL,
        tags: ["منتجات", "flatlay", "إنستغرام"],
      },
      {
        slug: "unboxing-hand-hold-shot",
        title_ar: "منتج ممسوك باليد (لحظة فتح الصندوق)",
        title_en: "Unboxing Hand-Hold Shot",
        description_ar: "لقطة قريبة تُظهر حجم المنتج وملمسه — من أكثر أنماط تسويق المحتوى طلباً",
        description_en: "A close-up showing the product's true scale and texture — one of the most-requested content-marketing styles",
        prompt_text_en:
          "close-up macro photo of a hand naturally holding {{product}}, realistic skin texture and natural tones, soft diffused daylight, gently blurred background with shallow depth of field, authentic unboxing moment, fine surface detail on both hand and product, sharp focal point, high-end lifestyle commercial quality",
        prompt_display_ar:
          "لقطة قريبة ماكرو ليد تمسك {{product}} بشكل طبيعي، ملمس بشرة واقعي وألوان طبيعية، ضوء نهار ناعم موزع، خلفية ضبابية خفيفة بعمق ميدان ضحل، لحظة فتح صندوق أصيلة، تفاصيل سطحية دقيقة لليد والمنتج معاً، نقطة تركيز حادة، جودة تجارية حياتية راقية",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a smartphone box" },
        ],
        style: "lifestyle",
        model: MODEL,
        tags: ["منتجات", "unboxing"],
      },
      {
        slug: "dynamic-liquid-splash-shot",
        title_ar: "منتج مع تناثر سائل ديناميكي",
        title_en: "Dynamic Liquid Splash Shot",
        description_ar: "تأثير قوي ومطلوب بكثرة لمنتجات المشروبات ومستحضرات التجميل والعناية",
        description_en: "A high-demand dramatic effect for beverages, cosmetics, and skincare products",
        prompt_text_en:
          "{{product}} with dynamic {{liquid}} splash frozen at 1/8000th of a second, dramatic dark studio background, high-contrast rim lighting sculpting the droplets, ultra high speed photography, crisp crystal-clear droplets with realistic refraction, commercial beverage/cosmetics campaign quality, tack-sharp focus",
        prompt_display_ar:
          "{{product}} مع تناثر {{liquid}} متجمد بسرعة تصوير فائقة (1/8000 ثانية)، خلفية استوديو داكنة درامية، إضاءة حافة عالية التباين تُبرز شكل القطرات، تصوير عالي السرعة احترافي، قطرات واضحة تماماً كالكريستال مع انكسار ضوئي واقعي، جودة حملة تجارية للمشروبات ومستحضرات التجميل، تركيز حاد جداً",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a cosmetic jar" },
          { key: "liquid", label_ar: "السائل", label_en: "Liquid", default: "milk" },
        ],
        style: "dramatic",
        model: MODEL,
        tags: ["منتجات", "splash"],
      },
      {
        slug: "packaging-mockup-3d-render",
        title_ar: "موك أب تغليف ثلاثي الأبعاد",
        title_en: "3D Packaging Mockup",
        description_ar: "معاينة واقعية للتغليف قبل الطباعة — أساسي لأي علامة تجارية جديدة تطلق منتجاً",
        description_en: "A realistic packaging preview before print — essential for any brand launching a new product",
        prompt_text_en:
          "photorealistic 3D packaging mockup of a {{product}} box, {{color}} label design with clean typography space, resting on a neutral matte surface, soft studio lighting with a subtle reflection below, precise front-facing angle, physically accurate materials and print texture, high resolution product render, retail-ready presentation quality",
        prompt_display_ar:
          "موك أب ثلاثي الأبعاد واقعي لعلبة تغليف {{product}}، تصميم ملصق بلون {{color}} مع مساحة خط واضحة، موضوعة على سطح مطفي محايد، إضاءة استوديو ناعمة مع انعكاس خفيف أسفلها، زاوية أمامية دقيقة، خامات وطباعة واقعية فيزيائياً، عرض منتج بدقة عالية، جودة عرض جاهزة للتجزئة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a snack" },
          { key: "color", label_ar: "اللون الأساسي", label_en: "Primary color", default: "green and gold" },
        ],
        style: "studio",
        model: MODEL,
        tags: ["منتجات", "تغليف"],
      },
      {
        slug: "macro-texture-detail-shot",
        title_ar: "لقطة ماكرو لتفاصيل جودة المنتج",
        title_en: "Macro Quality-Detail Shot",
        description_ar: "لقطة قريبة جداً تُبرز الخامة والجودة — الأكثر طلباً لمنتجات الفخامة والعناية والمجوهرات",
        description_en: "An extreme close-up highlighting material and craftsmanship — the top request for luxury, skincare, and jewelry brands",
        prompt_text_en:
          "extreme macro close-up photograph of {{product}}, revealing fine surface texture, material grain, and craftsmanship detail, single dramatic directional light source with a soft reflector fill, razor-thin depth of field with silky bokeh falloff, luxury product photography quality, hyper-detailed and tack-sharp on the focal point",
        prompt_display_ar:
          "تصوير ماكرو شديد القرب لـ{{product}}، يُظهر الملمس السطحي الدقيق وتفاصيل الخامة والحرفية، مصدر ضوء واحد درامي موجه مع عاكس تعبئة ناعم، عمق ميدان شديد الضحالة ببوكيه حريري، جودة تصوير منتجات فاخرة، دقة فائقة التفاصيل وحدة تركيز على النقطة المحورية",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a gold watch clasp" },
        ],
        style: "macro",
        model: MODEL,
        tags: ["منتجات", "فخامة", "ماكرو"],
      },
      {
        slug: "model-wearing-demo-shot",
        title_ar: "منتج على عارض/عارضة أثناء الاستخدام",
        title_en: "Product Demo on a Model",
        description_ar: "المنتج معروض على شخص حقيقي أثناء الاستخدام — الأكثر طلباً لإعلانات الأزياء والعناية والإكسسوارات",
        description_en: "The product shown worn or used by a real person — the top request for fashion, beauty, and accessory ads",
        prompt_text_en:
          "commercial advertising photograph of a {{model_type}} wearing/using {{product}}, shot on a real DSLR camera, natural confident pose with subtle asymmetry, soft flattering studio lighting with a gentle rim light, visible skin texture with natural pores, individual hair strands, clean {{background_color}} backdrop, sharp focus on the product with the model in complementary soft focus, unretouched real-photo quality, no airbrushing, no cgi, no plastic skin, high-end fashion-campaign quality, authentic skin and fabric texture",
        prompt_display_ar:
          "صورة إعلانية تجارية لـ{{model_type}} يرتدي/يستخدم {{product}}، مصورة بكاميرا DSLR حقيقية، وضعية واثقة طبيعية بعدم تناظر خفيف، إضاءة استوديو ناعمة مُجملة مع ضوء حافة خفيف، ملمس بشرة طبيعي بمسام ظاهرة، خصل شعر فردية، خلفية نظيفة بلون {{background_color}}، تركيز حاد على المنتج مع تركيز ناعم مكمّل على العارض، جودة صورة حقيقية غير مُنعّمة، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، جودة حملة أزياء راقية، ملمس بشرة وقماش أصيل",
        variables: [
          { key: "model_type", label_ar: "نوع العارض", label_en: "Model type", default: "a young woman" },
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "gold hoop earrings" },
          { key: "background_color", label_ar: "لون الخلفية", label_en: "Background color", default: "soft cream" },
        ],
        style: "editorial",
        model: MODEL,
        tags: ["منتجات", "أزياء", "إعلان"],
      },
      {
        slug: "outdoor-golden-hour-shot",
        title_ar: "منتج بإضاءة الساعة الذهبية الخارجية",
        title_en: "Outdoor Golden Hour Product Shot",
        description_ar: "مظهر طبيعي دافئ خارجي — الأكثر طلباً لمنتجات العناية الطبيعية والصحة والطعام",
        description_en: "A warm natural outdoor look — the top request for organic, wellness, and food products",
        prompt_text_en:
          "{{product}} placed among natural elements like weathered stones, moss, and green leaves, warm outdoor golden hour side lighting, organic earthy color palette, shallow depth of field with a softly blurred natural backdrop, editorial nature photography, authentic textures, serene wellness-brand mood",
        prompt_display_ar:
          "{{product}} موضوع وسط عناصر طبيعية كحجارة متآكلة، طحالب، وأوراق شجر خضراء، إضاءة جانبية دافئة من الساعة الذهبية الخارجية، لوحة ألوان ترابية عضوية، عمق ميدان ضحل مع خلفية طبيعية ضبابية ناعمة، تصوير طبيعي تحريري، خامات أصيلة، أجواء هادئة تناسب علامات العناية والصحة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "an organic soap bar" },
        ],
        style: "natural",
        model: MODEL,
        tags: ["منتجات", "طبيعي"],
      },
    ],
  },
  {
    slug: "social-ads",
    name_ar: "إعلانات سوشيال ميديا",
    name_en: "Social Media Ads",
    icon: "megaphone",
    sort_order: 2,
    prompts: [
      {
        slug: "instagram-square-promo-post",
        title_ar: "منشور ترويجي مربع لإنستغرام",
        title_en: "Square Instagram Promo Post",
        description_ar: "المقاس والتصميم الأكثر طلباً لأي حملة ترويجية على إنستغرام وفيسبوك",
        description_en: "The most-requested format and layout for any Instagram or Facebook promo campaign",
        prompt_text_en:
          "square 1:1 format social media advertisement for {{business}}, bold {{color}} color scheme with strong visual hierarchy, generous empty space reserved for text overlay, modern flat design, high contrast, scroll-stopping composition, clean vector-quality shapes, marketing poster precision, crisp print-ready resolution",
        prompt_display_ar:
          "إعلان سوشيال ميديا بمقاس مربع 1:1 لـ{{business}}، ألوان جريئة بدرجة {{color}} مع تسلسل بصري واضح، مساحة فارغة واسعة مخصصة للنص، تصميم مسطح عصري، تباين عالٍ، تكوين يوقف التمرير فوراً، أشكال بجودة فيكتور نظيفة، دقة بوستر تسويقي، دقة طباعة عالية",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a coffee shop" },
          { key: "color", label_ar: "اللون الأساسي", label_en: "Primary color", default: "orange and cream" },
        ],
        style: "flat design",
        model: MODEL,
        tags: ["إعلان", "سوشيال ميديا"],
        is_featured: true,
      },
      {
        slug: "flash-sale-discount-banner",
        title_ar: "بانر تخفيضات فلاش سيل",
        title_en: "Flash Sale Discount Banner",
        description_ar: "بانر حماسي عالي التحويل لعروض التخفيضات المحدودة — من أعلى التصاميم طلباً في مواسم البيع",
        description_en: "A high-conversion, high-energy banner for limited-time discounts — one of the most-requested designs during sale seasons",
        prompt_text_en:
          "vibrant sale banner design, large bold '{{discount}}' text placeholder as the clear focal point, dynamic diagonal shapes guiding the eye, smooth {{color}} gradient background, confetti and motion-burst elements, exciting high-energy retail promotion style, crisp vector precision, print and digital-ready quality",
        prompt_display_ar:
          "تصميم بانر تخفيضات نابض بالحياة، مساحة نصية كبيرة وجريئة لنسبة الخصم '{{discount}}' كنقطة تركيز واضحة، أشكال قطرية ديناميكية توجّه النظر، خلفية متدرجة ناعمة بلون {{color}}، عناصر قصاصات ورقية وانفجار حركي، أسلوب ترويجي عالي الطاقة للتجزئة، دقة فيكتور نظيفة، جودة جاهزة للطباعة والرقمي",
        variables: [
          { key: "discount", label_ar: "نسبة الخصم", label_en: "Discount", default: "50% OFF" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "red and yellow" },
        ],
        style: "bold",
        model: MODEL,
        tags: ["إعلان", "تخفيضات"],
      },
      {
        slug: "app-feature-phone-mockup-ad",
        title_ar: "إعلان ميزة تطبيق على موك أب هاتف",
        title_en: "App Feature Mockup Ad",
        description_ar: "أساسي لكل تطبيق يريد الترويج لميزة جديدة بشكل احترافي على المتاجر ومنصات الإعلانات",
        description_en: "Essential for any app promoting a new feature professionally on app stores and ad platforms",
        prompt_text_en:
          "modern smartphone mockup floating at a slight 3D angle, displaying a pixel-precise clean {{app_type}} app interface, soft smooth gradient {{color}} background, realistic drop shadow beneath the device, premium tech marketing style, minimal and polished, product-launch quality render",
        prompt_display_ar:
          "موك أب هاتف ذكي عصري معلق بزاوية ثلاثية أبعاد خفيفة، يعرض واجهة تطبيق {{app_type}} نظيفة ودقيقة البكسل، خلفية متدرجة ناعمة بلون {{color}}، ظل واقعي أسفل الجهاز، أسلوب تسويقي تقني فاخر، بسيط ومصقول، جودة رندر إطلاق منتج",
        variables: [
          { key: "app_type", label_ar: "نوع التطبيق", label_en: "App type", default: "food delivery" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "blue and white" },
        ],
        style: "tech",
        model: MODEL,
        tags: ["إعلان", "تطبيقات"],
      },
      {
        slug: "before-after-comparison-ad",
        title_ar: "مقارنة قبل وبعد",
        title_en: "Before & After Comparison Ad",
        description_ar: "من أقوى تصاميم الإقناع في السوق — يُثبت النتيجة بصرياً بشكل مباشر",
        description_en: "One of the most persuasive ad formats on the market — proves the result visually, instantly",
        prompt_text_en:
          "clean split-screen comparison image, left half showing {{before}}, right half showing {{after}}, sharp precise dividing line, bright even lighting matched identically on both sides, professional before-and-after marketing layout, high-detail realism on both halves, trustworthy commercial quality",
        prompt_display_ar:
          "صورة مقارنة نظيفة مقسومة الشاشة، النصف الأيسر يُظهر {{before}}، النصف الأيمن يُظهر {{after}}، خط فاصل دقيق وحاد، إضاءة ساطعة متطابقة تماماً في الجانبين، تخطيط تسويقي احترافي لقبل وبعد، واقعية عالية التفاصيل في الجانبين، جودة تجارية موثوقة",
        variables: [
          { key: "before", label_ar: "الحالة قبل", label_en: "Before state", default: "a dull faded car exterior" },
          { key: "after", label_ar: "الحالة بعد", label_en: "After state", default: "the same car, polished and glossy" },
        ],
        style: "clean",
        model: MODEL,
        tags: ["إعلان", "قبل وبعد"],
      },
      {
        slug: "ugc-style-testimonial-selfie",
        title_ar: "سيلفي تقييم بأسلوب محتوى المستخدمين (UGC)",
        title_en: "UGC-Style Testimonial Selfie",
        description_ar: "الاتجاه الأعلى طلباً عالمياً حالياً — يبدو كصورة حقيقية من عميل حقيقي، يرفع الثقة أكثر من أي إعلان مصمم",
        description_en: "The single hottest global ad trend right now — looks like a genuine customer photo, and out-converts polished studio ads",
        prompt_text_en:
          "authentic UGC-style selfie photo of a {{person}} holding {{product}} casually, shot on a phone camera with natural imperfect framing, everyday home or car interior background, soft ambient indoor lighting, genuine happy candid expression, slightly grainy realistic phone-camera quality, unpolished authentic social-proof aesthetic, no studio lighting look",
        prompt_display_ar:
          "صورة سيلفي أصيلة بأسلوب محتوى المستخدمين (UGC) لـ{{person}} يمسك {{product}} بشكل عفوي، ملتقطة بكاميرا هاتف بتأطير طبيعي غير مثالي، خلفية منزل أو سيارة يومية، إضاءة داخلية محيطة ناعمة، تعبير سعيد عفوي صادق، جودة كاميرا هاتف واقعية بحبيبات خفيفة، طابع غير مصقول يعكس مصداقية اجتماعية حقيقية، بلا مظهر إضاءة استوديو",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young woman" },
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a skincare serum bottle" },
        ],
        style: "ugc",
        model: MODEL,
        tags: ["إعلان", "UGC", "ترند"],
        is_featured: true,
      },
      {
        slug: "story-countdown-launch-teaser",
        title_ar: "ستوري عد تنازلي لإطلاق منتج",
        title_en: "Countdown Story for Product Launch",
        description_ar: "تصميم ستوري رأسي مثير يعلن عن اقتراب إطلاق جديد",
        description_en: "Vertical story design building excitement for a new launch",
        prompt_text_en:
          "vertical 9:16 story format design, dramatic glowing countdown timer graphic as the centerpiece, dark {{color}} background with softly glowing particle bokeh, clear teaser text space, futuristic launch-announcement style, high-energy anticipation mood, crisp premium render quality",
        prompt_display_ar:
          "تصميم ستوري بصيغة رأسية 9:16، رسم عداد تنازلي متوهج درامي كنقطة مركزية، خلفية داكنة بلون {{color}} مع جزيئات بوكيه متوهجة ناعمة، مساحة نص تشويقي واضحة، أسلوب إعلان إطلاق مستقبلي، أجواء ترقب عالية الطاقة، جودة رندر فاخرة نظيفة",
        variables: [
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "midnight blue" },
        ],
        style: "futuristic",
        model: MODEL,
        tags: ["إعلان", "ستوري"],
      },
      {
        slug: "carousel-tips-infographic-slide",
        title_ar: "شريحة كاروسيل نصائح تعليمية",
        title_en: "Educational Carousel Tips Slide",
        description_ar: "تنسيق المحتوى التعليمي الأعلى طلباً على إنستغرام ولينكدإن لجذب المتابعين",
        description_en: "The most-requested educational content format on Instagram and LinkedIn for growing an audience",
        prompt_text_en:
          "clean educational carousel slide design, bold oversized number '{{number}}' as the dominant graphic element, {{color}} background with soft geometric accent shapes, generous clearly organized text space, modern infographic style with strong visual hierarchy, crisp flat-design precision",
        prompt_display_ar:
          "تصميم شريحة كاروسيل تعليمية نظيفة، رقم '{{number}}' كبير وبارز كعنصر رسومي مهيمن، خلفية بلون {{color}} مع أشكال هندسية ناعمة مساندة، مساحة نص واسعة ومنظمة بوضوح، أسلوب إنفوجرافيك عصري بتسلسل بصري قوي، دقة تصميم مسطح نظيفة",
        variables: [
          { key: "number", label_ar: "الرقم", label_en: "Number", default: "1" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "teal" },
        ],
        style: "infographic",
        model: MODEL,
        tags: ["إعلان", "كاروسيل"],
      },
      {
        slug: "limited-stock-urgency-design",
        title_ar: "تصميم إلحاح الكمية المحدودة",
        title_en: "Limited Stock Urgency Design",
        description_ar: "تصميم يحفّز الشراء الفوري بشعور الندرة — يرفع معدل التحويل في الحملات المدفوعة",
        description_en: "A design that drives urgency and immediate purchase action — boosts conversion in paid campaigns",
        prompt_text_en:
          "urgent retail promotion design, bold '{{message}}' typography placeholder as the dominant focal point, sharp warning-stripe pattern accents, high-alert {{color}} color scheme, dynamic energetic diagonal composition, scroll-stopping impact, crisp print and digital-ready precision",
        prompt_display_ar:
          "تصميم ترويجي عاجل للتجزئة، مساحة نصية بارزة ومهيمنة لعبارة '{{message}}'، لمسات نمط خطوط تحذيرية حادة، تدرج ألوان {{color}} عالي التنبيه، تكوين قطري ديناميكي حيوي، تأثير يوقف التمرير فوراً، دقة نظيفة جاهزة للطباعة والرقمي",
        variables: [
          { key: "message", label_ar: "الرسالة", label_en: "Message", default: "LAST CHANCE" },
          { key: "color", label_ar: "اللون", label_en: "Color", default: "red and black" },
        ],
        style: "bold",
        model: MODEL,
        tags: ["إعلان", "عرض محدود"],
      },
      {
        slug: "five-star-review-highlight-ad",
        title_ar: "إعلان إبراز تقييم خمس نجوم",
        title_en: "Five-Star Review Highlight Ad",
        description_ar: "من أكثر الإعلانات طلباً لبناء الثقة السريعة قبل الشراء",
        description_en: "One of the most-requested ad types for building instant pre-purchase trust",
        prompt_text_en:
          "eye-catching review highlight card design, five prominent gold stars as the visual anchor, soft {{color}} background, refined quotation accent graphic, clean modern layout with clearly defined space for review text, trust-building commercial polish",
        prompt_display_ar:
          "تصميم بطاقة إبراز تقييم لافت، خمس نجوم ذهبية بارزة كنقطة ارتكاز بصرية، خلفية ناعمة بلون {{color}}، لمسة رسومية راقية لعلامة اقتباس، تخطيط عصري نظيف مع مساحة محددة بوضوح لنص التقييم، لمسة تجارية تبني الثقة",
        variables: [
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "mint green" },
        ],
        style: "minimal",
        model: MODEL,
        tags: ["إعلان", "تقييمات"],
      },
      {
        slug: "meta-feed-ad-cta-cover",
        title_ar: "غلاف إعلان فيسبوك/إنستغرام بزر دعوة لإجراء",
        title_en: "Meta Feed Ad Cover with CTA Button",
        description_ar: "التصميم القياسي الأكثر استخداماً في حملات فيسبوك وإنستغرام الممولة",
        description_en: "The standard, most-used layout in paid Facebook and Instagram ad campaigns",
        prompt_text_en:
          "polished paid social feed ad cover for {{business}}, bold headline text space at the top, {{product}} as the clear hero visual in the center, rounded call-to-action button graphic at the bottom reading '{{cta}}', clean brand-safe {{color}} palette, high-contrast professional ad-platform-ready composition",
        prompt_display_ar:
          "غلاف إعلان فيد مدفوع مصقول لـ{{business}}، مساحة عنوان بارز في الأعلى، {{product}} كعنصر بصري مركزي واضح، زر دعوة لإجراء بحواف دائرية أسفل التصميم يحمل نص '{{cta}}'، لوحة ألوان {{color}} نظيفة وآمنة للعلامة التجارية، تكوين عالي التباين جاهز لمنصات الإعلانات",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "an online store" },
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a leather wallet" },
          { key: "cta", label_ar: "نص الزر", label_en: "Button text", default: "SHOP NOW" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "black and gold" },
        ],
        style: "clean",
        model: MODEL,
        tags: ["إعلان", "فيسبوك", "إنستغرام"],
      },
    ],
  },
  {
    slug: "branding-logos",
    name_ar: "هوية بصرية ولوجوهات",
    name_en: "Branding & Logos",
    icon: "sparkles",
    sort_order: 3,
    prompts: [
      {
        slug: "minimal-lettermark-logo-design",
        title_ar: "لوجو حرفي بسيط",
        title_en: "Minimal Lettermark Logo",
        description_ar: "أسلوب اللوجو الأكثر طلباً للشركات الناشئة — أنيق وقابل للتحجيم على كل الوسائط",
        description_en: "The most-requested logo style for startups — elegant and scalable across every medium",
        prompt_text_en:
          "minimal lettermark logo design featuring the letter '{{letter}}', precise geometric clean lines with perfect symmetry, refined {{color}} color palette, flat scalable vector style, centered on a plain white background, modern timeless brand identity, print and app-icon ready quality",
        prompt_display_ar:
          "تصميم لوجو حرفي بسيط يعتمد على الحرف '{{letter}}'، خطوط هندسية دقيقة بتناظر مثالي، لوحة ألوان راقية {{color}}، أسلوب فيكتور مسطح قابل للتحجيم، في وسط خلفية بيضاء بسيطة، هوية علامة تجارية عصرية خالدة، جودة جاهزة للطباعة وأيقونات التطبيقات",
        variables: [
          { key: "letter", label_ar: "الحرف", label_en: "Letter", default: "N" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "navy and gold" },
        ],
        style: "flat vector",
        model: MODEL,
        tags: ["لوجو", "هوية"],
        is_featured: true,
      },
      {
        slug: "abstract-geometric-mark-logo",
        title_ar: "شعار رمزي تجريدي",
        title_en: "Abstract Symbol Mark",
        description_ar: "رمز تجريدي يعكس مفهوم النشاط التجاري بأسلوب عالمي عصري",
        description_en: "Abstract symbol representing the brand's concept in a modern global style",
        prompt_text_en:
          "abstract geometric logo mark representing {{concept}}, minimal flat vector shapes with precise clean lines, smooth {{color}} gradient, deliberately balanced negative space, professional scalable brand mark on a plain white background, timeless modern identity quality",
        prompt_display_ar:
          "شعار هندسي تجريدي يمثل مفهوم {{concept}}، أشكال فيكتور مسطحة بخطوط دقيقة ونظيفة، تدرج لوني ناعم {{color}}، توازن مدروس في المساحات الفارغة، علامة تجارية احترافية قابلة للتحجيم على خلفية بيضاء، جودة هوية عصرية خالدة",
        variables: [
          { key: "concept", label_ar: "المفهوم", label_en: "Concept", default: "growth and connection" },
          { key: "color", label_ar: "التدرج اللوني", label_en: "Gradient", default: "green to blue" },
        ],
        style: "abstract",
        model: MODEL,
        tags: ["لوجو", "تجريدي"],
      },
      {
        slug: "friendly-mascot-character-logo",
        title_ar: "شعار شخصية كرتونية (ماسكوت)",
        title_en: "Mascot Character Logo",
        description_ar: "شخصية ودودة تمثل العلامة التجارية — الأكثر طلباً للعلامات الموجهة للعائلات والأطفال",
        description_en: "A friendly character representing the brand — the top request for family- and kid-facing brands",
        prompt_text_en:
          "friendly cartoon mascot logo of a {{animal}}, bold clean outlines, flat vibrant {{color}} colors, warm playful expression, centered vector illustration on a plain white background, scalable brand mascot style, polished professional finish",
        prompt_display_ar:
          "شعار ماسكوت كرتوني ودود على شكل {{animal}}، خطوط خارجية بارزة ونظيفة، ألوان مسطحة زاهية {{color}}، تعبير مرح ودافئ، رسم فيكتور مركزي على خلفية بيضاء، أسلوب ماسكوت قابل للتحجيم، لمسة نهائية احترافية مصقولة",
        variables: [
          { key: "animal", label_ar: "الحيوان", label_en: "Animal", default: "a fox" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "orange and white" },
        ],
        style: "mascot",
        model: MODEL,
        tags: ["لوجو", "ماسكوت"],
      },
      {
        slug: "vintage-emblem-badge-logo",
        title_ar: "شعار شارة تقليدية (إمبلم)",
        title_en: "Classic Emblem Badge Logo",
        description_ar: "شعار دائري كلاسيكي يوحي بالثقة والتراث — مطلوب كثيراً لمحمصات القهوة والمطاعم التراثية",
        description_en: "A classic circular badge conveying trust and heritage — heavily requested for coffee roasteries and heritage restaurants",
        prompt_text_en:
          "vintage emblem badge logo design for {{business}}, precise circular border with fine ornamental detailing, {{color}} monochrome palette, centered icon of {{icon}}, flat scalable vector illustration on a plain white background, heritage-quality craftsmanship feel",
        prompt_display_ar:
          "تصميم شعار شارة كلاسيكية (إمبلم) لـ{{business}}، حدود دائرية دقيقة بتفاصيل زخرفية أنيقة، لوحة ألوان أحادية {{color}}، أيقونة مركزية لـ{{icon}}، رسم فيكتور مسطح قابل للتحجيم على خلفية بيضاء، إحساس حرفي تراثي عالي الجودة",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a coffee roastery" },
          { key: "icon", label_ar: "الرمز المركزي", label_en: "Central icon", default: "a coffee bean" },
          { key: "color", label_ar: "اللون", label_en: "Color", default: "dark brown" },
        ],
        style: "emblem",
        model: MODEL,
        tags: ["لوجو", "شارة"],
      },
      {
        slug: "business-card-mockup-scene",
        title_ar: "موك أب بطاقة عمل",
        title_en: "Business Card Mockup",
        description_ar: "عرض واقعي لتصميم بطاقة العمل — ضروري لكل عرض هوية بصرية أمام العميل",
        description_en: "A realistic mockup of a business card design — essential for every brand-identity presentation",
        prompt_text_en:
          "photorealistic business card mockup, two cards featuring a {{color}} minimal design, placed on a {{surface}}, soft natural directional lighting, shallow depth of field with a softly blurred background, professional branding photography, physically accurate paper texture and print finish",
        prompt_display_ar:
          "موك أب واقعي لبطاقة عمل، بطاقتان بتصميم بسيط بلون {{color}}، موضوعتان على {{surface}}، إضاءة طبيعية موجهة ناعمة، عمق ميدان ضحل مع خلفية ضبابية ناعمة، تصوير هوية بصرية احترافي، خامة ورق ولمسة طباعة واقعية فيزيائياً",
        variables: [
          { key: "color", label_ar: "اللون", label_en: "Color", default: "black and gold" },
          { key: "surface", label_ar: "السطح", label_en: "Surface", default: "a marble table" },
        ],
        style: "mockup",
        model: MODEL,
        tags: ["هوية", "بطاقة عمل"],
      },
      {
        slug: "modern-app-icon-design",
        title_ar: "تصميم أيقونة تطبيق",
        title_en: "Modern App Icon Design",
        description_ar: "أيقونة تطبيق حديثة بزوايا دائرية وألوان متدرجة — مطلوبة لكل إطلاق تطبيق جديد",
        description_en: "A modern rounded app icon with gradient colors — required for every new app launch",
        prompt_text_en:
          "modern mobile app icon design, rounded square superellipse shape, simple {{symbol}} symbol precisely centered, smooth {{color}} gradient background, flat minimal style, pixel-perfect edges, iOS/Android app store submission quality",
        prompt_display_ar:
          "تصميم أيقونة تطبيق جوال عصرية، شكل مربع بزوايا دائرية (superellipse)، رمز {{symbol}} بسيط في المنتصف بدقة، خلفية متدرجة ناعمة بلون {{color}}، أسلوب مسطح بسيط، حواف دقيقة بالبكسل، جودة جاهزة لمتاجر iOS وAndroid",
        variables: [
          { key: "symbol", label_ar: "الرمز", label_en: "Symbol", default: "a chat bubble" },
          { key: "color", label_ar: "التدرج اللوني", label_en: "Gradient", default: "purple to pink" },
        ],
        style: "flat design",
        model: MODEL,
        tags: ["هوية", "أيقونة"],
      },
      {
        slug: "storefront-signage-mockup-scene",
        title_ar: "موك أب لافتة واجهة متجر",
        title_en: "Storefront Signage Mockup",
        description_ar: "عرض الشعار على واجهة متجر واقعية — من أقوى الطرق لبيع الهوية البصرية لصاحب النشاط",
        description_en: "The logo displayed on a realistic storefront — one of the most persuasive ways to sell a brand identity to a business owner",
        prompt_text_en:
          "photorealistic storefront signage mockup for {{business}}, modern architectural shop exterior, clean {{color}} signage board with clear logo placement space, natural daytime lighting with accurate shadows, architectural photography style, high-detail realistic materials",
        prompt_display_ar:
          "موك أب واقعي للافتة واجهة متجر لـ{{business}}، واجهة محل معمارية عصرية، لوحة لافتة نظيفة بلون {{color}} مع مساحة واضحة لوضع الشعار، إضاءة نهارية طبيعية بظلال دقيقة، أسلوب تصوير معماري، خامات واقعية عالية التفاصيل",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a bakery" },
          { key: "color", label_ar: "لون اللافتة", label_en: "Signage color", default: "warm cream and wood" },
        ],
        style: "mockup",
        model: MODEL,
        tags: ["هوية", "واجهة متجر"],
      },
      {
        slug: "brand-color-palette-board",
        title_ar: "لوحة ألوان الهوية البصرية",
        title_en: "Brand Color Palette Board",
        description_ar: "عرض منظم لألوان الهوية البصرية — عنصر أساسي في أي دليل هوية احترافي",
        description_en: "An organized presentation of the brand's color identity — a core piece of any professional brand guideline",
        prompt_text_en:
          "clean brand style guide color palette board, five precisely arranged color swatches in {{color}} tones, minimal refined typography labels, professional branding presentation layout, plain white background, print-ready design-system quality",
        prompt_display_ar:
          "لوحة عرض ألوان دليل الهوية البصرية بتصميم نظيف، خمس عينات ألوان مرتبة بدقة بدرجات {{color}}، تسميات نصية أنيقة بسيطة، تخطيط عرض احترافي للهوية، خلفية بيضاء، جودة نظام تصميم جاهزة للطباعة",
        variables: [
          { key: "color", label_ar: "الدرجات اللونية", label_en: "Color tones", default: "warm earthy" },
        ],
        style: "presentation",
        model: MODEL,
        tags: ["هوية", "ألوان"],
      },
      {
        slug: "social-profile-avatar-logo",
        title_ar: "لوجو صورة بروفايل للسوشيال ميديا",
        title_en: "Social Media Profile Avatar Logo",
        description_ar: "لوجو دائري مصغّر مصمم خصيصاً ليبدو واضحاً كصورة بروفايل — من أعلى الطلبات بحثاً على جوجل",
        description_en: "A compact circular logo designed specifically to read clearly as a tiny profile picture — one of the highest-searched requests on Google",
        prompt_text_en:
          "simple bold circular profile picture logo design for {{business}}, high contrast {{color}} palette that stays legible at small sizes, single clean centered icon or initial, no fine details that disappear when scaled down, flat vector style, plain background, optimized for Instagram/TikTok/WhatsApp avatar use",
        prompt_display_ar:
          "تصميم لوجو دائري بسيط وجريء لصورة البروفايل لـ{{business}}، لوحة ألوان {{color}} عالية التباين تبقى واضحة بالأحجام الصغيرة، أيقونة أو حرف مركزي واحد نظيف، بلا تفاصيل دقيقة تختفي عند التصغير، أسلوب فيكتور مسطح، خلفية بسيطة، محسّن للاستخدام كصورة بروفايل على إنستغرام وتيك توك وواتساب",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a fitness studio" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "black and lime green" },
        ],
        style: "flat vector",
        model: MODEL,
        tags: ["لوجو", "بروفايل", "سوشيال ميديا"],
        is_featured: true,
      },
      {
        slug: "branded-tshirt-merch-mockup",
        title_ar: "موك أب تيشيرت بالهوية التجارية",
        title_en: "Branded T-Shirt Merch Mockup",
        description_ar: "عرض الشعار على منتج ملبوس واقعي — ترند صاعد قوي في تصميم البضائع الترويجية (ميرتش)",
        description_en: "The logo shown on a realistic wearable product — a strongly rising trend in branded merch design",
        prompt_text_en:
          "photorealistic t-shirt mockup, a {{color}} shirt worn on a person with the {{business}} logo printed cleanly centered on the chest, natural fabric folds and texture, soft studio lighting, plain neutral background, realistic screen-print finish, apparel-branding presentation quality",
        prompt_display_ar:
          "موك أب واقعي لتيشيرت، قميص بلون {{color}} يرتديه شخص مع طباعة شعار {{business}} بوضوح في المنتصف على الصدر، طيات قماش وملمس طبيعي، إضاءة استوديو ناعمة، خلفية محايدة بسيطة، لمسة طباعة سيلك سكرين واقعية، جودة عرض ملابس بالهوية التجارية",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a streetwear brand" },
          { key: "color", label_ar: "لون القميص", label_en: "Shirt color", default: "black" },
        ],
        style: "mockup",
        model: MODEL,
        tags: ["هوية", "ميرتش", "تيشيرت"],
      },
    ],
  },
  {
    slug: "portraits",
    name_ar: "بورتريه واقعي",
    name_en: "Realistic Portraits",
    icon: "user",
    sort_order: 4,
    prompts: [
      {
        slug: "ai-linkedin-headshot",
        title_ar: "صورة شخصية احترافية لينكدإن (هيدشوت بالذكاء الاصطناعي)",
        title_en: "AI LinkedIn Professional Headshot",
        description_ar: "الأكثر بحثاً على جوجل عالمياً في فئة البورتريه — بديل فوري لجلسة تصوير احترافية مكلفة",
        description_en: "The single most globally Google-searched portrait category — an instant substitute for an expensive professional photo session",
        prompt_text_en:
          "professional corporate headshot portrait of a {{person}}, wearing {{outfit}}, neutral gray studio background, soft even three-point lighting, shot on a Canon EOS R5 with an 85mm f1.4 lens, confident authentic expression with natural facial asymmetry, visible skin pores and subtle texture, individual hair strands, unretouched real-photo quality, sharp eye focus, no airbrushing, no cgi, no plastic skin, high-end LinkedIn-quality photography",
        prompt_display_ar:
          "صورة بورتريه احترافية لـ{{person}}، يرتدي {{outfit}}، خلفية استوديو رمادية محايدة، إضاءة ثلاثية الاتجاه ناعمة متساوية، مصورة بكاميرا Canon EOS R5 وعدسة 85 مم f1.4، تعبير واثق وأصيل بعدم تناظر طبيعي في الوجه، مسام بشرة ظاهرة وملمس دقيق، خصل شعر فردية واضحة، جودة صورة حقيقية غير مُنعّمة، تركيز حاد على العينين، بدون تنعيم مصطنع، بدون رندر CGI، بدون مظهر بلاستيكي، تصوير بجودة LinkedIn الاحترافية",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a businesswoman" },
          { key: "outfit", label_ar: "الزي", label_en: "Outfit", default: "a tailored navy blazer" },
        ],
        style: "corporate",
        model: MODEL,
        tags: ["بورتريه", "أعمال", "هيدشوت"],
        is_featured: true,
      },
      {
        slug: "cinematic-golden-hour-portrait",
        title_ar: "بورتريه سينمائي بإضاءة الغروب",
        title_en: "Cinematic Golden Hour Portrait",
        description_ar: "بورتريه بإضاءة الغروب وأجواء سينمائية — من أكثر أنماط البورتريه بحثاً للمحتوى الشخصي",
        description_en: "A portrait with golden hour lighting and cinematic mood — one of the most-searched portrait styles for personal content",
        prompt_text_en:
          "cinematic portrait of a {{person}}, golden hour sunset lighting, warm rim light separating the subject from the background, shallow depth of field with a smoothly blurred outdoor background, shot on a real DSLR camera, visible skin pores and natural texture, realistic flyaway hair strands catching the light, subtle film grain, unretouched candid authenticity, no airbrushing, no cgi, no plastic skin, teal-and-orange inspired color grading, moody atmospheric mood, professional 85mm lens photography",
        prompt_display_ar:
          "بورتريه سينمائي لـ{{person}}، إضاءة غروب الشمس الذهبية، ضوء حافة دافئ يفصل الشخص عن الخلفية، عمق ميدان ضحل مع خلفية خارجية ضبابية ناعمة، مصورة بكاميرا DSLR حقيقية، مسام بشرة ظاهرة وملمس طبيعي، خصل شعر طائرة واقعية يلمعها الضوء، حبيبات فيلم خفيفة، أصالة عفوية غير مُنعّمة، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، تدرج ألوان مستوحى من السماوي والبرتقالي، أجواء درامية غامضة، تصوير احترافي بعدسة 85 مم",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young man" },
        ],
        style: "cinematic",
        model: MODEL,
        tags: ["بورتريه", "سينمائي"],
      },
      {
        slug: "studio-beauty-glow-portrait",
        title_ar: "بورتريه تجميلي في الاستوديو",
        title_en: "Studio Beauty Portrait",
        description_ar: "بورتريه ناعم يبرز نضارة البشرة — أساسي لإعلانات التجميل والعناية بالبشرة",
        description_en: "A soft glowing portrait highlighting skin — essential for beauty and skincare advertising",
        prompt_text_en:
          "beauty studio portrait of a {{person}}, shot on a real camera with a soft beauty-dish light, naturally glowing skin with realistic subsurface scattering and fine visible pores, gentle catchlight in the eyes, individual hair strands, clean {{background_color}} background, minimal fresh makeup, sharp macro-level facial detail, no waxy or plastic texture, no cgi, high-end real cosmetics-advertising photography, color-accurate skin tones",
        prompt_display_ar:
          "بورتريه تجميلي في الاستوديو لـ{{person}}، مصورة بكاميرا حقيقية بإضاءة طبق تجميل ناعمة، بشرة متوهجة طبيعياً بملمس واقعي ومسام دقيقة ظاهرة، بريق خفيف في العينين، خصل شعر فردية واضحة، خلفية نظيفة بلون {{background_color}}، مكياج بسيط منعش، تفاصيل وجه دقيقة جداً، بدون ملمس شمعي أو بلاستيكي، بدون CGI، تصوير إعلاني حقيقي راقٍ لمستحضرات التجميل، دقة ألوان بشرة واقعية",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a woman" },
          { key: "background_color", label_ar: "لون الخلفية", label_en: "Background color", default: "soft pink" },
        ],
        style: "beauty",
        model: MODEL,
        tags: ["بورتريه", "تجميل"],
      },
      {
        slug: "traditional-gulf-attire-portrait",
        title_ar: "بورتريه بالزي التراثي الخليجي",
        title_en: "Traditional Gulf Attire Portrait",
        description_ar: "بورتريه يبرز الزي التراثي بإضاءة فاخرة — الأكثر طلباً محلياً في مناسبات اليوم الوطني والأعياد",
        description_en: "A portrait highlighting traditional attire with elegant lighting — the top local request for National Day and holiday occasions",
        prompt_text_en:
          "elegant portrait of a {{person}} wearing traditional {{attire}}, shot on a real DSLR camera, rich warm directional lighting, natural skin texture with visible pores and tone variation, individual hair and beard strand detail, ornate patterned background, richly detailed fabric texture and embroidery, unretouched authentic photography, no cgi, no plastic skin, cultural heritage photography, high production quality, dignified composed posture",
        prompt_display_ar:
          "بورتريه أنيق لـ{{person}} يرتدي {{attire}} التراثي، مصورة بكاميرا DSLR حقيقية، إضاءة موجهة دافئة وفاخرة، ملمس بشرة طبيعي بمسام ظاهرة وتدرج لوني واقعي، تفاصيل شعر ولحية فردية، خلفية بزخارف مزركشة، تفاصيل قماش وتطريز دقيقة جداً، تصوير أصيل غير مُنعّم، بدون CGI، بدون مظهر بلاستيكي، تصوير تراثي ثقافي، جودة إنتاج عالية، وقفة متزنة ووقورة",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a man" },
          { key: "attire", label_ar: "الزي", label_en: "Attire", default: "a bisht over a white thobe" },
        ],
        style: "cultural",
        model: MODEL,
        tags: ["بورتريه", "تراث"],
      },
      {
        slug: "graduation-cap-gown-portrait",
        title_ar: "بورتريه تخرج بقبعة وردائه",
        title_en: "Graduation Cap & Gown Portrait",
        description_ar: "بورتريه احتفالي موسمي عالي الطلب مع كل موسم تخرج جامعي",
        description_en: "A celebratory seasonal portrait in high demand every university graduation season",
        prompt_text_en:
          "joyful graduation portrait of a {{person}} wearing a cap and gown, confidently holding a rolled diploma, shot on a real DSLR camera, soft golden hour outdoor lighting on a university campus backdrop, natural skin texture with visible pores, authentic asymmetric proud smile, individual hair strands, genuine unretouched candid moment, no airbrushing, no cgi, shallow depth of field with warm bokeh, authentic celebratory documentary photography quality",
        prompt_display_ar:
          "بورتريه تخرج مفعم بالفرح لـ{{person}} يرتدي قبعة ورداء التخرج، يحمل شهادة ملفوفة بثقة، مصورة بكاميرا DSLR حقيقية، إضاءة ذهبية خارجية ناعمة أمام خلفية حرم جامعي، ملمس بشرة طبيعي بمسام ظاهرة، ابتسامة فخر عفوية غير متناظرة تماماً، خصل شعر فردية، لحظة عفوية غير مُنعّمة، بدون تنعيم مصطنع، بدون CGI، عمق ميدان ضحل ببوكيه دافئ، جودة تصوير وثائقي احتفالي أصيل",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young graduate" },
        ],
        style: "candid",
        model: MODEL,
        tags: ["بورتريه", "تخرج"],
      },
      {
        slug: "wedding-engagement-couple-portrait",
        title_ar: "بورتريه زفاف/خطوبة رومانسي",
        title_en: "Wedding & Engagement Couple Portrait",
        description_ar: "أحد أعلى فئات البورتريه طلباً وقيمة سوقية — سوق ضخم على مدار السنة",
        description_en: "One of the highest-demand and highest-value portrait categories — a massive year-round market",
        prompt_text_en:
          "romantic wedding-style portrait of a {{couple}}, shot on a real DSLR camera with a fast prime lens, soft golden hour outdoor lighting, gentle intimate pose, natural skin texture with visible pores and subtle imperfections, realistic hair strands catching backlight, elegant {{outfit}} attire, dreamy shallow depth of field with warm glowing bokeh, unretouched candid authenticity, no airbrushing, no cgi, no plastic skin, fine-art wedding photography quality, tender authentic emotion, cinematic color grading",
        prompt_display_ar:
          "بورتريه رومانسي بأسلوب الزفاف لـ{{couple}}، مصورة بكاميرا DSLR حقيقية وعدسة سريعة، إضاءة ذهبية خارجية ناعمة، وضعية حميمة رقيقة، ملمس بشرة طبيعي بمسام ظاهرة وعيوب دقيقة طبيعية، خصل شعر واقعية يلمعها الضوء الخلفي، زي أنيق {{outfit}}، عمق ميدان حالم ضحل مع بوكيه دافئ متوهج، أصالة عفوية غير مُنعّمة، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، جودة تصوير زفاف فني راقٍ، مشاعر أصيلة رقيقة، تدرج ألوان سينمائي",
        variables: [
          { key: "couple", label_ar: "الثنائي", label_en: "Couple", default: "a bride and groom" },
          { key: "outfit", label_ar: "الزي", label_en: "Attire", default: "a white wedding dress and a black tuxedo" },
        ],
        style: "romantic",
        model: MODEL,
        tags: ["بورتريه", "زفاف"],
        is_featured: true,
      },
      {
        slug: "dramatic-black-white-portrait",
        title_ar: "بورتريه درامي بالأبيض والأسود",
        title_en: "Dramatic Black & White Portrait",
        description_ar: "بورتريه فني كلاسيكي بتباين قوي وظلال درامية",
        description_en: "A classic artistic portrait with strong contrast and dramatic shadows",
        prompt_text_en:
          "dramatic black and white portrait of a {{person}}, shot on a real camera with natural film grain, strong directional side lighting (Rembrandt style), visible skin texture and natural pores, authentic facial asymmetry, individual hair strands, deep rich shadows, high tonal contrast, no airbrushing, no cgi, no plastic skin, fine-art photography quality, tack-sharp detailed eyes, timeless classic mood, full dynamic range from pure black to bright highlight",
        prompt_display_ar:
          "بورتريه درامي بالأبيض والأسود لـ{{person}}، مصورة بكاميرا حقيقية بحبيبات فيلم طبيعية، إضاءة جانبية قوية موجهة (أسلوب رامبرانت)، ملمس بشرة طبيعي ومسام ظاهرة، عدم تناظر طبيعي في الوجه، خصل شعر فردية، ظلال عميقة وغنية، تباين لوني عالٍ، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، جودة تصوير فني كلاسيكي، عينان حادتا التفاصيل جداً، أجواء خالدة كلاسيكية، مدى ديناميكي كامل من الأسود التام للإضاءة الساطعة",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "an elderly man" },
        ],
        style: "fine art",
        model: MODEL,
        tags: ["بورتريه", "أبيض وأسود"],
      },
      {
        slug: "warm-family-group-portrait",
        title_ar: "بورتريه عائلي جماعي دافئ",
        title_en: "Warm Family Group Portrait",
        description_ar: "صورة جماعية دافئة تناسب المناسبات العائلية والاحتفالات الموسمية",
        description_en: "A warm group photo suited for family occasions and seasonal celebrations",
        prompt_text_en:
          "warm family group portrait of {{group}}, shot on a real DSLR camera with a fast prime lens, soft golden hour outdoor lighting, natural asymmetric smiles and relaxed poses, visible skin texture with pores and subtle imperfections, realistic hair flyaways catching the light, coordinated {{color}} outfit tones, unretouched candid authentic family snapshot feel, subtle film grain, no airbrushing, no cgi, no illustration, professional family photography style, gentle bokeh background, heartfelt authentic connection captured",
        prompt_display_ar:
          "بورتريه عائلي جماعي دافئ لـ{{group}}، مصورة بكاميرا DSLR حقيقية وعدسة سريعة، إضاءة خارجية ذهبية ناعمة، ابتسامات عفوية غير متناظرة تماماً ووضعيات مريحة، ملمس بشرة طبيعي بمسام وعيوب دقيقة، خصل شعر طائرة واقعية يلمعها الضوء، ألوان ملابس منسقة {{color}}، طابع لقطة عائلية عفوية غير مُنعّمة، حبيبات فيلم خفيفة، بدون تنعيم مصطنع، بدون CGI، بدون رسم توضيحي، أسلوب تصوير عائلي احترافي، خلفية بوكيه ناعمة، ترابط أصيل ملموس",
        variables: [
          { key: "group", label_ar: "أفراد العائلة", label_en: "Family members", default: "a family of four" },
          { key: "color", label_ar: "ألوان الملابس", label_en: "Outfit colors", default: "beige and white" },
        ],
        style: "lifestyle",
        model: MODEL,
        tags: ["بورتريه", "عائلي"],
      },
      {
        slug: "corporate-team-office-portrait",
        title_ar: "بورتريه فريق العمل داخل المكتب",
        title_en: "Corporate Team Portrait",
        description_ar: "صورة جماعية احترافية للموقع الإلكتروني وصفحة \"من نحن\"",
        description_en: "A professional group photo for the company website and \"About Us\" page",
        prompt_text_en:
          "professional corporate team portrait of {{team_size}} colleagues, shot on a real DSLR camera, modern office background with soft depth blur, bright even lighting, natural skin texture with visible pores, authentic asymmetric expressions, individual hair strands, confident friendly poses, unretouched real-photo quality, no airbrushing, no cgi, no plastic skin, business casual attire, high-end corporate photography, natural group composition with clear individual detail",
        prompt_display_ar:
          "بورتريه احترافي لفريق عمل مكوّن من {{team_size}}، مصورة بكاميرا DSLR حقيقية، خلفية مكتب عصري بضبابية ناعمة، إضاءة ساطعة متساوية، ملمس بشرة طبيعي بمسام ظاهرة، تعبيرات عفوية غير متناظرة تماماً، خصل شعر فردية، وضعيات واثقة وودية، جودة صورة حقيقية غير مُنعّمة، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، زي عمل غير رسمي، تصوير مؤسسي راقٍ، تكوين جماعي طبيعي مع وضوح تفاصيل كل فرد",
        variables: [
          { key: "team_size", label_ar: "عدد أفراد الفريق", label_en: "Team size", default: "five" },
        ],
        style: "corporate",
        model: MODEL,
        tags: ["بورتريه", "فريق عمل"],
      },
      {
        slug: "candid-lifestyle-street-portrait",
        title_ar: "بورتريه عفوي بأسلوب حياتي في الشارع",
        title_en: "Candid Lifestyle Street Portrait",
        description_ar: "لحظة طبيعية غير مصطنعة تناسب المحتوى الشخصي والإنفلونسر",
        description_en: "A natural unposed moment, great for personal and influencer content",
        prompt_text_en:
          "candid lifestyle portrait of a {{person}} laughing naturally at {{location}}, shot on a real camera, soft natural daylight, visible skin texture with natural pores, realistic hair strand detail, genuinely unposed authentic moment, unretouched street photography, no airbrushing, no cgi, no plastic skin, warm film-inspired color grading, documentary photography style, natural motion blur on background elements, real emotion captured mid-moment",
        prompt_display_ar:
          "بورتريه عفوي بأسلوب حياتي لـ{{person}} يضحك بشكل طبيعي في {{location}}، مصورة بكاميرا حقيقية، ضوء نهار طبيعي ناعم، ملمس بشرة طبيعي بمسام ظاهرة، تفاصيل شعر واقعية، لحظة أصيلة غير مصطنعة تماماً، تصوير شارع غير مُنعّم، بدون تنعيم مصطنع، بدون CGI، بدون مظهر بلاستيكي، تدرج ألوان دافئ مستوحى من الأفلام، أسلوب تصوير وثائقي، ضبابية حركة طبيعية في عناصر الخلفية، مشاعر حقيقية ملتقطة في لحظتها",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young woman" },
          { key: "location", label_ar: "المكان", label_en: "Location", default: "a busy souq" },
        ],
        style: "candid",
        model: MODEL,
        tags: ["بورتريه", "حياتي"],
      },
    ],
  },
  {
    slug: "art-styles",
    name_ar: "أنماط فنية",
    name_en: "Art Styles",
    icon: "palette",
    sort_order: 5,
    prompts: [
      {
        slug: "studio-ghibli-style-illustration",
        title_ar: "رسمة بأسلوب استوديو جيبلي",
        title_en: "Studio Ghibli-Style Illustration",
        description_ar: "الأسلوب الفني الأعلى بحثاً وترنداً في العالم حالياً — تحويل أي مشهد أو شخص لرسمة حالمة بأسلوب الأنمي الياباني الكلاسيكي",
        description_en: "The single most globally trending and searched art style right now — turning any scene or person into a dreamy classic Japanese-anime-inspired illustration",
        prompt_text_en:
          "hand-painted Studio Ghibli-inspired illustration of {{subject}}, soft painterly watercolor-textured backgrounds, warm nostalgic lighting, whimsical dreamlike atmosphere, gentle rounded character design, lush detailed nature elements, vibrant yet soft color palette, iconic Japanese animation film aesthetic, high-quality frame-worthy composition",
        prompt_display_ar:
          "رسمة مرسومة يدوياً مستوحاة من أسلوب استوديو جيبلي لـ{{subject}}، خلفيات ناعمة بخامة ألوان مائية، إضاءة دافئة حنينية، أجواء حالمة خيالية، تصميم شخصيات ناعم مستدير، عناصر طبيعة غنية بالتفاصيل، لوحة ألوان زاهية وناعمة في آن واحد، جمالية أفلام الأنمي الياباني الشهيرة، تكوين بجودة عالية تستحق التأطير",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "a girl standing in a sunlit meadow with a cat" },
        ],
        style: "ghibli",
        model: MODEL,
        tags: ["فني", "جيبلي", "ترند"],
        is_featured: true,
      },
      {
        slug: "3d-pixar-style-character",
        title_ar: "شخصية برندر ثلاثي الأبعاد بأسلوب بيكسار",
        title_en: "3D Pixar-Style Rendered Character",
        description_ar: "شخصية بأسلوب رندر ثلاثي الأبعاد ناعم وحديث — من أعلى الأنماط طلباً لمحتوى الأطفال والماسكوت",
        description_en: "A character in a smooth modern 3D render style — one of the top-requested styles for kids' content and mascots",
        prompt_text_en:
          "cute 3D rendered character of {{subject}}, smooth clay-like subsurface-scattering material, soft three-point studio lighting, vibrant {{color}} colors, Pixar/Disney-inspired stylized render, centered composition, ultra high quality octane-style render, crisp clean edges",
        prompt_display_ar:
          "شخصية برندر ثلاثي الأبعاد لطيفة لـ{{subject}}، خامة ناعمة شبيهة بالصلصال مع تشتت ضوئي تحت السطح، إضاءة استوديو ثلاثية الاتجاه ناعمة، ألوان زاهية {{color}}، أسلوب مستوحى من بيكسار وديزني، تكوين مركزي، رندر فائق الجودة، حواف نظيفة حادة",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "a small robot" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "orange and teal" },
        ],
        style: "3D render",
        model: MODEL,
        tags: ["فني", "3D"],
      },
      {
        slug: "anime-dramatic-scene-art",
        title_ar: "مشهد درامي بأسلوب الأنمي",
        title_en: "Dramatic Anime Style Scene",
        description_ar: "مشهد ملون بأسلوب رسوم الأنمي الياباني — قاعدة جماهيرية ضخمة عالمياً",
        description_en: "A colorful scene drawn in Japanese anime art style — a massive global fanbase",
        prompt_text_en:
          "high-quality anime style illustration of {{subject}}, vibrant cel-shaded colors with clean line art, dramatic {{lighting}} lighting with strong rim highlights, Japanese animation aesthetic, dynamic dramatic composition, crisp detailed background art, studio-quality frame",
        prompt_display_ar:
          "رسمة عالية الجودة بأسلوب الأنمي لـ{{subject}}، ألوان زاهية بتظليل خلوي ورسم خطوط نظيف، إضاءة {{lighting}} درامية بإبرازات حافة قوية، جمالية الرسوم المتحركة اليابانية، تكوين درامي ديناميكي، خلفية دقيقة التفاصيل، جودة استوديو احترافية",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "a warrior standing on a rooftop" },
          { key: "lighting", label_ar: "الإضاءة", label_en: "Lighting", default: "sunset" },
        ],
        style: "anime",
        model: MODEL,
        tags: ["فني", "أنمي"],
      },
      {
        slug: "cinematic-movie-still-frame",
        title_ar: "لقطة سينمائية بأسلوب الأفلام",
        title_en: "Cinematic Movie Still",
        description_ar: "مشهد بجودة وأجواء لقطة فيلم سينمائي هوليوودي",
        description_en: "A scene with the quality and mood of a Hollywood film still",
        prompt_text_en:
          "cinematic movie still of {{scene}}, anamorphic lens flare, rich teal-and-orange color grading, dramatic atmospheric haze, wide 2.39:1 aspect ratio composition, subtle film grain, blockbuster production quality, sharp focal subject with soft background falloff",
        prompt_display_ar:
          "لقطة سينمائية من {{scene}}، توهج عدسة أنامورفيك، تدرج ألوان غني بين السماوي والبرتقالي، ضباب جوي درامي، تكوين بنسبة عرض سينمائية 2.39:1، حبيبات فيلم خفيفة، جودة إنتاج أفلام هوليوود، موضوع محوري حاد مع تلاشي خلفية ناعم",
        variables: [
          { key: "scene", label_ar: "المشهد", label_en: "Scene", default: "a lone figure walking through a rainy city street at night" },
        ],
        style: "cinematic",
        model: MODEL,
        tags: ["فني", "سينمائي"],
      },
      {
        slug: "delicate-watercolor-illustration",
        title_ar: "رسمة بألوان مائية",
        title_en: "Watercolor Illustration",
        description_ar: "رسمة ناعمة بأسلوب الألوان المائية اليدوية — مطلوبة جداً لبطاقات المعايدة والمنتجات الفنية",
        description_en: "A soft handmade-feel illustration in watercolor style — heavily requested for greeting cards and art prints",
        prompt_text_en:
          "delicate watercolor illustration of {{subject}}, soft flowing color bleeds with natural pigment granulation, visible textured paper grain, pastel {{color}} tones, authentic hand-painted artistic style, light airy composition, gallery-quality fine art finish",
        prompt_display_ar:
          "رسمة ألوان مائية رقيقة لـ{{subject}}، سيولة ألوان ناعمة متداخلة مع تحبب صبغي طبيعي، خامة ورق ظاهرة بوضوح، درجات {{color}} باستيل، أسلوب فني مرسوم يدوياً أصيل، تكوين خفيف وهوائي، لمسة نهائية بجودة معرض فني",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "a bouquet of desert flowers" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "warm terracotta" },
        ],
        style: "watercolor",
        model: MODEL,
        tags: ["فني", "ألوان مائية"],
      },
      {
        slug: "classic-oil-painting-portrait",
        title_ar: "لوحة زيتية كلاسيكية",
        title_en: "Classic Oil Painting Portrait",
        description_ar: "أسلوب اللوحات الزيتية الكلاسيكي الخالد — طلب متجدد دائماً للهدايا الفاخرة واللوحات الشخصية",
        description_en: "The timeless classic oil-painting style — an evergreen request for premium gifts and personal portraits",
        prompt_text_en:
          "classic oil painting portrait of {{subject}}, rich visible brushstroke texture, warm museum-quality color palette, dramatic chiaroscuro lighting with deep shadows, ornate gilded frame feel, Renaissance-master-inspired composition, fine-art gallery quality, canvas texture detail",
        prompt_display_ar:
          "لوحة زيتية كلاسيكية لـ{{subject}}، ملمس فرشاة غني وواضح، لوحة ألوان دافئة بجودة المتاحف، إضاءة درامية بتباين ظل وضوء قوي (كياروسكورو)، إحساس إطار ذهبي مزخرف، تكوين مستوحى من أساتذة عصر النهضة، جودة معرض فني راقٍ، تفاصيل خامة القماش",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "an elegant woman in a red gown" },
        ],
        style: "oil painting",
        model: MODEL,
        tags: ["فني", "لوحة زيتية"],
      },
      {
        slug: "bold-pop-art-portrait",
        title_ar: "بورتريه بأسلوب البوب آرت",
        title_en: "Pop Art Style Portrait",
        description_ar: "بورتريه ملون بأسلوب البوب آرت الجريء — شائع جداً كهدية شخصية ومطبوعات جدارية",
        description_en: "A bold colorful portrait in the pop art style — very popular as a personalized gift and wall print",
        prompt_text_en:
          "pop art style portrait of {{subject}}, bold flat {{color}} color blocks with precise registration, thick clean black outlines, classic halftone dot pattern, Andy Warhol inspired aesthetic, high contrast graphic style, crisp screen-print quality finish",
        prompt_display_ar:
          "بورتريه بأسلوب البوب آرت لـ{{subject}}، كتل ألوان مسطحة جريئة {{color}} بمحاذاة دقيقة، خطوط خارجية سوداء سميكة ونظيفة، نمط نقاط هالفتون كلاسيكي، جمالية مستوحاة من آندي وارهول، أسلوب رسومي عالي التباين، لمسة نهائية بجودة طباعة الشاشة الحريرية",
        variables: [
          { key: "subject", label_ar: "الموضوع", label_en: "Subject", default: "a woman" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "hot pink and yellow" },
        ],
        style: "pop art",
        model: MODEL,
        tags: ["فني", "بوب آرت"],
      },
      {
        slug: "neon-cyberpunk-city-scene",
        title_ar: "مشهد سايبربانك مستقبلي بأضواء نيون",
        title_en: "Neon Cyberpunk City Scene",
        description_ar: "مشهد مدينة مستقبلية بأضواء نيون ساطعة — من أشهر الأنماط الفنية طلباً لخلفيات الشاشات والألعاب",
        description_en: "A futuristic city scene lit with vivid neon lights — one of the most-requested art styles for wallpapers and gaming content",
        prompt_text_en:
          "cyberpunk futuristic scene of {{scene}}, glowing neon {{color}} lights reflected on rain-soaked streets, towering holographic signage, moody atmospheric fog with volumetric light rays, highly detailed digital concept-art quality, cinematic wide composition",
        prompt_display_ar:
          "مشهد سايبربانك مستقبلي لـ{{scene}}، أضواء نيون متوهجة {{color}} منعكسة على شوارع مبللة، لافتات هولوغرافية شاهقة، ضباب جوي غامض بأشعة ضوئية حجمية، فن رقمي عالي التفاصيل بجودة concept art، تكوين سينمائي واسع",
        variables: [
          { key: "scene", label_ar: "المشهد", label_en: "Scene", default: "a busy night street market" },
          { key: "color", label_ar: "لون الأضواء", label_en: "Light color", default: "cyan and magenta" },
        ],
        style: "cyberpunk",
        model: MODEL,
        tags: ["فني", "سايبربانك"],
      },
      {
        slug: "epic-fantasy-concept-art",
        title_ar: "لوحة فانتازيا ملحمية (كونسبت آرت)",
        title_en: "Epic Fantasy Concept Art",
        description_ar: "أسلوب مطلوب بقوة من عشاق الألعاب والروايات والعوالم الخيالية",
        description_en: "A style in strong demand from gaming, fantasy-novel, and world-building fans",
        prompt_text_en:
          "epic fantasy concept art of {{scene}}, dramatic god-rays breaking through storm clouds, richly detailed environment with a strong sense of scale, painterly digital art style, cinematic color grading, intricate atmospheric depth, blockbuster video-game-quality illustration",
        prompt_display_ar:
          "لوحة كونسبت آرت فانتازيا ملحمية لـ{{scene}}، أشعة ضوئية درامية تخترق سحب العاصفة، بيئة غنية بالتفاصيل بإحساس ضخامة قوي، أسلوب فن رقمي أقرب للوحة مرسومة، تدرج ألوان سينمائي، عمق جوي معقد، جودة رسم ألعاب فيديو ضخمة الإنتاج",
        variables: [
          { key: "scene", label_ar: "المشهد", label_en: "Scene", default: "a floating castle above the clouds" },
        ],
        style: "fantasy",
        model: MODEL,
        tags: ["فني", "فانتازيا"],
      },
      {
        slug: "modern-arabic-calligraphy-art",
        title_ar: "لوحة خط عربي فني معاصر",
        title_en: "Modern Arabic Calligraphy Art",
        description_ar: "تكوين فني معاصر مبني على الخط العربي — طلب محلي مستمر وقوي للديكور والهدايا",
        description_en: "A contemporary artistic composition built on Arabic calligraphy — a strong, steady local request for decor and gifts",
        prompt_text_en:
          "artistic Arabic calligraphy composition of the word '{{word}}', elegant flowing thuluth-inspired script, refined gold ink accents on a richly textured {{color}} background, modern Islamic art style, intricate fine detail, gallery-quality fine art finish",
        prompt_display_ar:
          "لوحة خط عربي فنية لكلمة '{{word}}'، خط انسيابي أنيق مستوحى من خط الثلث، لمسات حبر ذهبي راقية على خلفية بخامة غنية {{color}}، أسلوب فني إسلامي معاصر، تفاصيل دقيقة ومتقنة، لمسة نهائية بجودة معرض فني",
        variables: [
          { key: "word", label_ar: "الكلمة", label_en: "Word", default: "بسم الله" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "deep emerald green" },
        ],
        style: "calligraphy",
        model: MODEL,
        tags: ["فني", "خط عربي"],
      },
    ],
  },
  {
    slug: "covers-posts",
    name_ar: "أغلفة ومنشورات",
    name_en: "Covers & Posts",
    icon: "layout",
    sort_order: 6,
    prompts: [
      {
        slug: "high-ctr-youtube-thumbnail",
        title_ar: "صورة مصغرة ليوتيوب عالية النقر",
        title_en: "High-CTR YouTube Thumbnail",
        description_ar: "الأكثر طلباً وبحثاً على جوجل لصناع المحتوى — تصميم مصغّرة تزيد نسبة مشاهدات الفيديو",
        description_en: "The single most Google-searched request from content creators — a thumbnail design that boosts video views",
        prompt_text_en:
          "high contrast YouTube thumbnail design about {{topic}}, bold expressive focal subject with exaggerated emotion, bright {{color}} background, large clearly readable text space, exciting energetic composition, scroll-stopping click-through optimized design",
        prompt_display_ar:
          "تصميم صورة مصغرة ليوتيوب عالي التباين عن {{topic}}، عنصر محوري تعبيري بارز بمشاعر مبالغ فيها بقصد الجذب، خلفية زاهية بلون {{color}}، مساحة نص كبيرة وواضحة القراءة، تكوين حيوي ومثير، تصميم محسّن لزيادة نسبة النقر",
        variables: [
          { key: "topic", label_ar: "الموضوع", label_en: "Topic", default: "a tech review" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "bright yellow" },
        ],
        style: "bold",
        model: MODEL,
        tags: ["غلاف", "يوتيوب"],
        is_featured: true,
      },
      {
        slug: "podcast-cover-art-square",
        title_ar: "غلاف بودكاست",
        title_en: "Podcast Cover Art",
        description_ar: "غلاف مربع جذاب يناسب منصات البودكاست — سوق متنامٍ بسرعة",
        description_en: "An eye-catching square cover suited for podcast platforms — a fast-growing market",
        prompt_text_en:
          "modern podcast cover art design, bold {{color}} color scheme with strong visual identity, abstract sound-wave graphic element, large clearly reserved space for title text, professional audio-branding style, square 3000x3000 format, crisp streaming-platform-ready quality",
        prompt_display_ar:
          "تصميم غلاف بودكاست عصري، ألوان جريئة بدرجة {{color}} بهوية بصرية قوية، عنصر رسومي لموجات صوتية تجريدية، مساحة كبيرة محجوزة بوضوح لعنوان الحلقة، أسلوب هوية صوتية احترافي، مقاس مربع 3000×3000، جودة جاهزة لمنصات البث",
        variables: [
          { key: "color", label_ar: "اللون", label_en: "Color", default: "deep purple and orange" },
        ],
        style: "modern",
        model: MODEL,
        tags: ["غلاف", "بودكاست"],
      },
      {
        slug: "ebook-guide-cover-design",
        title_ar: "غلاف كتاب إلكتروني إرشادي",
        title_en: "Ebook Guide Cover Design",
        description_ar: "غلاف احترافي لكتاب رقمي أو دليل إرشادي — أساسي لكل من يبيع منتجاً رقمياً",
        description_en: "A professional cover for a digital book or guide — essential for anyone selling a digital product",
        prompt_text_en:
          "professional ebook cover design about {{topic}}, minimal modern layout with clear typographic hierarchy, refined {{color}} color palette, large reserved title text space, subtle abstract background graphic, publishing-house quality, crisp print-and-digital-ready resolution",
        prompt_display_ar:
          "تصميم غلاف كتاب إلكتروني عن {{topic}}، تخطيط عصري بسيط بتسلسل نصي واضح، لوحة ألوان راقية {{color}}، مساحة نص عنوان كبيرة محجوزة، رسم خلفية تجريدي خفيف، جودة دار نشر احترافية، دقة جاهزة للطباعة والرقمي",
        variables: [
          { key: "topic", label_ar: "الموضوع", label_en: "Topic", default: "digital marketing" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "navy and gold" },
        ],
        style: "editorial",
        model: MODEL,
        tags: ["غلاف", "كتاب"],
      },
      {
        slug: "professional-linkedin-banner",
        title_ar: "بانر لينكدإن احترافي",
        title_en: "Professional LinkedIn Banner",
        description_ar: "بانر بروفايل يعكس هوية احترافية على لينكدإن — طلب متكرر لكل باحث عمل ورائد أعمال",
        description_en: "A profile banner reflecting a professional identity on LinkedIn — a recurring request from every job seeker and entrepreneur",
        prompt_text_en:
          "professional LinkedIn banner design, wide 1584x396 format, clean corporate {{color}} palette, subtle geometric background pattern, elegant clearly reserved space for name and title text, business networking style, crisp polished finish",
        prompt_display_ar:
          "تصميم بانر لينكدإن احترافي، مقاس عريض 1584×396، لوحة ألوان مؤسسية نظيفة {{color}}، نمط هندسي خفيف في الخلفية، مساحة أنيقة محجوزة للاسم والمسمى الوظيفي، أسلوب تواصل مهني، لمسة نهائية نظيفة مصقولة",
        variables: [
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "navy blue" },
        ],
        style: "corporate",
        model: MODEL,
        tags: ["غلاف", "لينكدإن"],
      },
      {
        slug: "motivational-quote-instagram-post",
        title_ar: "منشور اقتباس تحفيزي لإنستغرام",
        title_en: "Motivational Quote Instagram Post",
        description_ar: "من أعلى أنواع المنشورات طلباً وانتشاراً على الإطلاق — محتوى يُعاد نشره ومشاركته باستمرار",
        description_en: "One of the most-requested and most-shared post types ever — content that gets endlessly reposted",
        prompt_text_en:
          "elegant motivational quote background design, soft {{color}} gradient or textured backdrop, tasteful minimal decorative accents like fine line art or subtle botanical elements, large clean central space reserved for quote text, calm inspiring aesthetic, square Instagram-ready composition, premium polished finish",
        prompt_display_ar:
          "خلفية تصميم اقتباس تحفيزي أنيقة، تدرج أو خامة ناعمة بلون {{color}}، لمسات زخرفية بسيطة أنيقة مثل خطوط فنية دقيقة أو عناصر نباتية خفيفة، مساحة مركزية كبيرة ونظيفة محجوزة لنص الاقتباس، طابع ملهم هادئ، تكوين مربع جاهز لإنستغرام، لمسة نهائية فاخرة",
        variables: [
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "sage green" },
        ],
        style: "minimal",
        model: MODEL,
        tags: ["منشور", "اقتباس", "إنستغرام"],
        is_featured: true,
      },
      {
        slug: "conference-event-poster",
        title_ar: "بوستر فعالية أو مؤتمر",
        title_en: "Event & Conference Poster",
        description_ar: "بوستر إعلاني جذاب للفعاليات والمؤتمرات",
        description_en: "An eye-catching poster design for events and conferences",
        prompt_text_en:
          "vibrant event poster design for {{event}}, dynamic layered composition with clear visual hierarchy, bold {{color}} color scheme, large clearly reserved space for event details text, modern festival poster style, crisp print-ready resolution",
        prompt_display_ar:
          "تصميم بوستر فعالية نابض بالحياة لـ{{event}}، تكوين طبقات ديناميكي بتسلسل بصري واضح، ألوان جريئة {{color}}، مساحة كبيرة محجوزة لتفاصيل الفعالية، أسلوب بوستر مهرجانات عصري، دقة جاهزة للطباعة",
        variables: [
          { key: "event", label_ar: "الفعالية", label_en: "Event", default: "a tech conference" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "electric blue and purple" },
        ],
        style: "festival",
        model: MODEL,
        tags: ["غلاف", "فعاليات"],
      },
      {
        slug: "music-playlist-cover-art",
        title_ar: "غلاف قائمة تشغيل موسيقية",
        title_en: "Music Playlist Cover Art",
        description_ar: "غلاف مربع نابض بالحياة لقوائم التشغيل الموسيقية",
        description_en: "A vibrant square cover art for music playlists",
        prompt_text_en:
          "vibrant music playlist cover art for a {{genre}} playlist, abstract flowing color shapes with organic motion, smooth {{color}} gradient palette, dynamic energetic composition, square streaming-platform format, crisp modern digital-art finish",
        prompt_display_ar:
          "غلاف قائمة تشغيل موسيقية نابض بالحياة لموسيقى {{genre}}، أشكال لونية متدفقة بحركة عضوية، لوحة تدرج ناعمة {{color}}، تكوين ديناميكي حيوي، مقاس مربع لمنصات البث، لمسة نهائية رقمية عصرية نظيفة",
        variables: [
          { key: "genre", label_ar: "نوع الموسيقى", label_en: "Music genre", default: "chill lofi" },
          { key: "color", label_ar: "التدرج اللوني", label_en: "Gradient", default: "purple to blue" },
        ],
        style: "abstract",
        model: MODEL,
        tags: ["غلاف", "موسيقى"],
      },
      {
        slug: "music-single-album-cover",
        title_ar: "غلاف أغنية/ألبوم موسيقي",
        title_en: "Music Single/Album Cover",
        description_ar: "غلاف فني مطلوب بقوة من كل فنان أو منتج موسيقي مستقل",
        description_en: "An artistic cover heavily requested by every independent artist and music producer",
        prompt_text_en:
          "striking album cover artwork for a {{genre}} release titled '{{title}}', bold artistic visual concept with strong mood and atmosphere, {{color}} dominant color palette, professional record-label quality composition, clearly reserved space for artist name and title typography, square high-resolution streaming-ready format",
        prompt_display_ar:
          "غلاف ألبوم فني لافت لإصدار موسيقى {{genre}} بعنوان '{{title}}'، مفهوم بصري فني جريء بمزاج وأجواء قوية، لوحة ألوان مهيمنة {{color}}، تكوين بجودة شركات الإنتاج الموسيقي، مساحة محجوزة بوضوح لاسم الفنان والعنوان، مقاس مربع عالي الدقة جاهز لمنصات البث",
        variables: [
          { key: "genre", label_ar: "نوع الموسيقى", label_en: "Music genre", default: "R&B" },
          { key: "title", label_ar: "عنوان الأغنية", label_en: "Track title", default: "Midnight" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "deep red and black" },
        ],
        style: "artistic",
        model: MODEL,
        tags: ["غلاف", "موسيقى", "ألبوم"],
      },
      {
        slug: "novel-book-cover-design",
        title_ar: "غلاف رواية",
        title_en: "Novel Book Cover Design",
        description_ar: "غلاف روائي جذاب يُباع به الكتاب من النظرة الأولى — طلب دائم من الكتّاب المستقلين",
        description_en: "An eye-catching novel cover that sells the book at first glance — a constant request from independent authors",
        prompt_text_en:
          "professional novel book cover design for a {{genre}} story, evocative atmospheric scene capturing the story's mood, dramatic {{color}} color grading, elegant title typography space at the top and author name space at the bottom, traditional publishing-house quality, print-and-ebook-ready resolution",
        prompt_display_ar:
          "تصميم غلاف رواية احترافي لقصة من نوع {{genre}}، مشهد جوي معبّر يجسّد مزاج القصة، تدرج ألوان درامي {{color}}، مساحة عنوان أنيقة في الأعلى ومساحة اسم المؤلف في الأسفل، جودة دور النشر التقليدية، دقة جاهزة للطباعة والنسخة الرقمية",
        variables: [
          { key: "genre", label_ar: "نوع الرواية", label_en: "Genre", default: "fantasy" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "deep blue and silver" },
        ],
        style: "editorial",
        model: MODEL,
        tags: ["غلاف", "كتاب", "رواية"],
      },
      {
        slug: "brand-social-profile-header",
        title_ar: "غلاف بروفايل تويتر/إكس",
        title_en: "Twitter/X Profile Header",
        description_ar: "غلاف بروفايل عريض يعكس هوية العلامة",
        description_en: "A wide profile header reflecting the brand's identity",
        prompt_text_en:
          "wide social media profile header design about {{topic}}, minimal modern {{color}} background, subtle brand pattern, clean composition with clearly reserved space for profile photo overlay, professional polished look, crisp digital-ready resolution",
        prompt_display_ar:
          "تصميم غلاف بروفايل عريض لمنصة تواصل عن {{topic}}، خلفية عصرية بسيطة بلون {{color}}، نمط علامة تجارية خفيف، تكوين نظيف مع مساحة محجوزة بوضوح لصورة البروفايل، مظهر احترافي مصقول، دقة رقمية جاهزة",
        variables: [
          { key: "topic", label_ar: "الموضوع", label_en: "Topic", default: "a design studio" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "charcoal and teal" },
        ],
        style: "minimal",
        model: MODEL,
        tags: ["غلاف", "بروفايل"],
      },
    ],
  },
  {
    slug: "occasions",
    name_ar: "مناسبات",
    name_en: "Occasions",
    icon: "calendar",
    sort_order: 7,
    prompts: [
      {
        slug: "elegant-ramadan-greeting-post",
        title_ar: "منشور تهنئة رمضانية أنيقة",
        title_en: "Elegant Ramadan Greeting Post",
        description_ar: "أعلى تصميم موسمي طلباً في السوق العربي — كل متجر وعلامة تحتاجه سنوياً",
        description_en: "The highest-demand seasonal design in the Arabic market — every store and brand needs one every year",
        prompt_text_en:
          "elegant Ramadan greeting design, intricately ornate crescent moon and lantern illustration, warm {{color}} tones with fine gold-leaf accents, detailed arabesque pattern work, festive Islamic aesthetic, clearly reserved space for greeting text, premium print-quality finish",
        prompt_display_ar:
          "تصميم تهنئة رمضانية أنيق، رسم هلال وفانوس مزخرف بدقة متقنة، درجات {{color}} دافئة مع لمسات ذهبية دقيقة، زخرفة عربية مفصلة، طابع احتفالي إسلامي، مساحة محجوزة بوضوح لنص التهنئة، لمسة نهائية فاخرة بجودة الطباعة",
        variables: [
          { key: "color", label_ar: "اللون", label_en: "Color", default: "deep purple" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["مناسبات", "رمضان"],
        is_featured: true,
      },
      {
        slug: "joyful-eid-celebration-banner",
        title_ar: "بانر احتفال العيد",
        title_en: "Eid Celebration Banner",
        description_ar: "بانر مبهج للاحتفال بالعيد ومناسبات العروض المرتبطة به",
        description_en: "A cheerful banner for Eid celebrations and related promotions",
        prompt_text_en:
          "joyful Eid celebration banner design, intricate decorative geometric Islamic patterns, bright {{color}} festive colors, detailed fireworks and lantern illustrations, clearly reserved space for greeting message, high production quality, premium festive finish",
        prompt_display_ar:
          "تصميم بانر احتفال بالعيد مفعم بالبهجة، زخارف إسلامية هندسية متقنة، ألوان احتفالية زاهية {{color}}، رسومات ألعاب نارية وفوانيس دقيقة، مساحة محجوزة بوضوح لرسالة التهنئة، جودة إنتاج عالية، لمسة احتفالية فاخرة",
        variables: [
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "gold and green" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["مناسبات", "عيد"],
      },
      {
        slug: "patriotic-national-day-poster",
        title_ar: "بوستر اليوم الوطني",
        title_en: "National Day Poster",
        description_ar: "تصميم فخم يحتفي بمناسبة اليوم الوطني — طلب سنوي ثابت وقوي في كل دول الخليج",
        description_en: "A proud design celebrating National Day — a strong, steady annual request across the Gulf",
        prompt_text_en:
          "patriotic national day poster design, flag-inspired {{color}} color palette, detailed falcon silhouette and heritage pattern work, fireworks bursting in the sky, dramatic sunset background with rich color grading, celebratory composition true to the occasion's spirit, premium print-ready finish",
        prompt_display_ar:
          "تصميم بوستر وطني فخم، لوحة ألوان مستوحاة من العلم {{color}}، ظلال صقر وزخارف تراثية دقيقة، ألعاب نارية منفجرة في السماء، خلفية غروب درامية بتدرج ألوان غني، تكوين احتفالي بروح المناسبة، لمسة نهائية فاخرة جاهزة للطباعة",
        variables: [
          { key: "color", label_ar: "ألوان العلم", label_en: "Flag colors", default: "green and white" },
        ],
        style: "patriotic",
        model: MODEL,
        tags: ["مناسبات", "اليوم الوطني"],
      },
      {
        slug: "seasonal-sale-campaign-design",
        title_ar: "تصميم عروض موسم التخفيضات",
        title_en: "Seasonal Sale Campaign Design",
        description_ar: "تصميم موسمي حماسي لحملات التخفيضات الكبرى (الجمعة البيضاء ونهاية الموسم)",
        description_en: "An energetic seasonal design for major sale campaigns (Black Friday, end-of-season)",
        prompt_text_en:
          "high energy seasonal sale campaign design for {{season}}, bold '{{discount}}' text placeholder as the clear focal point, dynamic burst shapes radiating outward, vibrant {{color}} color scheme, exciting retail promotion aesthetic, scroll-stopping crisp finish",
        prompt_display_ar:
          "تصميم حملة تخفيضات موسمية حماسي لـ{{season}}، مساحة نصية بارزة وواضحة لعبارة '{{discount}}' كنقطة تركيز، أشكال انفجارية ديناميكية منطلقة للخارج، ألوان زاهية {{color}}، طابع ترويجي مثير للتجزئة، لمسة نهائية نظيفة توقف التمرير",
        variables: [
          { key: "season", label_ar: "الموسم", label_en: "Season", default: "end of season sale" },
          { key: "discount", label_ar: "نسبة الخصم", label_en: "Discount", default: "UP TO 70%" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "red and gold" },
        ],
        style: "bold",
        model: MODEL,
        tags: ["مناسبات", "تخفيضات"],
      },
      {
        slug: "graduation-announcement-poster",
        title_ar: "تصميم تهنئة تخرج",
        title_en: "Graduation Announcement Poster",
        description_ar: "تصميم أنيق للاحتفال بمناسبة التخرج — طلب موسمي متكرر لكل عائلة وجامعة",
        description_en: "An elegant design celebrating a graduation milestone — a recurring seasonal request for every family and university",
        prompt_text_en:
          "elegant graduation celebration design, detailed graduation cap and diploma illustration, fine confetti details, soft {{color}} festive palette, clearly reserved space for congratulatory text, joyful academic milestone style, premium polished finish",
        prompt_display_ar:
          "تصميم احتفالي أنيق بمناسبة التخرج، رسم قبعة تخرج وشهادة دقيق، تفاصيل قصاصات احتفالية ناعمة، لوحة ألوان ناعمة {{color}}، مساحة محجوزة بوضوح لنص التهنئة، طابع بهيج لإنجاز أكاديمي، لمسة نهائية فاخرة مصقولة",
        variables: [
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "navy and gold" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["مناسبات", "تخرج"],
      },
      {
        slug: "wedding-invitation-elegant-design",
        title_ar: "تصميم دعوة زفاف راقية",
        title_en: "Elegant Wedding Invitation Design",
        description_ar: "تصميم دعوة زفاف راقٍ بلمسة عربية — سوق كبير ومستمر على مدار العام",
        description_en: "A refined wedding invitation with an Arabic touch — a large, year-round market",
        prompt_text_en:
          "luxurious wedding invitation design, delicate botanically-accurate floral {{color}} illustrations, elegant fine-line ornamental border, soft romantic color palette, clearly reserved space for names and date text, premium stationery finish, gallery-quality fine detail",
        prompt_display_ar:
          "تصميم دعوة زفاف فاخرة، رسومات زهور دقيقة ونباتياً واقعية بلون {{color}}، إطار زخرفي أنيق بخطوط رفيعة، لوحة ألوان رومانسية ناعمة، مساحة محجوزة بوضوح لاسمي العروسين والتاريخ، لمسة نهائية فاخرة بجودة القرطاسية الراقية",
        variables: [
          { key: "color", label_ar: "لون الزهور", label_en: "Floral color", default: "blush pink and gold" },
        ],
        style: "elegant",
        model: MODEL,
        tags: ["مناسبات", "زفاف"],
      },
      {
        slug: "sparkling-new-year-design",
        title_ar: "تصميم احتفال رأس السنة",
        title_en: "New Year Celebration Design",
        description_ar: "تصميم احتفالي متلألئ لمناسبة رأس السنة الميلادية — طلب سنوي ثابت لكل نشاط تجاري",
        description_en: "A sparkling festive design for New Year celebrations — a steady annual request for every business",
        prompt_text_en:
          "festive New Year celebration design, glittering fireworks and fine confetti detail, bold '{{year}}' number typography as the centerpiece, dark {{color}} background with sparkling bokeh light, celebratory countdown atmosphere, premium crisp finish",
        prompt_display_ar:
          "تصميم احتفالي برأس السنة، ألعاب نارية وقصاصات متلألئة دقيقة، خط بارز لرقم السنة '{{year}}' كنقطة مركزية، خلفية داكنة بلون {{color}} مع إضاءة بوكيه متلألئة، أجواء عد تنازلي احتفالية، لمسة نهائية فاخرة نظيفة",
        variables: [
          { key: "year", label_ar: "السنة", label_en: "Year", default: "2027" },
          { key: "color", label_ar: "لون الخلفية", label_en: "Background color", default: "midnight blue and gold" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["مناسبات", "رأس السنة"],
      },
      {
        slug: "gentle-mothers-day-design",
        title_ar: "تصميم عيد الأم",
        title_en: "Mother's Day Design",
        description_ar: "تصميم دافئ ورقيق للاحتفاء بعيد الأم",
        description_en: "A warm, gentle design celebrating Mother's Day",
        prompt_text_en:
          "gentle Mother's Day celebration design, soft blooming {{flower}} flowers with delicate botanical detail, warm pastel {{color}} palette, tender hand-drawn illustration style, clearly reserved space for a heartfelt message, premium gentle finish",
        prompt_display_ar:
          "تصميم رقيق للاحتفاء بعيد الأم، زهور {{flower}} متفتحة ناعمة بتفاصيل نباتية دقيقة، لوحة ألوان باستيل دافئة {{color}}، أسلوب رسم يدوي رقيق حنون، مساحة محجوزة بوضوح لرسالة من القلب، لمسة نهائية فاخرة رقيقة",
        variables: [
          { key: "flower", label_ar: "نوع الزهور", label_en: "Flower type", default: "roses" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "blush pink and cream" },
        ],
        style: "gentle",
        model: MODEL,
        tags: ["مناسبات", "عيد الأم"],
      },
      {
        slug: "grand-opening-launch-announcement",
        title_ar: "إعلان افتتاح كبير لنشاط تجاري",
        title_en: "Grand Opening Launch Announcement",
        description_ar: "أول انطباع يراه العملاء عن نشاط جديد — طلب أساسي لكل متجر أو مطعم أو صالون عند الافتتاح",
        description_en: "The first impression customers see of a new business — a core request for every store, restaurant, or salon opening",
        prompt_text_en:
          "exciting grand opening announcement design for {{business}}, bold ribbon-cutting or sparkle-burst centerpiece graphic, vibrant {{color}} color scheme, celebratory confetti details, large clearly reserved space for opening date and address text, high-energy retail launch aesthetic, crisp print-ready finish",
        prompt_display_ar:
          "تصميم إعلان افتتاح كبير مثير لـ{{business}}، رسم مركزي بارز لقص الشريط أو انفجار بريق احتفالي، ألوان زاهية {{color}}، تفاصيل قصاصات احتفالية، مساحة كبيرة محجوزة بوضوح لتاريخ الافتتاح والعنوان، طابع إطلاق تجاري عالي الطاقة، لمسة نهائية نظيفة جاهزة للطباعة",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a new restaurant" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "red and gold" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["مناسبات", "افتتاح"],
      },
      {
        slug: "back-to-school-promo-design",
        title_ar: "تصميم عروض العودة للمدارس",
        title_en: "Back-to-School Promo Design",
        description_ar: "أحد أقوى المواسم التجارية طلباً كل عام — تصميم عائلي مرح ومحفّز للشراء",
        description_en: "One of the strongest recurring commercial seasons every year — a fun, family-friendly design that drives purchases",
        prompt_text_en:
          "cheerful back-to-school promotion design, playful illustrated school supplies like {{items}} arranged dynamically, bright {{color}} color scheme, bold '{{discount}}' text placeholder as the focal point, energetic family-friendly retail aesthetic, crisp print-and-digital-ready finish",
        prompt_display_ar:
          "تصميم ترويجي مرح لموسم العودة للمدارس، رسومات مرحة للوازم مدرسية مثل {{items}} مرتبة بشكل حيوي، ألوان زاهية {{color}}، مساحة نصية بارزة لعبارة '{{discount}}' كنقطة تركيز، طابع ترويجي عائلي حيوي، لمسة نهائية نظيفة جاهزة للطباعة والرقمي",
        variables: [
          { key: "items", label_ar: "اللوازم المدرسية", label_en: "School items", default: "backpacks and notebooks" },
          { key: "discount", label_ar: "نسبة الخصم", label_en: "Discount", default: "30% OFF" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "yellow and blue" },
        ],
        style: "playful",
        model: MODEL,
        tags: ["مناسبات", "عودة المدارس"],
      },
    ],
  },
];

export const allSeedPrompts = seedCategories.flatMap((category) =>
  category.prompts.map((prompt) => ({ ...prompt, categorySlug: category.slug })),
);
