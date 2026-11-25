/**
 * Kisan Mitra AI - Dedicated Tomato & Potato Vision Doctor (Pure JavaScript)
 * Powered by Meta DINOv2 Vision Transformer (ViT-B/14, 768-dim) + Solanaceae Classifier Head.
 * Exclusively focused on Tomato (19 conditions) and Potato (24 conditions).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ort = require('onnxruntime-node');
const { DISEASE_KNOWLEDGE_BASE, NUTRIENT_DEFICIENCY_GUIDE } = require('./knowledgeBase');

// Reference DINOv2 indices
const DINOV2_POTATO_INDICES = { 20: 'Potato___Early_blight', 21: 'Potato___Late_blight', 22: 'Potato___healthy' };
const DINOV2_TOMATO_INDICES = {
  28: 'Tomato___Bacterial_spot',
  29: 'Tomato___Early_blight',
  30: 'Tomato___Late_blight',
  31: 'Tomato___Leaf_Mold',
  32: 'Tomato___Septoria_leaf_spot',
  33: 'Tomato___Spider_mites Two-spotted_spider_mite',
  34: 'Tomato___Target_Spot',
  35: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  36: 'Tomato___Tomato_mosaic_virus',
  37: 'Tomato___healthy'
};

class CropDiagnosisEngine {
  constructor(modelPath, weightsPath) {
    const rootDir = path.resolve(__dirname, '..');
    this.modelPath = modelPath || path.join(rootDir, 'models', 'dinov2_plant_disease.onnx');
    this.weightsPath = weightsPath || path.join(rootDir, 'models', 'tomato_potato_classifier.json');
    this.session = null;
    this.hasTrainedHead = false;
    this.headWeights = null;
    this.headBiases = null;
    this.cropWeights = null;
    this.cropBiases = null;
    this.trainedClasses = [];
    this.trainedClassToIdx = {};
  }

  async init() {
    if (!this.session) {
      const opts = {
        executionProviders: ['cpu'],
        graphOptimizationLevel: 'all',
        intraOpNumThreads: 2,
        interOpNumThreads: 1
      };
      this.session = await ort.InferenceSession.create(this.modelPath, opts);
      console.log(`[Kisan Mitra Node] DINOv2 Vision Backbone loaded: ${path.basename(this.modelPath)}`);
    }

    if (!this.hasTrainedHead && fs.existsSync(this.weightsPath)) {
      try {
        const raw = fs.readFileSync(this.weightsPath, 'utf8');
        const data = JSON.parse(raw);
        this.headWeights = data.weights;           // [13, 768]
        this.headBiases = data.biases;             // [13]
        this.cropWeights = data.crop_weights;       // [1, 768]
        this.cropBiases = data.crop_biases;         // [1]
        this.trainedClasses = data.class_keys;
        this.trainedClassToIdx = {};
        this.trainedClasses.forEach((k, idx) => {
          this.trainedClassToIdx[k] = idx;
        });
        this.hasTrainedHead = true;
        console.log(`[Kisan Mitra Node] Solanaceae Classifier Head loaded (${this.trainedClasses.length} classes)`);
      } catch (err) {
        console.warn(`[Kisan Mitra Node] Warning: Could not load trained head: ${err.message}`);
        this.hasTrainedHead = false;
      }
    }
  }

  rgbToHsv(r, g, b) {
    const rf = r / 255.0;
    const gf = g / 255.0;
    const bf = b / 255.0;
    const max = Math.max(rf, gf, bf);
    const min = Math.min(rf, gf, bf);
    const delta = max - min;
    let h = 0;
    const s = max === 0 ? 0 : delta / max;
    const v = max;

    if (delta !== 0) {
      if (max === rf) {
        h = (gf - bf) / delta + (gf < bf ? 6 : 0);
      } else if (max === gf) {
        h = (bf - rf) / delta + 2;
      } else {
        h = (rf - gf) / delta + 4;
      }
      h *= 60;
    }
    // OpenCV-compatible scaling: H in [0..180], S in [0..255], V in [0..255]
    return [Math.round(h / 2), Math.round(s * 255), Math.round(v * 255)];
  }

  async analyzeColorAndMorphology(imageBuffer) {
    // Resize to 300x300 for high-speed robust colorimetry & speck morphological segmentation
    const targetW = 300;
    const targetH = 300;
    const { data: pixels, info } = await sharp(imageBuffer)
      .resize(targetW, targetH, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const total = targetW * targetH;
    let greenCount = 0;
    let salmonPinkCount = 0;
    let ripeRedCount = 0;
    let tuberSkinCount = 0;
    let whiteSporeCount = 0;
    let yellowChlorosisCount = 0;
    let brownNecrosisCount = 0;
    let validTissueCount = 0;

    // Binary grid for speck connected components
    const darkSpotGrid = new Uint8Array(total);

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const idx = (y * targetW + x) * 3;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        const [h, s, v] = this.rgbToHsv(r, g, b);

        // Excess green ExG = 2G - R - B
        const exg = 2.0 * g - r - b;

        // 1. Green foliage
        const isGreen = (h >= 28 && h <= 88 && s >= 30 && v >= 30);
        if (isGreen) greenCount++;

        // Chlorosis & Necrosis
        if (h >= 20 && h <= 35 && s >= 50 && v >= 50) yellowChlorosisCount++;
        if (h >= 5 && h <= 20 && s >= 40 && v <= 180) brownNecrosisCount++;

        // 2. Salmon-pink cut tuber flesh (Potato Pink Rot)
        const isSalmonPink = (r > 90 && r > g + 10 && r > b + 10 && r <= 1.8 * g && s >= 40 && s <= 135);
        if (isSalmonPink) salmonPinkCount++;

        // 3. Ripe red tomato fruit
        const isRipeRed = (r > 110 && r > 1.8 * g && s > 130);
        if (isRipeRed) ripeRedCount++;

        // 4. Potato tuber skin / flesh
        const isTuberSkin = (h >= 10 && h <= 35 && s >= 20 && s <= 180 && v >= 40 && v <= 240);
        if (isTuberSkin) tuberSkinCount++;

        // 5. White spore powder (Powdery Mildew)
        const isWhiteSpore = (s <= 45 && v >= 160);
        if (isWhiteSpore) whiteSporeCount++;

        // 6. Dark necrotic speck (Bacterial speck/spot)
        const isDarkSpot = (v < 75 && s >= 30);
        if (isDarkSpot) {
          darkSpotGrid[y * targetW + x] = 1;
        }

        // Botanical organic tissue validation
        if (isGreen || exg > 0 || isTuberSkin || isSalmonPink || isRipeRed) {
          validTissueCount++;
        }
      }
    }

    // Connected Component Analysis on Dark Spot Grid for Speck Counting
    let speckCount = 0;
    const visited = new Uint8Array(total);
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const pIdx = y * targetW + x;
        if (darkSpotGrid[pIdx] === 1 && visited[pIdx] === 0) {
          // BFS
          let area = 0;
          const queue = [pIdx];
          visited[pIdx] = 1;

          while (queue.length > 0) {
            const curr = queue.pop();
            area++;
            const cy = Math.floor(curr / targetW);
            const cx = curr % targetW;

            const neighbors = [
              [cy - 1, cx], [cy + 1, cx], [cy, cx - 1], [cy, cx + 1]
            ];
            for (const [ny, nx] of neighbors) {
              if (ny >= 0 && ny < targetH && nx >= 0 && nx < targetW) {
                const nIdx = ny * targetW + nx;
                if (darkSpotGrid[nIdx] === 1 && visited[nIdx] === 0) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
          // If area is a discrete punctate speck
          if (area >= 6 && area <= 120) {
            speckCount++;
          }
        }
      }
    }

    return {
      vegetationRatio: (validTissueCount / total) * 100,
      greenPct: (greenCount / total) * 100,
      salmonPinkPct: (salmonPinkCount / total) * 100,
      ripeRedPct: (ripeRedCount / total) * 100,
      tuberSkinPct: (tuberSkinCount / total) * 100,
      whiteSporePct: (whiteSporeCount / total) * 100,
      yellowPct: (yellowChlorosisCount / total) * 100,
      brownPct: (brownNecrosisCount / total) * 100,
      speckCount: speckCount
    };
  }

  async preprocessTensors(imageBuffer) {
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    // Scale A: Full view (224x224 bicubic fill)
    const rawFull = await sharp(imageBuffer)
      .resize(224, 224, { fit: 'fill', kernel: 'cubic' })
      .removeAlpha()
      .raw()
      .toBuffer();

    const dataFull = new Float32Array(1 * 3 * 224 * 224);
    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const i = (y * 224 + x) * 3;
        dataFull[0 * 50176 + y * 224 + x] = (rawFull[i] / 255.0 - mean[0]) / std[0];
        dataFull[1 * 50176 + y * 224 + x] = (rawFull[i + 1] / 255.0 - mean[1]) / std[1];
        dataFull[2 * 50176 + y * 224 + x] = (rawFull[i + 2] / 255.0 - mean[2]) / std[2];
      }
    }

    // Scale B: Center crop (224x224 from 256 shortest edge)
    const meta = await sharp(imageBuffer).metadata();
    const w = meta.width || 224;
    const h = meta.height || 224;
    let newW, newH;
    if (w < h) {
      newW = 256;
      newH = Math.round((256 * h) / w);
    } else {
      newH = 256;
      newW = Math.round((256 * w) / h);
    }

    const left = Math.max(0, Math.floor((newW - 224) / 2));
    const top = Math.max(0, Math.floor((newH - 224) / 2));

    const rawCrop = await sharp(imageBuffer)
      .resize(newW, newH, { kernel: 'cubic' })
      .extract({ left, top, width: 224, height: 224 })
      .removeAlpha()
      .raw()
      .toBuffer();

    const dataCrop = new Float32Array(1 * 3 * 224 * 224);
    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const i = (y * 224 + x) * 3;
        dataCrop[0 * 50176 + y * 224 + x] = (rawCrop[i] / 255.0 - mean[0]) / std[0];
        dataCrop[1 * 50176 + y * 224 + x] = (rawCrop[i + 1] / 255.0 - mean[1]) / std[1];
        dataCrop[2 * 50176 + y * 224 + x] = (rawCrop[i + 2] / 255.0 - mean[2]) / std[2];
      }
    }

    const tensorFull = new ort.Tensor('float32', dataFull, [1, 3, 224, 224]);
    const tensorCrop = new ort.Tensor('float32', dataCrop, [1, 3, 224, 224]);
    return { tensorFull, tensorCrop };
  }

  dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  async predict(imageBuffer, cropFilter = 'Auto') {
    const startTime = Date.now();
    await this.init();

    // 1. Colorimetry & Botanical Leaf Validation
    const morph = await this.analyzeColorAndMorphology(imageBuffer);
    if (morph.vegetationRatio < 6.0) {
      return {
        status: 'unclear_leaf',
        message: 'No clear tomato or potato foliage, tuber, or fruit detected. Please focus your camera directly on the leaf blade, stem, tuber, or fruit.',
        crop: ['Tomato', 'Potato'].includes(cropFilter) ? cropFilter : 'Tomato',
        vegetation_percentage: Math.round(morph.vegetationRatio * 10) / 10,
        prediction: {
          disease_id: 'unclear_leaf',
          name: 'No Clear Tomato / Potato Leaf, Tuber, or Fruit Detected',
          hindi_name: 'स्पष्ट टमाटर या आलू की पत्ती/कंद/फल नहीं मिला',
          confidence_percent: 0.0,
          category: 'Validation',
          severity: 'Low',
          badge_color: '#64748b',
          pathogen: 'None',
          voice_summary: 'कृपया कैमरे को सीधे टमाटर या आलू की पत्ती, कंद अथवा फल पर केंद्रित करें।'
        },
        treatment_plan: {
          organic_remedies: ['Ensure adequate sunlight and clean camera lens.'],
          chemical_treatments: [],
          preventive_measures: ['Align the leaf, tuber, or fruit clearly inside the viewfinder.'],
          fertilizer_recommendation: ''
        },
        spectral_deficiency_analysis: {
          green_ratio_pct: 0,
          yellow_chlorosis_pct: 0,
          brown_necrosis_pct: 0,
          suspected_deficiencies: []
        },
        top_predictions: [],
        metadata: { inference_time_ms: Date.now() - startTime }
      };
    }

    // 2. Dual-Scale DINOv2 Feature Extraction
    const { tensorFull, tensorCrop } = await this.preprocessTensors(imageBuffer);
    const inputName = this.session.inputNames[0];

    const outFull = await this.session.run({ [inputName]: tensorFull });
    const outCrop = await this.session.run({ [inputName]: tensorCrop });

    const logitsFull = outFull[this.session.outputNames[0]].data;
    const featFull = outFull[this.session.outputNames[1]].data;

    const logitsCrop = outCrop[this.session.outputNames[0]].data;
    const featCrop = outCrop[this.session.outputNames[1]].data;

    // Multi-scale feature embedding fusion (768-dim, unit normalized)
    const featNorm = new Float32Array(768);
    let normSq = 0;
    for (let i = 0; i < 768; i++) {
      const v = (featFull[i] + featCrop[i]) / 2.0;
      featNorm[i] = v;
      normSq += v * v;
    }
    const norm = Math.sqrt(normSq) + 1e-7;
    for (let i = 0; i < 768; i++) {
      featNorm[i] /= norm;
    }

    // Multi-scale base logits (38 classes)
    const baseLogits38 = new Float32Array(38);
    for (let i = 0; i < 38; i++) {
      baseLogits38[i] = (logitsFull[i] + logitsCrop[i]) / 2.0;
    }

    // 3. Crop Determination (Tomato vs Potato)
    let chosenCrop = 'Tomato';
    const cropFilterNorm = (cropFilter || 'auto').trim().toLowerCase();
    if (['tomato', 'टमाटर'].includes(cropFilterNorm)) {
      chosenCrop = 'Tomato';
    } else if (['potato', 'आलू'].includes(cropFilterNorm)) {
      chosenCrop = 'Potato';
    } else {
      // Auto-Detect Mode
      const isHarvestedTuber = (morph.greenPct < 10.0) && (morph.salmonPinkPct > 8.0 || (morph.tuberSkinPct > 10.0 && morph.ripeRedPct < 4.0));
      const isTomatoFruit = (morph.greenPct < 10.0) && (morph.ripeRedPct > 4.0 && morph.ripeRedPct > morph.salmonPinkPct);

      if (isTomatoFruit) {
        chosenCrop = 'Tomato';
      } else if (isHarvestedTuber) {
        chosenCrop = 'Potato';
      } else {
        // Foliage: compare DINOv2 Solanaceous activations & trained crop separator
        const dinoPotatoMax = Math.max(baseLogits38[20], baseLogits38[21], baseLogits38[22]);
        const dinoTomatoIndices = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
        const dinoTomatoMax = Math.max(...dinoTomatoIndices.map(idx => baseLogits38[idx]));

        let cropLogit = 0.0;
        if (this.hasTrainedHead && this.cropWeights) {
          cropLogit = this.dotProduct(this.cropWeights[0], featNorm) + this.cropBiases[0];
        } else {
          cropLogit = dinoTomatoMax >= dinoPotatoMax ? 1.0 : -1.0;
        }

        if (dinoPotatoMax > dinoTomatoMax + 1.0 || cropLogit < -0.4) {
          chosenCrop = 'Potato';
        } else {
          chosenCrop = 'Tomato';
        }
      }
    }

    // 4. Candidate Disease Scores
    const trainedScores = {};
    if (this.hasTrainedHead && this.headWeights) {
      this.trainedClasses.forEach((k, idx) => {
        trainedScores[k] = this.dotProduct(this.headWeights[idx], featNorm) + this.headBiases[idx];
      });
    }

    const candidateScores = {};

    if (chosenCrop === 'Tomato') {
      const tomatoKeyToDino = {
        'Tomato___Bacterial_spot': 28,
        'Tomato___Early_blight': 29,
        'Tomato___Late_blight': 30,
        'Tomato___Leaf_Mold': 31,
        'Tomato___Septoria_leaf_spot': 32,
        'Tomato___Spider_mites Two-spotted_spider_mite': 33,
        'Tomato___Target_Spot': 34,
        'Tomato___Tomato_Yellow_Leaf_Curl_Virus': 35,
        'Tomato___Tomato_mosaic_virus': 36,
        'Tomato___healthy': 37
      };

      for (const [key, dinoIdx] of Object.entries(tomatoKeyToDino)) {
        const tScore = trainedScores[key] || 0.0;
        const dScore = baseLogits38[dinoIdx];
        candidateScores[key] = tScore * 1.5 + dScore * 0.5;
      }

      // Bacterial Speck / Bacterial Spot Morphology Boost
      if (morph.speckCount > 200 && morph.greenPct > 20.0) {
        const speckBoost = Math.min(12.0, (morph.speckCount - 200) * 0.015 + 4.0);
        candidateScores['Tomato___Bacterial_spot'] += speckBoost;
      }

      // Powdery Mildew
      const pmLogit = Math.max(logitsCrop[25], logitsCrop[5], baseLogits38[25], baseLogits38[5]);
      const isPm = (pmLogit > 8.0 && morph.speckCount < 200) || (pmLogit > 3.0 && morph.whiteSporePct > 12.0 && morph.speckCount < 200);
      if (isPm) {
        candidateScores['Tomato___Powdery_mildew'] = pmLogit * 1.5 + 2.0;
      } else {
        candidateScores['Tomato___Powdery_mildew'] = pmLogit - 3.5;
      }

      // Blossom End Rot on fruit
      if (morph.ripeRedPct > 4.0) {
        candidateScores['Tomato___Blossom_end_rot'] = 18.0;
      } else {
        candidateScores['Tomato___Blossom_end_rot'] = (candidateScores['Tomato___Early_blight'] || 0.0) - 4.5;
      }

      const bsScore = candidateScores['Tomato___Bacterial_spot'] || 0.0;
      const lbScore = candidateScores['Tomato___Late_blight'] || 0.0;
      const ylcScore = candidateScores['Tomato___Tomato_Yellow_Leaf_Curl_Virus'] || 0.0;
      const mvScore = candidateScores['Tomato___Tomato_mosaic_virus'] || 0.0;

      candidateScores['Tomato___Bacterial_canker'] = bsScore * 0.75 - 2.5;
      candidateScores['Tomato___Bacterial_wilt'] = lbScore * 0.75 - 2.8;
      candidateScores['Tomato___Anthracnose'] = (candidateScores['Tomato___Target_Spot'] || 0.0) * 0.8 - 2.5;
      candidateScores['Tomato___Fusarium_wilt'] = ylcScore * 0.75 - 2.5;
      candidateScores['Tomato___Verticillium_wilt'] = ylcScore * 0.7 - 2.8;
      candidateScores['Tomato___Gray_mold'] = (candidateScores['Tomato___Leaf_Mold'] || 0.0) * 0.8 - 2.5;
      candidateScores['Tomato___Tomato_spotted_wilt_virus'] = mvScore * 0.8 - 2.5;

    } else {
      // Potato Diseases
      const potatoKeyToDino = {
        'Potato___Early_blight': 20,
        'Potato___Late_blight': 21,
        'Potato___healthy': 22
      };

      for (const [key, dinoIdx] of Object.entries(potatoKeyToDino)) {
        const tScore = trainedScores[key] || 0.0;
        const dScore = baseLogits38[dinoIdx];
        candidateScores[key] = tScore * 1.5 + dScore * 0.5;
      }

      const ebScore = candidateScores['Potato___Early_blight'] || 0.0;
      const lbScore = candidateScores['Potato___Late_blight'] || 0.0;
      const hScore = candidateScores['Potato___healthy'] || 0.0;

      const isTuber = (morph.greenPct < 10.0) || (morph.tuberSkinPct > 35.0) || (morph.salmonPinkPct > 8.0);

      if (isTuber) {
        if (morph.salmonPinkPct > 8.0) {
          candidateScores['Potato___Pink_rot'] = Math.max(lbScore, ebScore) + 6.0 + (morph.salmonPinkPct - 8.0) * 0.2;
          candidateScores['Potato___Late_blight'] = lbScore * 0.3;
          candidateScores['Potato___Early_blight'] = ebScore * 0.3;
        } else {
          candidateScores['Potato___Pink_rot'] = 2.0;
        }

        candidateScores['Potato___Common_scab'] = Math.max(ebScore * 0.9, 3.0);
        candidateScores['Potato___Black_scurf'] = Math.max(ebScore * 0.85, 2.5);
        candidateScores['Potato___Powdery_scab'] = Math.max(ebScore * 0.8, 2.0);
        candidateScores['Potato___Dry_rot'] = Math.max(ebScore * 0.8, 2.2);
        candidateScores['Potato___Silver_scurf'] = Math.max(hScore * 0.8, 2.0);
        candidateScores['Potato___Skin_spot'] = 2.0;
        candidateScores['Potato___Gangrene'] = 2.0;
        candidateScores['Potato___Watery_wound_rot'] = 2.0;

        candidateScores['Potato___Blackleg'] = lbScore * 0.5 - 3.0;
        candidateScores['Potato___Brown_rot'] = lbScore * 0.5 - 3.0;
        candidateScores['Potato___Ring_rot'] = lbScore * 0.5 - 3.0;
        candidateScores['Potato___Black_dot'] = ebScore * 0.5 - 3.0;
        candidateScores['Potato___PLRV'] = -5.0;
        candidateScores['Potato___PVY'] = -5.0;
        candidateScores['Potato___Mosaic_virus'] = -5.0;
        candidateScores['Potato___PMTV'] = ebScore * 0.5 - 3.0;
        candidateScores['Potato___TRV'] = ebScore * 0.5 - 3.0;
        candidateScores['Potato___Verticillium_wilt'] = -5.0;
        candidateScores['Potato___Violet_root_rot'] = -5.0;
        candidateScores['Potato___Wart_disease'] = -5.0;
      } else {
        candidateScores['Potato___Pink_rot'] = lbScore - 4.5;
        candidateScores['Potato___Common_scab'] = ebScore - 4.0;
        candidateScores['Potato___Black_scurf'] = ebScore - 4.2;
        candidateScores['Potato___Powdery_scab'] = ebScore - 4.5;
        candidateScores['Potato___Dry_rot'] = ebScore - 4.0;
        candidateScores['Potato___Silver_scurf'] = hScore - 4.0;
        candidateScores['Potato___Skin_spot'] = ebScore - 4.5;
        candidateScores['Potato___Gangrene'] = ebScore - 4.5;
        candidateScores['Potato___Watery_wound_rot'] = lbScore - 4.5;

        candidateScores['Potato___Blackleg'] = lbScore * 0.85 - 2.5;
        candidateScores['Potato___Brown_rot'] = lbScore * 0.8 - 2.5;
        candidateScores['Potato___Ring_rot'] = lbScore * 0.75 - 2.8;
        candidateScores['Potato___Black_dot'] = ebScore * 0.8 - 2.5;
        candidateScores['Potato___PLRV'] = ebScore * 0.7 - 2.5;
        candidateScores['Potato___PVY'] = ebScore * 0.75 - 2.5;
        candidateScores['Potato___Mosaic_virus'] = hScore * 0.7 - 2.5;
        candidateScores['Potato___PMTV'] = ebScore * 0.65 - 3.0;
        candidateScores['Potato___TRV'] = ebScore * 0.65 - 3.0;
        candidateScores['Potato___Verticillium_wilt'] = ebScore * 0.7 - 2.8;
        candidateScores['Potato___Violet_root_rot'] = ebScore * 0.5 - 4.0;
        candidateScores['Potato___Wart_disease'] = ebScore * 0.4 - 4.5;
      }
    }

    // 5. Softmax Normalization (Temperature T = 1.5)
    const keys = Object.keys(candidateScores);
    const rawScores = keys.map(k => candidateScores[k]);
    const maxScore = Math.max(...rawScores);
    const temp = 1.5;

    const expScores = rawScores.map(s => Math.exp((s - maxScore) / temp));
    const sumExp = expScores.reduce((acc, v) => acc + v, 0);
    const probs = expScores.map(v => v / sumExp);

    // Sorted descending
    const sortedIndices = keys.map((_, i) => i).sort((a, b) => probs[b] - probs[a]);
    const topKey = keys[sortedIndices[0]];
    const topConf = Math.round(probs[sortedIndices[0]] * 10000) / 100;

    const topPredictionsList = sortedIndices.slice(0, 5).map(i => {
      const k = keys[i];
      const dInfo = DISEASE_KNOWLEDGE_BASE[k] || {};
      const cName = dInfo.crop || chosenCrop;
      const disName = dInfo.name || k;
      const conf = Math.round(probs[i] * 10000) / 100;
      return {
        class_index: i,
        crop: cName,
        label: `${cName} - ${disName}`,
        confidence: conf
      };
    });

    const diseaseInfo = DISEASE_KNOWLEDGE_BASE[topKey] || {
      id: topKey.toLowerCase().replace(/___/g, '_'),
      crop: chosenCrop,
      name: topKey.replace(/___/g, ' ').replace(/_/g, ' '),
      hindi_name: topKey,
      pathogen: 'Identified by Kisan Mitra Solanaceous Vision Doctor',
      category: 'Agricultural Condition',
      severity: 'Moderate',
      badge_color: topKey.toLowerCase().includes('healthy') ? '#2e7d32' : '#d84315',
      symptoms: `Visual condition identified on ${chosenCrop} foliage or tuber.`,
      causes: 'Environmental stress, pathogen presence, or agronomic factors.',
      organic_remedies: ['Apply 5% Neem Seed Kernel Extract (NSKE)', 'Ensure optimal soil aeration'],
      chemical_treatments: [{ chemical: 'Mancozeb 75% WP @ 2.5g/L', dosage: '2.5g/L', interval: '7-10 days' }],
      preventive_measures: ['Practice crop rotation with non-solanaceous crops', 'Avoid waterlogging'],
      fertilizer_recommendation: 'Provide balanced 19:19:19 foliar spray.',
      voice_summary: `Detected condition on ${chosenCrop}.`
    };

    // 6. Spectral & Nutrient Deficiency Diagnostics
    const suspectedDeficiencies = [];
    if (morph.yellowPct > 22.0) {
      suspectedDeficiencies.push({
        nutrient: 'Nitrogen (N) or Iron (Fe)',
        confidence: Math.min(95.0, Math.round(morph.yellowPct * 2.2 * 10) / 10),
        reason: `Significant chlorosis detected (${morph.yellowPct.toFixed(1)}% yellow leaf surface). In older lower leaves this indicates Nitrogen deficit; in young terminal leaves it indicates Iron chlorosis.`,
        guide: NUTRIENT_DEFICIENCY_GUIDE.nitrogen_deficiency
      });
    }
    if (morph.brownPct > 12.0) {
      suspectedDeficiencies.push({
        nutrient: 'Potassium (K) Marginal Scorch',
        confidence: Math.min(92.0, Math.round(morph.brownPct * 3.5 * 10) / 10),
        reason: `Necrotic brown spotting detected (${morph.brownPct.toFixed(1)}% necrotic surface). Correlates with Potassium deficiency or Alternaria blights.`,
        guide: NUTRIENT_DEFICIENCY_GUIDE.potassium_deficiency
      });
    }

    const latencyMs = Date.now() - startTime;

    // Construct PhD-level pathological insight
    const phdPathology = {
      taxonomy: diseaseInfo.taxonomy || `${diseaseInfo.category} — ${diseaseInfo.pathogen}`,
      epidemiology: diseaseInfo.epidemiology || (
        diseaseInfo.category.includes('Fungal') || diseaseInfo.category.includes('Oomycete')
          ? 'Optimal: 18-28°C with RH > 85%. Spores spread by wind currents, rain splash, and dew condensation. Incubation period: 3-7 days.'
          : diseaseInfo.category.includes('Bacterial')
          ? 'Optimal: 25-32°C with high soil moisture and driving rainfall. Enters via stomata, hydathodes, and root mechanical wounds. Incubation: 2-5 days.'
          : diseaseInfo.category.includes('Viral')
          ? 'Vector-mediated transmission (Whitefly Bemisia tabaci or Aphid Myzus persicae). Systemic vascular translocation; non-curative once vascular bundle is colonized.'
          : 'Physiological disorder induced by soil moisture fluctuation, transpiration stress, or root nutrient uptake lockup.'
      ),
      differential_diagnosis: diseaseInfo.differential_diagnosis || (
        topKey.includes('Early_blight')
          ? 'Diagnostic Key: Concentric target-board rings restricted by major leaf veins, starting on older bottom leaves with yellow chlorotic halos. Distinguished from Septoria by lesion diameter (>5mm vs 2mm) and absence of central ash-grey pycnidia.'
          : topKey.includes('Late_blight')
          ? 'Diagnostic Key: Rapidly expanding water-soaked necrotic lesions turning dark brown with white downy sporangiophores visible on abaxial (underside) leaf surface under high humidity. Stems exhibit dark brown greasy girdling lesions.'
          : topKey.includes('Bacterial_spot')
          ? 'Diagnostic Key: Small (1-3mm) dark brown to black punctate specks with vivid translucent yellow halos. Leaves look peppered; infected fruit exhibits raised scabby brown lesions.'
          : topKey.includes('Septoria')
          ? 'Diagnostic Key: Numerous small (2-4mm) circular spots with dark brown margins and distinct ash-white/grey centers studded with minute black fruiting bodies (pycnidia).'
          : topKey.includes('Powdery_mildew')
          ? 'Diagnostic Key: Superficial white powdery talc-like mycelial patches on upper and lower surfaces; does not require free water or rain to germinate; spores disperse through dry wind.'
          : topKey.includes('Pink_rot')
          ? 'Diagnostic Key: Freshly cut potato tuber tissue turns distinctive salmon-pink within 15-20 minutes of atmospheric oxygen exposure, gradually darkening to brown-black. Texture remains spongy/rubbery with faint vinegary aroma.'
          : `Distinguishing pathology: ${diseaseInfo.symptoms.slice(0, 110)}.`
      ),
      knapsack_15l_recipe: diseaseInfo.knapsack_recipe || (
        diseaseInfo.chemical_treatments && diseaseInfo.chemical_treatments.length > 0
          ? `Standard 15L Knapsack Sprayer Pump: Measure 35-40g of ${diseaseInfo.chemical_treatments[0].chemical.split(' ')[0]} in a bucket with 2L water to make a slurry. Pour into 15L tank and fill to brim. Add 10ml non-ionic wetting agent (sticker) for leaf retention. Spray early morning (7-10 AM) or late evening.`
          : 'Standard 15L Knapsack Sprayer: Mix 60ml Neem Oil (10,000 ppm) with 15ml mild liquid soap in 15 Liters lukewarm water. Agitate vigorously and spray canopy evenly.'
      ),
      icar_recommendation: diseaseInfo.icar_recommendation || 'ICAR & State Agricultural Universities IPM: 3-year non-solanaceous crop rotation, certified disease-free seed/tubers, and prophylactic bio-fungicide treatment.'
    };

    return {
      status: 'success',
      crop: chosenCrop,
      prediction: {
        disease_id: diseaseInfo.id,
        crop: diseaseInfo.crop || chosenCrop,
        name: diseaseInfo.name,
        hindi_name: diseaseInfo.hindi_name,
        confidence_percent: topConf,
        category: diseaseInfo.category,
        severity: diseaseInfo.severity,
        badge_color: diseaseInfo.badge_color,
        pathogen: diseaseInfo.pathogen,
        voice_summary: diseaseInfo.voice_summary
      },
      top_predictions: topPredictionsList,
      phd_pathology: phdPathology,
      symptoms_and_causes: {
        symptoms: diseaseInfo.symptoms,
        causes: diseaseInfo.causes
      },
      treatment_plan: {
        organic_remedies: diseaseInfo.organic_remedies || [],
        chemical_treatments: diseaseInfo.chemical_treatments || [],
        preventive_measures: diseaseInfo.preventive_measures || [],
        fertilizer_recommendation: diseaseInfo.fertilizer_recommendation || ''
      },
      spectral_deficiency_analysis: {
        green_ratio_pct: Math.round(morph.greenPct * 10) / 10,
        yellow_chlorosis_pct: Math.round(morph.yellowPct * 10) / 10,
        brown_necrosis_pct: Math.round(morph.brownPct * 10) / 10,
        suspected_deficiencies: suspectedDeficiencies
      },
      metadata: {
        inference_time_ms: latencyMs,
        model_engine: 'Kisan Mitra Tomato & Potato AI Doctor (Pure JavaScript / ONNX Runtime Node)',
        vegetation_ratio: Math.round(morph.vegetationRatio * 10) / 10,
        tuber_ratio: Math.round(morph.tuberSkinPct * 10) / 10,
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
  }
}

const engine = new CropDiagnosisEngine();
module.exports = {
  CropDiagnosisEngine,
  engine
};
