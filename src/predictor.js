/**
 * Kisan Mitra AI - Dedicated Tomato & Potato Vision Doctor (Pure JavaScript)
 * Powered by Meta DINOv2 Vision Transformer (ViT-B/14, 768-dim) + Multi-Scale TTA
 * + Adaptive Extreme-Condition Lighting Recovery + Full 43-Condition Morphometry.
 * Exclusively focused on Tomato (19 conditions) and Potato (24 conditions).
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ort = require('onnxruntime-node');
const { DISEASE_KNOWLEDGE_BASE, NUTRIENT_DEFICIENCY_GUIDE } = require('./knowledgeBase');

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
        this.cropWeights = data.crop_weights;      // [1, 768]
        this.cropBiases = data.crop_biases;        // [1]
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

  /**
   * High-speed 300x300 colorimetry, extreme lighting telemetry, spatial lesion zoning,
   * and BFS punctate speck segmentation. Respects EXIF rotation automatically.
   */
  async analyzeColorAndMorphology(imageBuffer) {
    const targetW = 300;
    const targetH = 300;
    const { data: pixels } = await sharp(imageBuffer)
      .rotate() // Auto-apply smartphone EXIF orientation
      .resize(targetW, targetH, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const total = targetW * targetH;
    let greenCount = 0;
    let deepShadeGreenCount = 0;
    let salmonPinkCount = 0;
    let ripeRedCount = 0;
    let tuberSkinCount = 0;
    let whiteSporeCount = 0;
    let yellowChlorosisCount = 0;
    let brownNecrosisCount = 0;
    let validTissueCount = 0;

    // Extended morphometry for all 43 Solanaceae conditions
    let bottomDarkCount = 0;
    let upperDarkCount = 0;
    let centerCreamCount = 0;
    let centerBrownCount = 0;
    let pitchBlackCount = 0;
    let corkyBrownCount = 0;
    let silverySheenCount = 0;
    let purpleBronzeCount = 0;
    let grayMoldCount = 0;
    let highEdgeCount = 0;

    // Illumination telemetry for extreme conditions (night/shade/fog/glare)
    let lumSum = 0;
    const lumHist = new Uint32Array(256);

    const darkSpotGrid = new Uint8Array(total);
    const centerStart = 75;
    const centerEnd = 225;
    const centerArea = (centerEnd - centerStart) * (centerEnd - centerStart);

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const idx = (y * targetW + x) * 3;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        lumSum += lum;
        lumHist[Math.min(255, Math.max(0, lum))]++;

        const [h, s, v] = this.rgbToHsv(r, g, b);
        const exg = 2.0 * g - r - b;

        // 1. Standard + Low-light Shade Green Foliage
        const isGreen = (h >= 28 && h <= 88 && s >= 30 && v >= 30);
        const isShadeGreen = (h >= 26 && h <= 94 && s >= 22 && v >= 16 && v < 30 && g > r);
        if (isGreen) greenCount++;
        if (isShadeGreen) deepShadeGreenCount++;

        // 2. Chlorosis & Necrosis
        const isYellow = (h >= 20 && h <= 35 && s >= 50 && v >= 45);
        const isBrown = (h >= 5 && h <= 20 && s >= 35 && v >= 15 && v <= 185);
        if (isYellow) yellowChlorosisCount++;
        if (isBrown) brownNecrosisCount++;

        // 3. Salmon-pink cut tuber flesh (Potato Pink Rot)
        const isSalmonPink = (r > 90 && r > g + 10 && r > b + 10 && r <= 1.8 * g && s >= 40 && s <= 135);
        if (isSalmonPink) salmonPinkCount++;

        // 4. Ripe red tomato fruit
        const isRipeRed = (r > 105 && r > 1.75 * g && s > 125);
        if (isRipeRed) ripeRedCount++;

        // 5. Potato tuber skin / cream flesh
        const isTuberSkin = (h >= 8 && h <= 36 && s >= 18 && s <= 185 && v >= 35 && v <= 245);
        if (isTuberSkin) tuberSkinCount++;

        // 6. White spore powder / mold tuft
        const isWhiteSpore = (s <= 45 && v >= 165);
        if (isWhiteSpore) whiteSporeCount++;

        // 7. Additional Pathological Signatures
        if (v < 45 && s < 75) pitchBlackCount++; // Black Scurf / Blackleg ink rot
        if (h >= 8 && h <= 24 && s >= 55 && s <= 165 && v >= 55 && v <= 165) corkyBrownCount++; // Common Scab / Dry Rot
        if (s <= 28 && v >= 135 && v <= 215 && r >= b - 8) silverySheenCount++; // Silver Scurf
        if (((h >= 135 && h <= 178) || (r > g + 12 && b > g + 8)) && s >= 35 && v >= 35 && v <= 170) purpleBronzeCount++; // TSWV / Violet Root Rot
        if (s <= 36 && v >= 85 && v <= 175) grayMoldCount++; // Gray Mold (Botrytis)

        // Spatial fruit/stem lesion distribution
        if (v < 65 && s >= 20) {
          if (y >= 200) bottomDarkCount++;
          else if (y >= 40 && y < 180) upperDarkCount++;
        }

        // Interior cut tuber flesh vs necrotic interior arcs
        if (x >= centerStart && x < centerEnd && y >= centerStart && y < centerEnd) {
          if (s <= 48 && v >= 155 && r >= 150 && g >= 145) centerCreamCount++;
          if (isBrown) centerBrownCount++;
        }

        // Local edge contrast cue for rough corky scabs/warts
        if (x > 0 && y > 0) {
          const prevIdx = (y * targetW + (x - 1)) * 3;
          const grad = Math.abs(r - pixels[prevIdx]) + Math.abs(g - pixels[prevIdx + 1]) + Math.abs(b - pixels[prevIdx + 2]);
          if (grad > 65) highEdgeCount++;
        }

        // 8. Dark necrotic speck grid (Bacterial speck/spot)
        if (v < 75 && s >= 30) {
          darkSpotGrid[y * targetW + x] = 1;
        }

        // Botanical organic tissue validation
        if (isGreen || isShadeGreen || exg > 0 || isYellow || isBrown || isTuberSkin || isSalmonPink || isRipeRed) {
          validTissueCount++;
        }
      }
    }

    // Luminance quantiles (5th & 95th percentile) for extreme lighting detection
    let p5 = 0;
    let p95 = 255;
    let cum = 0;
    for (let i = 0; i < 256; i++) {
      cum += lumHist[i];
      if (p5 === 0 && cum >= total * 0.05) p5 = i;
      if (cum >= total * 0.95) {
        p95 = i;
        break;
      }
    }
    const meanLum = lumSum / total;
    const contrastSpan = p95 - p5;
    const isLowLight = meanLum < 62;
    const isOverexposed = meanLum > 210;
    const isLowContrastFog = (contrastSpan < 58 && greenCount / total < 0.45);
    const isExtremeCondition = isLowLight || isOverexposed || isLowContrastFog;

    // Connected Component Analysis on Dark Spot Grid for Speck Counting
    let speckCount = 0;
    let tinyPimpleCount = 0;
    const visited = new Uint8Array(total);
    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const pIdx = y * targetW + x;
        if (darkSpotGrid[pIdx] === 1 && visited[pIdx] === 0) {
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
          if (area >= 6 && area <= 120) speckCount++;
          if (area >= 4 && area <= 28) tinyPimpleCount++;
        }
      }
    }

    return {
      vegetationRatio: (validTissueCount / total) * 100,
      greenPct: ((greenCount + deepShadeGreenCount) / total) * 100,
      salmonPinkPct: (salmonPinkCount / total) * 100,
      ripeRedPct: (ripeRedCount / total) * 100,
      tuberSkinPct: (tuberSkinCount / total) * 100,
      whiteSporePct: (whiteSporeCount / total) * 100,
      yellowPct: (yellowChlorosisCount / total) * 100,
      brownPct: (brownNecrosisCount / total) * 100,
      bottomDarkPct: (bottomDarkCount / (total / 3)) * 100,
      upperDarkPct: (upperDarkCount / (total * 0.47)) * 100,
      centerCreamPct: (centerCreamCount / centerArea) * 100,
      centerBrownPct: (centerBrownCount / centerArea) * 100,
      pitchBlackPct: (pitchBlackCount / total) * 100,
      corkyBrownPct: (corkyBrownCount / total) * 100,
      silverySheenPct: (silverySheenCount / total) * 100,
      purpleBronzePct: (purpleBronzeCount / total) * 100,
      grayMoldPct: (grayMoldCount / total) * 100,
      highEdgePct: (highEdgeCount / total) * 100,
      speckCount,
      tinyPimpleCount,
      lighting: {
        meanLum: Math.round(meanLum),
        contrastSpan,
        isLowLight,
        isOverexposed,
        isLowContrastFog,
        isExtremeCondition
      }
    };
  }

  rgbBufferToFloatTensor(rawBuf) {
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];
    const data = new Float32Array(1 * 3 * 224 * 224);
    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const i = (y * 224 + x) * 3;
        const pos = y * 224 + x;
        data[pos] = (rawBuf[i] / 255.0 - mean[0]) / std[0];
        data[50176 + pos] = (rawBuf[i + 1] / 255.0 - mean[1]) / std[1];
        data[100352 + pos] = (rawBuf[i + 2] / 255.0 - mean[2]) / std[2];
      }
    }
    return new ort.Tensor('float32', data, [1, 3, 224, 224]);
  }

  async preprocessTensors(imageBuffer, useExtremeEnhancement = false) {
    // Always normalize EXIF orientation first via .rotate()
    const baseImg = sharp(imageBuffer).rotate();
    const meta = await baseImg.metadata();
    const w = meta.width || 224;
    const h = meta.height || 224;

    // Scale A: Full View (224x224 bicubic)
    const rawFull = await sharp(imageBuffer)
      .rotate()
      .resize(224, 224, { fit: 'fill', kernel: 'cubic' })
      .removeAlpha()
      .raw()
      .toBuffer();

    // Scale B: Center Crop (224x224 from 256 shortest edge)
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
      .rotate()
      .resize(newW, newH, { kernel: 'cubic' })
      .extract({ left, top, width: 224, height: 224 })
      .removeAlpha()
      .raw()
      .toBuffer();

    const tensors = {
      tensorFull: this.rgbBufferToFloatTensor(rawFull),
      tensorCrop: this.rgbBufferToFloatTensor(rawCrop),
      tensorEnhanced: null
    };

    // Scale C: Contrast & Illumination Normalized + Mirror View for Extreme Field Conditions
    if (useExtremeEnhancement) {
      const rawEnhanced = await sharp(imageBuffer)
        .rotate()
        .normalise() // Dynamic histogram stretch fixes dark shade, fog haze, and glare washout
        .flop()      // Horizontal TTA symmetry boost
        .resize(newW, newH, { kernel: 'cubic' })
        .extract({ left, top, width: 224, height: 224 })
        .removeAlpha()
        .raw()
        .toBuffer();
      tensors.tensorEnhanced = this.rgbBufferToFloatTensor(rawEnhanced);
    }

    return tensors;
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

    // 1. Colorimetry, Extreme Lighting Telemetry & Morphology
    const morph = await this.analyzeColorAndMorphology(imageBuffer);
    const extremeActive = morph.lighting.isExtremeCondition;

    // Reject outright empty/non-plant frames (< 1.5%), check DINOv2 rescue if borderline (1.5%..5.5%)
    const buildUnclearResponse = () => ({
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
        organic_remedies: ['Ensure the leaf, stem, or tuber fills the frame cleanly.'],
        chemical_treatments: [],
        preventive_measures: ['Align the affected crop area clearly inside the frame.'],
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
    });

    if (morph.vegetationRatio < 1.5 && morph.whiteSporePct < 15.0) {
      return buildUnclearResponse();
    }

    // 2. Multi-Scale DINOv2 Feature Extraction (with Scale C adaptive boost for extreme conditions)
    const { tensorFull, tensorCrop, tensorEnhanced } = await this.preprocessTensors(imageBuffer, extremeActive);
    const inputName = this.session.inputNames[0];

    const outFull = await this.session.run({ [inputName]: tensorFull });
    const outCrop = await this.session.run({ [inputName]: tensorCrop });

    const logitsFull = outFull[this.session.outputNames[0]].data;
    const featFull = outFull[this.session.outputNames[1]].data;
    const logitsCrop = outCrop[this.session.outputNames[0]].data;
    const featCrop = outCrop[this.session.outputNames[1]].data;

    let logitsEnh = null;
    let featEnh = null;
    if (tensorEnhanced) {
      const outEnh = await this.session.run({ [inputName]: tensorEnhanced });
      logitsEnh = outEnh[this.session.outputNames[0]].data;
      featEnh = outEnh[this.session.outputNames[1]].data;
    }

    const scaleWeightMain = tensorEnhanced ? 0.40 : 0.50;
    const scaleWeightEnh = tensorEnhanced ? 0.20 : 0.0;

    // Multi-scale normalized embedding (768-dim)
    const featNorm = new Float32Array(768);
    let normSq = 0;
    for (let i = 0; i < 768; i++) {
      const v = featFull[i] * scaleWeightMain + featCrop[i] * scaleWeightMain + (featEnh ? featEnh[i] * scaleWeightEnh : 0);
      featNorm[i] = v;
      normSq += v * v;
    }
    const norm = Math.sqrt(normSq) + 1e-7;
    for (let i = 0; i < 768; i++) {
      featNorm[i] /= norm;
    }

    const baseLogits38 = new Float32Array(38);
    for (let i = 0; i < 38; i++) {
      baseLogits38[i] = logitsFull[i] * scaleWeightMain + logitsCrop[i] * scaleWeightMain + (logitsEnh ? logitsEnh[i] * scaleWeightEnh : 0);
    }

    // Neural validation check for dim/borderline uploads
    const dinoPotatoMax = Math.max(baseLogits38[20], baseLogits38[21], baseLogits38[22]);
    const dinoTomatoIndices = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
    const dinoTomatoMax = Math.max(...dinoTomatoIndices.map(idx => baseLogits38[idx]));
    const maxPlantActivation = Math.max(dinoPotatoMax, dinoTomatoMax);

    if (morph.vegetationRatio < 5.0 && maxPlantActivation < 3.0) {
      return buildUnclearResponse();
    }

    // 3. Crop Determination (Tomato vs Potato)
    let chosenCrop = 'Tomato';
    const cropFilterNorm = (cropFilter || 'auto').trim().toLowerCase();
    if (['tomato', 'टमाटर'].includes(cropFilterNorm)) {
      chosenCrop = 'Tomato';
    } else if (['potato', 'आलू'].includes(cropFilterNorm)) {
      chosenCrop = 'Potato';
    } else {
      const isHarvestedTuber = (morph.greenPct < 10.0) && (morph.salmonPinkPct > 7.5 || (morph.tuberSkinPct > 10.0 && morph.ripeRedPct < 4.0) || morph.centerCreamPct > 15.0);
      const isTomatoFruit = (morph.greenPct < 10.0) && (morph.ripeRedPct > 4.0 && morph.ripeRedPct > morph.salmonPinkPct);

      if (isTomatoFruit) {
        chosenCrop = 'Tomato';
      } else if (isHarvestedTuber) {
        chosenCrop = 'Potato';
      } else {
        let cropLogit = 0.0;
        if (this.hasTrainedHead && this.cropWeights) {
          cropLogit = this.dotProduct(this.cropWeights[0], featNorm) + this.cropBiases[0];
        } else {
          cropLogit = dinoTomatoMax >= dinoPotatoMax ? 1.0 : -1.0;
        }
        chosenCrop = (dinoPotatoMax > dinoTomatoMax + 1.0 || cropLogit < -0.4) ? 'Potato' : 'Tomato';
      }
    }

    // 4. Full 43-Disease Candidate Scoring Engine
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

      // Bacterial Speck / Spot Punctate Morphology Boost
      if (morph.speckCount > 200 && morph.greenPct > 20.0) {
        const speckBoost = Math.min(12.0, (morph.speckCount - 200) * 0.015 + 4.0);
        candidateScores['Tomato___Bacterial_spot'] += speckBoost;
      }

      // Powdery Mildew (Fungal spore dust detection)
      const pmLogit = Math.max(logitsCrop[25], logitsCrop[5], baseLogits38[25], baseLogits38[5]);
      const isPm = (pmLogit > 8.0 && morph.speckCount < 200) || (pmLogit > 3.0 && morph.whiteSporePct > 12.0 && morph.speckCount < 200);
      candidateScores['Tomato___Powdery_mildew'] = isPm ? (pmLogit * 1.5 + 2.0) : (pmLogit - 3.5);

      const bsScore = candidateScores['Tomato___Bacterial_spot'] || 0.0;
      const lbScore = candidateScores['Tomato___Late_blight'] || 0.0;
      const ylcScore = candidateScores['Tomato___Tomato_Yellow_Leaf_Curl_Virus'] || 0.0;
      const mvScore = candidateScores['Tomato___Tomato_mosaic_virus'] || 0.0;
      const tsScore = candidateScores['Tomato___Target_Spot'] || 0.0;
      const lmScore = candidateScores['Tomato___Leaf_Mold'] || 0.0;
      const maxFoliar = Math.max(...Object.values(candidateScores));
      const trainedUncertain = maxFoliar < 3.5;

      // Fruit Conditions (Ripe/Ripening Tomato Fruits)
      const isFruitCloseUp = morph.ripeRedPct > 5.0 && morph.greenPct < 15.0;
      if (isFruitCloseUp) {
        if (morph.bottomDarkPct > morph.upperDarkPct * 1.45 && morph.bottomDarkPct > 5.0) {
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 12.0;
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 3.0;
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 1.0;
        } else if (morph.upperDarkPct > 4.0 || morph.corkyBrownPct > 5.0) {
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 11.0;
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 2.0;
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 1.0;
        } else if (morph.speckCount > 15 && morph.whiteSporePct > 3.0) {
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 10.0;
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 2.0;
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 1.0;
        } else {
          candidateScores['Tomato___Blossom_end_rot'] = 18.0;
          candidateScores['Tomato___Anthracnose'] = 10.0;
          candidateScores['Tomato___Bacterial_canker'] = 6.0;
        }
      } else {
        candidateScores['Tomato___Blossom_end_rot'] = maxFoliar - 7.5;
        candidateScores['Tomato___Anthracnose'] = maxFoliar - 6.5;
        candidateScores['Tomato___Bacterial_canker'] = (trainedUncertain && morph.speckCount < 45 && morph.brownPct > 18.0 && morph.highEdgePct > 18.0)
          ? (bsScore + 2.5)
          : (maxFoliar - 6.5);
      }

      // Secondary Foliar & Vascular Conditions (Engaged cleanly when trained foliage classes are uncertain)
      candidateScores['Tomato___Gray_mold'] = (trainedUncertain && morph.grayMoldPct > 22.0 && morph.brownPct > 8.0 && morph.speckCount < 140)
        ? (lmScore + 3.0)
        : (maxFoliar - 6.5);

      candidateScores['Tomato___Tomato_spotted_wilt_virus'] = (morph.purpleBronzePct > 12.0 && morph.greenPct > 15.0 && maxFoliar < 5.0)
        ? (Math.max(mvScore, ylcScore) + (morph.purpleBronzePct - 10.0) * 0.5)
        : (maxFoliar - 6.5);

      const isStrongYellowWilt = (trainedUncertain && morph.yellowPct > 36.0 && morph.greenPct > 15.0 && morph.speckCount < 60);
      candidateScores['Tomato___Fusarium_wilt'] = isStrongYellowWilt ? (maxFoliar + 3.5) : (maxFoliar - 6.5);
      candidateScores['Tomato___Verticillium_wilt'] = (isStrongYellowWilt && morph.brownPct > 10.0) ? (maxFoliar + 2.5) : (maxFoliar - 6.8);

      candidateScores['Tomato___Bacterial_wilt'] = (trainedUncertain && morph.greenPct > 45.0 && morph.yellowPct < 8.0 && morph.brownPct < 5.0)
        ? (lbScore + 2.5)
        : (maxFoliar - 6.8);

    } else {
      // POTATO DISEASES (24 Total Conditions)
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
      const maxFoliarPot = Math.max(ebScore, lbScore, hScore);

      const isTuber = (morph.greenPct < 10.0) || (morph.tuberSkinPct > 38.0) || (morph.salmonPinkPct > 7.5) || (morph.centerCreamPct > 18.0);

      if (isTuber) {
        candidateScores['Potato___Early_blight'] = ebScore * 0.25;
        candidateScores['Potato___Late_blight'] = lbScore * 0.25;
        candidateScores['Potato___healthy'] = (morph.brownPct < 3.5 && morph.pitchBlackPct < 2.5 && morph.salmonPinkPct < 4.0 && morph.corkyBrownPct < 4.5 && morph.whiteSporePct < 5.0)
          ? Math.max(hScore, 9.5)
          : (hScore * 0.25);

        candidateScores['Potato___Pink_rot'] = (morph.salmonPinkPct > 7.5)
          ? Math.max(maxFoliarPot, 6.0) + 8.0 + (morph.salmonPinkPct - 7.5) * 0.35
          : -3.0;

        if (morph.centerCreamPct > 22.0 && morph.centerBrownPct > 5.0 && morph.salmonPinkPct < 6.0) {
          candidateScores['Potato___PMTV'] = 9.0 + morph.centerBrownPct * 0.2;
          candidateScores['Potato___TRV'] = 8.2 + morph.centerBrownPct * 0.15;
          candidateScores['Potato___Brown_rot'] = 7.5;
          candidateScores['Potato___Ring_rot'] = 7.0;
        } else {
          candidateScores['Potato___PMTV'] = -3.0;
          candidateScores['Potato___TRV'] = -3.2;
          candidateScores['Potato___Brown_rot'] = -2.8;
          candidateScores['Potato___Ring_rot'] = -3.0;
        }

        candidateScores['Potato___Watery_wound_rot'] = (morph.centerCreamPct > 12.0 && morph.grayMoldPct > 18.0 && morph.salmonPinkPct < 6.0) ? 9.2 : -3.0;
        candidateScores['Potato___Black_scurf'] = (morph.pitchBlackPct > 6.0 && morph.salmonPinkPct < 6.0) ? (8.5 + morph.pitchBlackPct * 0.35) : -2.5;
        candidateScores['Potato___Common_scab'] = (morph.corkyBrownPct > 10.0 && morph.highEdgePct > 11.0 && morph.salmonPinkPct < 6.0) ? (8.0 + morph.corkyBrownPct * 0.30) : -2.0;
        candidateScores['Potato___Powdery_scab'] = (morph.corkyBrownPct > 8.5 && morph.brownPct > 10.0 && morph.tinyPimpleCount > 25) ? (8.2 + morph.corkyBrownPct * 0.25) : -2.5;
        candidateScores['Potato___Dry_rot'] = (morph.whiteSporePct > 7.0 && morph.brownPct > 9.0) ? (8.8 + morph.whiteSporePct * 0.25) : -2.4;
        candidateScores['Potato___Gangrene'] = (morph.brownPct > 14.0 && morph.pitchBlackPct > 5.0 && morph.whiteSporePct < 5.0) ? 8.0 : -2.8;
        candidateScores['Potato___Silver_scurf'] = (morph.silverySheenPct > 16.0 && morph.brownPct < 5.0 && morph.pitchBlackPct < 3.0) ? (8.6 + morph.silverySheenPct * 0.2) : -2.8;
        candidateScores['Potato___Skin_spot'] = (morph.tinyPimpleCount > 35 && morph.brownPct < 10.0) ? 7.8 : -3.2;
        candidateScores['Potato___Black_dot'] = (morph.silverySheenPct > 10.0 && morph.tinyPimpleCount > 25) ? 7.5 : -3.2;
        candidateScores['Potato___Violet_root_rot'] = (morph.purpleBronzePct > 12.0 && morph.salmonPinkPct < 6.0) ? (9.5 + morph.purpleBronzePct * 0.3) : -4.0;
        candidateScores['Potato___Wart_disease'] = (morph.pitchBlackPct > 15.0 && morph.highEdgePct > 25.0) ? 9.2 : -4.0;

        candidateScores['Potato___Blackleg'] = -3.5;
        candidateScores['Potato___PLRV'] = -6.0;
        candidateScores['Potato___PVY'] = -6.0;
        candidateScores['Potato___Mosaic_virus'] = -6.0;
        candidateScores['Potato___Verticillium_wilt'] = -6.0;

      } else {
        const potUncertain = maxFoliarPot < 3.5;
        candidateScores['Potato___Pink_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Common_scab'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Black_scurf'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Powdery_scab'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Dry_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Silver_scurf'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Skin_spot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Gangrene'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Watery_wound_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Brown_rot'] = maxFoliarPot - 6.5;
        candidateScores['Potato___Ring_rot'] = maxFoliarPot - 6.5;
        candidateScores['Potato___Black_dot'] = maxFoliarPot - 6.5;
        candidateScores['Potato___PMTV'] = maxFoliarPot - 7.0;
        candidateScores['Potato___TRV'] = maxFoliarPot - 7.0;
        candidateScores['Potato___Violet_root_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Wart_disease'] = maxFoliarPot - 7.5;

        candidateScores['Potato___Blackleg'] = (potUncertain && morph.bottomDarkPct > 24.0 && morph.yellowPct > 12.0 && morph.greenPct > 20.0)
          ? (maxFoliarPot + 2.8)
          : (maxFoliarPot - 6.5);

        candidateScores['Potato___PLRV'] = (potUncertain && morph.yellowPct > 24.0 && morph.purpleBronzePct > 5.0 && morph.brownPct < 8.0)
          ? (maxFoliarPot + 2.5)
          : (maxFoliarPot - 6.5);

        candidateScores['Potato___PVY'] = (potUncertain && morph.yellowPct > 18.0 && morph.greenPct > 30.0 && morph.brownPct < 4.5)
          ? (maxFoliarPot + 2.2)
          : (maxFoliarPot - 6.5);
        candidateScores['Potato___Mosaic_virus'] = (potUncertain && morph.yellowPct > 12.0 && morph.greenPct > 45.0 && morph.brownPct < 3.0)
          ? (maxFoliarPot + 1.8)
          : (maxFoliarPot - 6.5);

        candidateScores['Potato___Verticillium_wilt'] = (potUncertain && morph.yellowPct > 28.0 && morph.brownPct > 10.0 && morph.speckCount < 45)
          ? (maxFoliarPot + 2.4)
          : (maxFoliarPot - 6.8);
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
      pathogen: 'Solanaceous Pathogen',
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

    // 7. Bilingual Pathology Insights
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
          : `Distinguishing pathology: ${diseaseInfo.symptoms}`
      ),
      knapsack_15l_recipe: diseaseInfo.knapsack_recipe || (
        diseaseInfo.chemical_treatments && diseaseInfo.chemical_treatments.length > 0
          ? `Standard 15L Knapsack Sprayer Pump: Measure 35-40g of ${diseaseInfo.chemical_treatments[0].chemical.split(' ')[0]} in a bucket with 2L water to make a slurry. Pour into 15L tank and fill to brim. Add 10ml non-ionic wetting agent (sticker) for leaf retention. Spray early morning (7-10 AM) or late evening.`
          : 'Standard 15L Knapsack Sprayer: Mix 60ml Neem Oil (10,000 ppm) with 15ml mild liquid soap in 15 Liters lukewarm water. Agitate vigorously and spray canopy evenly.'
      ),
      icar_recommendation: diseaseInfo.icar_recommendation || 'Follow 3-year non-solanaceous crop rotation, use certified disease-free seed/tubers, and initiate preventive biological sprays early.'
    };

    const chemNameHi = (diseaseInfo.chemical_treatments && diseaseInfo.chemical_treatments[0])
      ? diseaseInfo.chemical_treatments[0].chemical
      : 'नीम का तेल (10,000 ppm)';

    const phdPathologyHi = {
      taxonomy: `${diseaseInfo.category} — ${diseaseInfo.pathogen}`,
      epidemiology: diseaseInfo.category.includes('Fungal') || diseaseInfo.category.includes('Oomycete')
        ? 'अनुकूल मौसम: तापमान 18-28°C तथा सापेक्ष आर्द्रता > 85%। फफूंद के बीजाणु हवा, बारिश की बौछार और सुबह की ओस से फैलते हैं। संक्रमण काल: 3-7 दिन।'
        : diseaseInfo.category.includes('Bacterial')
        ? 'अनुकूल मौसम: 25-32°C तापमान, अधिक नमी व तेज बारिश। जीवाणु पत्तियों के रंध्रों (स्टोमेटा) व जड़ों के घाव से प्रवेश करते हैं। संक्रमण काल: 2-5 दिन।'
        : diseaseInfo.category.includes('Viral')
        ? 'वाहक कीट द्वारा प्रसार: सफेद मक्खी (Bemisia tabaci) या माहू (Aphids) के माध्यम से फैलता है। संवहनी ऊतक में फैलने के बाद इसका सीधा इलाज संभव नहीं, रोकथाम ही सर्वोत्तम उपाय है।'
        : 'पर्यावरणीय एवं पोषण विकार: मिट्टी में नमी के उतार-चढ़ाव, पीएच असंतुलन या जड़ों द्वारा पोषक तत्व न सोख पाने के कारण उत्पन्न।',
      differential_diagnosis: topKey.includes('Early_blight')
        ? 'पहचान कुंजी: पुरानी निचली पत्तियों पर पीले घेरे के साथ गोल छल्लेदार (टारगेट बोर्ड) धब्बे जो मुख्य शिराओं से सीमित रहते हैं। सेप्टोरिया से अंतर: इसके धब्बे बड़े (>5mm) होते हैं और बीच में काले बिंदु नहीं होते।'
        : topKey.includes('Late_blight')
        ? 'पहचान कुंजी: तेजी से फैलने वाले पानी-भीगे काले-भूरे धब्बे; अधिक नमी व कोहरे में पत्ती के निचले हिस्से पर सफेद मखमली फफूंद (स्पोरैंजिया) स्पष्ट दिखाई देती है। तने पर भी चिकने काले घाव बनते हैं।'
        : topKey.includes('Bacterial_spot')
        ? 'पहचान कुंजी: पत्तियों पर 1-3mm छोटे गहरे भूरे-काले धब्बे जिनके चारों ओर स्पष्ट पीला प्रभामंडल (हलो) होता है। फलों पर उभरे हुए खुरदुरे चकत्ते बनते हैं।'
        : topKey.includes('Septoria')
        ? 'पहचान कुंजी: अनगिनत छोटे (2-4mm) गोल धब्बे जिनकी बाहरी किनारी गहरी भूरी व केंद्र राख जैसा सफेद होता है, जिसमें सूक्ष्म काले बिंदु (पाइक्निडिया) दिखते हैं।'
        : topKey.includes('Powdery_mildew')
        ? 'पहचान कुंजी: पत्ती की ऊपरी व निचली सतह पर सफेद टेलकम पाउडर जैसा चूर्ण। इसे फैलने के लिए बारिश या पत्ती पर पानी की बूंदों की जरूरत नहीं होती; सूखी हवा से बीजाणु उड़ते हैं।'
        : topKey.includes('Pink_rot')
        ? 'पहचान कुंजी: आलू को काटने पर हवा के संपर्क में आने के 15-20 मिनट के भीतर गूदा हल्के गुलाबी (साल्मन पिंक) रंग का हो जाता है और बाद में भूरा-काला पड़ जाता है; बनावट स्पंज जैसी व रबड़दार होती है।'
        : `विशिष्ट रोग लक्षण: ${diseaseInfo.hindi_name} — ${diseaseInfo.symptoms}`,
      knapsack_15l_recipe: (diseaseInfo.chemical_treatments && diseaseInfo.chemical_treatments.length > 0)
        ? `मानक 15-लीटर नैपसैक स्प्रेयर पंप विधि: एक बाल्टी में 2 लीटर साफ पानी लेकर ${chemNameHi.split(' ')[0]} की अनुशंसित मात्रा (लगभग 35-40 ग्राम या 15 मिली तरल) का गाढ़ा घोल बनाएं। इसे 15 लीटर पंप टंकी में डालकर पूरा पानी भरें और बेहतर फैलाव के लिए 10ml कृषि स्टीकर मिलाएं। छिड़काव सुबह 7-10 बजे या शाम के समय करें।`
        : 'मानक 15-लीटर स्प्रेयर पंप विधि: 15 लीटर हल्के गुनगुने पानी में 60ml कोल्ड-प्रेस्ड नीम तेल (10,000 ppm) और 15ml तरल साबुन/स्टीकर मिलाकर अच्छी तरह हिलाएं और पत्तियों की दोनों सतहों पर समान छिड़काव करें।',
      icar_recommendation: '3-वर्षीय गैर-सोलेनेसी फसल चक्र (मक्का, दलहन) अपनाएं, प्रमाणित रोगमुक्त बीज/कंद का प्रयोग करें और शुरुआती लक्षण दिखते ही अनुशंसित उपचार करें।'
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
      phd_pathology_hi: phdPathologyHi,
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
        extreme_condition_mode: extremeActive,
        lighting_summary: morph.lighting,
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
