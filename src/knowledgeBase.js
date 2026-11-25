/**
 * Kisan Mitra - Solanaceous Crop Disease & Nutrient Knowledge Base
 * Exclusively Tomato (19 conditions) and Potato (24 AHDB & global conditions).
 */

const DISEASE_KNOWLEDGE_BASE = {
  "Tomato___Powdery_mildew": {
    "id": "tomato_powdery_mildew",
    "crop": "Tomato",
    "name": "Tomato Powdery Mildew",
    "hindi_name": "टमाटर का चूर्णिल आसिता रोग (पाउडरी मिल्ड्यू)",
    "pathogen": "Oidium neolycopersici / Leveillula taurica (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#0284c7",
    "symptoms": "Telltale white, talcum-powder-like fungal patches and flour-like spore dust on upper and lower leaf surfaces, starting as chlorotic yellow blotches. Affected leaves curl, turn brown, and drop prematurely. (Photo reference: Dr. Meg McGrath / Cornell Pathology).",
    "causes": "Warm, dry weather accompanied by moderate to high relative humidity (60-80%). Unlike late blight, it does NOT require free leaf wetness or rain to infect; spores are dispersed rapidly by wind currents.",
    "organic_remedies": [
      "Spray Wettable Sulfur 80% WDG @ 3 grams per Liter of water (most effective organic standard).",
      "Spray diluted fresh milk (1 part milk to 9 parts water). Milk lactoferrin produces free radicals under sunlight that dismantle fungal mycelium.",
      "Apply Potassium Bicarbonate @ 4g/L or Baking Soda (Sodium Bicarbonate) @ 5g/L with 1ml liquid soap or horticultural oil.",
      "Spray cold-pressed Neem Oil (10,000 ppm) @ 3-5 ml/L during early morning or evening."
    ],
    "chemical_treatments": [
      {
        "chemical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
        "dosage": "1 ml per Liter of water",
        "interval": "Apply at the onset of initial white powdery spots, repeat after 10-12 days."
      },
      {
        "chemical": "Hexaconazole 5% SC (Contaf) or Myclobutanil 10% WP",
        "dosage": "Contaf @ 2 ml/L OR Myclobutanil @ 1 g/L of water",
        "interval": "Rapid systemic cure for expanding mildew colonies."
      },
      {
        "chemical": "Penconazole 10% EC (Topas)",
        "dosage": "0.5 ml per Liter of water",
        "interval": "Curative triazole fungicide with translaminar movement."
      }
    ],
    "preventive_measures": [
      "Increase plant spacing to allow plenty of sunlight and cross-ventilation through the canopy.",
      "Prune infected lower foliage immediately and discard away from field; never compost powdery mildew leaves.",
      "Scout weekly during warm, dry spells, especially in greenhouses and high tunnels.",
      "Avoid excessive nitrogen fertilizers which produce dense, tender succulent foliage susceptible to mildew."
    ],
    "fertilizer_recommendation": "Spray Potassium Schoenite (0:0:50) @ 5g/L and Silica foliar spray to thicken the leaf cuticle and prevent fungal haustoria penetration.",
    "voice_summary": "Tomato Powdery Mildew detected with telltale white fungal spores on leaves. Spray Wettable Sulfur or Amistar Top immediately. Prune dense foliage to increase airflow."
  },
  "Tomato___Bacterial_spot": {
    "id": "tomato_bacterial_spot",
    "crop": "Tomato",
    "name": "Tomato Bacterial Spot",
    "hindi_name": "टमाटर का जीवाणु धब्बा रोग (बैक्टीरियल स्पॉट)",
    "pathogen": "Xanthomonas campestris pv. vesicatoria",
    "category": "Bacterial",
    "severity": "High",
    "badge_color": "#e65100",
    "symptoms": "Small, water-soaked, dark brown to black circular spots (1-3mm) with yellow halos on leaves. Causes leaf drop and sunscald on fruits.",
    "causes": "Warm temperatures (24-30°C) with high humidity, overhead irrigation, and driving rain splashes.",
    "organic_remedies": [
      "Spray Copper Hydroxide or certified organic copper soap weekly.",
      "Apply Bacillus subtilis (Bio-fungicide) @ 5g/L during early vegetative stage.",
      "Spray 5% Neem Seed Kernel Extract (NSKE) as an antibacterial deterrent."
    ],
    "chemical_treatments": [
      {
        "chemical": "Copper Oxychloride 50% WP + Streptocycline",
        "dosage": "Copper Oxychloride @ 2.5g/L + Streptocycline @ 0.1g/L (1g in 10L water)",
        "interval": "Spray twice at 10-12 day intervals."
      },
      {
        "chemical": "Kasugamycin 3% SL",
        "dosage": "2 ml per Liter of water",
        "interval": "Apply at the onset of initial lesions."
      }
    ],
    "preventive_measures": [
      "Use certified disease-free treated seeds.",
      "Avoid overhead sprinkler irrigation; switch to drip irrigation to keep foliage dry.",
      "Practice 2-3 year crop rotation away from solanaceous crops."
    ],
    "fertilizer_recommendation": "Avoid excessive Nitrogen fertilizer which promotes soft succulent growth. Supplement with Potassium (K) to strengthen leaf cell walls.",
    "voice_summary": "Detected Tomato Bacterial Spot. Immediately spray Copper Oxychloride with Streptocycline. Avoid overhead watering to prevent bacterial spread."
  },
  "Tomato___Early_blight": {
    "id": "tomato_early_blight",
    "crop": "Tomato",
    "name": "Tomato Early Blight",
    "hindi_name": "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)",
    "pathogen": "Alternaria solani (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#d84315",
    "symptoms": "Concentric rings resembling a 'target board' or bullseye surrounded by yellow chlorotic margins, starting on oldest lower leaves and moving upwards.",
    "causes": "Warm temperatures (24-29°C) combined with high humidity, heavy morning dew, or rain splashes from contaminated soil.",
    "organic_remedies": [
      "Foliar spray of Trichoderma viride @ 5g/L mixed with 10ml jaggery solution.",
      "Apply Cow urine (diluted 1:10) mixed with asafoetida (heeng) as a bio-protectant.",
      "Spray baking soda solution (5g/L) with horticultural oil to alter leaf surface pH."
    ],
    "chemical_treatments": [
      {
        "chemical": "Mancozeb 75% WP (Indofil M-45)",
        "dosage": "2.5 grams per Liter of water",
        "interval": "Preventive spray every 7-10 days."
      },
      {
        "chemical": "Chlorothalonil 75% WP or Azoxystrobin + Difenoconazole (Amistar Top)",
        "dosage": "1 ml per Liter of water",
        "interval": "Curative spray for moderate-to-severe blighting."
      }
    ],
    "preventive_measures": [
      "Prune lower leaves touching the soil (bottom 12 inches) to improve air circulation.",
      "Apply plastic or organic straw mulch to stop fungal spores splashing from soil onto leaves.",
      "Burn or deeply bury severely infected crop residues."
    ],
    "fertilizer_recommendation": "Maintain balanced N:P:K (19:19:19) with adequate Calcium. Avoid nitrogen deficiency as stressed plants succumb faster.",
    "voice_summary": "Tomato Early Blight detected with characteristic bullseye target spots. Spray Mancozeb or Chlorothalonil and prune lowest infected leaves."
  },
  "Tomato___Late_blight": {
    "id": "tomato_late_blight",
    "crop": "Tomato",
    "name": "Tomato Late Blight",
    "hindi_name": "टमाटर का पछेती झुलसा रोग (लेट ब्लाइट) - अत्यंत घातक",
    "pathogen": "Phytophthora infestans (Oomycete)",
    "category": "Fungal / Oomycete",
    "severity": "Critical",
    "badge_color": "#b71c1c",
    "symptoms": "Rapidly spreading irregular, water-soaked greenish-black lesions that turn greasy and papery. White fuzzy fungal growth appears on leaf undersides in high humidity. Can destroy an entire field in 5-7 days.",
    "causes": "Cool (15-22°C), overcast, foggy weather with relative humidity above 90%.",
    "organic_remedies": [
      "Apply Bordeaux mixture (1%) thoroughly on both sides of foliage immediately before foggy spells.",
      "Bio-control: Foliar application of Pseudomonas fluorescens @ 5g/L.",
      "Copper hydroxide spray (2.5g/L) as a protective barrier."
    ],
    "chemical_treatments": [
      {
        "chemical": "Metalaxyl 8% + Mancozeb 64% WP (Ridomil Gold)",
        "dosage": "2.5 grams per Liter of water",
        "interval": "Immediate systemic curative action, repeat after 10 days if foggy."
      },
      {
        "chemical": "Cymoxanil 8% + Mancozeb 64% WP (Curzate M8)",
        "dosage": "2.0 grams per Liter of water",
        "interval": "Kickback curative spray within 48 hours of infection."
      }
    ],
    "preventive_measures": [
      "Monitor weather forecasts closely; spray prophylactic fungicides prior to cloudy/misty spells.",
      "Do not plant tomatoes immediately adjacent to potato fields.",
      "Ensure proper drainage and wide row spacing (90cm x 60cm)."
    ],
    "fertilizer_recommendation": "Avoid high Nitrogen before winter/monsoon rains. Spray Potassium Schoenite or SOP (0:0:50) to enhance plant disease resistance.",
    "voice_summary": "Critical alert: Tomato Late Blight detected. Spray Ridomil Gold or Curzate immediately. Act within twenty-four hours to save the crop."
  },
  "Tomato___Leaf_Mold": {
    "id": "tomato_leaf_mold",
    "crop": "Tomato",
    "name": "Tomato Leaf Mold",
    "hindi_name": "टमाटर का पर्ण फफूंद (लीफ मोल्ड)",
    "pathogen": "Passalora fulva (formerly Cladosporium fulvum)",
    "category": "Fungal",
    "severity": "Moderate",
    "badge_color": "#f57c00",
    "symptoms": "Pale greenish-yellow chlorotic spots on upper leaf surface, with dense olive-green to grayish velvety fungal mold on corresponding underside.",
    "causes": "High humidity (>85%) and moderate temperatures (20-25°C), common in polyhouses and dense canopies.",
    "organic_remedies": [
      "Sulfur 80% WDG @ 3g/L spray.",
      "Potassium bicarbonate foliar spray @ 4g/L to disrupt fungal spores.",
      "Ventilate greenhouse/polyhouse to reduce humidity below 75%."
    ],
    "chemical_treatments": [
      {
        "chemical": "Difenoconazole 25% EC (Score)",
        "dosage": "1 ml per Liter of water",
        "interval": "Spray twice at 12-day intervals."
      },
      {
        "chemical": "Thiophanate Methyl 70% WP (Roko)",
        "dosage": "1.5 grams per Liter of water",
        "interval": "Effective protective and systemic cure."
      }
    ],
    "preventive_measures": [
      "Increase plant spacing and de-sucker tomato plants to allow maximum air circulation.",
      "Water only at ground level early in the morning.",
      "Clean and sanitize polyhouse structures between seasons."
    ],
    "fertilizer_recommendation": "Balanced NPK fertigation. Ensure adequate Zinc and Boron micronutrient balance.",
    "voice_summary": "Tomato Leaf Mold detected with yellow spots and underside olive mold. Increase ventilation and apply Difenoconazole or Sulfur spray."
  },
  "Tomato___Septoria_leaf_spot": {
    "id": "tomato_septoria_leaf_spot",
    "crop": "Tomato",
    "name": "Tomato Septoria Leaf Spot",
    "hindi_name": "टमाटर का सेप्टोरिया पत्ती धब्बा रोग",
    "pathogen": "Septoria lycopersici (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#ef6c00",
    "symptoms": "Numerous small circular spots (1.5-3mm) with gray/tan centers and prominent dark margins. Tiny black specks visible inside spot centers.",
    "causes": "Prolonged leaf wetness and warm temperatures (20-25°C). Spores splash up from crop residue.",
    "organic_remedies": [
      "Copper hydroxide 53.8% DF @ 2g/L.",
      "Bio-spray with Trichoderma harzianum @ 5g/L.",
      "Neem cake soil application (250 kg/acre) to suppress soil inoculum."
    ],
    "chemical_treatments": [
      {
        "chemical": "Chlorothalonil 75% WP (Kavach)",
        "dosage": "2 grams per Liter of water",
        "interval": "Apply every 7-10 days under rainy weather."
      },
      {
        "chemical": "Tebuconazole 25.9% EC (Folicur)",
        "dosage": "1.5 ml per Liter of water",
        "interval": "Systemic triazole fungicide for rapid arrest."
      }
    ],
    "preventive_measures": [
      "Strip off infected lower leaves and discard away from field.",
      "Deep summer ploughing to bury old tomato vines.",
      "Keep soil well-mulched with paddy straw or black silver polyethylene."
    ],
    "fertilizer_recommendation": "Avoid nitrogen spikes. Apply water-soluble 13:0:45 (Potassium Nitrate) @ 5g/L as foliar booster.",
    "voice_summary": "Tomato Septoria leaf spot detected with multiple circular gray-center lesions. Spray Chlorothalonil and prune affected lower foliage."
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    "id": "tomato_spider_mites",
    "crop": "Tomato",
    "name": "Tomato Spider Mite Infestation",
    "hindi_name": "टमाटर का लाल मकड़ी / माइट्स प्रकोप (स्पाइडर माइट्स)",
    "pathogen": "Tetranychus urticae (Acarina Pest)",
    "category": "Pest / Acarid",
    "severity": "High",
    "badge_color": "#c2185b",
    "symptoms": "Fine yellow stippling (speckled tiny dots) on leaves, bronzing or bleached appearance. Fine silk webbing on leaf undersides and terminal shoots.",
    "causes": "Hot, dry, and dusty weather. Excess use of broad-spectrum pyrethroid insecticides that kill natural predator mites.",
    "organic_remedies": [
      "Spray Neem oil 10,000 ppm @ 3ml/L with mild soap solution.",
      "Release predatory mites (Phytoseiulus persimilis) in enclosed greenhouses.",
      "High-pressure water jet spray to physically dislodge mites and webs."
    ],
    "chemical_treatments": [
      {
        "chemical": "Spiromesifen 22.9% SC (Oberon)",
        "dosage": "1 ml per Liter of water",
        "interval": "Targets eggs and nymphs with long residual protection."
      },
      {
        "chemical": "Abamectin 1.9% EC (Vertimec)",
        "dosage": "0.75 ml per Liter of water",
        "interval": "Translaminar miticide effective against active adult mites."
      }
    ],
    "preventive_measures": [
      "Keep farm boundaries weed-free.",
      "Maintain adequate soil moisture; drought-stressed tomatoes attract heavy mite infestations.",
      "Avoid indiscriminate synthetic pyrethroid sprays."
    ],
    "fertilizer_recommendation": "Excess Nitrogen creates tender high-amino acid leaves that fuel mite population explosions. Reduce Urea, increase Potassium and Silica.",
    "voice_summary": "Spider Mite infestation identified. Leaves show yellow stippling and webbing. Spray Spiromesifen or Abamectin under leaves, and apply Neem oil."
  },
  "Tomato___Target_Spot": {
    "id": "tomato_target_spot",
    "crop": "Tomato",
    "name": "Tomato Target Spot",
    "hindi_name": "टमाटर का टार्गेट स्पॉट रोग",
    "pathogen": "Corynespora cassiicola (Fungus)",
    "category": "Fungal",
    "severity": "Moderate",
    "badge_color": "#d84315",
    "symptoms": "Brown circular lesions with faint concentric rings and light brown centers. Causes defoliation and sunken lesions on fruit.",
    "causes": "Warm temperatures (25-32°C) with persistent moisture and rain.",
    "organic_remedies": [
      "Foliar spray with Copper octanoate (copper soap).",
      "Plant extract of garlic and neem bulb spray (2%).",
      "Bacillus amyloliquefaciens bio-formulation @ 4g/L."
    ],
    "chemical_treatments": [
      {
        "chemical": "Pyraclostrobin 20% WG (Headline)",
        "dosage": "1 gram per Liter of water",
        "interval": "Broad-spectrum strobilurin fungicide."
      },
      {
        "chemical": "Mancozeb 75% WP + Carbendazim 12% (SAAF)",
        "dosage": "2 grams per Liter of water",
        "interval": "Combination contact and systemic protection."
      }
    ],
    "preventive_measures": [
      "Good field sanitation and immediate removal of crop debris.",
      "Staking and trellising plants to keep foliage off damp ground.",
      "Ensure good cross-ventilation in crop rows."
    ],
    "fertilizer_recommendation": "Provide optimal Potassium and Calcium nutrition to strengthen cell wall resistance.",
    "voice_summary": "Tomato Target Spot detected. Apply SAAF or Pyraclostrobin fungicide and stake plants off damp soil."
  },
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
    "id": "tomato_yellow_leaf_curl",
    "crop": "Tomato",
    "name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
    "hindi_name": "टमाटर का पीला पत्ती मरोड़ रोग (लीफ कर्ल वायरस)",
    "pathogen": "Begomovirus (Transmitted by Silverleaf Whitefly, Bemisia tabaci)",
    "category": "Viral (Vector-borne)",
    "severity": "Critical",
    "badge_color": "#c62828",
    "symptoms": "Severe upward leaf curling, cupping, yellowing of leaf margins, thick leathery texture, bushy stunted plant stature, and flower drop with negligible fruit set.",
    "causes": "Infestation by Silverleaf Whitefly (Bemisia tabaci) acting as the insect vector.",
    "organic_remedies": [
      "Install Yellow Sticky Traps @ 20-25 traps per acre to catch whitefly vectors.",
      "Spray 5% NSKE (Neem Seed Kernel Extract) or Neem oil 1500 ppm @ 5ml/L.",
      "Spray Verticillium lecanii (Bio-insecticide) @ 5g/L during evening hours."
    ],
    "chemical_treatments": [
      {
        "chemical": "Diafenthiuron 50% WP (Pegasus)",
        "dosage": "1.25 grams per Liter of water",
        "interval": "Highly effective against adult and nymphal whiteflies."
      },
      {
        "chemical": "Acetamiprid 20% SP (Pride)",
        "dosage": "0.4 grams per Liter of water",
        "interval": "Systemic neonicotinoid targeting sap-sucking vectors."
      }
    ],
    "preventive_measures": [
      "Rouge out and destroy severely virus-infected plants immediately to prevent field spread.",
      "Grow 2-3 border rows of maize or sorghum as physical windbreaks against whiteflies.",
      "Use 40-50 mesh insect-proof nets in nurseries during seedling raising."
    ],
    "fertilizer_recommendation": "Spray foliar micronutrients (Zinc, Boron, Magnesium @ 2g/L) along with 00:52:34 to help mildly affected plants maintain vigor.",
    "voice_summary": "Warning: Tomato Yellow Leaf Curl Virus detected. Transmitted by Whiteflies. Control whiteflies immediately using Diafenthiuron or Acetamiprid."
  },
  "Tomato___Tomato_mosaic_virus": {
    "id": "tomato_mosaic_virus",
    "crop": "Tomato",
    "name": "Tomato Mosaic Virus (ToMV)",
    "hindi_name": "टमाटर का मोजेक वायरस (चितेरी रोग)",
    "pathogen": "Tobamovirus (Mechanically transmitted via tools, hands, seeds)",
    "category": "Viral",
    "severity": "High",
    "badge_color": "#ad1457",
    "symptoms": "Mottled dark green and light yellow patches on leaves, distortion or blistering of leaf blade, 'shoestring' fern-like thinning.",
    "causes": "Highly stable mechanical virus spread by farm workers' hands, pruning shears, stakes, or tobacco residue.",
    "organic_remedies": [
      "Dip hands and pruning tools in 20% skimmed milk solution or 10% TSP.",
      "Foliar spray with raw milk diluted 1:5 acts as an effective virus transmission blocker.",
      "Prompt uprooting and burning of infected plants."
    ],
    "chemical_treatments": [
      {
        "chemical": "Viricide / Bio-immunostimulant (Chitosan oligosaccharide)",
        "dosage": "2 ml per Liter of water",
        "interval": "Sprayed to induce Systemic Acquired Resistance."
      }
    ],
    "preventive_measures": [
      "Workers should wash hands with soap before touching plants.",
      "Heat-treat seeds at 70°C for 2-4 days before sowing.",
      "Never compost virus-infected tomato leaves."
    ],
    "fertilizer_recommendation": "Provide optimal balanced micronutrients (Iron, Zinc). Spray Seaweed Extract @ 2ml/L.",
    "voice_summary": "Tomato Mosaic Virus detected with mottled leaves. Disinfect pruning tools with milk or soap solution, and remove severely infected plants."
  },
  "Tomato___healthy": {
    "id": "tomato_healthy",
    "crop": "Tomato",
    "name": "Healthy Tomato Leaf",
    "hindi_name": "स्वस्थ टमाटर का पौधा (उत्कृष्ट स्वास्थ्य)",
    "pathogen": "None (Plant is Vigorous & Healthy)",
    "category": "Healthy",
    "severity": "Low",
    "badge_color": "#2e7d32",
    "symptoms": "Vibrant green leaves, uniform color, smooth leaf surface, vigorous turgid foliage with zero lesions, mold, or curling.",
    "causes": "Optimal nutrition, clean irrigation, and effective pest management.",
    "organic_remedies": [
      "Continue prophylactic bi-weekly neem oil spray (2ml/L) as a natural shield.",
      "Apply Vermicompost (2 tonnes/acre) or Jeevamrutha soil drench every 15 days."
    ],
    "chemical_treatments": [
      {
        "chemical": "No chemical fungicide or bactericide needed!",
        "dosage": "Maintain regular preventative crop monitoring",
        "interval": "Inspect leaves twice weekly."
      }
    ],
    "preventive_measures": [
      "Maintain consistent drip irrigation to avoid moisture stress.",
      "Keep soil well aerated and weed free.",
      "Monitor with yellow sticky traps for early pest alerts."
    ],
    "fertilizer_recommendation": "Follow stage-wise N:P:K schedule: Vegetative phase: 19:19:19; Flowering phase: 12:61:00 (MAP); Fruit development: 13:00:45 + Calcium Nitrate @ 5g/L.",
    "voice_summary": "Great news! Your tomato plant is in excellent health. Continue current irrigation and maintain regular organic preventative care."
  },
  "Tomato___Bacterial_canker": {
    "id": "tomato_bacterial_canker",
    "crop": "Tomato",
    "name": "Tomato Bacterial Canker",
    "hindi_name": "टमाटर का जीवाणु कैंकर रोग",
    "pathogen": "Clavibacter michiganensis subsp. michiganensis",
    "category": "Bacterial",
    "severity": "High to Severe",
    "badge_color": "#b91c1c",
    "symptoms": "White 'bird's eye' spots with brown raised centers on green fruit; marginal scorching ('firing') of leaflets; one-sided wilting of leaf branches; light brown pith discoloration.",
    "causes": "Seed-borne infection and contaminated pruning shears. Favored by warm temperatures (24-28°C) and splashing rain.",
    "organic_remedies": [
      "Spray Copper Hydroxide 53.8% DF @ 2g/L.",
      "Apply prophylactic Bacillus subtilis foliar spray.",
      "Perform hot water seed treatment at 50°C for 25 minutes before sowing."
    ],
    "chemical_treatments": [
      {
        "chemical": "Copper Oxychloride 50 WP @ 2.5g/L + Streptocycline @ 0.1g/L",
        "dosage": "2.5 g COC + 100 mg Streptocycline per Liter of water",
        "interval": "Apply every 7-10 days upon first warning; avoid spraying in strong sun."
      }
    ],
    "preventive_measures": [
      "Sterilize pruning knives with 10% bleach between individual plants.",
      "Disinfect seedling trays and greenhouse benches.",
      "Never work or prune in wet tomato foliage."
    ],
    "fertilizer_recommendation": "Maintain balanced Potassium nutrition; avoid high ammonium nitrogen which creates soft succulent tissues.",
    "voice_summary": "Tomato Bacterial Canker detected with bird's eye spots and marginal leaf firing. Disinfect tools and spray Copper Oxychloride with Streptocycline."
  },
  "Tomato___Bacterial_wilt": {
    "id": "tomato_bacterial_wilt",
    "crop": "Tomato",
    "name": "Tomato Bacterial Wilt",
    "hindi_name": "टमाटर का जीवाणु म्लानि (बैक्टीरियल विल्ट)",
    "pathogen": "Ralstonia solanacearum",
    "category": "Bacterial",
    "severity": "Severe",
    "badge_color": "#991b1b",
    "symptoms": "Rapid, sudden daytime wilting and collapse of green leaves without initial yellowing; plants may recover at night initially before permanent wilt; vascular ring browning; white bacterial streaming from cut stems immersed in clear water.",
    "causes": "Soil-borne bacterium invading through root wounds, nematodes, or transplant shock in warm, waterlogged soils (>30°C).",
    "organic_remedies": [
      "Soil drenching with Pseudomonas fluorescens @ 10g/L.",
      "Bio-fumigation with mustard cake or neem cake @ 250 kg/acre.",
      "Crop rotation with maize, sorghum, or paddy for 3 years."
    ],
    "chemical_treatments": [
      {
        "chemical": "Streptocycline @ 1.5g in 15L water + Copper Oxychloride @ 35g",
        "dosage": "Drench 100-150 ml around the base of each infected and adjacent plant",
        "interval": "Apply immediately upon wilt symptoms to halt underground spread."
      }
    ],
    "preventive_measures": [
      "Plant on raised beds with proper drainage furrows.",
      "Graft onto resistant rootstocks (e.g., wild tomato rootstocks).",
      "Avoid root injury during manual intercultural weeding."
    ],
    "fertilizer_recommendation": "Incorporate agricultural lime or bleaching powder (10 kg/acre) before planting to raise soil pH and suppress bacterial survival.",
    "voice_summary": "Emergency Alert: Tomato Bacterial Wilt detected with sudden green collapse. Drench soil around plant base with Streptocycline and Copper Oxychloride."
  },
  "Tomato___Anthracnose": {
    "id": "tomato_anthracnose",
    "crop": "Tomato",
    "name": "Tomato Anthracnose (Fruit Rot)",
    "hindi_name": "टमाटर का एन्थ्रेक्नोज (फल सड़न रोग)",
    "pathogen": "Colletotrichum coccodes / C. gloeosporioides (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#c2410c",
    "symptoms": "Small circular, depressed water-soaked circular lesions on ripe and ripening fruits; lesions expand into sunken craters with concentric rings of dark micro-sclerotia; tan foliar flecks.",
    "causes": "Rain splash carrying fungal microsclerotia from soil onto low-hanging fruits; high humidity (>90%) and warm weather (27°C).",
    "organic_remedies": [
      "Foliar spray of 5% Neem Seed Kernel Extract (NSKE).",
      "Spray Trichoderma harzianum @ 5g/L on foliage and developing fruit.",
      "Apply Copper Hydroxide @ 2g/L as preventative."
    ],
    "chemical_treatments": [
      {
        "chemical": "Azoxystrobin 23% SC (Amistar) or Difenoconazole 25% EC (Score)",
        "dosage": "Amistar @ 1 ml/L OR Score @ 0.5 ml/L",
        "interval": "Spray at first fruit set and repeat at 12-day intervals."
      }
    ],
    "preventive_measures": [
      "Mulch under plants with straw or plastic film to eliminate soil splash.",
      "Stake and trellis plants to keep all fruit clusters off the soil.",
      "Harvest ripe fruits promptly; never leave overripe tomatoes in the field."
    ],
    "fertilizer_recommendation": "Foliar spray of Potassium Nitrate (13:0:45) @ 5g/L to strengthen fruit cuticle thickness.",
    "voice_summary": "Tomato Anthracnose fruit rot detected with sunken concentric fruit craters. Mulch beds to stop rain splash and spray Azoxystrobin."
  },
  "Tomato___Fusarium_wilt": {
    "id": "tomato_fusarium_wilt",
    "crop": "Tomato",
    "name": "Tomato Fusarium Wilt",
    "hindi_name": "टमाटर का फ्यूजेरियम उकठा रोग",
    "pathogen": "Fusarium oxysporum f. sp. lycopersici (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#b45309",
    "symptoms": "Unilateral yellowing (one-sided leaf yellowing along a stem); foliage droops and wilts from base upward; internal vascular xylem turns characteristic dark reddish-brown when lower stem is sliced lengthwise.",
    "causes": "Soil-borne fungal chlamydospores persisting in field soil for over a decade; enters through root tips or nematode puncture wounds in warm soils (28°C).",
    "organic_remedies": [
      "Soil application of Trichoderma viride enriched Farmyard Manure (2 kg bioagent per 100 kg compost).",
      "Incorporate neem cake @ 200 kg/acre to suppress soil-borne fungal inoculum."
    ],
    "chemical_treatments": [
      {
        "chemical": "Carbendazim 50% WP (Bavistin) or Thiophanate Methyl 70% WP (Roko)",
        "dosage": "Bavistin @ 2 g/L OR Roko @ 1.5 g/L",
        "interval": "Root zone drenching with 150 ml per plant around drip perimeter."
      }
    ],
    "preventive_measures": [
      "Use Fusarium-resistant tomato hybrid varieties (VF or VFN label).",
      "Maintain soil pH at 6.5-7.0 (apply agricultural lime).",
      "Rotate crops with non-solanaceous crops (cereals, legumes) for 4-5 years."
    ],
    "fertilizer_recommendation": "Use nitrate nitrogen sources (Calcium Nitrate) instead of ammonium fertilizers which acidify rhizosphere and worsen Fusarium.",
    "voice_summary": "Tomato Fusarium Wilt detected with one-sided leaf yellowing and vascular browning. Drench root zone with Carbendazim or Trichoderma."
  },
  "Tomato___Verticillium_wilt": {
    "id": "tomato_verticillium_wilt",
    "crop": "Tomato",
    "name": "Tomato Verticillium Wilt",
    "hindi_name": "टमाटर का वर्टिसिलियम म्लानि रोग",
    "pathogen": "Verticillium dahliae (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#a16207",
    "symptoms": "Distinctive V-shaped yellow chlorotic wedges extending inward from leaf margins on lower leaves; wedge tips turn brown and necrotic; midday foliar wilting; light tan vascular discoloration in lower stem.",
    "causes": "Soil-borne microsclerotia surviving in soil for over 15 years; active in cool to moderate soil temperatures (20-25°C).",
    "organic_remedies": [
      "Soil solarization with clear polyethylene mulch for 6-8 weeks during summer months.",
      "Incorporate bio-agents Trichoderma and Pseudomonas into planting holes."
    ],
    "chemical_treatments": [
      {
        "chemical": "Thiophanate Methyl 70% WP (Roko)",
        "dosage": "1.5 g per Liter of water",
        "interval": "Apply as root drench at first observation of marginal yellow wedges."
      }
    ],
    "preventive_measures": [
      "Plant Verticillium-resistant hybrids (V or VF cultivars).",
      "Avoid planting after potatoes, eggplants, or strawberries.",
      "Maintain balanced soil fertility to sustain crop vitality."
    ],
    "fertilizer_recommendation": "Provide balanced NPK and ensure adequate potash (0:0:50 @ 5g/L) to delay symptom onset.",
    "voice_summary": "Tomato Verticillium Wilt detected with V-shaped yellow marginal leaf wedges. Drench with Thiophanate Methyl and ensure balanced potash."
  },
  "Tomato___Gray_mold": {
    "id": "tomato_gray_mold",
    "crop": "Tomato",
    "name": "Tomato Gray Mold (Botrytis Blight)",
    "hindi_name": "टमाटर का ग्रे मोल्ड (बोट्राइटिस झुलसा)",
    "pathogen": "Botrytis cinerea (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#64748b",
    "symptoms": "Velvety fuzzy grey-brown spore fuzz coating stems, blossoms, and leaves; V-shaped tan foliar blight; pale 'ghost spots' (tiny white rings around dark center) on green fruit; cankers girdling main stems.",
    "causes": "High relative humidity (>85%), cool temperatures (17-23°C), and stagnant air in high-density plantings or polyhouses.",
    "organic_remedies": [
      "Foliar spray with Bacillus subtilis bio-fungicide.",
      "Apply Potassium Bicarbonate @ 3g/L or diluted milk foliar spray.",
      "Prune lower leaves to dramatically increase canopy airflow."
    ],
    "chemical_treatments": [
      {
        "chemical": "Iprodione 50% WP (Rovral) or Pyrimethanil 37.5% SC (Scala)",
        "dosage": "Rovral @ 2 g/L OR Scala @ 1 ml/L",
        "interval": "Thorough canopy spray during cloudy, humid weather spells."
      }
    ],
    "preventive_measures": [
      "Prune lower leaves up to the first fruit cluster to promote air movement.",
      "Avoid overhead sprinkler irrigation; always keep leaves dry at nightfall.",
      "Remove spent flower petals promptly before they stick to fruits."
    ],
    "fertilizer_recommendation": "Avoid excess nitrogen which produces succulent, soft tissues. Apply Calcium Nitrate @ 5g/L to fortify cell walls.",
    "voice_summary": "Tomato Gray Mold Botrytis detected with velvety fuzzy mold on foliage. Prune dense foliage for ventilation and spray Iprodione."
  },
  "Tomato___Blossom_end_rot": {
    "id": "tomato_blossom_end_rot",
    "crop": "Tomato",
    "name": "Tomato Blossom End Rot (Calcium Deficiency)",
    "hindi_name": "टमाटर का ब्लॉसम एंड रॉट (कैल्शियम कमी)",
    "pathogen": "Physiological Disorder (Calcium Ca Deficiency & Water Stress)",
    "category": "Physiological",
    "severity": "Moderate to High",
    "badge_color": "#eab308",
    "symptoms": "Water-soaked spot at the blossom end (distal bottom) of green fruit; lesion expands into a flat, leathery, dark brown or sunken black crater; affected fruit ripens prematurely.",
    "causes": "Inadequate Calcium transport to rapidly expanding distal fruit cells, triggered by fluctuating soil moisture (drought followed by heavy flooding) or excessive ammonium nitrogen.",
    "organic_remedies": [
      "Maintain consistent soil moisture using drip irrigation and organic straw mulch.",
      "Apply pulverized agricultural gypsum or dolomite lime to soil before transplanting."
    ],
    "chemical_treatments": [
      {
        "chemical": "Chelated Calcium (Ca-EDTA 10%) or Calcium Nitrate foliar spray",
        "dosage": "Calcium Nitrate @ 5 g/L + Boron 20% @ 1 g/L",
        "interval": "Direct spray onto flower trusses and expanding young fruits every 7 days."
      }
    ],
    "preventive_measures": [
      "Never allow the root zone to dry out completely between irrigations.",
      "Maintain soil pH at 6.2 - 6.8 for optimal calcium availability.",
      "Mulch plant beds with organic straw or reflective plastic."
    ],
    "fertilizer_recommendation": "Avoid ammonium fertilizers (Ammonium Sulphate) during fruit sizing; supply nitrogen exclusively as Calcium Nitrate.",
    "voice_summary": "Tomato Blossom End Rot detected with black sunken base on fruit. Spray Calcium Nitrate with Boron and maintain steady drip irrigation."
  },
  "Tomato___Tomato_spotted_wilt_virus": {
    "id": "tomato_spotted_wilt_virus",
    "crop": "Tomato",
    "name": "Tomato Spotted Wilt Virus (TSWV)",
    "hindi_name": "टमाटर का चित्तीदार म्लानि विषाणु (स्पॉटेड विल्ट)",
    "pathogen": "Tomato Spotted Wilt Orthotospovirus (TSWV - Transmitted by Thrips)",
    "category": "Viral",
    "severity": "Severe",
    "badge_color": "#7c2d12",
    "symptoms": "Bronzing and purpling of upper leaf surfaces; dark brown concentric necrotic ringspots on foliage; growing tips wilt and die back; mature fruits show yellow chlorotic rings and bumpy deformity.",
    "causes": "Vector transmission by Western Flower Thrips (Frankliniella occidentalis) and onion thrips. Thrips acquire virus in larval stage and spread it throughout adult life.",
    "organic_remedies": [
      "Install blue sticky traps (25 per acre) for thrips monitoring and mass trapping.",
      "Spray Spinosad 45% SC @ 0.3 ml/L (certified organic naturally derived insecticide).",
      "Apply cold-pressed Neem Oil (10,000 ppm) @ 4 ml/L."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fipronil 5% SC or Cyantraniliprole 10.26% OD (Benevia)",
        "dosage": "Fipronil @ 1.5 ml/L OR Benevia @ 1.8 ml/L",
        "interval": "Apply early morning to control thrips vectors before bloom opening."
      }
    ],
    "preventive_measures": [
      "Use reflective silver mulches to disorient and repel thrips vectors.",
      "Rogue out and burn bronzed infected plants immediately upon first sight.",
      "Eradicate broadleaf weeds (pigweed, nightshade) around field borders that harbor thrips."
    ],
    "fertilizer_recommendation": "Foliar spray Zinc Sulphate (1g/L) + Boron (1g/L) + Potassium to support crop vigor.",
    "voice_summary": "Urgent Alert: Tomato Spotted Wilt Virus detected with bronzing and ring spots. Control thrips vectors with blue sticky traps and Spinosad spray."
  },
  "Potato___Early_blight": {
    "id": "potato_early_blight",
    "crop": "Potato",
    "name": "Potato Alternaria (Early Blight)",
    "hindi_name": "आलू का अल्टरनेरिया / अगेती झुलसा (अर्ली ब्लाइट)",
    "pathogen": "Alternaria solani / Alternaria alternata (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#d84315",
    "symptoms": "Dark brown to black circular or angular spots with concentric 'target-board' rings on older leaves. Spots are often vein-delimited with chlorotic yellow halos. As lesions coalesce, foliage blights, curls, and dies. (AHDB Potato Diagnostic Standard).",
    "causes": "Alternating periods of warm, dry weather punctuated by dew, rain, or overhead irrigation. Spores spread by wind drafts. Stressed or senescing plants are particularly vulnerable.",
    "organic_remedies": [
      "Foliar spray with Trichoderma viride @ 5g/L or Bacillus subtilis @ 5ml/L at canopy closure.",
      "Apply 1% Bordeaux mixture or Copper Hydroxide @ 2.5g/L as a preventative organic shield.",
      "Cold-pressed Neem Oil (10,000 ppm) @ 3-5 ml/L prevents spore germination on leaf surface.",
      "Cow urine extract (Gomutra 10% solution) mixed with fermented buttermilk as a foliar bio-spray."
    ],
    "chemical_treatments": [
      {
        "chemical": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
        "dosage": "1 ml per Liter of water",
        "interval": "Apply at initial appearance of target lesions; repeat after 10-12 days."
      },
      {
        "chemical": "Boscalid + Pyraclostrobin (Signum / Bellis)",
        "dosage": "0.5 g per Liter of water",
        "interval": "Premium dual-mode SDHI + Strobilurin for severe Alternaria pressure."
      },
      {
        "chemical": "Mancozeb 75% WP (Indofil M-45) or Chlorothalonil 75% WP",
        "dosage": "2.5 g per Liter of water",
        "interval": "Multi-site broad-spectrum protectant spray every 7-10 days."
      }
    ],
    "preventive_measures": [
      "Maintain balanced crop nutrition; avoid early nitrogen deficiency which accelerates foliar senescence.",
      "Practice 3-4 year crop rotation with non-solanaceous crops (cereals, legumes).",
      "Burn or deeply bury infected crop haulms and volunteer potato plants.",
      "Use certified disease-free seed tubers and minimize plant moisture stress with drip irrigation."
    ],
    "fertilizer_recommendation": "Provide adequate Potassium (Potassium Schoenite 0:0:50 @ 5g/L) and Magnesium Sulfate (10g/L) foliar spray to prevent premature leaf senescence.",
    "voice_summary": "Potato Alternaria Early Blight detected with concentric target rings on leaves. Spray Amistar Top or Mancozeb 75 WP at 2.5 grams per liter, and ensure balanced potash nutrition."
  },
  "Potato___Late_blight": {
    "id": "potato_late_blight",
    "crop": "Potato",
    "name": "Potato Late Blight",
    "hindi_name": "आलू का पछेती झुलसा रोग (अत्यंत विनाशकारी)",
    "pathogen": "Phytophthora infestans (Oomycete)",
    "category": "Oomycete",
    "severity": "Critical",
    "badge_color": "#b71c1c",
    "symptoms": "Rapidly expanding water-soaked dark brown to purplish-black necrotic blotches on leaf tips and margins. Under humid conditions (>90% RH or morning fog), a delicate white fluffy mildew ring appears on the underside of leaves around lesion edges. Stems develop dark greasy girdling lesions. Tubers develop reddish-brown dry granular rot.",
    "causes": "Cool, humid, foggy weather (10-20°C, RH > 90% for 48 consecutive hours - Hutton / Smith Criteria). Airborne sporangia and infected seed tubers.",
    "organic_remedies": [
      "Preventative foliar spray of 1% Bordeaux Mixture before foggy periods begin.",
      "Spray Copper Oxychloride 50% WP @ 3g/L combined with 5% NSKE.",
      "Bio-protectant spray of Pseudomonas fluorescens @ 5g/L as competitive antagonist."
    ],
    "chemical_treatments": [
      {
        "chemical": "Cymoxanil 8% + Mancozeb 64% WP (Curzate M8)",
        "dosage": "2.5 g per Liter of water",
        "interval": "Curative and translaminar; spray immediately upon weather blight alert."
      },
      {
        "chemical": "Dimethomorph 50% WP (Acrobat) + Mancozeb",
        "dosage": "1 g Acrobat + 2 g Mancozeb per Liter",
        "interval": "Antisporulant systemic control during rapid haulm expansion."
      },
      {
        "chemical": "Mandipropamid 23.4% SC (Revus) or Fluopicolide + Propamocarb (Infinito)",
        "dosage": "Revus @ 0.8 ml/L OR Infinito @ 1.5 ml/L",
        "interval": "Rainfast translaminar protection with strong anti-sporulant action."
      }
    ],
    "preventive_measures": [
      "Use certified blight-free seed tubers; inspect seed lots thoroughly.",
      "Hill up / earthing up soil adequately (at least 15 cm ridge depth) to prevent zoospores washing down to tubers.",
      "Destroy all potato dump piles (cull piles) before planting; never leave volunteer potatoes.",
      "Desiccate/burn haulms 10-14 days before harvest to prevent tuber contamination during lifting."
    ],
    "fertilizer_recommendation": "Avoid excessive nitrogen which produces dense, slow-drying foliage. Foliar spray Potassium Schoenite (0:0:50) @ 5g/L and soluble Silica to harden the leaf cuticle.",
    "voice_summary": "Urgent Alert: Potato Late Blight detected with water-soaked dark lesions. Spray Curzate or Dimethomorph immediately to stop fungal spore expansion."
  },
  "Potato___healthy": {
    "id": "potato_healthy",
    "crop": "Potato",
    "name": "Healthy Potato Crop",
    "hindi_name": "स्वस्थ आलू की फसल (उत्कृष्ट स्वास्थ्य)",
    "pathogen": "None (Vigorous & Clean Canopy)",
    "category": "Healthy",
    "severity": "Low",
    "badge_color": "#2e7d32",
    "symptoms": "Lush emerald-green compound foliage with uniform leaf expansion, strong turgid haulms, and zero necrotic spots, target rings, or curling.",
    "causes": "Quality certified seed tubers, well-drained sandy loam soil, and balanced crop husbandry.",
    "organic_remedies": [
      "Apply prophylactic bi-weekly neem oil (2 ml/L) spray as a natural repellent against aphids and pests.",
      "Apply soil drenching with Jeevamrutha or vermiwash every 15 days to enhance rhizosphere biodiversity."
    ],
    "chemical_treatments": [
      {
        "chemical": "No chemical fungicides or bactericides required!",
        "dosage": "Maintain weekly field scouting (check lower leaves and stems)",
        "interval": "Inspect twice weekly during overcast or humid weather."
      }
    ],
    "preventive_measures": [
      "Maintain timely earthing-up (at 30-35 days) to protect developing tubers from sunscald and blight zoospores.",
      "Avoid overhead sprinkler irrigation late in the evening to prevent prolonged leaf wetness.",
      "Install yellow sticky traps (15-20 per acre) to monitor aphid vector populations."
    ],
    "fertilizer_recommendation": "Maintain split fertilizer application: Base dose: NPK 12:32:16 + Zinc; Top dressing at earthing up: 50% Urea + MOP (Muriate of Potash) @ 50 kg/acre.",
    "voice_summary": "Congratulations! Your potato crop is healthy and vigorous with zero disease symptoms. Maintain regular scouting and earthing up."
  },
  "Potato___Black_dot": {
    "id": "potato_black_dot",
    "crop": "Potato",
    "name": "Potato Black Dot",
    "hindi_name": "आलू का ब्लैक डॉट रोग",
    "pathogen": "Colletotrichum coccodes (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#475569",
    "symptoms": "Yellowing and premature wilting of foliage, often confused with Verticillium wilt or natural senescence. Characteristic tiny black dots (micro-sclerotia, like ground pepper) develop on senescing stem bases, stolons, and inside stem hollows. Tubers show silvery-grey skin patches speckled with black microsclerotia.",
    "causes": "Soil-borne and seed-borne fungus. Exacerbated by sandy soils, warm soil temperatures (>20°C), poor drainage, drought stress, and compaction.",
    "organic_remedies": [
      "Incorporate bio-control Trichoderma harzianum @ 2.5 kg/acre into compost before planting.",
      "Grow brassica bio-fumigant cover crops (mustard/oilseed radish) and plow under before potato planting."
    ],
    "chemical_treatments": [
      {
        "chemical": "Azoxystrobin 23% SC (Amistar)",
        "dosage": "3 Liter per hectare applied in-furrow at planting",
        "interval": "In-furrow application coats daughter tubers and suppresses fungal colonisation."
      },
      {
        "chemical": "Fludioxonil + Sedaxane (Vibrance SB)",
        "dosage": "Seed tuber dressing before planting",
        "interval": "Protects emergence stolons from soil-borne microsclerotia."
      }
    ],
    "preventive_measures": [
      "Enforce 5-7 year crop rotation without solanaceous crops or tomatoes.",
      "Alleviate soil compaction and maintain uniform irrigation to prevent drought stress.",
      "Harvest promptly once skin set is achieved; delayed harvest increases tuber blemish."
    ],
    "fertilizer_recommendation": "Provide balanced Potash and avoid water stress during tuber bulking to maintain plant vigor.",
    "voice_summary": "Potato Black Dot detected with pepper-like microsclerotia on stems. Apply in-furrow Azoxystrobin, avoid drought stress, and harvest promptly."
  },
  "Potato___Blackleg": {
    "id": "potato_blackleg",
    "crop": "Potato",
    "name": "Blackleg & Bacterial Soft Rot",
    "hindi_name": "आलू का ब्लैकलेग एवं जीवाणु मृदु सड़न रोग",
    "pathogen": "Pectobacterium atrosepticum / Dickeya solani (Bacteria)",
    "category": "Bacterial",
    "severity": "Critical",
    "badge_color": "#1e293b",
    "symptoms": "Inky-black, slimy, soft decay at the stem base starting from the mother tuber and traveling up the stem. Leaves turn pale green or yellow, roll upward, become stiff and brittle, followed by rapid plant wilting and collapse. Tubers suffer wet, foul-smelling, creamy soft rot.",
    "causes": "Bacterial infection carried on seed tubers; favored by wet, waterlogged soils, high temperatures (>20°C for Dickeya, cooler for Pectobacterium), and tuber skinning during harvest.",
    "organic_remedies": [
      "Treat seed tubers with Streptomyces griseoviridis bio-inoculant.",
      "Dip whole seed tubers in 1% bleaching powder solution or sodium hypochlorite (100 ppm chlorine) before planting.",
      "Immediately rogue out and destroy blackleg-infected plants and mother tubers."
    ],
    "chemical_treatments": [
      {
        "chemical": "Copper Hydroxide 53.8% DF + Streptocycline",
        "dosage": "Copper @ 2g/L + Streptocycline @ 0.1g/L",
        "interval": "Foliar spray to prevent secondary aerosol spread across field."
      },
      {
        "chemical": "Bronopol (2-bromo-2-nitropropane-1,3-diol)",
        "dosage": "0.5 g per Liter of water",
        "interval": "Specialized bactericide for tuber and stem sanitation."
      }
    ],
    "preventive_measures": [
      "Use certified pathogen-free high-grade seed tubers; avoid cutting seed tubers (plant whole seed).",
      "Plant into warm (>10°C), well-drained soils; avoid planting in saturated or compacted ground.",
      "Ensure positive ventilation in potato stores; dry tubers within 24 hours of harvest.",
      "Thoroughly clean and sanitize grading lines, harvester belts, and storage boxes with quaternary ammonium disinfectants."
    ],
    "fertilizer_recommendation": "Apply Calcium Nitrate (5 kg/acre) during tuber bulking. Adequate calcium in tuber cell walls dramatically enhances resistance to Pectobacterium maceration.",
    "voice_summary": "Critical Warning: Blackleg bacterial decay detected with inky-black stem rot. Rogue out infected plants, improve soil drainage, and apply bactericide."
  },
  "Potato___Black_scurf": {
    "id": "potato_black_scurf",
    "crop": "Potato",
    "name": "Black Scurf & Stem Canker",
    "hindi_name": "आलू का ब्लैक स्कर्फ एवं तना कैंकर रोग",
    "pathogen": "Rhizoctonia solani (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#334155",
    "symptoms": "Tubers develop hard, black, irregular crusts or resting bodies ('dirt that won't wash off' - sclerotia). Emerging sprouts develop sunken brown necrotic cankers that girdle shoots, causing delayed emergence, aerial tubers in leaf axils, and purpling or upward rolling of top foliage.",
    "causes": "Soil-borne and seed-borne fungus favored by cold, damp soils at planting that delay sprout emergence. Rhizoctonia attacks young tender sprouts before they reach the surface.",
    "organic_remedies": [
      "Incorporate Trichoderma harzianum or Trichoderma viride @ 5g/kg seed tuber treatment.",
      "Green sprouting (chitting) of seed tubers before planting so sprouts emerge rapidly through cold soil."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fludioxonil 10% + Pencycuron 25% (Monceren / Maxim)",
        "dosage": "1.5 ml per kg seed tuber dressing",
        "interval": "Apply directly on seed tubers before planting."
      },
      {
        "chemical": "Azoxystrobin 23% SC (Amistar)",
        "dosage": "3 Liter per hectare in-furrow band spray at planting",
        "interval": "Creates a protective chemical envelope around emerging stolons."
      }
    ],
    "preventive_measures": [
      "Plant into warm, well-aerated seedbeds (>8°C) at shallow to moderate depth for swift emergence.",
      "Avoid planting heavily sclerotia-encrusted seed tubers.",
      "Practice 3-5 year crop rotation with non-host cereals or corn.",
      "Harvest tubers as soon as skin-set is achieved; leaving tubers in dry soil triggers sclerotia formation."
    ],
    "fertilizer_recommendation": "Avoid high undecomposed organic manure immediately prior to planting. Apply balanced phosphate to accelerate root and sprout development.",
    "voice_summary": "Potato Black Scurf and Stem Canker detected. Treat seed tubers with Pencycuron or Fludioxonil, plant in warm soil, and harvest promptly after skin set."
  },
  "Potato___Dry_rot": {
    "id": "potato_dry_rot",
    "crop": "Potato",
    "name": "Potato Dry Rot",
    "hindi_name": "आलू का सूखा सड़न रोग (ड्राई रॉट)",
    "pathogen": "Fusarium sambucinum / Fusarium solani (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#78350f",
    "symptoms": "On tubers: dark, sunken, wrinkled surface patches forming concentric wrinkled rings. Internal flesh turns brown, dry, and crumbly with hollow cavities lined with white, pink, or light blue fungal mycelium. Tuber eventually mummifies into a hard, shriveled mass.",
    "causes": "Wounding, bruising, and skinning during harvest and grading allow the wound-parasite Fusarium to enter. Favored by warm storage temperatures (>15°C) and poor curing.",
    "organic_remedies": [
      "Apply post-harvest tuber drench with bio-fungicide Bacillus subtilis or Trichoderma viride.",
      "Disinfect storage boxes and walls with 2% copper sulfate or 10% sodium hypochlorite."
    ],
    "chemical_treatments": [
      {
        "chemical": "Thiabendazole 45% SC or Fludioxonil (Scholar / Tecto)",
        "dosage": "30 ml per tonne of tubers as ultra-low-volume spray at store entry",
        "interval": "Post-harvest application within 2 weeks of lifting."
      },
      {
        "chemical": "Carbendazim 50% WP or Mancozeb 75% WP",
        "dosage": "2 g per kg seed tuber treatment",
        "interval": "Seed treatment prior to pre-sprouting or planting."
      }
    ],
    "preventive_measures": [
      "Ensure full skin-set before lifting by desiccating haulms 2-3 weeks prior to harvest.",
      "Minimize mechanical damage: cushion grader drops, keep drops under 20 cm, warm tubers to >10°C before grading.",
      "Cure tubers immediately after harvest at 12-15°C with 95% RH and positive ventilation for 10-14 days to promote suberin wound-healing."
    ],
    "fertilizer_recommendation": "Avoid excess nitrogen late in season which delays skin maturation and increases bruising susceptibility.",
    "voice_summary": "Potato Dry Rot detected with sunken wrinkled tuber rot. Cure tubers at 15 degrees Celsius with good ventilation, treat with Thiabendazole, and avoid harvest bruising."
  },
  "Potato___Brown_rot": {
    "id": "potato_brown_rot",
    "crop": "Potato",
    "name": "Potato Brown Rot / Bacterial Wilt",
    "hindi_name": "आलू का भूरा सड़न रोग / जीवाणु म्लानि (बैक्टीरियल विल्ट)",
    "pathogen": "Ralstonia solanacearum (Bacteria - Quarantine Pathogen)",
    "category": "Bacterial",
    "severity": "Critical",
    "badge_color": "#991b1b",
    "symptoms": "Rapid foliar wilting, often starting on one side of a stem during hot afternoons, recovering overnight before becoming irreversible. Stems show brown vascular discoloration. Tubers show distinct brown discoloration of the vascular ring; squeezing the cut tuber forces out droplets of white bacterial slime. Eyes develop sticky exudate with soil clinging to them.",
    "causes": "High-risk quarantine bacterial pathogen spread via contaminated seed tubers, surface irrigation water, soil, and root-knot nematodes. Thrives in warm soils (>25°C).",
    "organic_remedies": [
      "Strict biological containment: immediately destroy infected plants and surrounding 10m buffer zone.",
      "Apply bio-fumigation with Brassica juncea (Indian mustard) green manure to suppress soil bacteria."
    ],
    "chemical_treatments": [
      {
        "chemical": "Statutory Quarantine Control (No chemical cure exists for infected plants)",
        "dosage": "Mandatory reporting to agricultural authorities and quarantine destruction",
        "interval": "Soil quarantine for at least 5 years without solanaceous crops."
      },
      {
        "chemical": "Disinfectant (Bleaching powder / Peracetic acid for machinery sanitation)",
        "dosage": "15 kg bleaching powder per acre applied in soil before planting",
        "interval": "Suppresses bacterial population in endemic hot zones."
      }
    ],
    "preventive_measures": [
      "Plant strictly certified, testing-verified Ralstonia-free seed tubers.",
      "Never use surface drainage water or canal water from areas with suspected brown rot.",
      "Disinfect all farm machinery, tractors, and sorting tables with sanitizing wash.",
      "Control root-knot nematodes which create entry wounds for Ralstonia bacteria."
    ],
    "fertilizer_recommendation": "Apply agricultural lime in acidic soils to raise pH above 6.5, which helps reduce disease severity.",
    "voice_summary": "Severe Quarantine Alert: Potato Brown Rot Bacterial Wilt detected with vascular ooze. Notify authorities immediately, destroy infected plants, and avoid contaminated irrigation."
  },
  "Potato___Common_scab": {
    "id": "potato_common_scab",
    "crop": "Potato",
    "name": "Potato Common Scab",
    "hindi_name": "आलू का सामान्य खुरंड रोग (कॉमन स्कैब)",
    "pathogen": "Streptomyces scabies / Streptomyces turgidiscabies (Actinomycete)",
    "category": "Bacterial",
    "severity": "Moderate",
    "badge_color": "#a16207",
    "symptoms": "Tubers develop corky, rough, dark brown lesions on the skin, ranging from superficial scabs to raised corky outgrowths and deep pitted craters (up to 5mm deep). Foliage remains completely healthy and asymptomatic.",
    "causes": "Soil-borne filamentous bacterium favored by dry, warm soils during the critical 4-6 week window after tuber initiation. Thrives in alkaline soils (pH > 5.5).",
    "organic_remedies": [
      "Incorporate elemental sulfur (100-200 kg/acre) into soil prior to planting to lower soil pH to 5.0-5.2.",
      "Apply green manures and compost rich in antagonistic Streptomyces and Bacillus antagonists."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fluazinam (Shirlan) or Flusulfamide",
        "dosage": "Soil treatment or seed tuber spray @ 2 ml/L",
        "interval": "Reduces skin infection in high-risk scab soils."
      },
      {
        "chemical": "Mancozeb 75% WP seed tuber dusting",
        "dosage": "2 g per kg seed tuber",
        "interval": "Prevents seed-borne transmission to daughter tubers."
      }
    ],
    "preventive_measures": [
      "CRITICAL: Maintain soil moisture at 80-85% field capacity for 4 to 6 weeks starting at tuber initiation (golf-ball size). Moisture prevents bacterial lenticel penetration.",
      "Avoid liming immediately before potato crops; keep soil pH around 5.0 to 5.2.",
      "Plant scab-resistant cultivars (e.g., Maris Peer, King Edward, Kufri Jyoti).",
      "Avoid using untreated cattle manure immediately before planting as it can carry Streptomyces."
    ],
    "fertilizer_recommendation": "Use acidifying fertilizers such as Ammonium Sulfate instead of Calcium Ammonium Nitrate (CAN) to maintain an acidic micro-environment around tubers.",
    "voice_summary": "Potato Common Scab detected with corky tuber skin craters. Maintain soil moisture at field capacity for 4 weeks after tuber initiation and lower soil pH below 5.2."
  },
  "Potato___Gangrene": {
    "id": "potato_gangrene",
    "crop": "Potato",
    "name": "Potato Gangrene",
    "hindi_name": "आलू का गैंग्रीन रोग (गड्ढेदार सड़न)",
    "pathogen": "Boeremia foveata / Phoma exigua (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#57534e",
    "symptoms": "On tubers: distinct, circular or irregular dark, sunken 'thumb-mark' depressions or pocket-like cavities. Surface skin remains stretched over the cavity. Tuber flesh inside turns purplish-brown to black, granular, and rots.",
    "causes": "Fungus enters through wounds, cuts, and bruises caused during harvesting, grading, or handling. Heavily favored by cold, wet harvesting conditions (<10°C) followed by cold storage (<4°C) without prior curing.",
    "organic_remedies": [
      "Cure tubers thoroughly with warm air drying (12-15°C) to suberize all skin cracks.",
      "Store hygiene: wash down empty stores with peracetic acid."
    ],
    "chemical_treatments": [
      {
        "chemical": "Thiabendazole 45% SC (Storite / Tecto)",
        "dosage": "30-40 ml per tonne of tubers as mist spray on intake conveyor",
        "interval": "Apply within 14 days of lifting."
      },
      {
        "chemical": "Imazalil (Fungazil 100 SL)",
        "dosage": "15 ml per tonne of seed tubers",
        "interval": "Tuber mist application to control Gangrene and Silver Scurf."
      }
    ],
    "preventive_measures": [
      "Harvest only when soil and tuber temperatures are above 10°C; avoid lifting in cold weather.",
      "Maintain harvester cushion rubber and minimize tuber drop heights.",
      "Cure harvested potatoes for 10-14 days at 12-15°C with high humidity before cooling down to storage temperature."
    ],
    "fertilizer_recommendation": "Ensure adequate Potassium nutrition to reduce tuber bruising susceptibility during lifting.",
    "voice_summary": "Potato Gangrene detected with sunken thumb-mark tuber cavities. Harvest only above 10 degrees Celsius, cure tubers for 14 days, and treat with Thiabendazole."
  },
  "Potato___Mosaic_virus": {
    "id": "potato_mosaic_virus",
    "crop": "Potato",
    "name": "Latent & Mild Mosaic Viruses (PVX / PVA)",
    "hindi_name": "आलू का माइल्ड मोजेक वायरस (पीवीएक्स/पीवीए)",
    "pathogen": "Potato Virus X (Potexvirus) / Potato Virus A (Potyvirus)",
    "category": "Viral",
    "severity": "Moderate",
    "badge_color": "#c026d3",
    "symptoms": "Foliage exhibits mild light green to yellowish interveinal mosaic mottling, slight leaf blade rugosity, and faint wave-like leaflet margins. Often symptomless (latent) in cool weather, but causes significant yield drag (10-30%) when combined with PVY.",
    "causes": "PVX is transmitted mechanically via machinery, tractor wheels, foliage contact, cutting knives, and farm workers. PVA is transmitted by aphids (*Myzus persicae*).",
    "organic_remedies": [
      "Spray raw skimmed milk (10% solution) to inactivate mechanically transmitted virus particles during field operations.",
      "Rogue out and destroy symptomatic mottled plants early in the season."
    ],
    "chemical_treatments": [
      {
        "chemical": "Systemic Aphicide for vector control (Flonicamid 50% WG or Thiamethoxam 25% WG)",
        "dosage": "Flonicamid @ 0.3 g/L OR Thiamethoxam @ 0.2 g/L",
        "interval": "Apply at threshold aphid flight to stop PVA transmission."
      }
    ],
    "preventive_measures": [
      "Use certified virus-free seed tubers with certified ELISA or PCR health certificates.",
      "Disinfect tractor wheels and field sprayers between seed potato fields.",
      "Plant resistant potato varieties."
    ],
    "fertilizer_recommendation": "Avoid high nitrogen which stimulates soft succulent foliage preferred by aphid vectors. Spray micronutrient Zinc and Boron to support plant vigor.",
    "voice_summary": "Potato Mosaic Virus detected with light green mottling on leaves. Control aphid vectors with Flonicamid, disinfect machinery, and rogue out infected plants."
  },
  "Potato___Pink_rot": {
    "id": "potato_pink_rot",
    "crop": "Potato",
    "name": "Potato Pink Rot",
    "hindi_name": "आलू का गुलाबी सड़न रोग (पिंक रॉट)",
    "pathogen": "Phytophthora erythroseptica (Oomycete)",
    "category": "Oomycete",
    "severity": "High",
    "badge_color": "#ec4899",
    "symptoms": "Tubers suffer rubbery, water-soaked rot starting at the stem end. Tuber skin turns dark brown, lenticels turn black. DEFINITIVE DIAGNOSTIC SIGN: When cut and exposed to air, the infected white tuber flesh **turns salmon pink within 15-20 minutes**, then turns dark brown to black. Rotten tubers give off a faint vinegar or alcohol odor.",
    "causes": "Soil-borne oomycete favored by saturated, waterlogged, poorly drained soils and warm temperatures (20-25°C). Pathogen infects through stolons or lenticels.",
    "organic_remedies": [
      "Improve field drainage and install deep furrows to eliminate water ponding.",
      "Incorporate bio-fungicide Trichoderma harzianum into soil before planting."
    ],
    "chemical_treatments": [
      {
        "chemical": "Mefenoxam / Metalaxyl-M (Ridomil Gold SL)",
        "dosage": "1.2 Liter per hectare applied in-furrow at planting OR foliar at tuber initiation",
        "interval": "In-furrow application prevents stolon infection."
      },
      {
        "chemical": "Oxathiapiprolin (Zorvec Enicade) or Cyazofamid (Ranman)",
        "dosage": "Zorvec @ 0.5 ml/L OR Ranman @ 0.5 ml/L",
        "interval": "Foliar spray during tuber bulking translocates to daughter tubers."
      }
    ],
    "preventive_measures": [
      "Avoid planting in low-lying, poorly drained sections of the field.",
      "Avoid over-irrigation, especially during late tuber bulking.",
      "Do not harvest when soil is saturated; discard infected pink rot tubers before loading store to avoid storage breakdown."
    ],
    "fertilizer_recommendation": "Ensure optimal soil aeration and apply Calcium to enhance tuber skin and lenticel resistance.",
    "voice_summary": "Potato Pink Rot detected with flesh turning salmon-pink upon air exposure. Improve field drainage, apply Mefenoxam in-furrow, and avoid late over-irrigation."
  },
  "Potato___PLRV": {
    "id": "potato_plrv",
    "crop": "Potato",
    "name": "Potato Leafroll Virus (PLRV)",
    "hindi_name": "आलू का पत्ती मरोड़ रोग (लीफरोल वायरस)",
    "pathogen": "Potato Leafroll Virus (Polerovirus)",
    "category": "Viral",
    "severity": "Critical",
    "badge_color": "#7c3aed",
    "symptoms": "Upward rolling of leaflet margins along their length, starting at the lower leaves (primary infection) or upper leaves (secondary infection). Affected leaves become thick, leathery, and brittle, making a dry crackling rustle when touched. Severely infected plants are stunted with upright pale foliage. Tubers may develop net necrosis (internal brown network of strands).",
    "causes": "Transmitted persistently and circulative by aphids (primarily the Green Peach Aphid *Myzus persicae*). Infected seed tubers are the primary source of early outbreaks.",
    "organic_remedies": [
      "Install yellow sticky traps (25 traps per acre) across the field to monitor and mass-trap winged aphid vectors.",
      "Apply foliar sprays of cold-pressed Neem Oil (10,000 ppm) @ 5 ml/L or Pongamia pinnata oil @ 4 ml/L.",
      "Spray Beauveria bassiana or Verticillium lecanii bio-insecticide @ 5g/L."
    ],
    "chemical_treatments": [
      {
        "chemical": "Flonicamid 50% WG (Ulala / Teppeki)",
        "dosage": "0.3 g per Liter of water (60g/acre)",
        "interval": "Targeted aphicide that stops aphid feeding within 30 minutes, preventing PLRV transmission."
      },
      {
        "chemical": "Thiamethoxam 25% WG (Actara) or Acetamiprid 20% SP",
        "dosage": "Thiamethoxam @ 0.25 g/L OR Acetamiprid @ 0.3 g/L",
        "interval": "Systemic neonicotinoid providing 14-day persistent protection against aphid colonies."
      }
    ],
    "preventive_measures": [
      "Plant exclusively certified PLRV-free seed tubers.",
      "Rogue out and destroy infected rolled plants along with their tubers before aphid populations build up.",
      "Desiccate haulms early in seed potato production before the peak flight of winged aphids."
    ],
    "fertilizer_recommendation": "Maintain balanced fertility; avoid high nitrogen which increases foliar succulence and attracts dense aphid colonies.",
    "voice_summary": "Alert: Potato Leafroll Virus detected with upward rolling, leathery leaves. Control aphid vectors immediately with Flonicamid or Acetamiprid, and rogue out infected plants."
  },
  "Potato___PVY": {
    "id": "potato_pvy",
    "crop": "Potato",
    "name": "Potato Virus Y (PVY)",
    "hindi_name": "आलू का वाई वायरस रोग (पीवीवाई - अत्यंत गंभीर)",
    "pathogen": "Potato Virus Y (Potyvirus - Strains PVY-O, PVY-N, PVY-NTN)",
    "category": "Viral",
    "severity": "Critical",
    "badge_color": "#9333ea",
    "symptoms": "Severe foliar symptoms including dark green mosaic mottling, leaf crinkling, rugosity, and necrotic leaf drop ('leaf drop streak' where leaves dry and hang by a thread from the stem). Stunted plants. Recombinant strains (PVY-NTN) cause Potato Tuber Necrotic Ringspot Disease (PTNRD) - raised, sunken, brown necrotic rings on tuber skin.",
    "causes": "Transmitted non-persistently within seconds by over 50 species of aphids (including cereal and weed aphids probing foliage). Infected seed tubers.",
    "organic_remedies": [
      "Foliar spray with mineral crop oil (JMS Stylet-Oil) @ 7-10 L/ha weekly. The oil layer blocks virus retention on aphid mouthparts (stylets).",
      "Grow 2-3 border rows of sorghum, corn, or wheat around seed potato plots to act as aphid cleansing buffers."
    ],
    "chemical_treatments": [
      {
        "chemical": "Mineral Horticultural Oil (JMS Stylet Oil) + Systemic Aphicide",
        "dosage": "Mineral oil @ 10 ml/L + Flonicamid @ 0.3 g/L",
        "interval": "Apply every 7 days during aphid migration flights."
      },
      {
        "chemical": "Cyantraniliprole 10% OD (Benevia) or Spirotetramat",
        "dosage": "Benevia @ 1.8 ml per Liter of water",
        "interval": "Provides rapid feeding cessation against piercing-sucking vectors."
      }
    ],
    "preventive_measures": [
      "Use strictly certified elite seed tubers tested by ELISA/PCR for PVY.",
      "Rogue out and burn infected plants early in the season.",
      "Burn down or desiccate haulms 14 days before harvest to stop virus translocation into seed tubers."
    ],
    "fertilizer_recommendation": "Provide optimal Potassium and Micronutrients (Zinc, Boron) to support plant defense.",
    "voice_summary": "Critical Warning: Potato Virus Y detected with severe mosaic and necrotic leaf drop. Spray mineral oil with Flonicamid, destroy infected plants, and protect seed tubers."
  },
  "Potato___Powdery_scab": {
    "id": "potato_powdery_scab",
    "crop": "Potato",
    "name": "Potato Powdery Scab",
    "hindi_name": "आलू का पाउडरी स्कैब रोग",
    "pathogen": "Spongospora subterranea (Protozoan / Cercozoa)",
    "category": "Protozoan",
    "severity": "High",
    "badge_color": "#ca8a04",
    "symptoms": "On tubers: begins as small purplish or white pimples that rupture into circular, discrete open pustules filled with dark brown powdery spore balls (cystosori), surrounded by ragged, raised skin margins. Distinct from Common Scab by its powdery texture and circular discrete crater shape. On roots: causes small white to brown galls. VECTOR FOR PMTV (Mop Top Virus).",
    "causes": "Soil-borne zoosporic protozoan. Thrives in cool, wet, poorly drained soils (12-15°C) and soils with high organic matter. Resting spore balls survive over 10 years in soil.",
    "organic_remedies": [
      "Improve field tile drainage and subsoil to eliminate wet spots.",
      "Incorporate high-glucosinolate mustard cover crops as bio-fumigant."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fluazinam (Shirlan / Nando)",
        "dosage": "3 Liter per hectare incorporated into soil pre-planting OR in-furrow band",
        "interval": "Reduces zoospore motility and suppresses root galling."
      },
      {
        "chemical": "Mancozeb 75% WP seed tuber treatment",
        "dosage": "2 g per kg seed tuber",
        "interval": "Suppresses seed-borne spore transmission."
      }
    ],
    "preventive_measures": [
      "Avoid planting in wet, poorly drained fields; improve ditch drainage.",
      "Enforce long rotations (6-8 years without potatoes).",
      "Plant resistant varieties (e.g., King Edward, Cara).",
      "Never use seed tubers showing powdery scab pustules."
    ],
    "fertilizer_recommendation": "Avoid applying raw manures that increase soil water retention. Ensure adequate Zinc foliar spray.",
    "voice_summary": "Potato Powdery Scab detected with round open pustules and brown spore powder. Improve soil drainage, use certified clean seed, and apply Fluazinam in-furrow."
  },
  "Potato___Ring_rot": {
    "id": "potato_ring_rot",
    "crop": "Potato",
    "name": "Potato Ring Rot",
    "hindi_name": "आलू का रिंग रॉट रोग (वलय सड़न - संगरोध रोग)",
    "pathogen": "Clavibacter sepedonicus (Bacteria - Quarantine Pathogen)",
    "category": "Bacterial",
    "severity": "Critical",
    "badge_color": "#b91c1c",
    "symptoms": "Foliage shows yellowing between leaf veins, marginal wilting, upward rolling, and necrosis. On cut tubers: the vascular ring develops a distinct yellowish to creamy, cheesy breakdown that easily separates when squeezed, oozing bacterial slime. Severe infection leads to hollow vascular rings and secondary soft rot.",
    "causes": "Strict quarantine bacterial pathogen. Highly contagious; spreads primarily on seed cutters, machinery, sorting equipment, and storage containers where dried bacterial slime survives for years.",
    "organic_remedies": [
      "Zero tolerance quarantine disease: immediately notify quarantine authorities and incinerate infected crop.",
      "Sanitize all farm equipment, storage walls, and boxes with certified quaternary ammonium or peracetic acid disinfectants."
    ],
    "chemical_treatments": [
      {
        "chemical": "Statutory Quarantine Destruction (No chemical cure permitted)",
        "dosage": "Mandatory incineration or deep burial under agricultural inspection",
        "interval": "Total decontamination of farm premises."
      },
      {
        "chemical": "Equipment Disinfectant (Sodium hypochlorite 10% / Peracetic acid 2%)",
        "dosage": "Used for pressure-washing machinery, grader belts, and storage crates",
        "interval": "Soak contact surfaces for minimum 20 minutes."
      }
    ],
    "preventive_measures": [
      "Use only official certified seed with laboratory test certificates confirming freedom from Clavibacter.",
      "Never use recycled seed bags or second-hand wooden potato boxes without thorough disinfection.",
      "Plant whole seed tubers to eliminate transmission via seed cutting knives."
    ],
    "fertilizer_recommendation": "Follow statutory phytosanitary instructions.",
    "voice_summary": "Critical Quarantine Alert: Potato Ring Rot detected with cheesy breakdown of the vascular ring. Notify agricultural authorities immediately and disinfect all machinery."
  },
  "Potato___Silver_scurf": {
    "id": "potato_silver_scurf",
    "crop": "Potato",
    "name": "Potato Silver Scurf",
    "hindi_name": "आलू का सिल्वर स्कर्फ रोग (चमकीला छिलका रोग)",
    "pathogen": "Helminthosporium solani (Fungus)",
    "category": "Fungal",
    "severity": "Moderate",
    "badge_color": "#94a3b8",
    "symptoms": "Tubers develop silvery, glistening or metallic sheen patches with distinct outlines on the skin, most visible when tuber is damp. In red-skinned varieties, infected patches turn pale brown. In storage, infected skin loses moisture rapidly, leading to wrinkled, shriveled, dehydrated tubers with reduced weight.",
    "causes": "Seed-borne and storage fungus. Spores produced in storage are spread by ventilation fans, infecting neighboring tubers under warm, humid conditions (>90% RH, >5°C).",
    "organic_remedies": [
      "Wash and thoroughly sanitize empty storage facilities with peracetic acid or ozone.",
      "Apply bio-fungicide Bacillus subtilis tuber spray prior to loading into storage."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fludioxonil + Azoxystrobin (Cruiser Maxx / Maxim)",
        "dosage": "Seed tuber dressing @ 1.5 ml/kg seed",
        "interval": "Protects daughter tubers from seed-borne inoculum."
      },
      {
        "chemical": "Imazalil (Fungazil 100 SL) or Difenoconazole",
        "dosage": "15 ml per tonne of tubers as ultra-low-volume mist on store intake",
        "interval": "Post-harvest application within 2 weeks of lifting."
      }
    ],
    "preventive_measures": [
      "Harvest promptly once skin-set is complete; delaying harvest dramatically increases silver scurf severity.",
      "Dry tubers rapidly after harvest with positive ventilation.",
      "Lower storage temperature below 4°C as quickly as curing allows to suppress fungal sporulation."
    ],
    "fertilizer_recommendation": "Avoid high late-season nitrogen which delays haulm maturation and tuber skin-set.",
    "voice_summary": "Potato Silver Scurf detected with silvery metallic sheen on tuber skin. Harvest promptly after skin-set, apply Fludioxonil tuber treatment, and dry tubers rapidly."
  },
  "Potato___Skin_spot": {
    "id": "potato_skin_spot",
    "crop": "Potato",
    "name": "Potato Skin Spot",
    "hindi_name": "आलू का स्किन स्पॉट रोग (कील/फुंसी रोग)",
    "pathogen": "Polyscytalum pustulans (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#6b7280",
    "symptoms": "Tubers develop small (1-3 mm), dark purplish-brown, raised pimples or pustules scattered over the surface. Most damaging when pustules cluster around tuber eyes: the fungus penetrates and **kills the sprout buds (eyes)**, leading to 'blind tubers', gappy emergence, and missing plants in the field.",
    "causes": "Seed-borne and soil-borne fungus favored by cool, wet harvesting conditions followed by cool, humid storage without proper drying. Symptoms often develop slowly and only become visible after 2-3 months of storage.",
    "organic_remedies": [
      "Dry harvested tubers immediately with forced ambient air ventilation.",
      "Green sprouting (chitting) in light helps identify blind tubers with dead eyes before planting."
    ],
    "chemical_treatments": [
      {
        "chemical": "Imazalil or Thiabendazole (Tecto)",
        "dosage": "30 ml per tonne of tubers as post-harvest mist spray",
        "interval": "Apply on intake conveyor within 10 days of lifting."
      },
      {
        "chemical": "Fludioxonil (Maxim 100 FS)",
        "dosage": "1.5 ml per kg seed tuber treatment",
        "interval": "Protects eyes and sprouts at planting."
      }
    ],
    "preventive_measures": [
      "Avoid harvesting in wet, cold weather.",
      "Ensure rapid drying of tubers within 48 hours of lifting to arrest fungal penetration into eyes.",
      "Check seed tuber eyes carefully before planting; discard seed lots with high blind-eye incidence."
    ],
    "fertilizer_recommendation": "Promote rapid early emergence with balanced NPK and Zinc fertilizer.",
    "voice_summary": "Potato Skin Spot detected with dark pimples killing tuber eyes. Dry tubers within 48 hours of harvest, treat seed with Imazalil, and check eyes before planting."
  },
  "Potato___PMTV": {
    "id": "potato_pmtv",
    "crop": "Potato",
    "name": "Potato Mop Top Virus (PMTV / Spraing)",
    "hindi_name": "आलू का मॉप-टॉप वायरस रोग (स्प्रेइंग/पीला वी-आकार)",
    "pathogen": "Potato Mop-Top Virus (Pomovirus)",
    "category": "Viral",
    "severity": "High",
    "badge_color": "#eab308",
    "symptoms": "Foliage shows distinctive bright yellow chevron or V-shaped markings, yellow blotches, or ring patterns. Stems develop shortened internodes, creating a bunched, stunted 'mop-top' haulm habit. Internal tuber flesh develops brown, corky, necrotic concentric arcs or rings known as **spraing**, making tubers unmarketable.",
    "causes": "Transmitted by the soil-borne powdery scab vector *Spongospora subterranea*. The virus survives inside powdery scab resting spore balls in the soil for over a decade.",
    "organic_remedies": [
      "Control the powdery scab vector through improved soil drainage and subsoiling.",
      "Avoid planting susceptible varieties in fields with known powdery scab or PMTV history."
    ],
    "chemical_treatments": [
      {
        "chemical": "Fluazinam (Shirlan) soil incorporation",
        "dosage": "3 Liter per hectare applied to soil before planting",
        "interval": "Suppresses the Spongospora fungal vector that transmits PMTV."
      }
    ],
    "preventive_measures": [
      "Use certified seed tubers rigorously tested for PMTV and Spongospora freedom.",
      "Plant spraing-resistant varieties (e.g., King Edward, Cara).",
      "Avoid moving contaminated soil or machinery from infested fields."
    ],
    "fertilizer_recommendation": "Maintain optimal drainage and avoid heavy water application during early tuber initiation.",
    "voice_summary": "Potato Mop Top Virus detected with bright yellow chevron markings and internal spraing arcs. Control the Spongospora vector, improve drainage, and use certified seed."
  },
  "Potato___TRV": {
    "id": "potato_trv",
    "crop": "Potato",
    "name": "Tobacco Rattle Virus (TRV / Spraing)",
    "hindi_name": "आलू का तम्बाकू रैटल वायरस / स्प्रेइंग रोग",
    "pathogen": "Tobacco Rattle Virus (Tobravirus)",
    "category": "Viral",
    "severity": "High",
    "badge_color": "#d97706",
    "symptoms": "Foliage shows yellow chevron, ring, or line patterns ('stem mottle') or distorted leaflets. In tubers, the primary economic damage is **spraing**: internal hard, corky, dark brown concentric arcs, circles, and wavy lines throughout the flesh with zero external blemishes.",
    "causes": "Transmitted by free-living stubby-root nematodes (*Trichodorus* and *Paratrichodorus* species). Thrives in light, sandy, free-draining soils with high nematode populations and high soil moisture.",
    "organic_remedies": [
      "Grow non-host cover crops or bio-fumigant mustard crops to reduce stubby-root nematode populations.",
      "Apply neem cake @ 200 kg/acre to soil to suppress nematode vectors."
    ],
    "chemical_treatments": [
      {
        "chemical": "Oxamyl (Vydate 10G) or Fluopyram (Velum Prime)",
        "dosage": "Velum Prime @ 625 ml/ha applied in-furrow at planting",
        "interval": "Nematicide that paralyzes stubby-root nematodes, preventing TRV transmission."
      }
    ],
    "preventive_measures": [
      "Conduct pre-planting soil tests in sandy fields to quantify stubby-root nematode counts.",
      "Plant spraing-resistant potato varieties (e.g., Maris Piper, Cara, Lady Rosetta).",
      "Avoid over-irrigating light sandy fields during tuber initiation when nematodes are most active."
    ],
    "fertilizer_recommendation": "Apply soil organic amendments to improve soil microbial activity against nematodes.",
    "voice_summary": "Tobacco Rattle Virus TRV Spraing detected with internal corky brown rings in tubers. Apply Velum Prime nematicide, test sandy soils, and plant resistant varieties."
  },
  "Potato___Verticillium_wilt": {
    "id": "potato_verticillium_wilt",
    "crop": "Potato",
    "name": "Potato Verticillium Wilt (Early Dying)",
    "hindi_name": "आलू का वर्टिसिलियम म्लानि / अगेती सूखना रोग",
    "pathogen": "Verticillium dahliae / Verticillium albo-atrum (Fungus)",
    "category": "Fungal",
    "severity": "High",
    "badge_color": "#b45309",
    "symptoms": "Characteristic **unilateral wilting and yellowing**: one side of a compound leaf or one side of a plant turns yellow while the opposite side remains green. Lower leaves wilt, turn brown, and die ('Potato Early Dying Syndrome'). Lower stem vascular ring develops light brown to dark tan discoloration. Tubers show light brown vascular ring discoloration.",
    "causes": "Soil-borne vascular wilt fungus. Microsclerotia survive in soil for 10+ years. Disease is aggravated by high temperatures (22-28°C), drought stress, and root-lesion nematodes (*Pratylenchus penetrans*).",
    "organic_remedies": [
      "Bio-fumigation: plant high-glucosinolate mustard (Brassica juncea) green manure, chop finely, and incorporate into wet soil under tarp.",
      "Apply Trichoderma viride @ 2.5 kg/acre in compost."
    ],
    "chemical_treatments": [
      {
        "chemical": "Soil Fumigation (Metam sodium / Dazomet) in high-value seed fields",
        "dosage": "As per local regulatory protocol under plastic mulch",
        "interval": "Pre-planting fumigation reduces microsclerotia and nematode populations."
      },
      {
        "chemical": "Fluopyram (Velum Prime) for nematode suppression",
        "dosage": "625 ml per hectare in-furrow",
        "interval": "Controls Pratylenchus nematodes that synergize Verticillium entry."
      }
    ],
    "preventive_measures": [
      "Maintain 4-6 year crop rotation with non-hosts (corn, sorghum, small grains); avoid rotating with tomatoes, peppers, or eggplants.",
      "Plant Verticillium-tolerant varieties (e.g., Ranger Russet).",
      "Avoid moisture stress during tuber bulking: irrigate uniformly to maintain plant vigor."
    ],
    "fertilizer_recommendation": "Ensure adequate Nitrogen and Potassium; avoid early nutrient depletion which accelerates Early Dying senescence.",
    "voice_summary": "Potato Verticillium Wilt detected with unilateral leaf yellowing. Rotate with non-solanaceous crops, avoid drought stress, and suppress root nematodes."
  },
  "Potato___Violet_root_rot": {
    "id": "potato_violet_root_rot",
    "crop": "Potato",
    "name": "Potato Violet Root Rot",
    "hindi_name": "आलू का बैंगनी जड़ सड़न रोग",
    "pathogen": "Helicobasidium purpureum / Rhizoctonia crocorum (Fungus)",
    "category": "Fungal",
    "severity": "Moderate to High",
    "badge_color": "#6d28d9",
    "symptoms": "Tubers and underground stem bases become covered by a thick, velvety, purplish-violet to reddish-brown felt of fungal mycelium. Characteristic dark violet strands (mycelial cords) anchor the fungus to the tuber skin, causing a superficial dry rot with soil adhering tightly to the violet mantle.",
    "causes": "Soil-borne fungus surviving as sclerotia in the soil. Favored by wet, poorly aerated, acidic to neutral soils with a history of carrots, beets, or clover.",
    "organic_remedies": [
      "Apply agricultural lime to raise soil pH in acidic fields.",
      "Incorporate bio-fungicide Trichoderma harzianum @ 5 kg/acre into soil."
    ],
    "chemical_treatments": [
      {
        "chemical": "Soil treatment with Fluazinam or Azoxystrobin",
        "dosage": "In-furrow application as per label instructions",
        "interval": "Suppresses mycelial cords in infested soil zones."
      }
    ],
    "preventive_measures": [
      "Practice long crop rotation with non-susceptible cereals, corn, and grasses (avoid rotating with carrots or sugar beets).",
      "Improve soil drainage and eliminate waterlogged patches.",
      "Thoroughly clean tubers and reject seed lots showing purple felt mycelium."
    ],
    "fertilizer_recommendation": "Apply balanced nutrition; avoid waterlogging.",
    "voice_summary": "Potato Violet Root Rot detected with velvety purple mycelium on tubers. Rotate with cereals, improve soil drainage, and discard infected tubers."
  },
  "Potato___Wart_disease": {
    "id": "potato_wart_disease",
    "crop": "Potato",
    "name": "Potato Wart Disease",
    "hindi_name": "आलू का मस्सा रोग (वार्ट डिजीज - अत्यंत घातक संगरोध रोग)",
    "pathogen": "Synchytrium endobioticum (Chytrid Fungus - Strict Quarantine Pathogen)",
    "category": "Fungal",
    "severity": "Critical",
    "badge_color": "#7f1d1d",
    "symptoms": "Proliferating, irregular, cauliflower-like spongy warty tumors and coralloid outgrowths on tubers, stolons, and stem bases. Tumors start white or greenish on exposed tubers, then turn dark brown or black, rotting into an inky foul mass. Foliage may appear completely normal or slightly stunted.",
    "causes": "Strict international quarantine pathogen. Obligate biotrophic chytrid producing thick-walled resting sporangia (winter spores) that **can survive dormant in soil for over 30 to 40 years**. Favored by cool, moist, temperate climates.",
    "organic_remedies": [
      "MANDATORY QUARANTINE: Immediately notify national plant protection authorities. Do not move soil or tubers from infected land."
    ],
    "chemical_treatments": [
      {
        "chemical": "Statutory Quarantine Elimination (No chemical control authorized)",
        "dosage": "Strict statutory planting prohibition on infested fields for 20+ years",
        "interval": "Quarantine boundary enforcement."
      }
    ],
    "preventive_measures": [
      "Plant strictly certified wart-immune varieties in high-risk zones.",
      "Strictly observe quarantine bans on moving soil, seed, or equipment from declared wart zones.",
      "Clean and power-wash all farm machinery before moving to clean fields."
    ],
    "fertilizer_recommendation": "Follow national statutory agricultural directives.",
    "voice_summary": "Strict Quarantine Alert: Potato Wart Disease detected with cauliflower-like tumors. Report to agricultural authorities immediately; quarantine restrictions apply."
  },
  "Potato___Watery_wound_rot": {
    "id": "potato_watery_wound_rot",
    "crop": "Potato",
    "name": "Potato Watery Wound Rot (Pythium Leak)",
    "hindi_name": "आलू का जलीय घाव सड़न रोग (वाटरी लीक)",
    "pathogen": "Pythium ultimum / Pythium spp. (Oomycete)",
    "category": "Oomycete",
    "severity": "High",
    "badge_color": "#0369a1",
    "symptoms": "Tubers suffer extremely rapid, watery, soft internal rotting entering through harvest wounds and skinning. External skin develops brown, water-soaked, greasy patches bordered by a dark line. When cut, infected flesh is water-soaked, creamy-gray, and turns brown to black upon air exposure. Squeezing an infected tuber forces out a **watery, clear to dirty brownish liquid ('leak')**, leaving only an empty papery skin shell.",
    "causes": "Wound parasite favored by high tuber and air temperatures at harvest (>20-25°C) combined with mechanical bruising, skinning, and harvesting into hot boxes.",
    "organic_remedies": [
      "Harvest only during cool early morning hours when tuber pulp temperature is below 18°C.",
      "Cure tubers with forced cool, dry ambient air immediately after harvest."
    ],
    "chemical_treatments": [
      {
        "chemical": "Metalaxyl-M / Mefenoxam (Ridomil Gold SL)",
        "dosage": "Foliar application during tuber bulking or post-harvest tuber drench",
        "interval": "Suppresses Pythium zoospore infection."
      },
      {
        "chemical": "Phosphorous Acid / Potassium Phosphite (Agri-Fos)",
        "dosage": "3 ml per Liter of water as post-harvest mist spray",
        "interval": "Induces systemic tuber resistance against Pythium leak and pink rot."
      }
    ],
    "preventive_measures": [
      "Never harvest potatoes in hot, sunny conditions when pulp temperature exceeds 20°C.",
      "Ensure full tuber maturity and firm skin-set before lifting by desiccating haulms 2 weeks earlier.",
      "Minimize grader drops and harvest impacts; eliminate sharp edges on harvesting equipment.",
      "Ensure rapid ventilation and cooling in store to remove surface moisture."
    ],
    "fertilizer_recommendation": "Avoid excess nitrogen late in season which produces tender skins prone to harvesting wounds.",
    "voice_summary": "Potato Watery Wound Rot Pythium Leak detected with tubers squirting watery fluid. Harvest only in cool mornings below 18 degrees Celsius, avoid skinning, and apply Phosphite."
  }
};

