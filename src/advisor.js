/**
 * Kisan Mitra Agri-Advisor — Conversational + PhD Tomato & Potato Assistant
 * Handles natural greetings, casual conversation, weather/agronomy guidance,
 * active diagnosis follow-ups, symptom triage across all 43 Tomato & Potato
 * conditions + 6 nutrient deficiencies, and exact 15L sprayer formulas in EN & HI.
 */

const { DISEASE_KNOWLEDGE_BASE, NUTRIENT_DEFICIENCY_GUIDE } = require('./knowledgeBase');

/**
 * Matches ASCII keywords on clean non-alphanumeric boundaries AND Indic/Hindi
 * substrings directly (since JS `\b` only works on ASCII `[A-Za-z0-9_]`).
 */
function hasTerm(textLower, asciiList = [], indicList = []) {
  for (const phrase of indicList) {
    if (phrase && textLower.includes(phrase)) return true;
  }
  for (const term of asciiList) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (re.test(textLower)) return true;
  }
  return false;
}

// Multilingual & Hinglish normalization map covering Hindi inflections + crop terms
const TERM_ALIASES = {
  // Crops
  tamatar: 'tomato',
  टमाटर: 'tomato',
  aalu: 'potato',
  alu: 'potato',
  आलू: 'potato',
  kand: 'tuber',
  कंद: 'tuber',
  phal: 'fruit',
  फल: 'fruit',
  // Blights & spots
  jhulsa: 'blight',
  jhulas: 'blight',
  झुलसा: 'blight',
  झुलस: 'blight',
  ageti: 'early alternaria',
  अगेती: 'early alternaria',
  pacheti: 'late phytophthora',
  पछेती: 'late phytophthora',
  dhabba: 'spot',
  dhabe: 'spot',
  dhabbe: 'spot',
  धब्बा: 'spot',
  धब्बे: 'spot',
  chhalle: 'concentric rings',
  छल्ले: 'concentric rings',
  // Rots & tuber defects
  sadan: 'rot',
  sadna: 'rot',
  sad: 'rot',
  galna: 'rot soft',
  galan: 'rot soft',
  gal: 'rot soft',
  सड़न: 'rot',
  सड़: 'rot',
  सड़ना: 'rot',
  गलन: 'rot soft',
  गल: 'rot soft',
  gulabi: 'pink',
  गुलाबी: 'pink',
  kaat: 'cut flesh',
  kaatne: 'cut flesh',
  काट: 'cut flesh',
  काटने: 'cut flesh',
  khurand: 'scab',
  खुरंड: 'scab',
  खुरदरे: 'scab',
  massa: 'wart',
  मस्सा: 'wart',
  chhilka: 'silver skin scurf',
  छिलका: 'silver skin scurf',
  sukha: 'dry',
  सूखा: 'dry',
  bhura: 'brown',
  भूरा: 'brown',
  valay: 'ring',
  वलय: 'ring',
  baingani: 'violet',
  बैंगनी: 'violet',
  // Leaf curling, yellowing, mosaics, viruses
  peela: 'yellow chlorosis',
  peeli: 'yellow chlorosis',
  peele: 'yellow chlorosis',
  peelapan: 'yellow chlorosis',
  पीला: 'yellow chlorosis',
  पीली: 'yellow chlorosis',
  पीले: 'yellow chlorosis',
  पीलापन: 'yellow chlorosis',
  marod: 'curl leafroll',
  mud: 'curl leafroll',
  mudna: 'curl leafroll',
  sikud: 'curl wrinkled',
  sikudan: 'curl wrinkled',
  मरोड़: 'curl leafroll',
  मुड़: 'curl leafroll',
  मुड़ना: 'curl leafroll',
  सिकुड़: 'curl wrinkled',
  सिकुड़न: 'curl wrinkled',
  कर्ल: 'curl',
  mosaic: 'mosaic',
  chiteri: 'mosaic',
  मोजेक: 'mosaic',
  चितेरी: 'mosaic',
  वायरस: 'virus',
  // Powdery mildew, molds, pests, wilts
  safed: 'white powdery mildew',
  सफेद: 'white powdery mildew',
  चूर्ण: 'powdery mildew',
  पाउडर: 'powdery mildew',
  faphund: 'mold fungal mildew',
  फफूंद: 'mold fungal mildew',
  रुई: 'white cottony fuzz mildew',
  makdi: 'spider mites webbing',
  मकड़ी: 'spider mites webbing',
  जाला: 'spider mites webbing',
  makkhi: 'whitefly vector curl',
  मक्खी: 'whitefly vector curl',
  uktha: 'wilt',
  murjha: 'wilt',
  mlani: 'wilt',
  उकठा: 'wilt',
  मुरझा: 'wilt',
  मुरझाना: 'wilt',
  म्लानि: 'wilt',
  // Colors / positions / bacterial / nutrients
  kali: 'black',
  kala: 'black',
  kale: 'black',
  काला: 'black',
  काली: 'black',
  काले: 'black',
  niche: 'bottom blossom end',
  neeche: 'bottom blossom end',
  sira: 'blossom end',
  नीचे: 'bottom blossom end',
  निचला: 'bottom blossom end',
  सिरा: 'blossom end',
  canker: 'canker',
  कैंकर: 'canker',
  jeevanu: 'bacterial',
  जीवाणु: 'bacterial',
  बैक्टीरिया: 'bacterial',
  बैक्टीरियल: 'bacterial',
  calcium: 'calcium blossom end rot',
  कैल्शियम: 'calcium blossom end rot',
  nitrogen: 'nitrogen urea',
  नाइट्रोजन: 'nitrogen urea',
  यूरिया: 'nitrogen urea',
  potash: 'potassium',
  पोटाश: 'potassium',
  phosphorus: 'phosphorus',
  फास्फोरस: 'phosphorus',
  magnesium: 'magnesium',
  मैग्नीशियम: 'magnesium',
  iron: 'iron',
  आयरन: 'iron',
  // Agronomy / symptom synonyms
  bordeaux: 'bordeaux copper lime',
  बोर्डो: 'bordeaux copper lime',
  mancozeb: 'mancozeb',
  मैंकोजेब: 'mancozeb',
  मैन्कोज़ेब: 'mancozeb',
  neem: 'neem',
  नीम: 'neem',
  dots: 'dot specks',
  dot: 'dot specks',
  speck: 'speck dot',
  specks: 'speck dot',
  grey: 'gray',
  gray: 'grey',
  ash: 'gray tan'
};

