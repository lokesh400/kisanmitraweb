/**
 * Kisan Mitra (किसान मित्र) — Bilingual Agricultural Dictionary
 * Strictly English (en) & Hindi (hi)
 */

const I18N_TRANSLATIONS = {
    en: {
        app_title: "Kisan Mitra",
        app_subtitle: "Specialist Tomato & Potato Plant Doctor",
        btn_chat_nav: "Kisan Helpline",
        trust_badge: "ICAR Pathology & Meta DINOv2 AI",
        conditions_count_badge: "43 Tomato & Potato Conditions",
        sprayer_badge: "15L Knapsack Sprayer Dosages",
        tagline: "PhD-Grade Plant Pathology & AI Crop Doctor",
        sub_tagline: "Upload or photograph any tomato or potato leaf, stem, or tuber for instant differential diagnosis, epidemiology triggers, organic remedies, and exact 15-Liter sprayer formulations.",

        // Step 1: Capture
        step_1_title: "Select Crop & Upload Leaf Photo",
        step_1_desc: "Take a clear daylight photo of the affected leaf, stem, or potato tuber.",
        crop_focus_label: "🌱 Crop Focus",
        crop_auto: "Auto-Detect",
        crop_tomato: "Tomato (टमाटर)",
        crop_potato: "Potato (आलू)",
        btn_upload_mode: "Upload Photo",
        btn_camera_mode: "Live Camera",
        dropzone_text: "Click or drag & drop leaf or tuber photo",
        dropzone_hint: "Supports JPG, PNG, WebP • Best results in natural daylight",
        btn_browse: "Choose Photo",
        btn_snap: "Take Photo",
        btn_flip: "Flip",
        btn_remove_preview: "Change Photo",
        btn_diagnose: "Diagnose Crop Health",
        btn_diagnosing: "Analyzing Pathology...",
        photo_tip_copy: "<strong>Field Tip:</strong> Hold the camera 15–25 cm from a single symptomatic leaf or cut tuber so concentric rings, fungal fuzz, or spots are sharply focused.",

        // Step 2: Results
        step_2_title: "Expert Pathology & Field Prescription",
        step_2_desc: "Differential diagnosis, causal organism taxonomy, and exact sprayer recipes.",
        empty_title: "Diagnostic Engine Ready",
        empty_desc: "Upload a photo of your tomato or potato leaf, stem, or tuber on the left to generate a complete plant pathology report.",
        cap_1_title: "PhD Differential Pathology",
        cap_1_desc: "Separates Early Blight concentric rings, Late Blight abaxial sporangia, Septoria pycnidia, Bacterial specks, and Tuber Pink Rot.",
        cap_2_title: "15L Knapsack Pump Recipes",
        cap_2_desc: "Verified active ingredients, slurry mixing instructions, organic bio-controls, and spraying intervals.",
        cap_3_title: "English & Hindi Voice + WhatsApp",
        cap_3_desc: "One-tap spoken advisory in clear Hindi or English and shareable prescription cards.",
        loading_title: "Running Deep Vision Pathology Scan...",
        loading_desc: "Extracting 768-dim DINOv2 cellular embeddings, necrotic speck topology, and foliar chlorosis index.",

        match_confidence: "Match Accuracy",
        btn_listen: "Listen (Audio)",
        btn_stop_audio: "Stop Audio",
        btn_whatsapp: "Share on WhatsApp",
        btn_print: "Print Prescription",

        tab_organic: "🌿 Organic & Biocontrol",
        tab_chemical: "🧪 Chemical & 15L Sprayer",
        tab_phd: "🔬 PhD Pathology Key",
        tab_deficiency: "🍂 Soil & Nutrients",
        tab_preventive: "🛡️ Preventive Care",

        organic_header: "Organic & Biological Controls (IPM Standard)",
        knapsack_box_title: "Standard 15-Liter Knapsack Sprayer Pump Recipe",
        chemical_header: "Precision Chemical Sprays & Intervals",
        phd_taxonomy_title: "Taxonomic Classification & Etiology",
        phd_epidemiology_title: "Epidemiological Triggers & Disease Cycle",
        phd_differential_title: "Differential Diagnosis & Lookalike Key",
        phd_icar_title: "ICAR & Agricultural University Guidelines",

        spectral_title: "Foliar Color & Tissue Breakdown",
        green_tissue: "Healthy Green Tissue",
        yellow_chlorosis: "Yellow Chlorosis",
        brown_necrosis: "Brown Necrotic Spots",
        alt_distribution_title: "Differential Diagnostic Confidence Distribution",

        btn_ask_ai: "Ask Kisan AI Advisor",
        chat_modal_title: "Kisan Mitra Agri-Advisor",
        advisor_online: "● Online • English & हिन्दी Krishi Expert",
        chat_quick_1: "1% Bordeaux mixture recipe?",
        chat_quick_2: "Early vs Late Blight difference?",
        chat_quick_4: "15L pump dosage for Mancozeb?",
        chat_quick_3: "Whitefly organic spray?",
        chat_welcome: "Namaste! I am your Kisan AI Agricultural Advisor. Ask me anything about tomato or potato diseases, 1% Bordeaux mixture preparation, blight differentiation, or 15L sprayer pump dosages.",
        chat_placeholder: "Ask a tomato or potato farming question...",
        chat_send: "Send",

        footer_text: "Empowering Tomato & Potato Farmers with Computer Vision & Plant Pathology"
    },
    hi: {
        app_title: "किसान मित्र",
        app_subtitle: "टमाटर एवं आलू फसल रोग विशेषज्ञ डॉक्टर",
        btn_chat_nav: "किसान हेल्पलाइन",
        trust_badge: "ICAR रोग विज्ञान एवं Meta DINOv2 AI",
        conditions_count_badge: "43 टमाटर और आलू के रोग शामिल",
        sprayer_badge: "15 लीटर स्प्रेयर पंप की सटीक मात्रा",
        tagline: "पीएचडी-स्तरीय पौध रोग विज्ञान एवं एआई फसल डॉक्टर",
        sub_tagline: "टमाटर या आलू की पत्ती, तने या कंद की फोटो अपलोड करें — तुरंत वैज्ञानिक रोग पहचान, मौसम कारण, जैविक उपचार और 15-लीटर पंप के अनुसार दवा माप प्राप्त करें।",

        // Step 1: Capture
        step_1_title: "फसल चुनें और पत्ती की फोटो लगाएं",
        step_1_desc: "दिन की साफ रोशनी में रोगग्रस्त पत्ती, तने या आलू के कंद की स्पष्ट फोटो लें।",
        crop_focus_label: "🌱 फसल चुनें",
        crop_auto: "स्वतः पहचानें",
        crop_tomato: "टमाटर (Tomato)",
        crop_potato: "आलू (Potato)",
        btn_upload_mode: "फोटो अपलोड करें",
        btn_camera_mode: "लाइव कैमरा",
        dropzone_text: "पत्ती या आलू की फोटो यहां क्लिक करें या ड्रैग करें",
        dropzone_hint: "JPG, PNG, WebP समर्थित • साफ प्राकृतिक रोशनी में सर्वोत्तम परिणाम",
        btn_browse: "फोटो चुनें",
        btn_snap: "फोटो खींचें",
        btn_flip: "कैमरा पलटें",
        btn_remove_preview: "फोटो बदलें",
        btn_diagnose: "फसल की जांच करें",
        btn_diagnosing: "रोग विश्लेषण जारी है...",
        photo_tip_copy: "<strong>खेत की सलाह:</strong> कैमरा को पत्ती या कटे आलू से 15–25 सेमी दूर रखें ताकि गोल छल्ले, सफेद फफूंद या धब्बे बिल्कुल साफ दिखें।",

        // Step 2: Results
        step_2_title: "विशेषज्ञ रोग विज्ञान एवं दवा पर्ची",
        step_2_desc: "रोग की सटीक पहचान, रोगकारक वर्गीकरण और 15L स्प्रेयर पंप की मात्रा।",
        empty_title: "रोग जांच प्रणाली तैयार है",
        empty_desc: "पूरी पौध रोग विज्ञान रिपोर्ट और उपचार पर्ची पाने के लिए बाईं ओर टमाटर या आलू की पत्ती, तने या कंद की फोटो अपलोड करें।",
        cap_1_title: "पीएचडी अंतर-रोग पहचान (Differential Key)",
        cap_1_desc: "अगेती झुलसा के गोल छल्लों, पछेती झुलसा की निचली फफूंद, सेप्टोरिया धब्बों, जीवाणु धब्बे और आलू गुलाबी सड़न में सटीक अंतर पहचानता है।",
        cap_2_title: "15 लीटर नैपसैक पंप घोल विधि",
        cap_2_desc: "प्रमाणित फफूंदनाशक दवाएं, बाल्टी में घोल बनाने की विधि, जैविक नियंत्रण और छिड़काव अंतराल।",
        cap_3_title: "हिन्दी व अंग्रेज़ी आवाज़ + व्हाट्सएप पर्ची",
        cap_3_desc: "एक क्लिक में बोलकर सलाह सुनें और कृषि सेवा केंद्र के लिए व्हाट्सएप पर्ची साझा करें।",
        loading_title: "गहन विज़न रोग विज्ञान जांच जारी है...",
        loading_desc: "DINOv2 न्यूरल विश्लेषण, धब्बों की संरचना और पत्ती के पीलेपन (क्लोरोसिस) की गणना हो रही है।",

        match_confidence: "सटीकता (विश्वास)",
        btn_listen: "सलाह सुनें (आवाज़)",
        btn_stop_audio: "आवाज़ बंद करें",
        btn_whatsapp: "व्हाट्सएप पर शेयर करें",
        btn_print: "दवा पर्ची प्रिंट करें",

        tab_organic: "🌿 जैविक उपचार",
        tab_chemical: "🧪 रासायनिक दवा व 15L पंप",
        tab_phd: "🔬 वैज्ञानिक रोग कुंजी",
        tab_deficiency: "🍂 मिट्टी एवं पोषण",
        tab_preventive: "🛡️ रोकथाम व सावधानी",

        organic_header: "जैविक एवं प्राकृतिक रोग नियंत्रण (आईपीएम मानक)",
        knapsack_box_title: "मानक 15-लीटर नैपसैक स्प्रेयर पंप घोल विधि",
        chemical_header: "सटीक रासायनिक छिड़काव एवं अंतराल",
        phd_taxonomy_title: "रोगकारक का वैज्ञानिक वर्गीकरण (Taxonomy)",
        phd_epidemiology_title: "मौसम, तापमान एवं रोग फैलने की परिस्थितियां",
        phd_differential_title: "मिलते-जुलते रोगों से अलग पहचान की कुंजी",
        phd_icar_title: "ICAR एवं कृषि विश्वविद्यालय आईपीएम दिशानिर्देश",

        spectral_title: "पत्ती का रंग एवं ऊतक विश्लेषण",
        green_tissue: "स्वस्थ हरा ऊतक",
        yellow_chlorosis: "पीलापन (क्लोरोसिस)",
        brown_necrosis: "भूरा सूखा धब्बा (नेक्रोसिस)",
        alt_distribution_title: "रोग संभावना तुलनात्मक वितरण",

        btn_ask_ai: "किसान एआई सलाहकार से पूछें",
        chat_modal_title: "किसान मित्र कृषि सलाहकार",
        advisor_online: "● ऑनलाइन • हिन्दी व अंग्रेज़ी कृषि विशेषज्ञ",
        chat_quick_1: "1% बोर्डो मिश्रण कैसे बनाएं?",
        chat_quick_2: "अगेती और पछेती झुलसा में अंतर?",
        chat_quick_4: "15L पंप में मैंकोजेब कितनी डालें?",
        chat_quick_3: "सफेद मक्खी का जैविक उपाय?",
        chat_welcome: "नमस्ते किसान भाई! मैं आपका किसान एआई कृषि सलाहकार हूं। टमाटर और आलू के किसी भी रोग, 1% बोर्डो मिश्रण बनाने की विधि, झुलसा की पहचान या 15L पंप की दवा मात्रा के बारे में पूछें।",
        chat_placeholder: "टमाटर या आलू की खेती से जुड़ा कोई भी सवाल लिखें...",
        chat_send: "भेजें",

        footer_text: "कंप्यूटर विज़न और पौध रोग विज्ञान द्वारा टमाटर व आलू किसानों का भरोसेमंद साथी"
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
    if (lang !== "en" && lang !== "hi") {
        lang = "en";
    }
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
    const prefix = severity.toLowerCase().includes("healthy") ? "✅ " : "⚠️ ";
    return prefix + severity;
}
