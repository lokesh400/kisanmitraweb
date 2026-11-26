/**
 * Kisan Mitra (किसान मित्र) — Clean Bilingual Dictionary
 * Strictly English (en) & Hindi (hi)
 */

const I18N_TRANSLATIONS = {
    en: {
        app_title: "Kisan Mitra",
        app_subtitle: "Tomato & Potato Crop Doctor",
        btn_disease_guide: "Disease Guide",
        btn_chat_nav: "Helpline",

        capture_title: "Inspect Crop Photo",
        capture_desc: "Leaf, stem, fruit, or potato tuber",
        crop_focus_label: "Crop",
        crop_auto: "Auto",
        crop_tomato: "Tomato",
        crop_potato: "Potato",
        btn_upload_mode: "Upload Photo",
        btn_camera_mode: "Camera",
        dropzone_text: "Click or drop photo here",
        dropzone_hint: "Supports JPG, PNG, WebP in any lighting",
        btn_browse: "Choose Photo",
        btn_snap: "Take Photo",
        btn_flip: "Flip",
        btn_remove_preview: "Change Photo",
        btn_diagnose: "Diagnose Crop",
        btn_diagnosing: "Analyzing...",

        results_title: "Diagnosis & Treatment",
        results_desc: "Pathology, remedies & sprayer dosage",
        empty_title: "Ready to Diagnose",
        empty_desc: "Upload or capture a tomato or potato photo to receive complete treatment guidance.",
        loading_title: "Analyzing Photo...",
        loading_desc: "Checking disease patterns, tissue health, and lighting balance.",

        match_confidence: "Match",
        btn_listen: "Listen",
        btn_stop_audio: "Stop",
        btn_whatsapp: "WhatsApp",
        btn_print: "Print",

        tab_organic: "🌿 Organic",
        tab_chemical: "🧪 Sprays & Pump",
        tab_phd: "🔬 Pathology",
        tab_deficiency: "🍂 Nutrients",
        tab_preventive: "🛡️ Prevention",

        organic_header: "Organic & Biological Remedies",
        knapsack_box_title: "15-Liter Knapsack Sprayer Recipe",
        chemical_header: "Chemical Sprays & Dosages",
        phd_taxonomy_title: "Pathogen & Category",
        phd_epidemiology_title: "Weather & Disease Spread",
        phd_differential_title: "Key Distinguishing Symptoms",
        phd_icar_title: "Field Management Protocol",

        spectral_title: "Leaf Tissue Breakdown",
        green_tissue: "Healthy Green",
        yellow_chlorosis: "Yellow Chlorosis",
        brown_necrosis: "Brown Necrosis",
        alt_distribution_title: "Top Probable Matches",

        btn_ask_ai: "Ask Kisan AI",
        chat_modal_title: "Kisan Mitra Advisor",
        advisor_online: "● Online • Tomato & Potato Expert",
        chat_quick_1: "1% Bordeaux mixture?",
        chat_quick_2: "Early vs Late Blight?",
        chat_quick_4: "15L pump dosage?",
        chat_quick_3: "Whitefly organic spray?",
        chat_welcome: "Namaste! Ask me anything about tomato or potato diseases, organic remedies, Bordeaux mixture, or sprayer dosages.",
        chat_placeholder: "Ask a tomato or potato question...",
        chat_send: "Send",

        enc_title: "Tomato & Potato Disease Guide",
        enc_subtitle: "Browse or search any known condition & prescription",
        enc_search_placeholder: "Search symptom or disease (e.g. Scab, Wilt, Blight)...",
        enc_all: "All",

        footer_text: "Tomato & Potato Crop Doctor"
    },
    hi: {
        app_title: "किसान मित्र",
        app_subtitle: "टमाटर व आलू फसल डॉक्टर",
        btn_disease_guide: "रोग सूची",
        btn_chat_nav: "हेल्पलाइन",

        capture_title: "फसल फोटो जांचें",
        capture_desc: "पत्ती, तना, फल या आलू का कंद",
        crop_focus_label: "फसल",
        crop_auto: "स्वतः",
        crop_tomato: "टमाटर",
        crop_potato: "आलू",
        btn_upload_mode: "फोटो अपलोड",
        btn_camera_mode: "कैमरा",
        dropzone_text: "यहां क्लिक करें या फोटो ड्रैग करें",
        dropzone_hint: "कम रोशनी व तेज धूप में भी JPG, PNG, WebP समर्थित",
        btn_browse: "फोटो चुनें",
        btn_snap: "फोटो खींचें",
        btn_flip: "पलटें",
        btn_remove_preview: "बदलें",
        btn_diagnose: "फसल की जांच करें",
        btn_diagnosing: "जांच जारी है...",

        results_title: "जांच परिणाम व उपचार",
        results_desc: "रोग पहचान, जैविक व पंप दवा मात्रा",
        empty_title: "जांच के लिए तैयार",
        empty_desc: "टमाटर या आलू की फोटो अपलोड करें या कैमरे से लें, तुरंत संपूर्ण उपचार पर्ची पाएं।",
        loading_title: "फोटो की जांच हो रही है...",
        loading_desc: "रोग के लक्षण, पत्ती ऊतक और रोशनी संतुलन का विश्लेषण जारी है।",

        match_confidence: "सटीकता",
        btn_listen: "सुनें",
        btn_stop_audio: "रोकें",
        btn_whatsapp: "व्हाट्सएप",
        btn_print: "प्रिंट",

        tab_organic: "🌿 जैविक",
        tab_chemical: "🧪 दवा व 15L पंप",
        tab_phd: "🔬 रोग विवरण",
        tab_deficiency: "🍂 पोषण",
        tab_preventive: "🛡️ रोकथाम",

        organic_header: "जैविक व प्राकृतिक उपचार",
        knapsack_box_title: "15-लीटर नैपसैक स्प्रेयर पंप विधि",
        chemical_header: "रासायनिक छिड़काव व मात्रा",
        phd_taxonomy_title: "रोगकारक एवं श्रेणी",
        phd_epidemiology_title: "मौसम और रोग प्रसार",
        phd_differential_title: "मुख्य पहचान लक्षण",
        phd_icar_title: "खेत प्रबंधन उपाय",

        spectral_title: "पत्ती ऊतक विश्लेषण",
        green_tissue: "स्वस्थ हरा",
        yellow_chlorosis: "पीलापन",
        brown_necrosis: "भूरा धब्बा",
        alt_distribution_title: "प्रमुख संभावित रोग",

        btn_ask_ai: "किसान एआई से पूछें",
        chat_modal_title: "किसान मित्र सलाहकार",
        advisor_online: "● ऑनलाइन • टमाटर व आलू विशेषज्ञ",
        chat_quick_1: "1% बोर्डो मिश्रण विधि?",
        chat_quick_2: "अगेती बनाम पछेती झुलसा?",
        chat_quick_4: "15L पंप दवा मात्रा?",
        chat_quick_3: "सफेद मक्खी का जैविक उपाय?",
        chat_welcome: "नमस्ते! टमाटर और आलू के रोगों, जैविक उपचार, बोर्डो मिश्रण या स्प्रे पंप मात्रा से जुड़ा कोई भी सवाल पूछें।",
        chat_placeholder: "टमाटर या आलू से जुड़ा प्रश्न लिखें...",
        chat_send: "भेजें",

        enc_title: "टमाटर व आलू रोग मार्गदर्शिका",
        enc_subtitle: "सभी ज्ञात रोगों के लक्षण व उपचार खोजें",
        enc_search_placeholder: "लक्षण या रोग खोजें (उदा. झुलसा, सड़न, स्कैब)...",
        enc_all: "सभी",

        footer_text: "टमाटर एवं आलू फसल डॉक्टर"
    }
};