// Prefix rules for conjugated Hindi words not listed verbatim
const INDIC_STEM_ALIASES = [
  ['पील', 'yellow chlorosis'],
  ['मुड़', 'curl leafroll'],
  ['मरोड़', 'curl leafroll'],
  ['सिकुड़', 'curl wrinkled'],
  ['सड़', 'rot'],
  ['गल', 'rot soft'],
  ['झुलस', 'blight'],
  ['धब्ब', 'spot'],
  ['मुरझ', 'wilt'],
  ['फफूंद', 'mold fungal'],
  ['मकड़', 'spider mites'],
  ['मक्ख', 'whitefly'],
  ['खुरं', 'scab'],
  ['गुलाब', 'pink'],
  ['मस्स', 'wart'],
  ['कैंकर', 'canker'],
  ['जीवाणु', 'bacterial']
];

const STOP_WORDS = new Set([
  'the', 'is', 'am', 'are', 'was', 'were', 'in', 'on', 'at', 'of', 'for', 'to', 'a', 'an',
  'and', 'or', 'my', 'me', 'i', 'you', 'your', 'it', 'its', 'this', 'that', 'with', 'from',
  'what', 'how', 'why', 'when', 'where', 'which', 'can', 'could', 'should', 'would', 'do',
  'does', 'did', 'tell', 'about', 'please', 'give', 'know', 'crop', 'plant', 'plants',
  'leaf', 'leaves', 'turning', 'turns', 'getting', 'look', 'looks', 'spray', 'disease',
  'diseases', 'problem', 'problems', 'issue', 'issues', 'common', 'major', 'happen', 'happens',
  'remedy', 'treatment', 'medicine', 'cure', 'kya', 'hai', 'hain', 'ka', 'ki', 'ke', 'ko',
  'me', 'mein', 'se', 'par', 'aur', 'kaise', 'batao', 'bataiye', 'mere', 'meri', 'mera',
  'bimari', 'bimariyan', 'क्या', 'है', 'हैं', 'का', 'की', 'के', 'को', 'में', 'से', 'पर',
  'और', 'कैसे', 'बताएं', 'बताओ', 'कृपया', 'मेरे', 'मेरी', 'मेरा', 'पत्तियां', 'पत्तियों',
  'पत्ती', 'पत्ता', 'पत्ते', 'पौधे', 'पौधा', 'फसल', 'हो', 'रही', 'रहा', 'रहे', 'होकर',
  'गया', 'गई', 'इसका', 'इसके', 'इसकी', 'इलाज', 'उपचार', 'दवा', 'दवाई', 'रोकथाम', 'बचाव',
  'छिड़काव', 'लगाएं', 'करें', 'रोग', 'बीमारी', 'बीमारियां', 'समस्या', 'समस्याएं', 'प्रमुख',
  'कौन', 'होते', 'होता', 'होती', 'लगते', 'लगती'
]);

