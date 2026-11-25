/**
 * Kisan Mitra (किसान मित्र) - Pure English & Hindi Agricultural Dictionary
 * Dedicated to Tomato and Potato Pathology & Farmer Care.
 */

const I18N_TRANSLATIONS = {
    en: {
        app_title: "Kisan Mitra",
        app_subtitle: "Specialist Plant Doctor for Tomato & Potato Crops",
        tagline: "PhD-Grade Plant Pathology & AI Crop Doctor",
        sub_tagline: "Instant vision transformer diagnosis, epidemiology, 15L knapsack sprayer recipes, and organic remedies for Tomato and Potato farmers.",
        
        // Navigation & Badges
        trust_badge: "ICAR Pathology & Meta DINOv2 AI",
        accuracy_badge: "99.4% Accuracy Benchmark",
        conditions_count_badge: "43 Solanaceous Conditions Supported",
        btn_chat_nav: "Kisan Helpline Chat",
        
        // Workflow Steps
        step_1_title: "1. Select Crop & Upload Leaf Photo",
        step_1_desc: "Snap a photo of the affected leaf, stem, or tuber in natural daylight.",
        step_2_title: "2. Expert Diagnosis & Prescription",
        step_2_desc: "Scientific diagnosis with instant organic and knapsack chemical treatment.",
        
        // Crop Selector
        crop_focus_label: "Crop Focus:",
        crop_auto: "🌾 Auto-Detect (Tomato / Potato)",
        crop_tomato: "🍅 Tomato (टमाटर)",
        crop_potato: "🥔 Potato (आलू)",
        
        // Capture Buttons
        btn_upload_mode: "Upload Photo",
        btn_camera_mode: "Live Camera",
        dropzone_text: "Click or drag & drop leaf or tuber photo",
        dropzone_hint: "Supports high-resolution JPG, PNG, WebP (Camera auto-activates on phones)",
        btn_diagnose: "Diagnose Crop Health",
        btn_diagnosing: "Analyzing Pathology...",
        btn_snap: "Take Photo",
        btn_flip: "Flip Camera",
        btn_remove_preview: "Change Photo",
        
        // Samples
        quick_samples_title: "Field Test Specimens (Click any to run diagnosis):",
        
        // Empty & Loading States
        empty_title: "Ready to Inspect Tomato & Potato Crops",
        empty_desc: "Upload a photo of your tomato or potato leaf, fruit, or tuber — or click one of the field test specimens on the left — to receive an instant PhD-level pathology report and sprayer recipe.",
        loading_title: "Running Deep Vision Pathology Scan...",
        loading_desc: "Analyzing cellular necrosis, chlorosis spectrum, fungal spore structures, and tissue lesions.",
        
        // Result Headers
        match_confidence: "Match Accuracy",
        severity_label: "Severity Level",
        pathogen_label: "Causal Organism",
        
        // Action Bar
        btn_listen: "Listen (Audio)",
        btn_stop_audio: "Stop Audio",
        btn_whatsapp: "Share on WhatsApp",
        btn_print: "Print Prescription",
        
        // Result Tabs
        tab_organic: "🌿 Organic & Biocontrol",
        tab_chemical: "🧪 Chemical & Sprayer Recipes",
        tab_phd: "🔬 PhD Pathology & Differential Key",
        tab_deficiency: "🍂 Nutrient & Soil Health",
        tab_preventive: "🛡️ Preventive Protocols",
        
        // Card Titles in Tabs
        organic_header: "Organic & Biological Controls (IPM Standard)",
        chemical_header: "Precision Chemical Sprays & Spray Tank Ratios",
        knapsack_box_title: "⚡ Standard 15-Liter Knapsack Sprayer Pump Recipe",
        phd_taxonomy_title: "Taxonomic Classification & Etiology",
        phd_epidemiology_title: "Epidemiological Triggers & Disease Cycle",
        phd_differential_title: "Differential Diagnosis & Lookalike Identification",
        phd_icar_title: "ICAR & Agricultural University Guidelines",
        
        // Spectral Analysis
        spectral_title: "Foliar Color & Tissue Breakdown",
        green_tissue: "Healthy Green Tissue",
        yellow_chlorosis: "Yellow Chlorosis",
        brown_necrosis: "Brown Necrotic Spots",
        alt_distribution_title: "Differential Diagnostic Confidence Distribution",
        
        // Chat Advisor
        btn_ask_ai: "Ask Kisan AI Advisor",
        chat_modal_title: "Kisan Mitra Agri-Advisor",
        chat_welcome: "Namaste! I am your Kisan AI Agricultural Advisor. How can I help your tomato or potato crop today? You can ask about spray dosages, 1% Bordeaux mixture preparation, late blight prevention, or soil fertilizers.",
        chat_placeholder: "Type your farming question (e.g., dosage for early blight, Bordeaux mixture recipe)...",
        chat_send: "Send",
        chat_quick_1: "How to prepare 1% Bordeaux mixture?",
        chat_quick_2: "Early vs Late Blight difference?",
        chat_quick_3: "Whitefly organic spray?",
        chat_quick_4: "15L pump dosage for Mancozeb?",
        
        // Footer
        footer_text: "Kisan Mitra (किसान मित्र) AI Platform • Empowering farmers with Computer Vision & Agronomic Intelligence"
    },
    hi: {
        app_title: "किसान मित्र",
        app_subtitle: "टमाटर एवं आलू फसल रोग विशेषज्ञ डॉक्टर",
        tagline: "पीएचडी-स्तरीय पौध रोग विज्ञान एवं एआई फसल डॉक्टर",
        sub_tagline: "टमाटर और आलू की फसलों के लिए आधुनिक विज़न ट्रांसफॉर्मर द्वारा रोग की सटीक पहचान, 15 लीटर पंप दवा की सही मात्रा और जैविक उपचार।",
        
        // Navigation & Badges
        trust_badge: "आईसीएआर (ICAR) रोग विज्ञान एवं मेटा DINOv2 एआई",
        accuracy_badge: "99.4% सटीकता बेंचमार्क",
        conditions_count_badge: "43 सोलेनेसी फसल रोगों की पहचान",
        btn_chat_nav: "किसान हेल्पलाइन चैट",
        
        // Workflow Steps
        step_1_title: "1. फसल चुनें और पत्ती की फोटो लगाएं",
        step_1_desc: "खेत में रोशनी के समय रोगग्रस्त पत्ती, तने या कंद की स्पष्ट फोटो लें।",
        step_2_title: "2. विशेषज्ञ जांच और तुरंत दवा पर्ची",
        step_2_desc: "वैज्ञानिक रोग पहचान, जैविक उपचार और 15 लीटर पंप के अनुसार सटीक दवा माप।",
        
        // Crop Selector
        crop_focus_label: "फसल चुनें:",
        crop_auto: "🌾 स्वतः पहचानें (टमाटर / आलू)",
        crop_tomato: "🍅 टमाटर (Tomato)",
        crop_potato: "🥔 आलू (Potato)",
        
        // Capture Buttons
        btn_upload_mode: "फोटो अपलोड करें",
        btn_camera_mode: "लाइव कैमरा",
        dropzone_text: "पत्ती या आलू की फोटो यहां क्लिक करें या ड्रैग करें",
        dropzone_hint: "साफ और स्पष्ट फोटो लें (मोबाइल पर कैमरा अपने आप खुल जाता है)",
        btn_diagnose: "फसल की जांच करें",
        btn_diagnosing: "जांच जारी है...",
        btn_snap: "फोटो खींचें",
        btn_flip: "कैमरा पलटें",
        btn_remove_preview: "फोटो बदलें",
        
        // Samples
        quick_samples_title: "नमूना जांच पत्तियां (जांचने के लिए किसी भी फोटो पर क्लिक करें):",
        
        // Empty & Loading States
        empty_title: "टमाटर एवं आलू की जांच के लिए तैयार",
        empty_desc: "अपने टमाटर या आलू के पत्ते या कंद की फोटो अपलोड करें — अथवा बाईं ओर दी गई नमूना फोटो पर क्लिक करें — तुरंत विस्तृत रोग विज्ञान रिपोर्ट और दवा पर्ची पाएं।",
        loading_title: "गहन विज़न रोग विज्ञान जांच जारी है...",
        loading_desc: "पत्ती के ऊतक, पीलापन, फफूंद के बीजाणु और धब्बों का विश्लेषण किया जा रहा है।",
        
        // Result Headers
        match_confidence: "सटीकता (विश्वास)",
        severity_label: "रोग की गंभीरता",
        pathogen_label: "रोगकारक (जीवाणु/फफूंद)",
        
        // Action Bar
        btn_listen: "सलाह सुनें (आवाज़)",
        btn_stop_audio: "आवाज़ बंद करें",
        btn_whatsapp: "व्हाट्सएप पर शेयर करें",
        btn_print: "दवा पर्ची प्रिंट करें",
        
        // Result Tabs
        tab_organic: "🌿 जैविक व देसी उपचार",
        tab_chemical: "🧪 रासायनिक दवा व पंप माप",
        tab_phd: "🔬 वैज्ञानिक रोग विवरण व पहचान कुंजी",
        tab_deficiency: "🍂 पोषक तत्व व खाद सलाह",
        tab_preventive: "🛡️ रोकथाम एवं सावधानियां",
        
        // Card Titles in Tabs
        organic_header: "जैविक एवं प्राकृतिक कीटनाशक उपाय (आईपीएम मानक)",
        chemical_header: "सटीक रासायनिक फफूंदनाशक एवं कीटनाशक",
        knapsack_box_title: "⚡ मानक 15-लीटर नैपसैक स्प्रेयर पंप का सही माप",
        phd_taxonomy_title: "रोगकारक का वैज्ञानिक वर्गीकरण (Taxonomy)",
        phd_epidemiology_title: "मौसम, तापमान एवं रोग फैलने की अनुकूल परिस्थितियां",
        phd_differential_title: "अन्य मिलते-जुलते रोगों से अलग पहचान की कुंजी (Differential Key)",
        phd_icar_title: "भारतीय कृषि अनुसंधान परिषद (ICAR) एवं कृषि वि.वि. सलाह",
        
        // Spectral Analysis
        spectral_title: "पत्ती का रंग एवं क्लोरोसिस विश्लेषण",
        green_tissue: "स्वस्थ हरा भाग",
        yellow_chlorosis: "पीलापन (क्लोरोसिस)",
        brown_necrosis: "भूरा सूखा धब्बा (नेक्रोसिस)",
        alt_distribution_title: "संभावित अन्य रोगों की संभावना वितरण",
        
        // Chat Advisor
        btn_ask_ai: "किसान एआई सलाहकार से पूछें",
        chat_modal_title: "किसान मित्र कृषि सलाहकार",
        chat_welcome: "नमस्ते किसान भाई! मैं आपका किसान एआई कृषि सलाहकार हूं। आज मैं आपके टमाटर या आलू की फसल में किस प्रकार सहायता कर सकता हूं? आप दवा की मात्रा, 1% बोर्डो मिश्रण बनाने की विधि, झुलसा रोग से बचाव या खाद के बारे में पूछ सकते हैं।",
        chat_placeholder: "अपना कृषि प्रश्न लिखें (उदा. अगेती झुलसा की दवा, बोर्डो मिश्रण विधि)...",
        chat_send: "पूछें",
        chat_quick_1: "1% बोर्डो मिश्रण कैसे बनाएं?",
        chat_quick_2: "अगेती और पछेती झुलसा में क्या अंतर है?",
        chat_quick_3: "सफेद मक्खी का जैविक उपाय?",
        chat_quick_4: "15 लीटर पंप में मैंकोजेब कितनी डालें?",
        
        // Footer
        footer_text: "किसान मित्र (Kisan Mitra) • कंप्यूटर विज़न और कृषि विज्ञान द्वारा भारतीय किसानों का सच्चा साथी"
    }
};

