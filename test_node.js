const fs = require('fs');
const path = require('path');
const { engine } = require('./src/predictor');

async function test() {
  const samplesDir = path.join(__dirname, 'public', 'assets', 'samples');
  const files = [
    ['potato_pink_rot.jpg', 'Potato', 'Pink Rot'],
    ['potato_alternaria.jpg', 'Potato', 'Early Blight'],
    ['potato_late_blight.jpg', 'Potato', 'Late Blight'],
    ['powdery_mildew.jpg', 'Tomato', 'Powdery Mildew'],
    ['septoria_leaf_spot.jpg', 'Tomato', 'Septoria Leaf Spot'],
    ['bacterial_spot.jpg', 'Tomato', 'Bacterial Spot'],
    ['early_blight.jpg', 'Tomato', 'Early Blight'],
    ['late_blight.jpg', 'Tomato', 'Late Blight']
  ];

  console.log('='.repeat(65));
  console.log('  NODE.JS / JAVASCRIPT PREDICTOR VERIFICATION BENCHMARK');
  console.log('='.repeat(65));

  for (const [fname, expCrop, expDisease] of files) {
    const fp = path.join(samplesDir, fname);
    if (!fs.existsSync(fp)) {
      console.log(`Skipping ${fname} (not found)`);
      continue;
    }
    const buf = fs.readFileSync(fp);
    const res = await engine.predict(buf, 'Auto');
    const matched = res.crop === expCrop && res.prediction.name.toLowerCase().includes(expDisease.toLowerCase());
    const tag = matched ? 'PASS' : 'FAIL';
    console.log(`[${tag}] ${fname.padEnd(26)} => [${res.crop}] ${res.prediction.name} (${res.prediction.confidence_percent}%)`);
  }
}

test().catch(console.error);
