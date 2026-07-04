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
        slug: "studio-product-white-bg",
        title_ar: "منتج على خلفية بيضاء احترافية",
        title_en: "Product on a Clean White Studio Background",
        description_ar: "صورة منتج نظيفة لصفحات المتجر والكتالوجات",
        description_en: "Clean e-commerce style product photo for store listings",
        prompt_text_en:
          "professional studio product photography of {{product}}, centered composition following the rule of thirds, pure white seamless backdrop, three-point studio lighting with a large softbox key light and subtle fill, gentle contact shadow beneath the product, macro-level surface detail, sharp focus throughout, photorealistic, commercial e-commerce quality, 8k resolution",
        prompt_display_ar:
          "تصوير منتج احترافي في استوديو لـ {{product}}، تكوين مركزي وفق قاعدة الأثلاث، خلفية بيضاء ناصعة متصلة بلا حواف، إضاءة استوديو ثلاثية الاتجاه بمصدر رئيسي softbox كبير وإضاءة تعبئة خفيفة، ظل تلامس ناعم أسفل المنتج، تفاصيل سطحية دقيقة جداً، تركيز حاد بالكامل، واقعية فوتوغرافية، جودة تجارية للمتاجر الإلكترونية، دقة 8K",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a glass perfume bottle" },
        ],
        style: "studio",
        model: MODEL,
        tags: ["منتجات", "متجر", "product"],
        is_featured: true,
      },
      {
        slug: "product-lifestyle-scene",
        title_ar: "منتج في مشهد حياتي طبيعي",
        title_en: "Product in a Lifestyle Scene",
        description_ar: "منتج ضمن بيئة واقعية تعكس استخدامه اليومي",
        description_en: "Product placed in a realistic everyday setting",
        prompt_text_en:
          "lifestyle product photography, {{product}} placed naturally on a {{surface}}, soft directional natural window light with gentle falloff, warm cozy color grading, shallow depth of field with creamy bokeh, 50mm lens perspective, editorial commercial photography, true-to-life textures and materials, magazine-quality composition",
        prompt_display_ar:
          "تصوير منتج بأسلوب حياتي، {{product}} موضوع بشكل طبيعي على {{surface}}، إضاءة نافذة طبيعية موجهة بتلاشٍ ناعم، تدرج ألوان دافئ ومريح، عمق ميدان ضحل مع بوكيه ناعم، منظور عدسة 50 مم، تصوير تجاري تحريري، خامات وملمس واقعي تماماً، تكوين بجودة المجلات",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a ceramic coffee cup" },
          { key: "surface", label_ar: "السطح", label_en: "Surface", default: "wooden breakfast table" },
        ],
        style: "lifestyle",
        model: MODEL,
        tags: ["منتجات", "lifestyle"],
      },
      {
        slug: "product-floating-levitation",
        title_ar: "منتج عائم بتأثير الجاذبية الصفرية",
        title_en: "Levitating Product Shot",
        description_ar: "منتج يطفو في الهواء بتأثير بصري جذاب للإعلانات",
        description_en: "Eye-catching floating product effect for ads",
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
        slug: "product-flatlay-top-down",
        title_ar: "تنسيق منتجات من الأعلى (Flat Lay)",
        title_en: "Top-Down Flat Lay Arrangement",
        description_ar: "تنسيق أنيق للمنتجات من زاوية علوية لمنشورات السوشيال ميديا",
        description_en: "Elegant top-down arrangement for social media posts",
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
        tags: ["منتجات", "flatlay"],
      },
      {
        slug: "product-hand-holding",
        title_ar: "منتج ممسوك باليد",
        title_en: "Product Held in Hand",
        description_ar: "لقطة قريبة تُظهر حجم المنتج وملمسه بشكل واقعي",
        description_en: "Close-up shot showing the product's scale and texture",
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
        slug: "product-splash-liquid",
        title_ar: "منتج مع تناثر سائل",
        title_en: "Product with Liquid Splash",
        description_ar: "تأثير بصري قوي لمنتجات المشروبات ومستحضرات التجميل",
        description_en: "Dramatic splash effect for beverages and cosmetics",
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
        slug: "product-packaging-mockup",
        title_ar: "موك أب تغليف المنتج",
        title_en: "Product Packaging Mockup",
        description_ar: "عرض واقعي لعلبة أو تغليف المنتج قبل الطباعة",
        description_en: "Realistic mockup of product packaging before printing",
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
        slug: "product-outdoor-natural",
        title_ar: "منتج في بيئة خارجية طبيعية",
        title_en: "Product in an Outdoor Natural Setting",
        description_ar: "منتج بمظهر طبيعي خارجي يناسب منتجات العناية والطبيعة",
        description_en: "Natural outdoor look, suited for organic and wellness products",
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
      {
        slug: "product-360-catalog",
        title_ar: "منتج بزاوية ثلاثة أرباع للكتالوج",
        title_en: "Three-Quarter Angle Catalog Shot",
        description_ar: "زاوية كتالوجية كلاسيكية تُظهر أبعاد المنتج",
        description_en: "Classic catalog angle showing the product's dimensions",
        prompt_text_en:
          "three-quarter angle product photo of {{product}}, light gray seamless gradient background, even soft-box studio lighting eliminating harsh shadows, tack-sharp focus with crisp edge definition, professional retouching, color-accurate rendering, catalog-ready commercial quality, consistent with multi-angle product sets",
        prompt_display_ar:
          "صورة منتج بزاوية ثلاثة أرباع لـ {{product}}، خلفية متدرجة رمادية فاتحة متصلة، إضاءة استوديو softbox متساوية تلغي الظلال القاسية، تركيز حاد جداً مع حواف واضحة، معالجة احترافية، ألوان دقيقة، جودة تجارية جاهزة للكتالوج، متسقة مع مجموعات الزوايا المتعددة",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a leather handbag" },
        ],
        style: "studio",
        model: MODEL,
        tags: ["منتجات", "كتالوج"],
      },
      {
        slug: "product-color-variants-grid",
        title_ar: "شبكة تدرجات ألوان المنتج",
        title_en: "Product Color Variants Grid",
        description_ar: "عرض منظم لتدرجات ألوان المنتج المتوفرة",
        description_en: "Organized display of the product's available color options",
        prompt_text_en:
          "clean grid layout showing {{product}} in three distinct color variants, consistent identical studio lighting across all three, plain seamless white background, evenly spaced precise arrangement, sharp product-level detail on each variant, e-commerce variant showcase style, high resolution catalog quality",
        prompt_display_ar:
          "تخطيط شبكي نظيف يعرض {{product}} بثلاثة تدرجات ألوان مختلفة، إضاءة استوديو متطابقة تماماً على الثلاثة، خلفية بيضاء بسيطة متصلة، ترتيب متساوي المسافات دقيق، تفاصيل واضحة على مستوى المنتج لكل تدرج، أسلوب عرض خيارات المتجر الإلكتروني، جودة كتالوج بدقة عالية",
        variables: [
          { key: "product", label_ar: "المنتج", label_en: "Product", default: "a wireless earbuds case" },
        ],
        style: "studio",
        model: MODEL,
        tags: ["منتجات", "متغيرات"],
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
        slug: "instagram-square-promo",
        title_ar: "منشور ترويجي مربع لإنستغرام",
        title_en: "Square Instagram Promo Post",
        description_ar: "تصميم إعلاني جذاب بمقاس مربع لمنشورات إنستغرام",
        description_en: "Bold square-format ad visual for Instagram feed",
        prompt_text_en:
          "square 1:1 format social media advertisement for {{business}}, bold {{color}} color scheme with strong visual hierarchy, generous empty space reserved for text overlay, modern flat design, high contrast, scroll-stopping composition, clean vector-quality shapes, marketing poster precision, crisp print-ready resolution",
        prompt_display_ar:
          "إعلان سوشيال ميديا بمقاس مربع 1:1 لـ {{business}}، ألوان جريئة بدرجة {{color}} مع تسلسل بصري واضح، مساحة فارغة واسعة مخصصة للنص، تصميم مسطح عصري، تباين عالٍ، تكوين يوقف التمرير فوراً، أشكال بجودة فيكتور نظيفة، دقة بوستر تسويقي، دقة طباعة عالية",
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
        slug: "sale-discount-banner",
        title_ar: "بانر تخفيضات وعروض",
        title_en: "Sale & Discount Banner",
        description_ar: "بانر إعلاني حماسي لعروض التخفيضات الموسمية",
        description_en: "Energetic banner design for seasonal discount campaigns",
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
        slug: "app-feature-mockup",
        title_ar: "عرض ميزة تطبيق على جهاز",
        title_en: "App Feature Mockup on Device",
        description_ar: "عرض واجهة تطبيق على شاشة هاتف بأسلوب تسويقي أنيق",
        description_en: "Elegant marketing display of an app screen on a phone mockup",
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
        slug: "before-after-split",
        title_ar: "مقارنة قبل وبعد",
        title_en: "Before & After Split Visual",
        description_ar: "تصميم مقسوم يعرض نتائج الخدمة أو المنتج بوضوح",
        description_en: "Split-screen design clearly showcasing service or product results",
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
        slug: "testimonial-quote-card",
        title_ar: "بطاقة رأي عميل",
        title_en: "Customer Testimonial Card",
        description_ar: "بطاقة أنيقة لعرض تقييمات وآراء العملاء",
        description_en: "Elegant card layout for displaying customer reviews",
        prompt_text_en:
          "elegant testimonial card background design, soft {{color}} pastel gradient, large refined quotation mark graphic, five gold star rating icons, minimal clean layout with clearly reserved space for text, professional social-proof marketing style, crisp vector precision, premium finish",
        prompt_display_ar:
          "خلفية بطاقة تقييم عملاء أنيقة، تدرج لوني ناعم {{color}} باستيل، رمز علامة اقتباس كبيرة وراقية، خمس نجوم تقييم ذهبية، تخطيط بسيط ونظيف مع مساحة محجوزة بوضوح للنص، أسلوب احترافي لعرض الثقة الاجتماعية، دقة فيكتور نظيفة، لمسة نهائية فاخرة",
        variables: [
          { key: "color", label_ar: "اللون", label_en: "Color", default: "soft blue" },
        ],
        style: "minimal",
        model: MODEL,
        tags: ["إعلان", "تقييمات"],
      },
      {
        slug: "story-countdown-launch",
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
        slug: "carousel-tips-slide",
        title_ar: "شريحة كاروسيل نصائح",
        title_en: "Carousel Tips Slide",
        description_ar: "تصميم شريحة موحدة لمنشورات الكاروسيل التعليمية",
        description_en: "Cohesive slide design for educational carousel posts",
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
        slug: "limited-stock-urgency",
        title_ar: "تصميم إلحاح الكمية المحدودة",
        title_en: "Limited Stock Urgency Design",
        description_ar: "تصميم يحفّز الشراء الفوري بشعور الندرة",
        description_en: "Design that drives urgency and immediate purchase action",
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
        slug: "gift-guide-ad",
        title_ar: "إعلان دليل هدايا",
        title_en: "Gift Guide Ad",
        description_ar: "تصميم دافئ يعرض تشكيلة هدايا لمناسبة معينة",
        description_en: "Warm design showcasing a curated gift collection",
        prompt_text_en:
          "cozy gift guide advertisement featuring {{items}} arranged elegantly with intentional visual balance, warm {{color}} festive palette, soft ribbon and wrapping paper texture detail, inviting shopping campaign style, gentle natural lighting, premium seasonal retail quality",
        prompt_display_ar:
          "إعلان دليل هدايا دافئ يعرض {{items}} مرتبة بأناقة وتوازن بصري مدروس، لوحة ألوان احتفالية دافئة {{color}}، تفاصيل ملمس شرائط وورق تغليف ناعمة، أسلوب حملة تسوق جذابة، إضاءة طبيعية لطيفة، جودة تجارية موسمية فاخرة",
        variables: [
          { key: "items", label_ar: "الهدايا", label_en: "Gift items", default: "perfume bottles and gift boxes" },
          { key: "color", label_ar: "الألوان", label_en: "Colors", default: "burgundy and gold" },
        ],
        style: "festive",
        model: MODEL,
        tags: ["إعلان", "هدايا"],
      },
      {
        slug: "review-highlight-card",
        title_ar: "بطاقة إبراز تقييم مميز",
        title_en: "Review Highlight Card",
        description_ar: "تصميم يبرز تقييماً بارزاً لبناء الثقة",
        description_en: "Design highlighting a standout review to build trust",
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
        slug: "minimal-lettermark-logo",
        title_ar: "لوجو حرفي بسيط",
        title_en: "Minimal Lettermark Logo",
        description_ar: "شعار أنيق مبني على الحرف الأول من اسم العلامة",
        description_en: "Elegant logo built around the brand's initial letter",
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
        slug: "abstract-mark-logo",
        title_ar: "شعار رمزي تجريدي",
        title_en: "Abstract Symbol Mark",
        description_ar: "رمز تجريدي يعكس مفهوم النشاط التجاري",
        description_en: "Abstract symbol representing the brand's concept",
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
        slug: "mascot-character-logo",
        title_ar: "شعار شخصية كرتونية (ماسكوت)",
        title_en: "Mascot Character Logo",
        description_ar: "شخصية ودودة تمثل العلامة التجارية بأسلوب كرتوني",
        description_en: "Friendly character representing the brand in cartoon style",
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
        slug: "emblem-badge-logo",
        title_ar: "شعار شارة تقليدية (إمبلم)",
        title_en: "Classic Emblem Badge Logo",
        description_ar: "شعار دائري كلاسيكي يوحي بالثقة والتراث",
        description_en: "Classic circular badge conveying trust and heritage",
        prompt_text_en:
          "vintage emblem badge logo design for {{business}}, precise circular border with fine ornamental detailing, {{color}} monochrome palette, centered icon of {{icon}}, flat scalable vector illustration on a plain white background, heritage-quality craftsmanship feel",
        prompt_display_ar:
          "تصميم شعار شارة كلاسيكية (إمبلم) لـ {{business}}، حدود دائرية دقيقة بتفاصيل زخرفية أنيقة، لوحة ألوان أحادية {{color}}، أيقونة مركزية لـ {{icon}}، رسم فيكتور مسطح قابل للتحجيم على خلفية بيضاء، إحساس حرفي تراثي عالي الجودة",
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
        slug: "brand-color-palette-board",
        title_ar: "لوحة ألوان الهوية البصرية",
        title_en: "Brand Color Palette Board",
        description_ar: "عرض منظم لألوان الهوية البصرية للعلامة",
        description_en: "Organized presentation of the brand's color identity",
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
        slug: "business-card-mockup",
        title_ar: "موك أب بطاقة عمل",
        title_en: "Business Card Mockup",
        description_ar: "عرض واقعي لتصميم بطاقة العمل على سطح أنيق",
        description_en: "Realistic mockup of a business card design on an elegant surface",
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
        slug: "storefront-signage-mockup",
        title_ar: "موك أب لافتة واجهة متجر",
        title_en: "Storefront Signage Mockup",
        description_ar: "عرض الشعار على واجهة متجر واقعية",
        description_en: "Logo displayed on a realistic store front",
        prompt_text_en:
          "photorealistic storefront signage mockup for {{business}}, modern architectural shop exterior, clean {{color}} signage board with clear logo placement space, natural daytime lighting with accurate shadows, architectural photography style, high-detail realistic materials",
        prompt_display_ar:
          "موك أب واقعي للافتة واجهة متجر لـ {{business}}، واجهة محل معمارية عصرية، لوحة لافتة نظيفة بلون {{color}} مع مساحة واضحة لوضع الشعار، إضاءة نهارية طبيعية بظلال دقيقة، أسلوب تصوير معماري، خامات واقعية عالية التفاصيل",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a bakery" },
          { key: "color", label_ar: "لون اللافتة", label_en: "Signage color", default: "warm cream and wood" },
        ],
        style: "mockup",
        model: MODEL,
        tags: ["هوية", "واجهة متجر"],
      },
      {
        slug: "app-icon-design",
        title_ar: "تصميم أيقونة تطبيق",
        title_en: "App Icon Design",
        description_ar: "أيقونة تطبيق حديثة بزوايا دائرية وألوان متدرجة",
        description_en: "Modern rounded app icon with gradient colors",
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
        slug: "letterhead-mockup",
        title_ar: "موك أب ورق رسمي (Letterhead)",
        title_en: "Letterhead Mockup",
        description_ar: "عرض واقعي لتصميم الورق الرسمي للمراسلات",
        description_en: "Realistic mockup of official correspondence stationery",
        prompt_text_en:
          "photorealistic letterhead mockup for {{business}}, minimal {{color}} header design with clear logo placement space, clean textured paper, top-down flat lay photography with soft even lighting, professional stationery presentation, print-accurate detail",
        prompt_display_ar:
          "موك أب واقعي لورق رسمي لـ{{business}}، تصميم ترويسة بسيط بلون {{color}} مع مساحة واضحة للشعار، خامة ورق نظيفة، تصوير من الأعلى بإضاءة ناعمة متساوية، عرض قرطاسية احترافي، تفاصيل دقيقة مطابقة للطباعة",
        variables: [
          { key: "business", label_ar: "النشاط التجاري", label_en: "Business", default: "a law firm" },
          { key: "color", label_ar: "اللون", label_en: "Color", default: "navy blue" },
        ],
        style: "mockup",
        model: MODEL,
        tags: ["هوية", "قرطاسية"],
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
        slug: "corporate-headshot",
        title_ar: "صورة شخصية احترافية للأعمال",
        title_en: "Professional Corporate Headshot",
        description_ar: "صورة بورتريه رسمية تناسب الملفات الشخصية المهنية",
        description_en: "Formal portrait suited for professional profiles",
        prompt_text_en:
          "professional corporate headshot portrait of a {{person}}, wearing {{outfit}}, neutral gray studio background, soft even three-point lighting, 85mm portrait lens with subtle background compression, confident authentic expression, natural skin texture with no over-smoothing, sharp eye focus, high-end LinkedIn-quality photography",
        prompt_display_ar:
          "صورة بورتريه احترافية لـ{{person}}، يرتدي {{outfit}}، خلفية استوديو رمادية محايدة، إضاءة ثلاثية الاتجاه ناعمة متساوية، عدسة بورتريه 85 مم مع ضغط خلفية خفيف، تعبير واثق وأصيل، ملمس بشرة طبيعي بلا تنعيم مفرط، تركيز حاد على العينين، تصوير بجودة LinkedIn الاحترافية",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a businesswoman" },
          { key: "outfit", label_ar: "الزي", label_en: "Outfit", default: "a tailored navy blazer" },
        ],
        style: "corporate",
        model: MODEL,
        tags: ["بورتريه", "أعمال"],
        is_featured: true,
      },
      {
        slug: "cinematic-outdoor-portrait",
        title_ar: "بورتريه سينمائي خارجي",
        title_en: "Cinematic Outdoor Portrait",
        description_ar: "بورتريه بإضاءة الغروب وأجواء سينمائية",
        description_en: "Portrait with golden hour lighting and cinematic mood",
        prompt_text_en:
          "cinematic portrait of a {{person}}, golden hour sunset lighting, warm rim light separating the subject from the background, shallow depth of field with a smoothly blurred outdoor background, subtle film grain, teal-and-orange inspired color grading, moody atmospheric mood, professional 85mm lens photography",
        prompt_display_ar:
          "بورتريه سينمائي لـ{{person}}، إضاءة غروب الشمس الذهبية، ضوء حافة دافئ يفصل الشخص عن الخلفية، عمق ميدان ضحل مع خلفية خارجية ضبابية ناعمة، حبيبات فيلم خفيفة، تدرج ألوان مستوحى من السماوي والبرتقالي، أجواء درامية غامضة، تصوير احترافي بعدسة 85 مم",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young man" },
        ],
        style: "cinematic",
        model: MODEL,
        tags: ["بورتريه", "سينمائي"],
      },
      {
        slug: "studio-beauty-portrait",
        title_ar: "بورتريه تجميلي في الاستوديو",
        title_en: "Studio Beauty Portrait",
        description_ar: "بورتريه ناعم يبرز نضارة البشرة لإعلانات التجميل",
        description_en: "Soft glowing portrait highlighting skin, ideal for beauty ads",
        prompt_text_en:
          "beauty studio portrait of a {{person}}, flawless naturally glowing skin, soft beauty-dish lighting with a gentle catchlight in the eyes, clean {{background_color}} background, minimal fresh makeup, sharp macro-level facial detail, cosmetics advertising quality, color-accurate skin tones",
        prompt_display_ar:
          "بورتريه تجميلي في الاستوديو لـ{{person}}، بشرة متوهجة طبيعياً وخالية من العيوب، إضاءة طبق تجميل ناعمة مع بريق خفيف في العينين، خلفية نظيفة بلون {{background_color}}، مكياج بسيط منعش، تفاصيل وجه دقيقة جداً، جودة إعلانات مستحضرات التجميل، دقة ألوان بشرة واقعية",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a woman" },
          { key: "background_color", label_ar: "لون الخلفية", label_en: "Background color", default: "soft pink" },
        ],
        style: "beauty",
        model: MODEL,
        tags: ["بورتريه", "تجميل"],
      },
      {
        slug: "traditional-attire-portrait",
        title_ar: "بورتريه بالزي التراثي",
        title_en: "Traditional Attire Portrait",
        description_ar: "بورتريه يبرز الزي التراثي الخليجي بإضاءة فاخرة",
        description_en: "Portrait highlighting traditional Gulf attire with elegant lighting",
        prompt_text_en:
          "elegant portrait of a {{person}} wearing traditional {{attire}}, rich warm directional lighting, ornate patterned background, richly detailed fabric texture and embroidery, cultural heritage photography, high production quality, dignified composed posture",
        prompt_display_ar:
          "بورتريه أنيق لـ{{person}} يرتدي {{attire}} التراثي، إضاءة موجهة دافئة وفاخرة، خلفية بزخارف مزركشة، تفاصيل قماش وتطريز دقيقة جداً، تصوير تراثي ثقافي، جودة إنتاج عالية، وقفة متزنة ووقورة",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a man" },
          { key: "attire", label_ar: "الزي", label_en: "Attire", default: "a bisht over a white thobe" },
        ],
        style: "cultural",
        model: MODEL,
        tags: ["بورتريه", "تراث"],
      },
      {
        slug: "candid-lifestyle-portrait",
        title_ar: "بورتريه عفوي بأسلوب حياتي",
        title_en: "Candid Lifestyle Portrait",
        description_ar: "لحظة طبيعية غير مصطنعة تناسب المحتوى الشخصي",
        description_en: "A natural unposed moment, great for personal content",
        prompt_text_en:
          "candid lifestyle portrait of a {{person}} laughing naturally at {{location}}, soft natural daylight, genuinely unposed authentic moment, warm film-inspired color grading, documentary photography style, natural motion blur on background elements, real emotion captured mid-moment",
        prompt_display_ar:
          "بورتريه عفوي بأسلوب حياتي لـ{{person}} يضحك بشكل طبيعي في {{location}}، ضوء نهار طبيعي ناعم، لحظة أصيلة غير مصطنعة تماماً، تدرج ألوان دافئ مستوحى من الأفلام، أسلوب تصوير وثائقي، ضبابية حركة طبيعية في عناصر الخلفية، مشاعر حقيقية ملتقطة في لحظتها",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "a young woman" },
          { key: "location", label_ar: "المكان", label_en: "Location", default: "a busy souq" },
        ],
        style: "candid",
        model: MODEL,
        tags: ["بورتريه", "حياتي"],
      },
      {
        slug: "dramatic-black-white-portrait",
        title_ar: "بورتريه درامي بالأبيض والأسود",
        title_en: "Dramatic Black & White Portrait",
        description_ar: "بورتريه فني كلاسيكي بتباين قوي وظلال درامية",
        description_en: "Classic artistic portrait with strong contrast and dramatic shadows",
        prompt_text_en:
          "dramatic black and white portrait of a {{person}}, strong directional side lighting (Rembrandt style), deep rich shadows, high tonal contrast, fine-art photography quality, tack-sharp detailed eyes, timeless classic mood, full dynamic range from pure black to bright highlight",
        prompt_display_ar:
          "بورتريه درامي بالأبيض والأسود لـ{{person}}، إضاءة جانبية قوية موجهة (أسلوب رامبرانت)، ظلال عميقة وغنية، تباين لوني عالٍ، جودة تصوير فني كلاسيكي، عينان حادتا التفاصيل جداً، أجواء خالدة كلاسيكية، مدى ديناميكي كامل من الأسود التام للإضاءة الساطعة",
        variables: [
          { key: "person", label_ar: "الشخص", label_en: "Person", default: "an elderly man" },
        ],
        style: "fine art",
        model: MODEL,
        tags: ["بورتريه", "أبيض وأسود"],
      },
      {
        slug: "family-group-portrait",
        title_ar: "بورتريه عائلي جماعي",
        title_en: "Family Group Portrait",
        description_ar: "صورة جماعية دافئة تناسب المناسبات العائلية",
        description_en: "Warm group photo suited for family occasions",
        prompt_text_en:
          "warm family group portrait of {{group}}, soft golden hour outdoor lighting, natural genuine smiles and relaxed poses, coordinated {{color}} outfit tones, professional family photography style, gentle bokeh background, heartfelt authentic connection captured",
        prompt_display_ar:
          "بورتريه عائلي جماعي دافئ لـ{{group}}، إضاءة خارجية ذهبية ناعمة، ابتسامات طبيعية صادقة ووضعيات مريحة، ألوان ملابس منسقة {{color}}، أسلوب تصوير عائلي احترافي، خلفية بوكيه ناعمة، ترابط أصيل ملموس",
        variables: [
          { key: "group", label_ar: "أفراد العائلة", label_en: "Family members", default: "a family of four" },
          { key: "color", label_ar: "ألوان الملابس", label_en: "Outfit colors", default: "beige and white" },
        ],
        style: "lifestyle",
        model: MODEL,
        tags: ["بورتريه", "عائلي"],
      },
      {
        slug: "team-corporate-portrait",
        title_ar: "بورتريه فريق العمل",
        title_en: "Corporate Team Portrait",
        description_ar: "صورة جماعية احترافية لفريق العمل داخل المكتب",
        description_en: "Professional group photo of a team inside the office",
        prompt_text_en:
          "professional corporate team portrait of {{team_size}} colleagues, modern office background with soft depth blur, bright even lighting, confident friendly poses, business casual attire, high-end corporate photography, natural group composition with clear individual detail",
        prompt_display_ar:
          "بورتريه احترافي لفريق عمل مكوّن من {{team_size}}، خلفية مكتب عصري بضبابية ناعمة، إضاءة ساطعة متساوية، وضعيات واثقة وودية، زي عمل غير رسمي، تصوير مؤسسي راقٍ، تكوين جماعي طبيعي مع وضوح تفاصيل كل فرد",
        variables: [
          { key: "team_size", label_ar: "عدد أفراد الفريق", label_en: "Team size", default: "five" },
        ],
        style: "corporate",
        model: MODEL,
        tags: ["بورتريه", "فريق عمل"],
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
        slug: "3d-render-character",
        title_ar: "شخصية برندر ثلاثي الأبعاد",
        title_en: "3D Rendered Character",
        description_ar: "شخصية بأسلوب رندر ثلاثي الأبعاد ناعم وحديث",
        description_en: "Character in a smooth modern 3D render style",
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
        is_featured: true,
      },
      {
        slug: "anime-style-scene",
        title_ar: "مشهد بأسلوب الأنمي",
        title_en: "Anime Style Scene",
        description_ar: "مشهد ملون بأسلوب رسوم الأنمي الياباني",
        description_en: "Colorful scene drawn in Japanese anime art style",
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
        slug: "cinematic-movie-still",
        title_ar: "لقطة سينمائية بأسلوب الأفلام",
        title_en: "Cinematic Movie Still",
        description_ar: "مشهد بجودة وأجواء لقطة فيلم سينمائي",
        description_en: "Scene with the quality and mood of a film still",
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
        slug: "watercolor-illustration",
        title_ar: "رسمة بألوان مائية",
        title_en: "Watercolor Illustration",
        description_ar: "رسمة ناعمة بأسلوب الألوان المائية اليدوية",
        description_en: "Soft handmade-feel illustration in watercolor style",
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
        slug: "isometric-illustration",
        title_ar: "رسمة إيزومترية",
        title_en: "Isometric Illustration",
        description_ar: "تصميم إيزومتري نظيف يناسب الشرح البصري والتقني",
        description_en: "Clean isometric design great for tech and explainer visuals",
        prompt_text_en:
          "isometric illustration of {{scene}}, precise clean geometric shapes at true 30-degree isometric angles, flat vibrant colors, soft consistent shadows, miniature diorama feel, modern tech illustration style, crisp vector-quality edges, polished product-explainer quality",
        prompt_display_ar:
          "رسمة إيزومترية لـ{{scene}}، أشكال هندسية نظيفة بزاوية إيزومترية دقيقة 30 درجة، ألوان مسطحة زاهية، ظلال ناعمة متسقة، طابع الديوراما المصغرة، أسلوب رسم تقني عصري، حواف بجودة فيكتور نظيفة، جودة شرح منتج مصقولة",
        variables: [
          { key: "scene", label_ar: "المشهد", label_en: "Scene", default: "a small coffee shop interior" },
        ],
        style: "isometric",
        model: MODEL,
        tags: ["فني", "إيزومتري"],
      },
      {
        slug: "arabic-calligraphy-art",
        title_ar: "لوحة خط عربي فني",
        title_en: "Arabic Calligraphy Art",
        description_ar: "تكوين فني معاصر مبني على الخط العربي",
        description_en: "Contemporary artistic composition built on Arabic calligraphy",
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
      {
        slug: "pop-art-portrait",
        title_ar: "بورتريه بأسلوب البوب آرت",
        title_en: "Pop Art Style Portrait",
        description_ar: "بورتريه ملون بأسلوب البوب آرت الجريء",
        description_en: "Bold colorful portrait in the pop art style",
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
        slug: "cyberpunk-scene",
        title_ar: "مشهد سايبربانك مستقبلي",
        title_en: "Cyberpunk Futuristic Scene",
        description_ar: "مشهد مدينة مستقبلية بأضواء نيون ساطعة",
        description_en: "A futuristic city scene lit with vivid neon lights",
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
        slug: "podcast-cover-art",
        title_ar: "غلاف بودكاست",
        title_en: "Podcast Cover Art",
        description_ar: "غلاف مربع جذاب يناسب منصات البودكاست",
        description_en: "Eye-catching square cover suited for podcast platforms",
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
        is_featured: true,
      },
      {
        slug: "ebook-cover-design",
        title_ar: "غلاف كتاب إلكتروني",
        title_en: "Ebook Cover Design",
        description_ar: "غلاف احترافي لكتاب رقمي أو دليل إرشادي",
        description_en: "Professional cover for a digital book or guide",
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
        slug: "youtube-thumbnail",
        title_ar: "صورة مصغرة ليوتيوب",
        title_en: "YouTube Thumbnail",
        description_ar: "صورة مصغرة لافتة تزيد نسبة النقر على الفيديو",
        description_en: "Attention-grabbing thumbnail to boost video click-through",
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
      },
      {
        slug: "linkedin-banner",
        title_ar: "بانر لينكدإن احترافي",
        title_en: "Professional LinkedIn Banner",
        description_ar: "بانر بروفايل يعكس هوية احترافية على لينكدإن",
        description_en: "Profile banner reflecting a professional identity on LinkedIn",
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
        slug: "event-poster-design",
        title_ar: "بوستر فعالية",
        title_en: "Event Poster Design",
        description_ar: "بوستر إعلاني جذاب للفعاليات والمؤتمرات",
        description_en: "Eye-catching poster design for events and conferences",
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
        slug: "playlist-cover-art",
        title_ar: "غلاف قائمة تشغيل موسيقية",
        title_en: "Music Playlist Cover Art",
        description_ar: "غلاف مربع نابض بالحياة لقوائم التشغيل الموسيقية",
        description_en: "Vibrant square cover art for music playlists",
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
        slug: "social-profile-header",
        title_ar: "غلاف بروفايل تويتر/إكس",
        title_en: "Twitter/X Profile Header",
        description_ar: "غلاف بروفايل عريض يعكس هوية العلامة",
        description_en: "Wide profile header reflecting the brand's identity",
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
        slug: "ramadan-greeting-post",
        title_ar: "منشور تهنئة رمضانية",
        title_en: "Ramadan Greeting Post",
        description_ar: "تصميم احتفالي بأجواء رمضان للمتاجر والعلامات",
        description_en: "Festive Ramadan-themed design for stores and brands",
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
        slug: "eid-celebration-banner",
        title_ar: "بانر احتفال العيد",
        title_en: "Eid Celebration Banner",
        description_ar: "بانر مبهج للاحتفال بالعيد ومناسبات العروض",
        description_en: "Cheerful banner for Eid celebrations and related promotions",
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
        slug: "national-day-poster",
        title_ar: "بوستر اليوم الوطني",
        title_en: "National Day Poster",
        description_ar: "تصميم فخم يحتفي بمناسبة اليوم الوطني",
        description_en: "A proud design celebrating National Day",
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
        slug: "seasonal-sale-occasion",
        title_ar: "تصميم عروض موسم التخفيضات",
        title_en: "Seasonal Sale Occasion Design",
        description_ar: "تصميم موسمي حماسي لحملات التخفيضات الكبرى",
        description_en: "Energetic seasonal design for major sale campaigns",
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
        slug: "graduation-announcement",
        title_ar: "تصميم تهنئة تخرج",
        title_en: "Graduation Announcement Design",
        description_ar: "تصميم أنيق للاحتفال بمناسبة التخرج",
        description_en: "Elegant design celebrating a graduation milestone",
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
        slug: "wedding-invitation-design",
        title_ar: "تصميم دعوة زفاف",
        title_en: "Wedding Invitation Design",
        description_ar: "تصميم دعوة زفاف راقٍ بلمسة عربية",
        description_en: "Refined wedding invitation with an Arabic touch",
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
        slug: "new-year-celebration",
        title_ar: "تصميم احتفال رأس السنة",
        title_en: "New Year Celebration Design",
        description_ar: "تصميم احتفالي متلألئ لمناسبة رأس السنة الميلادية",
        description_en: "Sparkling festive design for New Year celebrations",
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
        slug: "mothers-day-design",
        title_ar: "تصميم عيد الأم",
        title_en: "Mother's Day Design",
        description_ar: "تصميم دافئ ورقيق للاحتفاء بعيد الأم",
        description_en: "Warm gentle design celebrating Mother's Day",
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
    ],
  },
];

export const allSeedPrompts = seedCategories.flatMap((category) =>
  category.prompts.map((prompt) => ({ ...prompt, categorySlug: category.slug })),
);
