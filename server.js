/**
 * Kisan Mitra (किसान मित्र) - Pure JavaScript & EJS AI Web Application
 * Dedicated Tomato & Potato Disease & Nutrient Deficiency Identification Doctor
 * Powered by Express, EJS, and Meta DINOv2 Vision Transformer (ONNX Runtime Node)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const { engine } = require('./src/predictor');
const { DISEASE_KNOWLEDGE_BASE, NUTRIENT_DEFICIENCY_GUIDE } = require('./src/knowledgeBase');

const app = express();
const PORT = process.env.PORT || 8000;

// Set EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Multer memory storage for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// Preloaded sample list for quick 1-click test chips
const SAMPLES = [
  { url: '/static/assets/samples/potato_pink_rot.jpg', label: '🥔 Potato Pink Rot (Tuber)', color: '#ec4899', name: 'Potato Pink Rot' },
  { url: '/static/assets/samples/potato_alternaria.jpg', label: '🥔 Potato Alternaria (AHDB)', color: '#f97316', name: 'Potato Alternaria' },
  { url: '/static/assets/samples/potato_late_blight.jpg', label: '🥔 Potato Late Blight', color: '#ef4444', name: 'Potato Late Blight' },
  { url: '/static/assets/samples/potato_healthy.jpg', label: '🥔 Healthy Potato Crop', color: '#22c55e', name: 'Healthy Potato' },
  { url: '/static/assets/samples/powdery_mildew.jpg', label: '🍅 Tomato Powdery Mildew', color: '#38bdf8', name: 'Tomato Powdery Mildew' },
  { url: '/static/assets/samples/early_blight.jpg', label: '🍅 Tomato Early Blight', color: '#34d399', name: 'Tomato Early Blight' },
  { url: '/static/assets/samples/late_blight.jpg', label: '🍅 Tomato Late Blight', color: '#ef4444', name: 'Tomato Late Blight' },
  { url: '/static/assets/samples/healthy_leaf.jpg', label: '🍅 Healthy Tomato', color: '#22c55e', name: 'Healthy Tomato' },
  { url: '/static/assets/samples/bacterial_spot.jpg', label: '🍅 Bacterial Spot', color: '#fbbf24', name: 'Tomato Bacterial Spot' },
  { url: '/static/assets/samples/yellow_leaf_curl.jpg', label: '🍅 Leaf Curl Virus', color: '#fb923c', name: 'Tomato Leaf Curl' },
  { url: '/static/assets/samples/spider_mites.jpg', label: '🍅 Spider Mites', color: '#f87171', name: 'Spider Mites' }
];

// ==========================================
// ROUTES
// ==========================================

/**
 * Main Web View (EJS)
 */
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Kisan Mitra (किसान मित्र) - AI Crop Disease & Nutrient Deficiency Doctor',
    metaDescription: 'Kisan Mitra is an intelligent AI agricultural platform to detect tomato and potato crop diseases and nutrient deficiencies from photos.',
    totalConditions: Object.keys(DISEASE_KNOWLEDGE_BASE).length,
    samples: SAMPLES
  });
});

/**
 * Healthcheck API
 */
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Kisan Mitra - Specialized Tomato & Potato AI Diagnostic Doctor (JavaScript / Node.js)',
    crops_supported: ['Tomato (19 Conditions)', 'Potato (24 AHDB & Global Conditions)'],
    model: 'Meta DINOv2 Vision Transformer + Specialized Tomato & Potato Classifier (ONNX Runtime Node)',
    classes_supported: Object.keys(DISEASE_KNOWLEDGE_BASE).length,
    knowledge_base_conditions: Object.keys(DISEASE_KNOWLEDGE_BASE).length,
    focus: 'Exclusively Tomato and Potato Crops',
    version: '3.0.0-node'
  });
});

/**
 * Disease Catalog API
 */
app.get('/api/v1/diseases', (req, res) => {
  const crop = req.query.crop;
  let diseases = Object.values(DISEASE_KNOWLEDGE_BASE);
  if (crop && !['all', 'auto'].includes(crop.toLowerCase())) {
    const cropClean = crop.toLowerCase();
    diseases = diseases.filter(d => (d.crop || '').toLowerCase().includes(cropClean));
  }
  res.json({
    total_conditions: diseases.length,
    diseases: diseases
  });
});

/**
 * Nutrient Deficiencies API
 */
