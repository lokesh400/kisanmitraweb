/**
 * Kisan Mitra - Sample Image Downloader (Pure Node.js)
 * Fetches authentic PlantVillage tomato & potato sample images for testing.
 */

const fs = require('fs');
const path = require('path');

const SAMPLES_DIR = path.join(__dirname, '..', 'public', 'assets', 'samples');
if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

const SAMPLES_MAP = {
  'early_blight.jpg': 'Tomato___Early_blight',
  'late_blight.jpg': 'Tomato___Late_blight',
  'bacterial_spot.jpg': 'Tomato___Bacterial_spot',
  'yellow_leaf_curl.jpg': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'spider_mites.jpg': 'Tomato___Spider_mites_Two_spotted_spider_mite',
  'healthy_leaf.jpg': 'Tomato___healthy'
};

async function fetchSamples() {
  console.log('[Kisan Mitra Node] Verifying and fetching authentic PlantVillage sample images...');
  for (const [targetName, folder] of Object.entries(SAMPLES_MAP)) {
    const destPath = path.join(SAMPLES_DIR, targetName);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`Sample ${targetName} already exists (${fs.statSync(destPath).size} bytes).`);
      continue;
    }

    try {
      const apiUrl = `https://api.github.com/repos/spMohanty/PlantVillage-Dataset/contents/raw/color/${folder}`;
      const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Kisan-Mitra-Node' } });
      if (res.ok) {
        const files = await res.json();
        if (Array.isArray(files) && files.length > 0) {
          const downloadUrl = files[0].download_url;
          if (downloadUrl) {
            const imgRes = await fetch(downloadUrl);
            if (imgRes.ok) {
              const arrayBuffer = await imgRes.arrayBuffer();
              fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
              console.log(`Downloaded ${targetName} (${arrayBuffer.byteLength} bytes).`);
              continue;
            }
          }
        }
      }
      console.log(`Could not download ${targetName} via GitHub API, keeping existing file.`);
    } catch (e) {
      console.error(`Error fetching ${targetName}:`, e.message);
    }
  }
}

if (require.main === module) {
  fetchSamples().catch(console.error);
}

module.exports = { fetchSamples };
