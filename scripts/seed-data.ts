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
          "professional studio product photography of {{product}}, centered composition, pure white seamless background, soft diffused lighting, subtle shadow beneath the product, high detail, commercial e-commerce style, 4k",
        prompt_display_ar:
          "تصوير منتج احترافي في استوديو لـ {{product}}، تكوين مركزي، خلفية بيضاء ناصعة بلا حواف، إضاءة ناعمة موزعة، ظل خفيف أسفل المنتج، تفاصيل عالية، أسلوب تجاري للمتاجر الإلكترونية، دقة 4K",
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
          "lifestyle product photography, {{product}} placed on a {{surface}}, natural window light, warm cozy atmosphere, shallow depth of field, editorial commercial photography, realistic textures",
        prompt_display_ar:
          "تصوير منتج بأسلوب حياتي، {{product}} موضوع على {{surface}}، إضاءة نافذة طبيعية، أجواء دافئة ومريحة، عمق ميدان ضحل، تصوير تجاري تحريري، خامات واقعية",
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
          "{{product}} levitating in mid-air, zero gravity effect, dynamic scattered elements around it, dramatic studio lighting, gradient {{background_color}} background, high-end advertising photography, sharp focus",
        prompt_display_ar:
          "{{product}} يطفو في الهواء، تأثير انعدام الجاذبية، عناصر متناثرة ديناميكية حوله، إضاءة استوديو درامية، خلفية متدرجة باللون {{background_color}}، تصوير إعلاني راقٍ، تركيز حاد",
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
          "flat lay photography from directly above, {{product}} arranged neatly with {{props}}, {{background_color}} background, soft natural light, minimal aesthetic, symmetrical composition, high resolution",
        prompt_display_ar:
          "تصوير من الأعلى مباشرة (Flat Lay)، {{product}} مرتب بعناية مع {{props}}، خلفية {{background_color}}، إضاءة طبيعية ناعمة، تصميم بسيط أنيق، تكوين متماثل، دقة عالية",
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
          "close-up photo of a hand holding {{product}}, natural skin tones, soft daylight, blurred background, authentic unboxing style, high detail texture",
        prompt_display_ar:
          "لقطة قريبة ليد تمسك {{product}}، ألوان بشرة طبيعية، ضوء نهار ناعم، خلفية ضبابية، أسلوب فتح الصندوق الواقعي، تفاصيل خامة عالية",
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
          "{{product}} with dynamic {{liquid}} splash frozen in motion around it, dark studio background, dramatic rim lighting, high speed photography, crisp water droplets, commercial quality",
        prompt_display_ar:
          "{{product}} مع تناثر {{liquid}} متجمد أثناء الحركة حوله، خلفية استوديو داكنة، إضاءة حافة درامية، تصوير عالي السرعة، قطرات ماء واضحة، جودة تجارية",
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
          "realistic packaging mockup of {{product}} box, {{color}} design, placed on a clean surface, soft studio lighting, subtle reflection, front-facing angle, high resolution product render",
        prompt_display_ar:
          "موك أب واقعي لعلبة تغليف {{product}}، تصميم بلون {{color}}، موضوعة على سطح نظيف، إضاءة استوديو ناعمة، انعكاس خفيف، زاوية أمامية، عرض منتج بدقة عالية",
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
          "{{product}} placed among natural elements like stones and green leaves, outdoor golden hour lighting, organic earthy tones, shallow depth of field, editorial nature photography",
        prompt_display_ar:
          "{{product}} موضوع وسط عناصر طبيعية كالحجارة وأوراق الشجر، إضاءة الساعة الذهبية الخارجية، ألوان ترابية طبيعية، عمق ميدان ضحل، تصوير طبيعي تحريري",
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
          "three-quarter angle product photo of {{product}}, light gray gradient background, even studio lighting, sharp focus, no harsh shadows, catalog ready, professional retouching",
        prompt_display_ar:
          "صورة منتج بزاوية ثلاثة أرباع لـ {{product}}، خلفية متدرجة رمادية فاتحة، إضاءة استوديو متساوية، تركيز حاد، بلا ظلال قاسية، جاهزة للكتالوج، معالجة احترافية",
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
          "clean grid layout showing {{product}} in three different color variants, consistent studio lighting, plain white background, evenly spaced arrangement, e-commerce variant showcase style",
        prompt_display_ar:
          "تخطيط شبكي نظيف يعرض {{product}} بثلاثة تدرجات ألوان مختلفة، إضاءة استوديو ثابتة، خلفية بيضاء بسيطة، ترتيب متساوي المسافات، أسلوب عرض خيارات المتجر الإلكتروني",
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
          "square format social media advertisement for {{business}}, bold {{color}} color scheme, large empty space for text overlay, modern flat design, high contrast, eye-catching, marketing poster style",
        prompt_display_ar:
          "إعلان سوشيال ميديا بمقاس مربع لـ {{business}}، ألوان جريئة بلون {{color}}، مساحة فارغة كبيرة لإضافة نص، تصميم مسطح عصري، تباين عالٍ، لافت للنظر، أسلوب بوستر تسويقي",
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
          "vibrant sale banner design, big bold '{{discount}}' text placeholder area, dynamic diagonal shapes, {{color}} gradient background, confetti and burst elements, exciting retail promotion style",
        prompt_display_ar:
          "تصميم بانر تخفيضات نابض بالحياة، مساحة نصية كبيرة وجريئة لنسبة الخصم '{{discount}}'، أشكال قطرية ديناميكية، خلفية متدرجة بلون {{color}}، عناصر قصاصات ورقية واحتفالية، أسلوب ترويجي حماسي للتجزئة",
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
          "modern smartphone mockup floating at an angle, displaying a clean {{app_type}} app interface, soft gradient {{color}} background, subtle shadow, tech marketing style, minimal and premium",
        prompt_display_ar:
          "موك أب هاتف ذكي عصري معلق بزاوية، يعرض واجهة تطبيق {{app_type}} نظيفة، خلفية متدرجة ناعمة بلون {{color}}، ظل خفيف، أسلوب تسويقي تقني، بسيط وراقٍ",
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
          "split screen comparison image, left side showing {{before}}, right side showing {{after}}, clean dividing line, bright even lighting, professional before-and-after marketing layout",
        prompt_display_ar:
          "صورة مقارنة مقسومة الشاشة، الجانب الأيسر يُظهر {{before}}، الجانب الأيمن يُظهر {{after}}، خط فاصل نظيف، إضاءة ساطعة ومتساوية، تخطيط تسويقي احترافي لقبل وبعد",
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
          "elegant testimonial card background design, soft {{color}} pastel tones, large quotation mark graphic, star rating icons, minimal clean layout with space for text, professional social proof style",
        prompt_display_ar:
          "خلفية بطاقة تقييم عملاء أنيقة، درجات لون {{color}} هادئة، رمز علامة اقتباس كبيرة، أيقونات تقييم بالنجوم، تخطيط بسيط ونظيف مع مساحة للنص، أسلوب احترافي لعرض الثقة الاجتماعية",
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
          "vertical story format design, dramatic countdown timer graphic, dark {{color}} background with glowing particles, teaser text space, futuristic launch announcement style, high energy",
        prompt_display_ar:
          "تصميم ستوري بصيغة رأسية، رسم عداد تنازلي درامي، خلفية داكنة بلون {{color}} مع جزيئات متوهجة، مساحة نص تشويقي، أسلوب إعلان إطلاق مستقبلي، طاقة عالية",
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
          "clean educational carousel slide design, bold number '{{number}}' graphic element, {{color}} background with soft geometric shapes, generous text space, modern infographic style",
        prompt_display_ar:
          "تصميم شريحة كاروسيل تعليمية نظيفة، عنصر رقم '{{number}}' بارز، خلفية بلون {{color}} مع أشكال هندسية ناعمة، مساحة نص واسعة، أسلوب إنفوجرافيك عصري",
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
          "urgent retail promotion design, '{{message}}' bold typography placeholder, warning stripe pattern accents, {{color}} high alert color scheme, dynamic energetic composition",
        prompt_display_ar:
          "تصميم ترويجي عاجل للتجزئة، مساحة نصية بارزة لعبارة '{{message}}'، لمسات نمط خطوط تحذيرية، تدرج ألوان {{color}} عالي التنبيه، تكوين ديناميكي حيوي",
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
          "cozy gift guide advertisement featuring {{items}} arranged elegantly, warm {{color}} festive palette, soft ribbon and wrapping paper details, inviting shopping campaign style",
        prompt_display_ar:
          "إعلان دليل هدايا دافئ يعرض {{items}} مرتبة بأناقة، لوحة ألوان احتفالية دافئة {{color}}، تفاصيل شرائط وورق تغليف ناعمة، أسلوب حملة تسوق جذابة",
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
          "eye-catching review highlight card design, five gold stars prominently displayed, soft {{color}} background, quotation accent graphic, clean modern layout with space for review text",
        prompt_display_ar:
          "تصميم بطاقة إبراز تقييم لافت، خمس نجوم ذهبية بارزة، خلفية ناعمة بلون {{color}}، لمسة رسومية لعلامة اقتباس، تخطيط عصري نظيف مع مساحة لنص التقييم",
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
          "minimal lettermark logo design featuring the letter '{{letter}}', geometric clean lines, {{color}} color palette, flat vector style, centered on plain white background, modern brand identity",
        prompt_display_ar:
          "تصميم لوجو حرفي بسيط يعتمد على الحرف '{{letter}}'، خطوط هندسية نظيفة، لوحة ألوان {{color}}، أسلوب فيكتور مسطح، في وسط خلفية بيضاء بسيطة، هوية علامة تجارية عصرية",
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
          "abstract geometric logo mark representing {{concept}}, minimal flat vector shapes, {{color}} gradient, balanced negative space, professional brand mark on white background",
        prompt_display_ar:
          "شعار هندسي تجريدي يمثل مفهوم {{concept}}، أشكال فيكتور مسطحة بسيطة، تدرج لوني {{color}}، توازن في المساحات الفارغة، علامة تجارية احترافية على خلفية بيضاء",
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
          "friendly cartoon mascot logo of a {{animal}}, bold outlines, flat vibrant {{color}} colors, playful expression, centered vector illustration on white background, brand mascot style",
        prompt_display_ar:
          "شعار ماسكوت كرتوني ودود على شكل {{animal}}، خطوط خارجية بارزة، ألوان مسطحة زاهية {{color}}، تعبير مرح، رسم فيكتور في المنتصف على خلفية بيضاء، أسلوب ماسكوت للعلامة التجارية",
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
          "vintage emblem badge logo design for {{business}}, circular border with ornamental details, {{color}} monochrome palette, centered icon of {{icon}}, flat vector illustration on white background",
        prompt_display_ar:
          "تصميم شعار شارة كلاسيكية (إمبلم) لـ {{business}}، حدود دائرية بتفاصيل زخرفية، لوحة ألوان أحادية {{color}}، أيقونة مركزية لـ {{icon}}، رسم فيكتور على خلفية بيضاء",
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
          "clean brand style guide color palette board, five color swatches in {{color}} tones arranged horizontally, minimal typography labels, professional branding presentation layout, white background",
        prompt_display_ar:
          "لوحة عرض ألوان دليل الهوية البصرية بتصميم نظيف، خمس عينات ألوان بدرجات {{color}} مرتبة أفقياً، تسميات نصية بسيطة، تخطيط عرض احترافي للهوية، خلفية بيضاء",
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
          "realistic business card mockup, two cards with a {{color}} minimal design, placed on a {{surface}}, soft natural lighting, shallow depth of field, professional branding photography",
        prompt_display_ar:
          "موك أب واقعي لبطاقة عمل، بطاقتان بتصميم بسيط بلون {{color}}، موضوعتان على {{surface}}، إضاءة طبيعية ناعمة، عمق ميدان ضحل، تصوير هوية بصرية احترافي",
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
          "realistic storefront signage mockup for {{business}}, modern shop exterior, clean {{color}} signage board with logo placeholder, daytime natural lighting, architectural photography style",
        prompt_display_ar:
          "موك أب واقعي للافتة واجهة متجر لـ {{business}}، واجهة محل عصرية، لوحة لافتة نظيفة بلون {{color}} مع مساحة للشعار، إضاءة نهارية طبيعية، أسلوب تصوير معماري",
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
          "modern mobile app icon design, rounded square shape, simple {{symbol}} symbol centered, smooth {{color}} gradient background, flat minimal style, iOS app store quality",
        prompt_display_ar:
          "تصميم أيقونة تطبيق جوال عصرية، شكل مربع بزوايا دائرية، رمز {{symbol}} بسيط في المنتصف، خلفية متدرجة ناعمة بلون {{color}}، أسلوب مسطح بسيط، بجودة متجر التطبيقات",
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
          "realistic letterhead mockup for {{business}}, minimal {{color}} header design with logo placeholder, clean paper texture, top-down flat lay photography, professional stationery presentation",
        prompt_display_ar:
          "موك أب واقعي لورق رسمي لـ{{business}}، تصميم ترويسة بسيط بلون {{color}} مع مساحة للشعار، خامة ورق نظيفة، تصوير من الأعلى، عرض قرطاسية احترافي",
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
          "professional corporate headshot portrait of a {{person}}, wearing {{outfit}}, neutral gray studio background, soft even lighting, confident expression, sharp focus, high-end photography",
        prompt_display_ar:
          "صورة بورتريه احترافية لـ{{person}}، يرتدي {{outfit}}، خلفية استوديو رمادية محايدة، إضاءة ناعمة متساوية، تعبير واثق، تركيز حاد، تصوير راقٍ",
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
          "cinematic portrait of a {{person}}, golden hour sunset lighting, warm rim light, shallow depth of field, blurred outdoor background, film grain, moody atmosphere, professional photography",
        prompt_display_ar:
          "بورتريه سينمائي لـ{{person}}، إضاءة غروب الشمس الذهبية، ضوء حافة دافئ، عمق ميدان ضحل، خلفية خارجية ضبابية، حبيبات فيلم، أجواء درامية، تصوير احترافي",
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
          "beauty studio portrait of a {{person}}, flawless glowing skin, soft beauty dish lighting, clean {{background_color}} background, minimal makeup, sharp detailed close-up, cosmetics advertising style",
        prompt_display_ar:
          "بورتريه تجميلي في الاستوديو لـ{{person}}، بشرة نضرة خالية من العيوب، إضاءة طبق تجميل ناعمة، خلفية نظيفة بلون {{background_color}}، مكياج بسيط، لقطة قريبة حادة التفاصيل، أسلوب إعلانات مستحضرات التجميل",
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
          "elegant portrait of a {{person}} wearing traditional {{attire}}, rich warm lighting, ornate patterned background, detailed fabric texture, cultural photography, high production quality",
        prompt_display_ar:
          "بورتريه أنيق لـ{{person}} يرتدي {{attire}} التراثي، إضاءة دافئة فاخرة، خلفية بزخارف مزركشة، تفاصيل قماش دقيقة، تصوير ثقافي، جودة إنتاج عالية",
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
          "candid lifestyle portrait of a {{person}} laughing naturally at {{location}}, soft natural daylight, authentic unposed moment, warm color grading, documentary photography style",
        prompt_display_ar:
          "بورتريه عفوي بأسلوب حياتي لـ{{person}} يضحك بشكل طبيعي في {{location}}، ضوء نهار طبيعي ناعم، لحظة أصيلة غير مصطنعة، تدرج ألوان دافئ، أسلوب تصوير وثائقي",
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
          "dramatic black and white portrait of a {{person}}, strong directional side lighting, deep shadows, high contrast, fine art photography style, sharp detailed eyes, timeless mood",
        prompt_display_ar:
          "بورتريه درامي بالأبيض والأسود لـ{{person}}، إضاءة جانبية قوية موجهة، ظلال عميقة، تباين عالٍ، أسلوب تصوير فني كلاسيكي، عينان حادتا التفاصيل، أجواء خالدة",
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
          "warm family group portrait of {{group}}, soft golden hour outdoor lighting, natural genuine smiles, coordinated {{color}} outfit tones, professional family photography style",
        prompt_display_ar:
          "بورتريه عائلي جماعي دافئ لـ{{group}}، إضاءة خارجية ذهبية ناعمة، ابتسامات طبيعية صادقة، ألوان ملابس منسقة {{color}}، أسلوب تصوير عائلي احترافي",
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
          "professional corporate team portrait of {{team_size}} colleagues, modern office background, bright even lighting, confident friendly poses, business casual attire, high-end corporate photography",
        prompt_display_ar:
          "بورتريه احترافي لفريق عمل مكوّن من {{team_size}}، خلفية مكتب عصري، إضاءة ساطعة متساوية، وضعيات واثقة وودية، زي عمل غير رسمي، تصوير مؤسسي راقٍ",
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
          "cute 3D rendered character of {{subject}}, smooth clay-like material, soft studio lighting, vibrant {{color}} colors, Pixar-inspired style, centered composition, high quality render",
        prompt_display_ar:
          "شخصية برندر ثلاثي الأبعاد لطيفة لـ{{subject}}، خامة ناعمة شبيهة بالصلصال، إضاءة استوديو ناعمة، ألوان زاهية {{color}}، أسلوب مستوحى من بيكسار، تكوين مركزي، رندر عالي الجودة",
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
          "anime style illustration of {{subject}}, vibrant cel-shaded colors, detailed line art, dramatic {{lighting}} lighting, Japanese animation aesthetic, dynamic composition",
        prompt_display_ar:
          "رسمة بأسلوب الأنمي لـ{{subject}}، ألوان زاهية بتظليل خلوي، رسم خطوط دقيق، إضاءة {{lighting}} درامية، جمالية الرسوم المتحركة اليابانية، تكوين ديناميكي",
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
          "cinematic movie still of {{scene}}, anamorphic lens flare, teal and orange color grading, dramatic atmosphere, wide aspect ratio composition, film grain, blockbuster quality",
        prompt_display_ar:
          "لقطة سينمائية من {{scene}}، توهج عدسة أنامورفيك، تدرج ألوان بين السماوي والبرتقالي، أجواء درامية، تكوين بنسبة عرض واسعة، حبيبات فيلم، جودة أفلام هوليوود",
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
          "delicate watercolor illustration of {{subject}}, soft flowing color bleeds, visible paper texture, pastel {{color}} tones, hand-painted artistic style, light and airy composition",
        prompt_display_ar:
          "رسمة ألوان مائية رقيقة لـ{{subject}}، سيولة ألوان ناعمة متداخلة، خامة ورق ظاهرة، درجات {{color}} باستيل، أسلوب فني مرسوم يدوياً، تكوين خفيف وهوائي",
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
          "isometric illustration of {{scene}}, clean geometric shapes, flat vibrant colors, soft shadows, miniature diorama feel, modern tech illustration style",
        prompt_display_ar:
          "رسمة إيزومترية لـ{{scene}}، أشكال هندسية نظيفة، ألوان مسطحة زاهية، ظلال ناعمة، طابع الديوراما المصغرة، أسلوب رسم تقني عصري",
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
          "artistic Arabic calligraphy composition of the word '{{word}}', elegant flowing script, gold ink accents on a {{color}} textured background, modern Islamic art style, high detail",
        prompt_display_ar:
          "لوحة خط عربي فنية لكلمة '{{word}}'، خط انسيابي أنيق، لمسات حبر ذهبي على خلفية بخامة {{color}}، أسلوب فني إسلامي معاصر، تفاصيل عالية",
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
          "pop art style portrait of {{subject}}, bold flat {{color}} color blocks, thick black outlines, halftone dot pattern, Andy Warhol inspired aesthetic, high contrast graphic style",
        prompt_display_ar:
          "بورتريه بأسلوب البوب آرت لـ{{subject}}، كتل ألوان مسطحة جريئة {{color}}، خطوط خارجية سوداء سميكة، نمط نقاط هالفتون، جمالية مستوحاة من آندي وارهول، أسلوب رسومي عالي التباين",
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
          "cyberpunk futuristic scene of {{scene}}, glowing neon {{color}} lights, rain-soaked reflective streets, towering holographic signs, moody atmospheric fog, highly detailed digital art",
        prompt_display_ar:
          "مشهد سايبربانك مستقبلي لـ{{scene}}، أضواء نيون متوهجة {{color}}، شوارع مبللة عاكسة، لافتات هولوغرافية شاهقة، ضباب جوي غامض، فن رقمي عالي التفاصيل",
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
          "modern podcast cover art design, bold {{color}} color scheme, abstract sound wave graphic element, large space for title text, professional audio branding style, square format",
        prompt_display_ar:
          "تصميم غلاف بودكاست عصري، ألوان جريئة بدرجة {{color}}، عنصر رسومي لموجات صوتية تجريدية، مساحة كبيرة لعنوان الحلقة، أسلوب هوية صوتية احترافي، مقاس مربع",
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
          "professional ebook cover design about {{topic}}, minimal modern layout, {{color}} color palette, large title text space, subtle abstract background graphic, publishing quality",
        prompt_display_ar:
          "تصميم غلاف كتاب إلكتروني عن {{topic}}، تخطيط عصري بسيط، لوحة ألوان {{color}}، مساحة نص عنوان كبيرة، رسم خلفية تجريدي خفيف، جودة نشر احترافية",
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
          "high contrast YouTube thumbnail design about {{topic}}, bold expressive focal subject, bright {{color}} background, large readable text space, exciting energetic composition",
        prompt_display_ar:
          "تصميم صورة مصغرة ليوتيوب عالي التباين عن {{topic}}، عنصر محوري تعبيري بارز، خلفية زاهية بلون {{color}}، مساحة نص كبيرة وواضحة، تكوين حيوي ومثير",
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
          "professional LinkedIn banner design, wide format, clean corporate {{color}} palette, subtle geometric background pattern, elegant space for name and title text, business networking style",
        prompt_display_ar:
          "تصميم بانر لينكدإن احترافي، مقاس عريض، لوحة ألوان مؤسسية نظيفة {{color}}، نمط هندسي خفيف في الخلفية، مساحة أنيقة للاسم والمسمى الوظيفي، أسلوب تواصل مهني",
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
          "vibrant event poster design for {{event}}, dynamic layered composition, bold {{color}} color scheme, large space for event details text, modern festival poster style",
        prompt_display_ar:
          "تصميم بوستر فعالية نابض بالحياة لـ{{event}}، تكوين طبقات ديناميكي، ألوان جريئة {{color}}، مساحة كبيرة لتفاصيل الفعالية، أسلوب بوستر مهرجانات عصري",
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
          "vibrant music playlist cover art for a {{genre}} playlist, abstract flowing color shapes, {{color}} gradient palette, dynamic energetic composition, square streaming platform format",
        prompt_display_ar:
          "غلاف قائمة تشغيل موسيقية نابض بالحياة لموسيقى {{genre}}، أشكال لونية متدفقة تجريدية، لوحة تدرج {{color}}، تكوين ديناميكي حيوي، مقاس مربع لمنصات البث",
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
          "wide social media profile header design about {{topic}}, minimal modern {{color}} background, subtle brand pattern, clean composition with space for profile photo overlay, professional look",
        prompt_display_ar:
          "تصميم غلاف بروفايل عريض لمنصة تواصل عن {{topic}}، خلفية عصرية بسيطة بلون {{color}}، نمط علامة تجارية خفيف، تكوين نظيف مع مساحة لصورة البروفايل، مظهر احترافي",
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
          "elegant Ramadan greeting design, ornate crescent moon and lantern illustration, warm {{color}} tones with gold accents, arabesque pattern details, festive Islamic aesthetic, space for greeting text",
        prompt_display_ar:
          "تصميم تهنئة رمضانية أنيق، رسم هلال وفانوس مزخرف، درجات {{color}} دافئة مع لمسات ذهبية، تفاصيل زخرفة عربية، طابع احتفالي إسلامي، مساحة لنص التهنئة",
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
          "joyful Eid celebration banner design, decorative geometric Islamic patterns, bright {{color}} festive colors, fireworks and lantern illustrations, space for greeting message, high quality",
        prompt_display_ar:
          "تصميم بانر احتفال بالعيد مفعم بالبهجة، زخارف إسلامية هندسية، ألوان احتفالية زاهية {{color}}، رسومات ألعاب نارية وفوانيس، مساحة لرسالة التهنئة، جودة عالية",
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
          "patriotic national day poster design, flag colors {{color}}, falcon and heritage pattern silhouettes, fireworks in the sky, dramatic sunset background, celebratory space themed composition",
        prompt_display_ar:
          "تصميم بوستر وطني فخم، ألوان العلم {{color}}، ظلال صقر وزخارف تراثية، ألعاب نارية في السماء، خلفية غروب درامية، تكوين احتفالي بروح المناسبة",
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
          "high energy seasonal sale campaign design for {{season}}, bold '{{discount}}' text placeholder, dynamic burst shapes, vibrant {{color}} color scheme, exciting retail promotion aesthetic",
        prompt_display_ar:
          "تصميم حملة تخفيضات موسمية حماسي لـ{{season}}، مساحة نصية بارزة لعبارة '{{discount}}'، أشكال انفجارية ديناميكية، ألوان زاهية {{color}}، طابع ترويجي مثير للتجزئة",
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
          "elegant graduation celebration design, graduation cap and diploma illustration, confetti details, soft {{color}} festive palette, space for congratulatory text, joyful academic milestone style",
        prompt_display_ar:
          "تصميم احتفالي أنيق بمناسبة التخرج، رسم قبعة تخرج وشهادة، تفاصيل قصاصات احتفالية، لوحة ألوان ناعمة {{color}}، مساحة لنص التهنئة، طابع بهيج لإنجاز أكاديمي",
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
          "luxurious wedding invitation design, delicate floral {{color}} illustrations, elegant ornamental border, soft romantic color palette, space for names and date text, premium stationery style",
        prompt_display_ar:
          "تصميم دعوة زفاف فاخرة، رسومات زهور دقيقة بلون {{color}}، إطار زخرفي أنيق، لوحة ألوان رومانسية ناعمة، مساحة لاسمي العروسين والتاريخ، أسلوب قرطاسية راقٍ",
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
          "festive New Year celebration design, glittering fireworks and confetti, bold '{{year}}' number typography, dark {{color}} background with sparkling light bokeh, celebratory countdown atmosphere",
        prompt_display_ar:
          "تصميم احتفالي برأس السنة، ألعاب نارية وقصاصات متلألئة، خط بارز لرقم السنة '{{year}}'، خلفية داكنة بلون {{color}} مع إضاءة بوكيه متلألئة، أجواء عد تنازلي احتفالية",
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
          "gentle Mother's Day celebration design, soft blooming {{flower}} flowers, warm pastel {{color}} palette, delicate hand-drawn illustration style, tender space for a heartfelt message",
        prompt_display_ar:
          "تصميم رقيق للاحتفاء بعيد الأم، زهور {{flower}} متفتحة ناعمة، لوحة ألوان باستيل دافئة {{color}}، أسلوب رسم يدوي رقيق، مساحة حانية لرسالة من القلب",
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