const DISEASE_LOCALIZED_NAMES = {
    "Tomato Early Blight": { hi: "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)" },
    "Tomato Late Blight": { hi: "टमाटर का पछेती झुलसा रोग (लेट ब्लाइट) — अत्यंत घातक" },
    "Tomato Bacterial Spot": { hi: "टमाटर का जीवाणु धब्बा रोग (बैक्टीरियल स्पॉट)" },
    "Tomato Bacterial Canker": { hi: "टमाटर का जीवाणु कैंसर (कैंकर रोग)" },
    "Tomato Bacterial Wilt": { hi: "टमाटर का जीवाणु म्लानि (उकठा / विल्ट)" },
    "Tomato Septoria Leaf Spot": { hi: "टमाटर का सेप्टोरिया पत्ती धब्बा रोग" },
    "Tomato Leaf Mold": { hi: "टमाटर का पत्ती फफूंद (लीफ मोल्ड)" },
    "Tomato Target Spot": { hi: "टमाटर का लक्ष्य धब्बा रोग (टारगेट स्पॉट)" },
    "Tomato Powdery Mildew": { hi: "टमाटर का चूर्णिल आसिता (पाउडरी मिल्ड्यू)" },
    "Tomato Anthracnose (Fruit Rot)": { hi: "टमाटर का एंथ्रेक्नोज (फल सड़न रोग)" },
    "Tomato Fusarium Wilt": { hi: "टमाटर का फ्यूजेरियम उकठा रोग (विल्ट)" },
    "Tomato Verticillium Wilt": { hi: "टमाटर का वर्टिसिलियम म्लानि (विल्ट)" },
    "Tomato Gray Mold (Botrytis Blight)": { hi: "टमाटर का भूरा फफूंद (ग्रे मोल्ड)" },
    "Tomato Spider Mite Infestation": { hi: "टमाटर पर लाल मकड़ी / दो-धब्बेदार मकड़ी कीट" },
    "Tomato Yellow Leaf Curl Virus (TYLCV)": { hi: "टमाटर का पीला पत्ती मरोड़ विषाणु (लीफ कर्ल)" },
    "Tomato Mosaic Virus": { hi: "टमाटर का मोजेक विषाणु (चितकबरा रोग)" },
    "Tomato Mosaic Virus (ToMV)": { hi: "टमाटर का मोजेक विषाणु (ToMV / चितकबरा रोग)" },
    "Tomato Spotted Wilt Virus (TSWV)": { hi: "टमाटर का चित्तीदार म्लानि विषाणु (स्पॉटेड विल्ट)" },
    "Blossom End Rot (Calcium Deficiency)": { hi: "टमाटर का फल तल सड़न (कैल्शियम की कमी)" },
    "Healthy Tomato Leaf": { hi: "स्वस्थ टमाटर की फसल (रोगमुक्त)" },
    "Healthy Tomato Crop": { hi: "स्वस्थ टमाटर की फसल (रोगमुक्त)" },
    "Potato Alternaria (Early Blight)": { hi: "आलू का अगेती झुलसा (अल्टरनेरिया ब्लाइट)" },
    "Potato Late Blight": { hi: "आलू का पछेती झुलसा रोग (लेट ब्लाइट) — महाविनाशक" },
    "Healthy Potato Crop": { hi: "स्वस्थ आलू की फसल (रोगमुक्त)" },
    "Potato Common Scab": { hi: "आलू का सामान्य खुरंड रोग (कॉमन स्कैब)" },
    "Potato Powdery Scab": { hi: "आलू का पाउडरी स्कैब (चूर्णिल खुरंड)" },
    "Blackleg & Bacterial Soft Rot": { hi: "आलू का ब्लैकलेग एवं जीवाणु कोमल सड़न" },
    "Black Scurf & Stem Canker": { hi: "आलू का काला खुरंड (राइजोक्टोनिया / ब्लैक स्कर्फ)" },
    "Potato Dry Rot": { hi: "आलू का सूखा सड़न रोग (ड्राई रॉट)" },
    "Potato Brown Rot (Bacterial Wilt)": { hi: "आलू का भूरा सड़न रोग (बैक्टीरियल विल्ट)" },
    "Potato Ring Rot": { hi: "आलू का वलय सड़न रोग (रिंग रॉट)" },
    "Potato Pink Rot": { hi: "आलू का गुलाबी सड़न रोग (पिंक रॉट)" },
    "Potato Watery Wound Rot (Pythium Leak)": { hi: "आलू का जलीय घाव सड़न (वाटरी लीक)" },
    "Potato Gangrene": { hi: "आलू का गैंग्रीन रोग (गड्ढेदार सड़न)" },
    "Potato Silver Scurf": { hi: "आलू का सिल्वर स्कर्फ (चंदेरी छिलका)" },
    "Potato Skin Spot": { hi: "आलू का स्किन स्पॉट रोग (कील/फुंसी)" },
    "Potato Black Dot": { hi: "आलू का ब्लैक डॉट रोग (काला बिंदु सड़न)" },
    "Potato Leafroll Virus (PLRV)": { hi: "आलू का पत्ती मरोड़ विषाणु (लीफरोल वायरस)" },
    "Potato Virus Y (PVY)": { hi: "आलू का वाई विषाणु रोग (पीवीवाई)" },
    "Latent & Mild Mosaic Viruses (PVX / PVA)": { hi: "आलू का माइल्ड मोजेक वायरस (पीवीएक्स/पीवीए)" },
    "Potato Mop Top Virus (PMTV / Spraing)": { hi: "आलू का मॉप-टॉप वायरस (स्प्रेइंग रोग)" },
    "Tobacco Rattle Virus (TRV / Spraing)": { hi: "तम्बाकू रैटल वायरस (स्प्रेइंग रोग)" },
    "Potato Verticillium Wilt (Early Dying)": { hi: "आलू का वर्टिसिलियम म्लानि (अगेती सूखना)" },
    "Potato Violet Root Rot": { hi: "आलू का बैंगनी जड़ सड़न रोग" },
    "Potato Wart Disease": { hi: "आलू का मस्सा रोग (वार्ट डिजीज)" }
};