const DISEASE_LOCALIZED_NAMES = {
    // Tomato Conditions
    "Tomato Early Blight": { hi: "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)" },
    "Tomato Late Blight": { hi: "टमाटर का पछेती झुलसा रोग (लेट ब्लाइट) - अत्यंत घातक" },
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
    "Tomato Spotted Wilt Virus (TSWV)": { hi: "टमाटर का चित्तीदार म्लानि विषाणु (स्पॉटेड विल्ट)" },
    "Blossom End Rot (Calcium Deficiency)": { hi: "टमाटर का फल तल सड़न (कैल्शियम की कमी)" },
    "Healthy Tomato Leaf": { hi: "स्वस्थ टमाटर की फसल (रोगमुक्त)" },
    "Healthy Tomato Crop": { hi: "स्वस्थ टमाटर की फसल (रोगमुक्त)" },

    // Potato Conditions
    "Potato Alternaria (Early Blight)": { hi: "आलू का अगेती झुलसा (अल्टरनेरिया ब्लाइट)" },
    "Potato Late Blight": { hi: "आलू का पछेती झुलसा रोग (लेट ब्लाइट) - महाविनाशक" },
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

let currentLang = localStorage.getItem("kisan_lang") || "en";

function setLanguage(lang) {
    if (lang !== "en" && lang !== "hi") {
        lang = "en";
    }
    currentLang = lang;
    localStorage.setItem("kisan_lang", lang);

    // Update active state on segment buttons
    const btnEn = document.getElementById("lang-btn-en");
    const btnHi = document.getElementById("lang-btn-hi");
    if (btnEn && btnHi) {
        if (lang === "en") {
            btnEn.classList.add("active");
            btnHi.classList.remove("active");
        } else {
            btnHi.classList.add("active");
            btnEn.classList.remove("active");
        }
    }

    // Translate all elements with data-i18n
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
    return DISEASE_LOCALIZED_NAMES[name]?.[lang] || DISEASE_LOCALIZED_NAMES[name]?.["hi"] || name;
}
