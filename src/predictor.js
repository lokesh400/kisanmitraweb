/**
 * Kisan Mitra AI - Dedicated Tomato & Potato Vision Doctor (Pure JavaScript)
 * Powered by Meta DINOv2 Vision Transformer (ViT-B/14, 768-dim) + Multi-Scale
 * & Adaptive Multi-Orientation TTA + Gray-World Lighting Recovery + OOD Gate
 * + Full 43-Condition Tomato (19) & Potato (24) Morphometry.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ort = require('onnxruntime-node');
const { DISEASE_KNOWLEDGE_BASE, NUTRIENT_DEFICIENCY_GUIDE } = require('./knowledgeBase');

const SOLANACEAE_38_INDICES = [20, 21, 22, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
const POWDERY_MILDEW_38_INDICES = [5, 25];

class CropDiagnosisEngine {
  constructor(modelPath, weightsPath) {
    const rootDir = path.resolve(__dirname, '..');
    this.modelPath = modelPath || path.join(rootDir, 'models', 'dinov2_plant_disease.onnx');
    this.weightsPath = weightsPath || path.join(rootDir, 'models', 'tomato_potato_classifier.json');
    this.session = null;
    this.hasTrainedHead = false;
    this.headWeights = null;
    this.headNormWeights = null;
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
        // Precompute L2-normalized class prototype vectors for cosine OOD verification
        this.headNormWeights = this.headWeights.map(w => {
          let normSq = 0;
          for (let i = 0; i < w.length; i++) normSq += w[i] * w[i];
          const n = Math.sqrt(normSq) + 1e-7;
          return w.map(v => v / n);
        });
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
    return [Math.round(h / 2), Math.round(s * 255), Math.round(v * 255)];
  }

  /**
   * Computes colorimetry, spatial lesion distribution, edge density, and punctate specks
   * on a 300x300 RGB buffer. Reused for both raw pixels and lighting-recovered pixels.
   */
  analyzePixelBuffer(pixels, targetW = 300, targetH = 300, computeSpecks = true) {
    const total = targetW * targetH;
    let greenCount = 0;
    let deepShadeGreenCount = 0;
    let salmonPinkCount = 0;
    let ripeRedCount = 0;
    let tuberSkinCount = 0;
    let whiteSporeCount = 0;
    let yellowChlorosisCount = 0;
    let brownNecrosisCount = 0;
    let validFoliarCount = 0;

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

    let lumSum = 0;
    let satSum = 0;
    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    const lumHist = new Uint32Array(256);

    const darkSpotGrid = computeSpecks ? new Uint8Array(total) : null;
    const centerStart = 75;
    const centerEnd = 225;
    const centerArea = (centerEnd - centerStart) * (centerEnd - centerStart);

    for (let y = 0; y < targetH; y++) {
      for (let x = 0; x < targetW; x++) {
        const idx = (y * targetW + x) * 3;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        rSum += r;
        gSum += g;
        bSum += b;
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        lumSum += lum;
        lumHist[Math.min(255, Math.max(0, lum))]++;

        const [h, s, v] = this.rgbToHsv(r, g, b);
        satSum += s;
        const exg = 2.0 * g - r - b;

        const isGreen = (h >= 28 && h <= 88 && s >= 28 && v >= 28);
        const isShadeGreen = (h >= 26 && h <= 94 && s >= 20 && v >= 14 && v < 28 && g > r);
        if (isGreen) greenCount++;
        if (isShadeGreen) deepShadeGreenCount++;

        const isYellow = (h >= 20 && h <= 35 && s >= 50 && v >= 45);
        const isBrown = (h >= 5 && h <= 20 && s >= 35 && v >= 15 && v <= 185);
        if (isYellow) yellowChlorosisCount++;
        if (isBrown) brownNecrosisCount++;

        const isSalmonPink = (r > 90 && r > g + 10 && r > b + 10 && r <= 1.8 * g && s >= 40 && s <= 135);
        if (isSalmonPink) salmonPinkCount++;

        // Stricter ripe tomato lycopene check so warm-tinted potato tubers do not trigger
        const isRipeRed = (r > 130 && r > 1.95 * g && r > 2.2 * b && s > 135);
        if (isRipeRed) ripeRedCount++;

        const isTuberSkin = (h >= 8 && h <= 36 && s >= 18 && s <= 185 && v >= 35 && v <= 245);
        if (isTuberSkin) tuberSkinCount++;

        const isWhiteSpore = (s <= 45 && v >= 165);
        if (isWhiteSpore) whiteSporeCount++;

        if (v < 45 && s < 75) pitchBlackCount++;
        if (h >= 8 && h <= 24 && s >= 55 && s <= 165 && v >= 55 && v <= 165) corkyBrownCount++;
        if (s <= 28 && v >= 135 && v <= 215 && r >= b - 8) silverySheenCount++;
        if (((h >= 135 && h <= 178) || (r > g + 12 && b > g + 8)) && s >= 35 && v >= 35 && v <= 170) purpleBronzeCount++;
        if (s <= 36 && v >= 85 && v <= 175) grayMoldCount++;

        if (v < 65 && s >= 20) {
          if (y >= 200) bottomDarkCount++;
          else if (y >= 40 && y < 180) upperDarkCount++;
        }

        if (x >= centerStart && x < centerEnd && y >= centerStart && y < centerEnd) {
          if (s <= 48 && v >= 155 && r >= 150 && g >= 145) centerCreamCount++;
          if (isBrown) centerBrownCount++;
        }

        if (x > 0 && y > 0) {
          const prevIdx = (y * targetW + (x - 1)) * 3;
          const grad = Math.abs(r - pixels[prevIdx]) + Math.abs(g - pixels[prevIdx + 1]) + Math.abs(b - pixels[prevIdx + 2]);
          if (grad > 65) highEdgeCount++;
        }

        if (darkSpotGrid && v < 75 && s >= 30) {
          darkSpotGrid[y * targetW + x] = 1;
        }

        // Only count true foliar green / excess-green toward foliage ratio (never warm human skin)
        if (isGreen || isShadeGreen || exg > 12) {
          validFoliarCount++;
        }
      }
    }

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
    const meanSat = satSum / total;
    const rMean = rSum / total;
    const gMean = gSum / total;
    const bMean = bSum / total;
    const contrastSpan = p95 - p5;
    const channelSpread = Math.max(rMean, gMean, bMean) / (Math.min(rMean, gMean, bMean) + 1.0);

    const isLowLight = meanLum < 68;
    const isOverexposed = meanLum > 195 || (p95 >= 244 && meanLum > 160);
    const isLowContrastFog = (contrastSpan < 70 && (greenCount / total) < 0.45) || (p5 > 45 && meanSat < 65);
    const hasColorCast = channelSpread > 1.24;
    const isExtremeCondition = isLowLight || isOverexposed || isLowContrastFog || hasColorCast;

    let speckCount = 0;
    let tinyPimpleCount = 0;
    if (darkSpotGrid) {
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
    }

    return {
      foliarRatio: (validFoliarCount / total) * 100,
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
        p5,
        p95,
        rMean,
        gMean,
        bMean,
        isLowLight,
        isOverexposed,
        isLowContrastFog,
        hasColorCast,
        isExtremeCondition
      }
    };
  }

  /**
   * Soft gray-world white-balance + percentile luminance stretch in pure JS (<2ms).
   * Restores true green/brown/pink pigments under warm sunset, fog washout, or deep shade.
   */
  balanceRawBuffer(pixels, lighting) {
    const out = Buffer.allocUnsafe(pixels.length);
    const { rMean, gMean, bMean, p5, p95, isLowLight } = lighting;
    const channelSpread = Math.max(rMean, gMean, bMean) / (Math.min(rMean, gMean, bMean) + 1.0);
    // Preserve true pigment ratios in dark shade; neutralize only genuine color-cast lighting
    const applyGrayWorld = !isLowLight && channelSpread > 1.35;
    const gray = (rMean + gMean + bMean) / 3.0;
    const clampGain = v => Math.max(0.78, Math.min(1.30, v));
    const rg = applyGrayWorld ? clampGain(gray / (rMean || 1)) : 1.0;
    const gg = applyGrayWorld ? clampGain(gray / (gMean || 1)) : 1.0;
    const bg = applyGrayWorld ? clampGain(gray / (bMean || 1)) : 1.0;

    const stretchLow = Math.max(0, p5 - 4);
    const stretchSpan = Math.max(24, p95 - stretchLow);
    const scale = 255.0 / stretchSpan;

    for (let i = 0; i < pixels.length; i += 3) {
      const r = ((pixels[i] - stretchLow) * scale) * rg;
      const g = ((pixels[i + 1] - stretchLow) * scale) * gg;
      const b = ((pixels[i + 2] - stretchLow) * scale) * bg;
      out[i] = r < 0 ? 0 : r > 255 ? 255 : Math.round(r);
      out[i + 1] = g < 0 ? 0 : g > 255 ? 255 : Math.round(g);
      out[i + 2] = b < 0 ? 0 : b > 255 ? 255 : Math.round(b);
    }
    return out;
  }

  async analyzeColorAndMorphology(imageBuffer) {
    const targetW = 300;
    const targetH = 300;
    const { data: pixels } = await sharp(imageBuffer)
      .rotate()
      .resize(targetW, targetH, { fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const morphRaw = this.analyzePixelBuffer(pixels, targetW, targetH, true);
    const balancedBuf = this.balanceRawBuffer(pixels, morphRaw.lighting);
    const morphBalanced = this.analyzePixelBuffer(balancedBuf, targetW, targetH, false);

    return { morphRaw, morphBalanced };
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

  async preprocessTensors(imageBuffer, lighting) {
    const baseImg = sharp(imageBuffer).rotate();
    const meta = await baseImg.metadata();
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

    const rawFull = await sharp(imageBuffer)
      .rotate()
      .resize(224, 224, { fit: 'fill', kernel: 'cubic' })
      .removeAlpha()
      .raw()
      .toBuffer();

    const rawCrop = await sharp(imageBuffer)
      .rotate()
      .resize(newW, newH, { kernel: 'cubic' })
      .extract({ left, top, width: 224, height: 224 })
      .removeAlpha()
      .raw()
      .toBuffer();

    // Scale C: Flipped view with adaptive Gray-World + luminance stretch if extreme lighting/tint
    let enhancedPipe = sharp(imageBuffer).rotate();
    if (lighting?.isExtremeCondition) {
      const { rMean, gMean, bMean, isLowLight } = lighting;
      const channelSpread = Math.max(rMean, gMean, bMean) / (Math.min(rMean, gMean, bMean) + 1.0);
      if (!isLowLight && channelSpread > 1.35) {
        const gray = (rMean + gMean + bMean) / 3.0;
        const clampG = v => Math.max(0.78, Math.min(1.30, v));
        enhancedPipe = enhancedPipe.linear(
          [clampG(gray / (rMean || 1)), clampG(gray / (gMean || 1)), clampG(gray / (bMean || 1))],
          [0, 0, 0]
        );
      }
      enhancedPipe = enhancedPipe.normalise();
    }
    const rawEnhFlip = await enhancedPipe
      .flop()
      .resize(newW, newH, { kernel: 'cubic' })
      .extract({ left, top, width: 224, height: 224 })
      .removeAlpha()
      .raw()
      .toBuffer();

    return {
      tensorFull: this.rgbBufferToFloatTensor(rawFull),
      tensorCrop: this.rgbBufferToFloatTensor(rawCrop),
      tensorEnhFlip: this.rgbBufferToFloatTensor(rawEnhFlip),
      rawCrop
    };
  }

  rotateRgb224(buf, deg) {
    const out = Buffer.allocUnsafe(224 * 224 * 3);
    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const srcIdx = (y * 224 + x) * 3;
        let dx, dy;
        if (deg === 90) {
          dx = 223 - y;
          dy = x;
        } else {
          // 270 degrees
          dx = y;
          dy = 223 - x;
        }
        const dstIdx = (dy * 224 + dx) * 3;
        out[dstIdx] = buf[srcIdx];
        out[dstIdx + 1] = buf[srcIdx + 1];
        out[dstIdx + 2] = buf[srcIdx + 2];
      }
    }
    return out;
  }

  dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  softmaxProbs(arr, temp = 1.0) {
    let mx = -Infinity;
    for (let i = 0; i < arr.length; i++) if (arr[i] > mx) mx = arr[i];
    let sum = 0;
    const out = new Float32Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      out[i] = Math.exp((arr[i] - mx) / temp);
      sum += out[i];
    }
    for (let i = 0; i < arr.length; i++) out[i] /= sum;
    return out;
  }

  computeTrainedScores(featNorm) {
    const trainedScores = {};
    let maxCos = -1.0;
    if (this.hasTrainedHead && this.headWeights) {
      this.trainedClasses.forEach((k, idx) => {
        trainedScores[k] = this.dotProduct(this.headWeights[idx], featNorm) + this.headBiases[idx];
        const cos = this.dotProduct(this.headNormWeights[idx], featNorm);
        if (cos > maxCos) maxCos = cos;
      });
    }
    return { trainedScores, maxCos };
  }

  async predict(imageBuffer, cropFilter = 'Auto') {
    const startTime = Date.now();
    await this.init();

    // 1. Raw + Gray-World Contrast-Recovered Colorimetry & Morphology
    const { morphRaw, morphBalanced } = await this.analyzeColorAndMorphology(imageBuffer);
    const morph = morphRaw;
    const extremeActive = morph.lighting.isExtremeCondition;

    const effectiveGreenPct = Math.max(morph.greenPct, morphBalanced.greenPct);
    const effectivePinkPct = Math.max(morph.salmonPinkPct, morphBalanced.salmonPinkPct);
    const effectiveYellowPct = morph.lighting.hasColorCast ? morphBalanced.yellowPct : morph.yellowPct;
    const effectiveBrownPct = morph.lighting.hasColorCast ? morphBalanced.brownPct : morph.brownPct;

    const buildRejectionResponse = (reasonText) => ({
      status: 'unclear_leaf',
      message: reasonText || 'Not a tomato or potato leaf detected. This system exclusively diagnoses Tomato & Potato foliage and crop specimens. Please upload a clear close-up leaf photo.',
      crop: 'None',
      vegetation_percentage: Math.round(morph.foliarRatio * 10) / 10,
      prediction: {
        disease_id: 'unclear_leaf',
        name: 'Not a Tomato or Potato Leaf',
        hindi_name: 'यह टमाटर या आलू की पत्ती नहीं है',
        confidence_percent: 0.0,
        category: 'Validation',
        severity: 'Low',
        badge_color: '#b91c1c',
        pathogen: 'Outside Supported Domain (Tomato & Potato Only)',
        voice_summary: 'यह फोटो टमाटर या आलू की पत्ती की नहीं है। कृपया केवल टमाटर या आलू की पत्ती की स्पष्ट फोटो अपलोड करें।'
      },
      treatment_plan: {
        organic_remedies: ['Point the camera directly at a Tomato or Potato leaf blade covering most of the frame.'],
        chemical_treatments: [],
        preventive_measures: ['Only Tomato and Potato crop leaves/specimens are supported for pathology diagnosis.'],
        fertilizer_recommendation: ''
      },
      spectral_deficiency_analysis: {
        green_ratio_pct: 0,
        yellow_chlorosis_pct: 0,
        brown_necrosis_pct: 0,
        suspected_deficiencies: []
      },
      top_predictions: [],
      metadata: {
        inference_time_ms: Date.now() - startTime,
        extreme_condition_mode: extremeActive,
        lighting_summary: morph.lighting
      }
    });

    // Reject completely flat/blank images immediately
    if (morph.lighting.contrastSpan < 10) {
      return buildRejectionResponse();
    }

    // 2. Multi-Scale DINOv2 Feature Extraction (Full + Crop + Flipped/Balanced Scale C)
    const { tensorFull, tensorCrop, tensorEnhFlip, rawCrop } = await this.preprocessTensors(imageBuffer, morph.lighting);
    const inputName = this.session.inputNames[0];
    const [outLogitKey, outFeatKey] = this.session.outputNames;

    const [outFull, outCrop, outEnh] = await Promise.all([
      this.session.run({ [inputName]: tensorFull }),
      this.session.run({ [inputName]: tensorCrop }),
      this.session.run({ [inputName]: tensorEnhFlip })
    ]);

    const wMain = extremeActive ? 0.30 : 0.36;
    const wCrop = extremeActive ? 0.30 : 0.36;
    const wEnh = extremeActive ? 0.40 : 0.28;

    const mergeAndNormalize = (runs) => {
      const feat = new Float32Array(768);
      const logits38 = new Float32Array(38);
      let wSum = 0;
      for (const { out, weight } of runs) {
        const fData = out[outFeatKey].data;
        const lData = out[outLogitKey].data;
        for (let i = 0; i < 768; i++) feat[i] += fData[i] * weight;
        for (let i = 0; i < 38; i++) logits38[i] += lData[i] * weight;
        wSum += weight;
      }
      if (wSum > 0) {
        for (let i = 0; i < 768; i++) feat[i] /= wSum;
        for (let i = 0; i < 38; i++) logits38[i] /= wSum;
      }
      let normSq = 0;
      for (let i = 0; i < 768; i++) normSq += feat[i] * feat[i];
      const rawFeatNorm = Math.sqrt(normSq);
      const norm = rawFeatNorm + 1e-7;
      for (let i = 0; i < 768; i++) feat[i] /= norm;
      return { featNorm: feat, rawFeatNorm, baseLogits38: logits38 };
    };

    const runList = [
      { out: outFull, weight: wMain },
      { out: outCrop, weight: wCrop },
      { out: outEnh, weight: wEnh }
    ];
    let { featNorm, rawFeatNorm, baseLogits38 } = mergeAndNormalize(runList);
    let { trainedScores, maxCos } = this.computeTrainedScores(featNorm);

    // 2B. Adaptive Multi-Rotation TTA (90° & 270°) if leaf prediction is truly tied/rotated
    const sortedTrainedVals = Object.values(trainedScores).sort((a, b) => b - a);
    const trainedMargin = (sortedTrainedVals[0] ?? 0) - (sortedTrainedVals[1] ?? 0);
    if (effectiveGreenPct >= 8.0 && (trainedMargin < 0.65 || (sortedTrainedVals[0] ?? 0) < 2.1)) {
      const t90 = this.rgbBufferToFloatTensor(this.rotateRgb224(rawCrop, 90));
      const t270 = this.rgbBufferToFloatTensor(this.rotateRgb224(rawCrop, 270));
      const [out90, out270] = await Promise.all([
        this.session.run({ [inputName]: t90 }),
        this.session.run({ [inputName]: t270 })
      ]);
      const mergedRot = mergeAndNormalize([
        ...runList,
        { out: out90, weight: 0.25 },
        { out: out270, weight: 0.25 }
      ]);
      featNorm = mergedRot.featNorm;
      rawFeatNorm = mergedRot.rawFeatNorm;
      baseLogits38 = mergedRot.baseLogits38;
      ({ trainedScores, maxCos } = this.computeTrainedScores(featNorm));
    }

    // 3. Strict Tomato & Potato Out-of-Distribution (OOD) Verification Gate
    // Blocks humans, rooms, random objects, white walls, and non-tomato/potato crops.
    const probs38 = this.softmaxProbs(baseLogits38, 1.0);
    const pSol = SOLANACEAE_38_INDICES.reduce((acc, idx) => acc + probs38[idx], 0);
    const pPM = POWDERY_MILDEW_38_INDICES.reduce((acc, idx) => acc + probs38[idx], 0);
    const solMax = Math.max(...SOLANACEAE_38_INDICES.map(idx => baseLogits38[idx]));
    const pmMax = Math.max(...POWDERY_MILDEW_38_INDICES.map(idx => baseLogits38[idx]));

    const maxLeafEvidence = Math.max(...Object.values(trainedScores), -10);
    const isGenuineLeaf =
      effectiveGreenPct >= 2.8 &&
      (rawFeatNorm < 61.5 || pSol >= 0.85) &&
      (
        (pSol >= 0.52 && solMax >= 8.5 && maxCos >= 0.140) ||
        (pSol >= 0.90 && solMax >= 12.5 && maxCos >= 0.125 && effectiveGreenPct >= 10.0) ||
        (maxCos >= 0.21 && solMax >= 9.0 && pSol >= 0.25 && effectiveGreenPct >= 15.0) ||
        (pPM >= 0.55 && pmMax >= 10.0 && maxCos >= 0.140 && effectiveGreenPct >= 14.0)
      );

    // Strict tuber/fruit gate: only accepts authentic tuber/fruit pathology (never human skin)
    const hasTuberOrFruitContrast =
      (morphBalanced.brownPct + effectivePinkPct >= 12.0) ||
      morphBalanced.corkyBrownPct >= 12.0 ||
      morphBalanced.pitchBlackPct >= 10.0 ||
      morphBalanced.ripeRedPct >= 12.0;

    const isGenuineTuberOrFruit =
      effectiveGreenPct < 10.0 &&
      pSol >= 0.52 &&
      solMax >= 12.0 &&
      rawFeatNorm < 59.5 &&
      hasTuberOrFruitContrast;

    if (!isGenuineLeaf && !isGenuineTuberOrFruit) {
      return buildRejectionResponse();
    }

    // 4. Crop Determination (Tomato vs Potato)
    const dinoPotatoMax = Math.max(baseLogits38[20], baseLogits38[21], baseLogits38[22]);
    const dinoTomatoIndices = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
    const dinoTomatoMax = Math.max(...dinoTomatoIndices.map(idx => baseLogits38[idx]));
    const trainedPotatoMax = Math.max(
      trainedScores['Potato___Early_blight'] ?? -10,
      trainedScores['Potato___Late_blight'] ?? -10,
      trainedScores['Potato___healthy'] ?? -10
    );
    const trainedTomatoMax = Math.max(
      ...Object.entries(trainedScores)
        .filter(([k]) => k.startsWith('Tomato___'))
        .map(([, v]) => v),
      -10
    );

    let chosenCrop = 'Tomato';
    const cropFilterNorm = (cropFilter || 'auto').trim().toLowerCase();
    if (['tomato', 'टमाटर'].includes(cropFilterNorm)) {
      chosenCrop = 'Tomato';
    } else if (['potato', 'आलू'].includes(cropFilterNorm)) {
      chosenCrop = 'Potato';
    } else {
      const strongFoliarSignal = effectiveGreenPct >= 14.0 ||
        (effectiveGreenPct >= 3.0 && effectivePinkPct < 6.0 && (dinoPotatoMax > 13.5 || maxLeafEvidence > 2.2));
      const isTomatoFruit =
        !strongFoliarSignal &&
        morph.ripeRedPct > 9.0 &&
        morphBalanced.ripeRedPct > 8.0 &&
        morphBalanced.greenPct < 10.0 &&
        dinoPotatoMax < 12.0;

      const isHarvestedTuber =
        !strongFoliarSignal &&
        !isTomatoFruit &&
        effectiveGreenPct < 10.0 &&
        (effectivePinkPct > 7.5 || (morphBalanced.tuberSkinPct > 12.0 && morphBalanced.ripeRedPct < 6.0) || morphBalanced.centerCreamPct > 15.0);

      if (isTomatoFruit) {
        chosenCrop = 'Tomato';
      } else if (isHarvestedTuber) {
        chosenCrop = 'Potato';
      } else {
        const cropLogit = (this.hasTrainedHead && this.cropWeights)
          ? (this.dotProduct(this.cropWeights[0], featNorm) + this.cropBiases[0])
          : (dinoTomatoMax >= dinoPotatoMax ? 1.0 : -1.0);
        const potatoAdvantage = (trainedPotatoMax - trainedTomatoMax) * 0.45 + (dinoPotatoMax - dinoTomatoMax) * 0.12 - cropLogit * 0.55;
        chosenCrop = (dinoPotatoMax > dinoTomatoMax + 0.8 || cropLogit < -0.35 || potatoAdvantage > 0.35)
          ? 'Potato'
          : 'Tomato';
      }
    }

    // 5. Full 43-Disease Candidate Scoring Engine
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
        candidateScores[key] = tScore * 1.55 + dScore * 0.52;
      }

      // Bacterial Spot calibrated morphometry tie-breaker when neural head detects spotting
      if ((trainedScores['Tomato___Bacterial_spot'] || 0) > 1.2 && morph.speckCount >= 18 && effectiveGreenPct > 20.0) {
        const speckBoost = Math.min(3.5, (morph.speckCount - 15) * 0.03 + 1.2);
        candidateScores['Tomato___Bacterial_spot'] += speckBoost;
      }

      // Powdery Mildew (Cross-species fungal spore dust detection)
      const isPm = (pmMax > 8.5 && morph.speckCount < 200) || (pmMax > 3.5 && morphBalanced.whiteSporePct > 12.0 && morph.speckCount < 200);
      candidateScores['Tomato___Powdery_mildew'] = isPm ? (pmMax * 1.5 + 2.0) : (pmMax - 3.5);

      const bsScore = candidateScores['Tomato___Bacterial_spot'] || 0.0;
      const lbScore = candidateScores['Tomato___Late_blight'] || 0.0;
      const ylcScore = candidateScores['Tomato___Tomato_Yellow_Leaf_Curl_Virus'] || 0.0;
      const mvScore = candidateScores['Tomato___Tomato_mosaic_virus'] || 0.0;
      const lmScore = candidateScores['Tomato___Leaf_Mold'] || 0.0;
      const maxFoliar = Math.max(...Object.values(candidateScores));
      const trainedUncertain = maxFoliar < 3.5;

      // Tomato Fruit Conditions (when confirmed fruit closeup, not foliar leaf)
      const isFruitCloseUp = morphBalanced.ripeRedPct > 8.0 && morph.ripeRedPct > 6.0 && effectiveGreenPct < 12.0;
      if (isFruitCloseUp) {
        if (morph.bottomDarkPct > morph.upperDarkPct * 1.45 && morph.bottomDarkPct > 5.0) {
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 12.0;
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 3.0;
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 1.0;
        } else if (morph.upperDarkPct > 4.0 || morphBalanced.corkyBrownPct > 5.0) {
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 11.0;
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 2.0;
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 1.0;
        } else if (morph.speckCount > 15 && morphBalanced.whiteSporePct > 3.0) {
          candidateScores['Tomato___Bacterial_canker'] = maxFoliar + 10.0;
          candidateScores['Tomato___Anthracnose'] = maxFoliar + 2.0;
          candidateScores['Tomato___Blossom_end_rot'] = maxFoliar + 1.0;
        } else {
          candidateScores['Tomato___Blossom_end_rot'] = 18.0;
          candidateScores['Tomato___Anthracnose'] = 10.0;
          candidateScores['Tomato___Bacterial_canker'] = 6.0;
        }
      } else {
        candidateScores['Tomato___Blossom_end_rot'] = maxFoliar - 8.5;
        candidateScores['Tomato___Anthracnose'] = maxFoliar - 7.5;
        candidateScores['Tomato___Bacterial_canker'] = (trainedUncertain && morph.speckCount < 45 && effectiveBrownPct > 18.0 && morph.highEdgePct > 18.0)
          ? (bsScore + 2.5)
          : (maxFoliar - 7.5);
      }

      // Secondary Foliar & Vascular Conditions
      candidateScores['Tomato___Gray_mold'] = (trainedUncertain && morphBalanced.grayMoldPct > 22.0 && effectiveBrownPct > 8.0 && morph.speckCount < 140)
        ? (lmScore + 3.0)
        : (maxFoliar - 7.5);

      candidateScores['Tomato___Tomato_spotted_wilt_virus'] = (morphBalanced.purpleBronzePct > 12.0 && effectiveGreenPct > 15.0 && maxFoliar < 4.5)
        ? (Math.max(mvScore, ylcScore) + (morphBalanced.purpleBronzePct - 10.0) * 0.5)
        : (maxFoliar - 7.5);

      const isStrongYellowWilt = (trainedUncertain && effectiveYellowPct > 36.0 && effectiveGreenPct > 15.0 && morph.speckCount < 60);
      candidateScores['Tomato___Fusarium_wilt'] = isStrongYellowWilt ? (maxFoliar + 3.5) : (maxFoliar - 7.5);
      candidateScores['Tomato___Verticillium_wilt'] = (isStrongYellowWilt && effectiveBrownPct > 10.0) ? (maxFoliar + 2.5) : (maxFoliar - 7.8);

      candidateScores['Tomato___Bacterial_wilt'] = (trainedUncertain && effectiveGreenPct > 45.0 && effectiveYellowPct < 8.0 && effectiveBrownPct < 5.0)
        ? (lbScore + 2.5)
        : (maxFoliar - 7.8);

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
        candidateScores[key] = tScore * 1.55 + dScore * 0.52;
      }

      const ebScore = candidateScores['Potato___Early_blight'] || 0.0;
      const lbScore = candidateScores['Potato___Late_blight'] || 0.0;
      const hScore = candidateScores['Potato___healthy'] || 0.0;
      const maxFoliarPot = Math.max(ebScore, lbScore, hScore);

      // Guard strictly against treating foggy/warm foliage as a potato tuber
      const isFoliageClear = effectiveGreenPct >= 14.0 ||
        (effectiveGreenPct >= 3.0 && effectivePinkPct < 6.0 && (trainedPotatoMax >= 2.2 || dinoPotatoMax >= 13.5));
      const isTuber = !isFoliageClear && (effectiveGreenPct < 10.0 && (effectivePinkPct > 7.5 || morphBalanced.tuberSkinPct > 30.0 || morphBalanced.centerCreamPct > 18.0));

      if (isTuber) {
        candidateScores['Potato___Early_blight'] = ebScore * 0.25;
        candidateScores['Potato___Late_blight'] = lbScore * 0.25;
        candidateScores['Potato___healthy'] = (effectiveBrownPct < 3.5 && morphBalanced.pitchBlackPct < 2.5 && effectivePinkPct < 4.0 && morphBalanced.corkyBrownPct < 4.5 && morphBalanced.whiteSporePct < 5.0)
          ? Math.max(hScore, 9.5)
          : (hScore * 0.25);

        candidateScores['Potato___Pink_rot'] = (effectivePinkPct > 7.5)
          ? Math.max(maxFoliarPot, 6.0) + 9.0 + (effectivePinkPct - 7.5) * 0.35
          : -3.0;

        if (morphBalanced.centerCreamPct > 22.0 && morphBalanced.centerBrownPct > 5.0 && effectivePinkPct < 6.0) {
          candidateScores['Potato___PMTV'] = 9.0 + morphBalanced.centerBrownPct * 0.2;
          candidateScores['Potato___TRV'] = 8.2 + morphBalanced.centerBrownPct * 0.15;
          candidateScores['Potato___Brown_rot'] = 7.5;
          candidateScores['Potato___Ring_rot'] = 7.0;
        } else {
          candidateScores['Potato___PMTV'] = -3.0;
          candidateScores['Potato___TRV'] = -3.2;
          candidateScores['Potato___Brown_rot'] = -2.8;
          candidateScores['Potato___Ring_rot'] = -3.0;
        }

        candidateScores['Potato___Watery_wound_rot'] = (morphBalanced.centerCreamPct > 12.0 && morphBalanced.grayMoldPct > 18.0 && effectivePinkPct < 6.0) ? 9.2 : -3.0;
        candidateScores['Potato___Black_scurf'] = (morphBalanced.pitchBlackPct > 6.0 && effectivePinkPct < 6.0) ? (8.5 + morphBalanced.pitchBlackPct * 0.35) : -2.5;
        candidateScores['Potato___Common_scab'] = (morphBalanced.corkyBrownPct > 10.0 && morph.highEdgePct > 11.0 && effectivePinkPct < 6.0) ? (8.0 + morphBalanced.corkyBrownPct * 0.30) : -2.0;
        candidateScores['Potato___Powdery_scab'] = (morphBalanced.corkyBrownPct > 8.5 && effectiveBrownPct > 10.0 && morph.tinyPimpleCount > 25) ? (8.2 + morphBalanced.corkyBrownPct * 0.25) : -2.5;
        candidateScores['Potato___Dry_rot'] = (morphBalanced.whiteSporePct > 7.0 && effectiveBrownPct > 9.0 && effectivePinkPct < 6.0) ? (8.8 + morphBalanced.whiteSporePct * 0.25) : -2.4;
        candidateScores['Potato___Gangrene'] = (effectiveBrownPct > 14.0 && morphBalanced.pitchBlackPct > 5.0 && morphBalanced.whiteSporePct < 5.0 && effectivePinkPct < 6.0) ? 8.0 : -2.8;
        candidateScores['Potato___Silver_scurf'] = (morphBalanced.silverySheenPct > 16.0 && effectiveBrownPct < 5.0 && morphBalanced.pitchBlackPct < 3.0) ? (8.6 + morphBalanced.silverySheenPct * 0.2) : -2.8;
        candidateScores['Potato___Skin_spot'] = (morph.tinyPimpleCount > 35 && effectiveBrownPct < 10.0) ? 7.8 : -3.2;
        candidateScores['Potato___Black_dot'] = (morphBalanced.silverySheenPct > 10.0 && morph.tinyPimpleCount > 25) ? 7.5 : -3.2;
        candidateScores['Potato___Violet_root_rot'] = (morphBalanced.purpleBronzePct > 12.0 && effectivePinkPct < 6.0) ? (9.5 + morphBalanced.purpleBronzePct * 0.3) : -4.0;
        candidateScores['Potato___Wart_disease'] = (morphBalanced.pitchBlackPct > 15.0 && morph.highEdgePct > 25.0) ? 9.2 : -4.0;

        candidateScores['Potato___Blackleg'] = -3.5;
        candidateScores['Potato___PLRV'] = -6.0;
        candidateScores['Potato___PVY'] = -6.0;
        candidateScores['Potato___Mosaic_virus'] = -6.0;
        candidateScores['Potato___Verticillium_wilt'] = -6.0;
      } else {
        const potUncertain = maxFoliarPot < 3.5;
        for (const k of [
          'Potato___Pink_rot', 'Potato___Common_scab', 'Potato___Black_scurf',
          'Potato___Powdery_scab', 'Potato___Dry_rot', 'Potato___Silver_scurf',
          'Potato___Skin_spot', 'Potato___Gangrene', 'Potato___Watery_wound_rot',
          'Potato___Violet_root_rot', 'Potato___Wart_disease'
        ]) {
          candidateScores[k] = maxFoliarPot - 8.5;
        }
        candidateScores['Potato___Brown_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Ring_rot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___Black_dot'] = maxFoliarPot - 7.5;
        candidateScores['Potato___PMTV'] = maxFoliarPot - 8.0;
        candidateScores['Potato___TRV'] = maxFoliarPot - 8.0;

        candidateScores['Potato___Blackleg'] = (potUncertain && morph.bottomDarkPct > 24.0 && effectiveYellowPct > 12.0 && effectiveGreenPct > 20.0)
          ? (maxFoliarPot + 2.8)
          : (maxFoliarPot - 7.5);

        candidateScores['Potato___PLRV'] = (potUncertain && effectiveYellowPct > 24.0 && morphBalanced.purpleBronzePct > 5.0 && effectiveBrownPct < 8.0)
          ? (maxFoliarPot + 2.5)
          : (maxFoliarPot - 7.5);

        candidateScores['Potato___PVY'] = (potUncertain && effectiveYellowPct > 18.0 && effectiveGreenPct > 30.0 && effectiveBrownPct < 4.5)
          ? (maxFoliarPot + 2.2)
          : (maxFoliarPot - 7.5);
        candidateScores['Potato___Mosaic_virus'] = (potUncertain && effectiveYellowPct > 12.0 && effectiveGreenPct > 45.0 && effectiveBrownPct < 3.0)
          ? (maxFoliarPot + 1.8)
          : (maxFoliarPot - 7.5);

        candidateScores['Potato___Verticillium_wilt'] = (potUncertain && effectiveYellowPct > 28.0 && effectiveBrownPct > 10.0 && morph.speckCount < 45)
          ? (maxFoliarPot + 2.4)
          : (maxFoliarPot - 7.8);
      }
    }

    // 6. Softmax Normalization (Temperature T = 1.5)
    const keys = Object.keys(candidateScores);
    const rawScores = keys.map(k => candidateScores[k]);
    const probs = this.softmaxProbs(rawScores, 1.5);

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

    // 7. Spectral & Nutrient Deficiency Diagnostics (using balanced pigments in extreme conditions)
    const suspectedDeficiencies = [];
    if (effectiveYellowPct > 22.0) {
      suspectedDeficiencies.push({
        nutrient: 'Nitrogen (N) or Iron (Fe)',
        confidence: Math.min(95.0, Math.round(effectiveYellowPct * 2.2 * 10) / 10),
        reason: `Significant chlorosis detected (${effectiveYellowPct.toFixed(1)}% yellow leaf surface). In older lower leaves this indicates Nitrogen deficit; in young terminal leaves it indicates Iron chlorosis.`,
        guide: NUTRIENT_DEFICIENCY_GUIDE.nitrogen_deficiency
      });
    }
    if (effectiveBrownPct > 12.0) {
      suspectedDeficiencies.push({
        nutrient: 'Potassium (K) Marginal Scorch',
        confidence: Math.min(92.0, Math.round(effectiveBrownPct * 3.5 * 10) / 10),
        reason: `Necrotic brown spotting detected (${effectiveBrownPct.toFixed(1)}% necrotic surface). Correlates with Potassium deficiency or Alternaria blights.`,
        guide: NUTRIENT_DEFICIENCY_GUIDE.potassium_deficiency
      });
    }

    const latencyMs = Date.now() - startTime;

    // 8. Bilingual Pathology Insights
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
        green_ratio_pct: Math.round(effectiveGreenPct * 10) / 10,
        yellow_chlorosis_pct: Math.round(effectiveYellowPct * 10) / 10,
        brown_necrosis_pct: Math.round(effectiveBrownPct * 10) / 10,
        suspected_deficiencies: suspectedDeficiencies
      },
      metadata: {
        inference_time_ms: latencyMs,
        extreme_condition_mode: extremeActive,
        lighting_summary: morph.lighting,
        vegetation_ratio: Math.round(morph.foliarRatio * 10) / 10,
        tuber_ratio: Math.round(morph.tuberSkinPct * 10) / 10,
        solanaceae_gate_score: Math.round(pSol * 1000) / 10,
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