app.get('/api/v1/deficiencies', (req, res) => {
  res.json({
    crop: 'Tomato',
    deficiencies: NUTRIENT_DEFICIENCY_GUIDE
  });
});

/**
 * Sample Test Images API
 */
app.get('/api/v1/samples', (req, res) => {
  res.json({ samples: SAMPLES });
});

/**
 * Primary Multipart Diagnosis API
 */
app.post('/api/v1/diagnose', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ error: 'No image uploaded. Please upload a valid image file.' });
    }

    const cropFilter = req.body.crop || 'Auto';
    const result = await engine.predict(req.file.buffer, cropFilter);
    console.log(`[NODE DIAGNOSIS] Crop: ${cropFilter} -> Detected: [${result.crop}] ${result.prediction.name} (${result.prediction.confidence_percent}%)`);
    res.json(result);
  } catch (err) {
    console.error('Diagnosis error:', err);
    res.status(500).json({ error: `Diagnosis error: ${err.message}` });
  }
});

/**
 * Base64 Diagnosis API
 */
app.post('/api/v1/diagnose/base64', async (req, res) => {
  try {
    const rawB64 = req.body.image_base64;
    if (!rawB64) {
      return res.status(400).json({ error: 'Missing image_base64 parameter.' });
    }

    const base64Data = rawB64.includes(',') ? rawB64.split(',')[1] : rawB64;
    const buffer = Buffer.from(base64Data, 'base64');
    const cropFilter = req.body.crop || 'Auto';

    const result = await engine.predict(buffer, cropFilter);
    res.json(result);
  } catch (err) {
    console.error('Base64 Diagnosis error:', err);
    res.status(500).json({ error: `Diagnosis error: ${err.message}` });
  }
});

/**
 * Interactive Kisan Agri-Advisor Chat API
 */
app.post('/api/v1/chat', (req, res) => {
  const msg = (req.body.message || '').toLowerCase().trim();
  const ctx = (req.body.disease_context || '').toLowerCase();
  const lang = req.body.language || 'en';

  let reply = '';

  if (msg.includes('bordeaux')) {
    reply = 'To prepare 1% Bordeaux Mixture: Dissolve 1 kg Copper Sulphate (Neela Thotha) in 50L water in an earthen or plastic vessel. In another vessel, slake 1 kg Quicklime (Chuna) in 50L water. Slowly pour the copper sulphate solution into the lime suspension while stirring continuously. Test with a clean knife blade; if copper deposits on the blade, add more lime until neutral.';
  } else if (msg.includes('alternaria') || msg.includes('early blight') || msg.includes('late blight') || msg.includes('झुलसा')) {
    reply = 'Early Blight (Alternaria) forms concentric target rings starting on older leaves (spray Amistar Top @ 1ml/L or Mancozeb @ 2.5g/L). Late Blight (Phytophthora) produces water-soaked greasy patches with white spore fuzz on leaf undersides in foggy weather (immediately spray Curzate @ 2.5g/L or Ridomil Gold @ 2.5g/L).';
  } else if (msg.includes('neem') || msg.includes('organic') || msg.includes('जैविक')) {
    reply = 'Organic Crop Shield: Mix 5ml cold-pressed Neem Oil (10,000 ppm) with 1ml liquid soap in 1 Liter warm water. Add 5g Trichoderma viride or Pseudomonas fluorescens. Spray during early morning or evening hours.';
  } else if (msg.includes('dosage') || msg.includes('spray')) {
    reply = 'Standard Knapsack Sprayer (15L Pump): Mancozeb 75 WP (40g), Amistar Top (15ml), Ridomil Gold (35g), Neem Oil (50ml), Streptocycline (1.5g). Always wear mask and gloves while spraying.';
  } else {
    reply = 'Kisan Mitra Agronomy Tip: Ensure regular field scouting, inspect the underside of leaves for early lesion halos or aphids, and maintain proper crop earthing-up. Upload a clear photo of any affected leaf or tuber for instant AI diagnosis and prescription.';
  }

  res.json({
    reply: reply,
    language: lang,
    disease_context: ctx
  });
});

// Warm up DINOv2 session on server start
engine.init().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================================`);
    console.log(`  🌾 KISAN MITRA AI (NODE.JS & EJS) RUNNING ON PORT ${PORT}`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`=================================================================`);
  });
}).catch(err => {
  console.error('Failed to initialize DINOv2 vision model:', err);
  process.exit(1);
});