const NUTRIENT_DEFICIENCY_GUIDE = {
  "nitrogen_deficiency": {
    "name": "Nitrogen (N) Deficiency",
    "hindi_name": "नाइट्रोजन की कमी",
    "symptoms": "General uniform pale green to yellow chlorosis starting from older lower leaves first. Stems turn thin, woody, and fibrous.",
    "correction": "Apply Urea (46% N) @ 25 kg/acre as top dressing or spray 19:19:19 @ 5g/L or 1% Urea foliar spray."
  },
  "phosphorus_deficiency": {
    "name": "Phosphorus (P) Deficiency",
    "hindi_name": "फास्फोरस की कमी",
    "symptoms": "Purplish or bronze discoloration along main veins on the underside of leaves. Stunted root growth and delayed flowering.",
    "correction": "Apply DAP (Di-ammonium Phosphate) or SSP in soil, or foliar spray with 12:61:00 (Mono Ammonium Phosphate) @ 5g/L."
  },
  "potassium_deficiency": {
    "name": "Potassium (K) Deficiency",
    "hindi_name": "पोटाश (पोटेशियम) की कमी",
    "symptoms": "Marginal chlorosis turning into brown necrotic scorch along leaf tips and edges. Fruit develops blotchy ripening and hollow cores.",
    "correction": "Apply MOP (Muriate of Potash) or SOP (Sulphate of Potash) @ 20 kg/acre, or foliar spray 0:0:50 @ 5g/L."
  },
  "calcium_deficiency": {
    "name": "Calcium (Ca) Deficiency / Blossom End Rot",
    "hindi_name": "कैल्शियम की कमी / ब्लॉसम एंड रॉट",
    "symptoms": "Cupping and hooked distortion of youngest leaves. Black sunken leathery rot on the blossom end of green fruits.",
    "correction": "Foliar spray of Calcium Nitrate (18.8% Ca + 15.5% N) @ 5g/L + Boron 20% @ 1g/L every 10 days during fruit set."
  },
  "iron_deficiency": {
    "name": "Iron (Fe) Deficiency",
    "hindi_name": "आयरन (लोहा) की कमी",
    "symptoms": "Sharp interveinal chlorosis (veins remain distinctly dark green while leaf blade turns bleached yellow) on the youngest top leaves.",
    "correction": "Foliar spray of Chelated Iron (Fe-EDTA 12%) @ 1g/L of water."
  },
  "magnesium_deficiency": {
    "name": "Magnesium (Mg) Deficiency",
    "hindi_name": "मैग्नीशियम की कमी",
    "symptoms": "Interveinal chlorosis on older mature leaves; green veins with yellow to orange patches, progressing to brittle brown necrotic spots.",
    "correction": "Foliar spray of Magnesium Sulphate (Epsom salt) @ 5g/L or soil application @ 10 kg/acre."
  }
};

module.exports = {
  DISEASE_KNOWLEDGE_BASE,
  NUTRIENT_DEFICIENCY_GUIDE
};