const SEVERITY_LOCALIZED = {
    "Critical": { en: "🚨 Critical Risk", hi: "🚨 अत्यंत गंभीर" },
    "High": { en: "⚠️ High Severity", hi: "⚠️ उच्च गंभीरता" },
    "Moderate to High": { en: "⚠️ Moderate–High", hi: "⚠️ मध्यम से उच्च" },
    "Moderate": { en: "ℹ️ Moderate", hi: "ℹ️ मध्यम गंभीरता" },
    "Healthy / None": { en: "✅ Healthy Crop", hi: "✅ स्वस्थ फसल" },
    "None": { en: "✅ Healthy Crop", hi: "✅ स्वस्थ फसल" }
};

let currentLang = localStorage.getItem("kisan_lang") || "en";

function setLanguage(lang) {
    if (lang !== "en" && lang !== "hi") lang = "en";
    currentLang = lang;
    localStorage.setItem("kisan_lang", lang);

    const btnEn = document.getElementById("lang-btn-en");
    const btnHi = document.getElementById("lang-btn-hi");
    if (btnEn && btnHi) {
        btnEn.classList.toggle("active", lang === "en");
        btnHi.classList.toggle("active", lang === "hi");
        btnEn.setAttribute("aria-pressed", String(lang === "en"));
        btnHi.setAttribute("aria-pressed", String(lang === "hi"));
    }

    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        const translation = I18N_TRANSLATIONS[lang]?.[key];
        if (translation) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });

    document.documentElement.lang = lang;
}

function getLocalizedText(key, fallback = "") {
    return I18N_TRANSLATIONS[currentLang]?.[key] || fallback;
}

function getDiseaseLocalizedName(name, lang = currentLang) {
    if (lang === "en") return name;
    return DISEASE_LOCALIZED_NAMES[name]?.hi || name;
}

function getLocalizedSeverity(severity, lang = currentLang) {
    if (SEVERITY_LOCALIZED[severity]) {
        return SEVERITY_LOCALIZED[severity][lang] || SEVERITY_LOCALIZED[severity].en;
    }
    const prefix = String(severity).toLowerCase().includes("healthy") ? "✅ " : "⚠️ ";
    return prefix + severity;
}