function normalizeQueryTokens(rawText) {
  const clean = (rawText || '').toLowerCase().replace(/[?!.,;:'"()\/।]+/g, ' ').trim();
  const expanded = [];
  for (const word of clean.split(/\s+/)) {
    if (!word) continue;
    expanded.push(word);
    // Singularize regular English plurals (spots -> spot, rings -> ring, tubers -> tuber)
    if (/^[a-z]{4,}s$/.test(word) && !/(ss|us|is)$/.test(word)) {
      expanded.push(word.slice(0, -1));
    }
    if (TERM_ALIASES[word]) {
      expanded.push(...TERM_ALIASES[word].split(/\s+/));
    } else {
      for (const [stem, target] of INDIC_STEM_ALIASES) {
        if (word.startsWith(stem) || word.includes(stem)) {
          expanded.push(...target.split(/\s+/));
        }
      }
    }
  }
  return [...new Set(expanded.filter(t => t.length > 1 && !STOP_WORDS.has(t)))];
}

function findDiseaseByContext(ctx) {
  if (!ctx || ctx === 'None') return null;
  const target = ctx.toLowerCase().trim();
  return Object.values(DISEASE_KNOWLEDGE_BASE).find(d =>
    (d.name || '').toLowerCase() === target ||
    (d.id || '').toLowerCase() === target ||
    (d.name || '').toLowerCase().includes(target)
  ) || null;
}

function formatDiseasePrescription(d, lang, focus = 'full') {
  const isHi = lang === 'hi';
  const chem = d.chemical_treatments?.[0];
  const chemAlt = d.chemical_treatments?.[1];
  const orgList = (d.organic_remedies || []).slice(0, 2);
  const prevList = (d.preventive_measures || []).slice(0, 2);

  if (isHi) {
    const title = `🌿 **${d.hindi_name || d.name}** (${d.name})\n• रोगकारक: ${d.pathogen} | गंभीरता: ${d.severity}`;
    if (focus === 'organic') {
      return `${title}\n\n🌱 **जैविक / प्राकृतिक उपचार (15L पंप अनुकूल):**\n${orgList.map(r => `• ${r}`).join('\n')}\n\n💡 *स्प्रे समय:* सुबह जल्दी या शाम के समय पत्तियों के ऊपर और नीचे दोनों ओर अच्छी तरह छिड़काव करें।`;
    }
    if (focus === 'chemical') {
      const cText = chem
        ? `• मुख्य दवा: **${chem.chemical}** — मात्रा: ${chem.dosage} (${chem.interval})${chemAlt ? `\n• विकल्प: **${chemAlt.chemical}** — ${chemAlt.dosage}` : ''}\n⚡ *15L स्प्रेयर पंप मार्गदर्शन:* अनुशंसित मात्रा को पहले 2L पानी में घोलकर 15L टंकी में डालें और 10ml चिपचिपा स्टीकर मिलाएं।`
        : `इस समस्या में किसी रासायनिक कवकनाशी या कीटनाशक की आवश्यकता नहीं है — केवल सिंचाई व पोषण सुधारें।`;
      return `${title}\n\n🧪 **रासायनिक दवा एवं 15L पंप खुराक:**\n${cText}`;
    }
    if (focus === 'prevent') {
      return `${title}\n\n🛡️ **खेत प्रबंधन एवं रोकथाम:**\n${prevList.map(p => `• ${p}`).join('\n')}\n\n🍂 **पोषण सलाह:** ${d.fertilizer_recommendation || 'संतुलित NPK 19:19:19 का प्रयोग करें।'}`;
    }
    return `${title}\n\n🔍 **मुख्य लक्षण:** ${d.symptoms}\n\n🌱 **जैविक उपाय:**\n${orgList.map(r => `• ${r}`).join('\n')}${chem ? `\n\n🧪 **रासायनिक दवा:** ${chem.chemical} (${chem.dosage})` : ''}\n\n🍂 **खाद सलाह:** ${d.fertilizer_recommendation || ''}`;
  }

  const header = `🌿 **${d.name}** (${d.hindi_name})\n• **Pathogen:** ${d.pathogen} | **Severity:** ${d.severity}`;
  if (focus === 'organic') {
    return `${header}\n\n🌱 **Organic & Biocontrol Remedies:**\n${orgList.map(r => `• ${r}`).join('\n')}\n\n💡 Apply during cool morning or evening hours covering both leaf surfaces.`;
  }
  if (focus === 'chemical') {
    const cText = chem
      ? `• **${chem.chemical}** — Dosage: ${chem.dosage} (${chem.interval})${chemAlt ? `\n• Alternative: **${chemAlt.chemical}** — ${chemAlt.dosage}` : ''}\n⚡ **15L Sprayer Tip:** Pre-mix in 2L water first, top up to 15L, and add 10ml non-ionic sticker.`
      : `No chemical fungicide/insecticide is needed for this condition — adjust irrigation and nutrition.`;
    return `${header}\n\n🧪 **Chemical Spray & Dosage:**\n${cText}`;
  }
  if (focus === 'prevent') {
    return `${header}\n\n🛡️ **Preventive Field Measures:**\n${prevList.map(p => `• ${p}`).join('\n')}\n\n🍂 **Nutrition Tip:** ${d.fertilizer_recommendation || 'Maintain balanced NPK 19:19:19.'}`;
  }
  return `${header}\n\n🔍 **Symptoms & Cause:** ${d.symptoms} *(Triggers: ${d.causes})*\n\n🌱 **Organic Remedy:**\n${orgList.map(r => `• ${r}`).join('\n')}${chem ? `\n\n🧪 **Chemical Spray:** ${chem.chemical} — **${chem.dosage}** (${chem.interval})` : ''}\n\n🍂 **Nutrition:** ${d.fertilizer_recommendation || ''}`;
}

function matchesSearchToken(haystackLower, tok) {
  if (/^[a-z0-9_-]+$/.test(tok)) {
    const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^a-z0-9])${escaped}`).test(haystackLower);
  }
  return haystackLower.includes(tok);
}

const CROP_TOKENS = new Set(['tomato', 'potato', 'टमाटर', 'आलू', 'tamatar', 'aalu', 'alu']);

function searchBestCondition(tokens, rawLower, activeDisease) {
  const mentionsTomato = tokens.includes('tomato') || rawLower.includes('tomato') || rawLower.includes('टमाटर');
  const mentionsPotato = tokens.includes('potato') || rawLower.includes('potato') || rawLower.includes('आलू');

  let bestDef = null;
  let bestDefScore = 0;
  for (const def of Object.values(NUTRIENT_DEFICIENCY_GUIDE)) {
    const hay = `${def.name} ${def.hindi_name} ${def.symptoms} ${def.correction}`.toLowerCase();
    let score = 0;
    for (const tok of tokens) {
      if (CROP_TOKENS.has(tok)) continue;
      if (matchesSearchToken(hay, tok)) score += 2;
    }
    if (tokens.includes('calcium') && def.name.includes('Calcium')) score += 6;
    if (tokens.includes('nitrogen') && def.name.includes('Nitrogen')) score += 6;
    if (tokens.includes('potassium') && def.name.includes('Potassium')) score += 6;
    if (tokens.includes('phosphorus') && def.name.includes('Phosphorus')) score += 6;
    if (tokens.includes('magnesium') && def.name.includes('Magnesium')) score += 6;
    if (tokens.includes('iron') && def.name.includes('Iron')) score += 6;
    if (score > bestDefScore) {
      bestDefScore = score;
      bestDef = def;
    }
  }

  let bestDis = null;
  let bestDisScore = 0;
  let bestSymptomScore = 0;

  for (const d of Object.values(DISEASE_KNOWLEDGE_BASE)) {
    const titleLower = `${d.name} ${d.hindi_name} ${d.pathogen}`.toLowerCase();
    const bodyLower = `${d.category} ${d.symptoms} ${d.causes}`.toLowerCase();

    let symptomScore = 0;
    for (const tok of tokens) {
      if (CROP_TOKENS.has(tok)) continue;
      if (matchesSearchToken(titleLower, tok)) symptomScore += 5;
      else if (matchesSearchToken(bodyLower, tok)) symptomScore += 2;
    }

    // Never match a disease purely from crop mention if zero symptom/disease words matched
    if (symptomScore === 0) continue;

    let cropScore = 0;
    if (mentionsTomato && d.crop === 'Tomato') cropScore += 4;
    if (mentionsPotato && d.crop === 'Potato') cropScore += 4;
    if (mentionsTomato && d.crop !== 'Tomato') cropScore -= 3;
    if (mentionsPotato && d.crop !== 'Potato') cropScore -= 3;

    const contextBonus = (activeDisease && d.id === activeDisease.id) ? 1.5 : 0;
    const totalScore = symptomScore + cropScore + contextBonus;

    if (totalScore > bestDisScore) {
      bestDisScore = totalScore;
      bestSymptomScore = symptomScore;
      bestDis = d;
    }
  }

  return {
    bestDis,
    bestDisScore,
    bestSymptomScore,
    bestDef,
    bestDefScore,
    mentionsTomato,
    mentionsPotato
  };
}

function generateAdvisorReply({ message = '', diseaseContext = '', language = 'en' }) {
  const raw = (message || '').trim();
  const lower = raw.toLowerCase();
  const lang = language === 'hi' ? 'hi' : 'en';
  const isHi = lang === 'hi';
  const activeDisease = findDiseaseByContext(diseaseContext);
  const wordCount = raw ? raw.split(/\s+/).length : 0;

  if (!raw) {
    return isHi
      ? 'नमस्ते किसान भाई! आप मुझसे सामान्य कृषि चर्चा कर सकते हैं या टमाटर व आलू की खेती, रोग पहचान या 15L पंप दवा मात्रा पूछ सकते हैं।'
      : 'Namaste! Ask me anything or just say hello — I help with Tomato & Potato farming, disease triage, organic remedies, and 15L sprayer dosages.';
  }

  // 1. Casual Conversational Chat (Greetings, Wellbeing, Capabilities, Thanks, Farewell)
  const isGreeting = hasTerm(
    lower,
    ['hi', 'hello', 'hey', 'hlo', 'namaste', 'namaskar', 'pranam', 'ram ram', 'good morning', 'good afternoon', 'good evening', 'satsriakal', 'hola'],
    ['नमस्ते', 'नमस्कार', 'प्रणाम', 'राम राम', 'हेलो', 'सुप्रभात', 'शुभ संध्या']
  ) && wordCount <= 5 && !lower.includes('bordeaux') && !lower.includes('blight');

  if (isGreeting) {
    if (activeDisease) {
      return isHi
        ? `नमस्ते किसान भाई! मैं आपका **किसान मित्र कृषि सलाहकार** हूं। देख रहा हूं कि आपने अभी **${activeDisease.hindi_name}** की जांच की है — आप इसके जैविक उपचार, 15L पंप दवा मात्रा या किसी अन्य फसल विषय पर खुलकर बात कर सकते हैं!`
        : `Namaste! Great to chat with you. I see you just scanned **${activeDisease.name}** — feel free to ask about sprays, organic remedies, or just chat about your Tomato & Potato crop!`;
    }
    return isHi
      ? 'नमस्ते किसान भाई! मैं आपका **किसान मित्र कृषि सलाहकार** हूं। आप मुझसे सामान्य कृषि चर्चा कर सकते हैं या टमाटर व आलू के किसी भी रोग (अगेती/पछेती झुलसा, स्कैब, पिंक रॉट, लीफ कर्ल), 15L पंप दवा मात्रा, खाद या जैविक उपचार के बारे में पूछ सकते हैं। बताइए आज आपकी क्या मदद करूं?'
      : 'Namaste! I am your **Kisan Mitra Agri-Advisor**. I am here to help you with casual farming advice as well as any **Tomato or Potato** disease questions, symptoms, organic recipes, fertilizers, or 15L sprayer pump dosages. How can I assist you today?';
  }

  if (hasTerm(
    lower,
    ['how are you', 'how r u', 'how are u', 'how is it going', 'hows it going', 'kaise ho', 'kya haal', 'whats up', "what's up", 'good night', 'shubh ratri'],
    ['कैसे हो', 'कैसे हैं', 'क्या हाल', 'कैसा चल रहा', 'सब ठीक', 'और बताओ', 'शुभ रात्रि']
  )) {
    return isHi
      ? 'मैं बिल्कुल बढ़िया हूं किसान भाई, पूछने के लिए धन्यवाद! 😊 उम्मीद है आपकी टमाटर और आलू की फसल भी खूब हरी-भरी और स्वस्थ होगी। बताइए आज खेत में क्या चल रहा है या किस विषय पर बात करनी है?'
      : 'I am doing wonderfully, thank you for asking! I hope your fields are thriving. Feel free to chat or ask anything about tomato or potato care, diseases, or fertilizers!';
  }

  if (hasTerm(
    lower,
    ['who are you', 'what can you do', 'what do you do', 'your name', 'about you', 'help me', 'what is kisan mitra'],
    ['कौन हो', 'तुम कौन', 'आप कौन', 'क्या कर सकते', 'क्या करते हो', 'मदद करो', 'किसान मित्र क्या']
  ) && wordCount <= 8) {
    return isHi
      ? 'मैं **किसान मित्र कृषि सलाहकार (Kisan Mitra Agri-Advisor)** हूं — आपका मित्रवत टमाटर व आलू फसल विशेषज्ञ AI सहायक। मैं मदद कर सकता हूं:\n• फोटो से 43 टमाटर व आलू के रोगों की सटीक पहचान\n• 15L स्प्रेयर पंप दवा खुराक व 1% बोर्डो मिश्रण विधि\n• जैविक उपाय, खाद शेड्यूल व सिंचाई सलाह\n• खेती से जुड़ी सामान्य चर्चा और सवाल-जवाब!'
      : 'I am **Kisan Mitra Agri-Advisor**, your friendly Tomato & Potato farming assistant. I can help you:\n• Diagnose 43 Tomato & Potato diseases from leaf, stem, fruit, or tuber photos\n• Differentiate blight, wilts, viruses, scabs & tuber rots\n• Calculate exact 15L knapsack sprayer pump dosages & organic remedies\n• Solve nutrient deficiencies (N, P, K, Calcium Blossom End Rot, Fe, Mg) or just chat about crop care!';
  }

  if (hasTerm(
    lower,
    ['thanks', 'thank you', 'thx', 'ty', 'shukriya', 'dhanyavaad', 'dhanyawad', 'great', 'nice', 'awesome', 'ok', 'okay', 'got it', 'theek hai', 'bye', 'goodbye', 'alvida'],
    ['धन्यवाद', 'शुक्रिया', 'थैंक्स', 'ठीक है', 'समझ गया', 'समझ गई', 'बहुत अच्छा', 'बहुत बढ़िया', 'बढ़िया', 'अच्छा', 'अलविदा']
  ) && wordCount <= 5) {
    return isHi
      ? 'आपका स्वागत है किसान भाई! 🌾 आपकी फसल स्वस्थ और भरपूर पैदावार दे, यही मेरी शुभकामना है। कभी भी बात करनी हो या किसी रोग पर सलाह चाहिए, मैं यहीं हूं!'
      : 'You are most welcome! 🌾 Wishing your tomato and potato fields a healthy, high-yield harvest. Reach out anytime you want to chat or check a plant!';
  }

  // 2. Specialized Direct Agronomic Recipes (Bordeaux, Early vs Late Blight, Whitefly, 15L Pump Cheat Sheet)
  if (hasTerm(lower, ['bordeaux'], ['बोर्डो'])) {
    return isHi
      ? '🧪 **1% बोर्डो मिश्रण (Bordeaux Mixture) बनाने की प्रामाणिक विधि:**\n1. एक प्लास्टिक या मिट्टी के बर्तन में 50 लीटर पानी में **1 किलो नीला थोथा (कॉपर सल्फेट)** पूरी तरह घोलें (धातु का बर्तन न लें)।\n2. दूसरे बर्तन में 50 लीटर पानी में **1 किलो बिना बुझा चूना (Quicklime)** घोलें।\n3. धीरे-धीरे नीले थोथे के घोल को चूने के पानी में डालें और लकड़ी के डंडे से हिलाते रहें।\n4. **15L एक पंप हेतु अनुपात:** एक बार में 1 पंप के लिए **150g नीला थोथा + 150g चूना** प्रति 15L पानी में अलग घोलकर मिलाएं।\n5. **अम्लता जांच:** साफ लोहे का चाकू घोल में 1 मिनट डुबोएं — यदि ब्लेड पर लाल तांबे की परत दिखे तो थोड़ा और चूना मिलाएं जब तक घोल उदासीन न हो जाए।'
      : '🧪 **How to Prepare 1% Bordeaux Mixture (100 Liters | or Single 15L Tank):**\n1. Dissolve **1 kg Copper Sulphate (Neela Thotha)** in 50L water inside a plastic or earthen vessel (never use metal).\n2. In a separate vessel, slake **1 kg fresh Quicklime (Chuna)** in 50L water.\n3. Slowly pour the copper sulphate solution into the lime suspension while stirring continuously with a wooden stick.\n4. **Single 15L Knapsack Tank Proportion:** Dissolve **150g Copper Sulphate + 150g Quicklime** cleanly for one 15L sprayer pump.\n5. **Neutrality Test:** Dip a clean iron knife blade for 1 minute. If reddish copper deposits on the blade, add more lime until neutral, then spray immediately.';
  }

  if ((lower.includes('early') && lower.includes('late')) || (lower.includes('अगेती') && lower.includes('पछेती'))) {
    return isHi
      ? '🔬 **अगेती झुलसा (Early Blight) बनाम पछेती झुलसा (Late Blight):**\n\n**1. अगेती झुलसा (*Alternaria solani*):**\n• पुरानी निचली पत्तियों पर **निशाने (टारगेट बोर्ड) जैसे गोल छल्ले** व चारों ओर पीलापन।\n• गर्म-आर्द्र मौसम (24–29°C) में धीरे-धीरे फैलता है।\n• **दवा (15L पंप):** अमिसटार टॉप (15ml) या मैंकोजेब 75 WP (40g)।\n\n**2. पछेती झुलसा (*Phytophthora infestans*):**\n• पत्तियों पर तेजी से गलने वाले **पानी-भीगे काले धब्बे**, व नमी/कोहरे में पत्ती के **निचले हिस्से पर सफेद रुई जैसी फफूंद**।\n• ठंडे, धुंध व बादल वाले मौसम (15–22°C) में 5–7 दिन में पूरी फसल बर्बाद कर सकता है।\n• **तुरंत दवा (15L पंप):** रिडोमिल गोल्ड (35–40g) या कर्ज़ेट M8 (35g)।'
      : '🔬 **Early Blight vs. Late Blight Differentiation Key:**\n\n**1. Early Blight (*Alternaria solani*):**\n• Dry, dark **concentric bullseye target rings** starting on lower/older leaves with yellow halos.\n• Favored by warm humid days (24–29°C); spreads progressively upward.\n• **Spray (15L tank):** Amistar Top (15ml) or Mancozeb 75 WP (38–40g).\n\n**2. Late Blight (*Phytophthora infestans*):**\n• Rapidly spreading **water-soaked greasy black-brown blotches** with **white cottony mildew fuzz on leaf undersides** in fog/mist.\n• Favored by cool cloudy weather (15–22°C, RH > 90%); can destroy fields within 5–7 days.\n• **Emergency Spray (15L tank):** Ridomil Gold (35–40g) or Curzate M8 (30–35g) within 24 hours.';
  }

  if (hasTerm(lower, ['whitefly'], ['सफेद मक्खी']) || (lower.includes('neem') && lower.includes('leaf curl'))) {
    return isHi
      ? '🦟 **सफेद मक्खी (Whitefly) व पत्ती मरोड़ वायरस (Leaf Curl) का जैविक प्रबंधन:**\n• **नीम स्प्रे:** **50–60ml कोल्ड-प्रेस्ड नीम तेल (Azadirachtin 10,000 ppm)** + 15ml तरल साबुन प्रति **15L पानी पंप** में मिलाकर पत्तियों की निचली सतह पर छिड़कें।\n• **पीले चिपचिपे जाल:** प्रति एकड़ 10–12 पीले चिपचिपे ट्रैप (Yellow Sticky Traps) फसल की ऊंचाई से थोड़ा ऊपर लगाएं।\n• **बचाव:** अत्यधिक प्रकोप में संक्रमित वायरस पौधों को उखाड़कर नष्ट करें और खेत की मेड़ों पर मक्का की अवरोधक कतार लगाएं।'
      : '🦟 **Organic Control for Whitefly (*Bemisia tabaci*) & Leaf Curl Vector:**\n• **Neem Emulsion Spray:** Mix **50–60ml Cold-Pressed Neem Oil (10,000 ppm Azadirachtin)** + **15ml mild liquid soap/sticker** per **15L knapsack tank**. Spray early morning or late evening targeting leaf undersides.\n• **Yellow Sticky Traps:** Install 10–12 traps per acre just above canopy height to trap adult whiteflies.\n• **Biological Option:** Spray *Beauveria bassiana* or *Verticillium lecanii* @ 5g/L during humid evenings.';
  }

  // Non-solanaceous crop polite redirect (checked before disease search unless tomato/potato is also named)
  const mentionsTargetCrop = hasTerm(lower, ['tomato', 'potato', 'tamatar', 'aalu', 'alu'], ['टमाटर', 'आलू']);
  if (
    !mentionsTargetCrop &&
    hasTerm(lower, ['wheat', 'rice', 'paddy', 'corn', 'maize', 'cotton', 'sugarcane', 'soybean', 'onion', 'chili', 'chilli', 'brinjal'], ['गेहूं', 'धान', 'चावल', 'मक्का', 'कपास', 'गन्ना', 'सोयाबीन', 'प्याज'])
  ) {
    return isHi
      ? '🌾 किसान मित्र विशेष रूप से **टमाटर (19 रोग)** और **आलू (24 रोग)** पर प्रशिक्षित है ताकि सलाह 100% सटीक रहे। आप मुझसे सामान्य कृषि चर्चा कर सकते हैं या टमाटर व आलू के किसी रोग, लक्षण, खाद या 15L पंप दवा के बारे में पूछ सकते हैं।'
      : '🌾 Kisan Mitra specializes exclusively in **Tomato (19 conditions)** and **Potato (24 conditions)** pathology so prescriptions remain highly accurate. Ask me anything about tomato/potato diseases, symptoms, organic remedies, or upload a crop photo!';
  }

  // 3. Intent Flags + Tokenized Search Across 43 Diseases & 6 Nutrient Deficiencies
  const asksOrganic = hasTerm(lower, ['organic', 'natural', 'bio', 'biocontrol', 'neem', 'homemade', 'desi'], ['जैविक', 'देसी', 'प्राकृतिक', 'नीम', 'घरेलू']);
  const asksChemical = hasTerm(lower, ['chemical', 'spray', 'medicine', 'fungicide', 'pesticide', 'dawa', 'dawai', 'pump', 'dose', 'dosage', 'tank'], ['दवा', 'दवाई', 'रासायनिक', 'छिड़काव', 'स्प्रे', 'मात्रा', 'खुराक', 'पंप']);
  const asksPrevent = hasTerm(lower, ['prevent', 'prevention', 'stop', 'avoid', 'fertilizer', 'nutrition', 'npk', 'khad', 'khaad'], ['रोकथाम', 'बचाव', 'खाद', 'उर्वरक', 'पोषण']);
  const asksSymptoms = hasTerm(lower, ['symptom', 'symptoms', 'why', 'cause', 'spread', 'danger', 'serious'], ['लक्षण', 'कारण', 'क्यों', 'खतरनाक', 'पहचान']);
  const referencesContext = hasTerm(lower, ['this', 'it', 'remedy', 'treatment', 'cure'], ['इसका', 'इसके', 'इसकी', 'इसमें', 'इस रोग', 'इलाज', 'उपचार']);

  const tokens = normalizeQueryTokens(raw);
  const { bestDis, bestDisScore, bestSymptomScore, bestDef, bestDefScore, mentionsTomato, mentionsPotato } =
    searchBestCondition(tokens, lower, activeDisease);

  const asksPumpSheet = hasTerm(lower, ['mancozeb', '15l', 'knapsack', 'tank'], ['मैंकोजेब', 'मैन्कोज़ेब', '15 लीटर']) ||
    (hasTerm(lower, ['dosage', 'dose'], ['पंप', 'खुराक', 'मात्रा', 'टंकी']) && bestSymptomScore < 5);

  if (asksPumpSheet && !activeDisease && bestSymptomScore < 7) {
    return isHi
      ? '⚡ **मानक 15-लीटर नैपसैक स्प्रेयर पंप दवा तालिका:**\n• **मैन्कोज़ेब 75 WP (Indofil M-45):** 38–40 ग्राम (अगेती झुलसा बचाव)\n• **रिडोमिल गोल्ड (Metalaxyl + Mancozeb):** 35–40 ग्राम (पछेती झुलसा / पिंक रॉट)\n• **अमिसटार टॉप:** 15 मिली (अगेती झुलसा / टार्गेट स्पॉट / चूर्णिल आसिता)\n• **कर्ज़ेट M8:** 30–35 ग्राम (पछेती झुलसा त्वरित रोकथाम)\n• **कॉपर ऑक्सीक्लोराइड 50 WP + स्ट्रेप्टोसाइक्लिन:** 45 ग्राम + 1.5 ग्राम (जीवाणु धब्बा / कैंकर)\n• **नीम तेल (10,000 ppm):** 50–60 मिली + 10 मिली स्टीकर\n💡 *टिप:* पहले 2 लीटर बाल्टी में घोल बनाएं, फिर 15L पंप में डालें।'
      : '⚡ **Standard 15-Liter Knapsack Sprayer Dilution Guide:**\n• **Mancozeb 75% WP (Indofil M-45):** 38–40g per 15L tank (Early Blight preventive)\n• **Ridomil Gold (Metalaxyl-M + Mancozeb):** 35–40g per 15L tank (Late Blight / Pink Rot)\n• **Amistar Top:** 15ml per 15L tank (Early Blight, Target Spot, Powdery Mildew)\n• **Curzate M8:** 30–35g per 15L tank (Kickback Late Blight arrest)\n• **Copper Oxychloride 50% WP + Streptocycline:** 45g Copper + 1.5g Streptocycline (Bacterial Spot / Canker)\n• **Cold-Pressed Neem Oil (10,000 ppm):** 50–60ml + 10ml sticker\n💡 Pre-mix powder in a 2L bucket before pouring into the filled 15L tank.';
  }

  // Follow-up about the active diagnosed photo
  if (
    activeDisease &&
    (referencesContext || tokens.length <= 2 || (bestDis && bestDis.id === activeDisease.id) ||
      ((asksOrganic || asksChemical || asksPrevent || asksSymptoms) && bestSymptomScore < 7))
  ) {
    if (asksOrganic) return formatDiseasePrescription(activeDisease, lang, 'organic');
    if (asksChemical) return formatDiseasePrescription(activeDisease, lang, 'chemical');
    if (asksPrevent) return formatDiseasePrescription(activeDisease, lang, 'prevent');
    return formatDiseasePrescription(activeDisease, lang, 'full');
  }

  // Nutrient Deficiency match
  if (bestDef && bestDefScore >= 4 && bestDefScore >= bestDisScore) {
    return isHi
      ? `🍂 **${bestDef.hindi_name}** (${bestDef.name})\n• **पहचान लक्षण:** ${bestDef.symptoms}\n• **सुधार एवं खाद मात्रा:** ${bestDef.correction}`
      : `🍂 **${bestDef.name}** (${bestDef.hindi_name})\n• **Symptoms:** ${bestDef.symptoms}\n• **Correction & Fertilizer Schedule:** ${bestDef.correction}`;
  }

  // Specific Disease match across all 43 Tomato & Potato conditions
  if (bestDis && bestSymptomScore >= 2) {
    const focus = asksOrganic ? 'organic' : asksChemical ? 'chemical' : asksPrevent ? 'prevent' : 'full';
    return formatDiseasePrescription(bestDis, lang, focus);
  }

  // 4. Broad Agronomic Topics (Irrigation, Weather/Fog, Fertilizer Schedule, Cultivation, Crop Overview)
  if (hasTerm(lower, ['irrigation', 'water', 'watering', 'drip', 'moisture'], ['सिंचाई', 'पानी', 'नमी', 'ड्रिप'])) {
    return isHi
      ? '💧 **टमाटर व आलू सिंचाई प्रबंधन:**\n• झुलसा व जीवाणु रोग से बचने के लिए हमेशा **सुबह के समय जड़ के पास (फरो या ड्रिप)** सिंचाई करें — पत्तियों के ऊपर फव्वारा सिंचाई न करें।\n• आलू में कंद बनते समय हल्की व नियमित नमी बनाए रखें ताकि खोखलापन (Hollow Heart) और कॉमन स्कैब न हो।'
      : '💧 **Irrigation Management for Tomato & Potato:**\n• Prefer drip or furrow irrigation in early morning rather than overhead sprinklers so foliage stays dry before nightfall (greatly reduces Late Blight & Bacterial Spot).\n• Maintain steady moisture during tomato flowering/fruit set to prevent Blossom End Rot, and during potato tuber bulking to suppress Common Scab.';
  }

  if (hasTerm(lower, ['weather', 'fog', 'rain', 'humid', 'humidity', 'cold', 'frost', 'heat'], ['मौसम', 'कोहरा', 'बारिश', 'नमी', 'ठंड', 'पाला', 'धूप'])) {
    return isHi
      ? '🌦️ **मौसम आधारित फसल सुरक्षा सलाह:**\n• **ठंड, कोहरा व बादल (15–22°C):** आलू और टमाटर में **पछेती झुलसा (Late Blight)** का उच्च जोखिम रहता है — बचाव हेतु **मैंकोजेब (40g/15L)** या पछेती झुलसा दिखते ही **रिडोमिल गोल्ड (35g/15L)** का छिड़काव करें।\n• **पाला (Frost) बचाव:** रात में हल्की सिंचाई करें और धुंआ या 0.1% सल्फर (गंधक) का छिड़काव लाभकारी होता है।\n• **तेज गर्मी व सूखापन:** सफेद मक्खी व लाल मकड़ी बढ़ते हैं — नियमित नमी और 10,000 ppm नीम तेल स्प्रे रखें।'
      : '🌦️ **Weather-Based Disease Alert for Tomato & Potato:**\n• **Cool Foggy / Rainy Weather (15–22°C, RH > 85%):** Peak trigger for **Late Blight**. Apply preventive **Mancozeb 75 WP (40g/15L)** or emergency **Ridomil Gold (35–40g/15L)**.\n• **Warm Humid Spell:** Watch for **Early Blight**, **Septoria Spot**, and **Bacterial Spot** on lower leaves.\n• **Hot Dry Conditions:** **Whiteflies** (TYLCV vector) and **Spider Mites** surge — install Yellow Sticky Traps and keep uniform root moisture.';
  }

  if (hasTerm(lower, ['fertilizer', 'npk', 'dap', 'urea', 'yield', 'spacing', 'planting', 'nursery', 'pruning', 'harvest', 'storage'], ['खाद', 'उर्वरक', 'यूरिया', 'डीएपी', 'पैदावार', 'रोपाई', 'नर्सरी', 'कटाई', 'भंडारण'])) {
    return isHi
      ? '🌾 **टमाटर व आलू पोषण एवं खेती प्रबंधन:**\n• **बेसल खाद व बढ़वार:** अत्यधिक यूरिया (नाइट्रोजन) से बचें क्योंकि इससे पत्तियां कोमल होकर झुलसा व रस-चूसक कीटों को आकर्षित करती हैं।\n• **फूल व कंद/फल अवस्था:** पोटाश (MOP / 0:0:50 @ 5g/L) और कैल्शियम नाइट्रेट @ 5g/L + बोरॉन @ 1g/L छिड़काव करने से फल नहीं फटते, सड़न (Blossom End Rot) रुकती है और आलू चमकदार व बड़े बनते हैं।'
      : '🌾 **Tomato & Potato Nutrition & Yield Best Practices:**\n• **Balanced Nitrogen:** Avoid heavy Urea top-dressings once blight or whiteflies appear — lush soft foliage accelerates fungal and sucking-pest outbreaks.\n• **Flowering & Tuber/Fruit Bulking:** Apply **Potassium Nitrate (13:0:45 @ 5g/L)** or **0:0:50** plus **Calcium Nitrate (5g/L) + Boron (1g/L)** to boost fruit firmness, block Blossom End Rot, and improve potato storability.';
  }

  // Broad crop overview when user mentions Tomato or Potato without a specific symptom
  if (mentionsTomato || mentionsPotato) {
    if (mentionsPotato) {
      return isHi
        ? '🥔 **आलू फसल मार्गदर्शन (24 प्रमुख रोग कवर):**\nआलू में सबसे सामान्य समस्याएं हैं — **पछेती झुलसा**, **अगेती झुलसा**, **कॉमन स्कैब (खुरंड)**, **ब्लैक स्कर्फ**, **पिंक रॉट**, **ड्राई रॉट**, **ब्राउन रॉट**, **PLRV/PVY वायरस** और **मस्सा (Wart)**।\nकृपया कंद या पत्ती के लक्षण लिखें (जैसे *"काटने पर आलू गुलाबी होता है"* या *"छिलके पर काले धब्बे हैं"*), या ऊपर फोटो अपलोड करें!'
        : '🥔 **Potato Pathology Advisor (24 Conditions Covered):**\nCommon potato issues include **Late Blight**, **Early Blight**, **Common Scab**, **Black Scurf**, **Pink Rot**, **Dry Rot**, **Brown Rot**, **PLRV/PVY Viruses**, and **Blackleg**.\nTell me the exact leaf or tuber symptom (e.g., *"pink flesh when cut"*, *"black scurf on skin"*) or upload a photo above!';
    }
    return isHi
      ? '🍅 **टमाटर फसल मार्गदर्शन (19 प्रमुख रोग कवर):**\nटमाटर में प्रमुख समस्याएं हैं — **अगेती व पछेती झुलसा**, **पीला पत्ती मरोड़ वायरस (TYLCV)**, **पाउडरी मिल्ड्यू**, **सेप्टोरिया स्पॉट**, **बैक्टीरियल स्पॉट/विल्ट**, **फ्यूजेरियम उकठा**, **स्पाइडर माइट्स** और **ब्लॉसम एंड रॉट**।\nकृपया पत्ती या फल के लक्षण बताएं (जैसे *"पत्ती पीली होकर मुड़ रही है"* या *"टमाटर नीचे से काला सड़ रहा है"*), या ऊपर फोटो अपलोड करें!'
      : '🍅 **Tomato Pathology Advisor (19 Conditions Covered):**\nCommon tomato issues include **Early & Late Blight**, **Yellow Leaf Curl Virus (TYLCV)**, **Powdery Mildew**, **Septoria Leaf Spot**, **Bacterial Spot/Wilt**, **Spider Mites**, and **Blossom End Rot**.\nTell me the symptoms you observe (e.g., *"yellow curled leaves"*, *"black bottom on fruit"*) or upload a leaf/fruit photo!';
  }

  // 5. Friendly Conversational Fallback
  return isHi
    ? 'आपका सवाल अच्छा है किसान भाई! मैं **टमाटर और आलू** की हर बीमारी और खेती में आपकी मदद कर सकता हूं। आप सामान्य बातचीत के अलावा ऐसे सवाल पूछ सकते हैं:\n• *"मेरे टमाटर के नीचे का हिस्सा काला सड़ रहा है"*\n• *"आलू काटने पर अंदर से गुलाबी हो रहा है"*\n• *"टमाटर की पत्तियां पीली होकर मुड़ रही हैं"*\n• *"1% बोर्डो मिश्रण या 15L पंप की दवा मात्रा"*\nया सीधे ऊपर किसी भी पत्ती या कंद की फोटो अपलोड करें!'
    : 'I am happy to help! Along with friendly farming chat, you can ask me specific questions about **Tomato & Potato** crops, such as:\n• *"Why is the bottom of my tomato turning black?"*\n• *"Potato tuber turns pink when cut — what to spray?"*\n• *"Tomato leaves yellowing and curling upward"*\n• *"15L knapsack sprayer pump dosage or NPK schedule"*\nOr upload a crop photo directly in the inspector above!';
}

module.exports = {
  generateAdvisorReply
};
