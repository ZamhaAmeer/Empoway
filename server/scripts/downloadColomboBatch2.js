const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('client/public/places');

function downloadImage(fileName, outName) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, outName);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      console.log(`[SKIP] Already exists: ${outName} (${fs.statSync(dest).size} bytes)`);
      return resolve({ ok: true, file: outName, size: fs.statSync(dest).size });
    }

    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=800`;
    
    function fetchUrl(targetUrl, redirects = 4) {
      if (redirects <= 0) {
        return resolve({ ok: false, file: outName, error: 'Too many redirects' });
      }

      https.get(targetUrl, {
        headers: {
          'User-Agent': 'EmpowayAccessibilityPlatform/1.0 (https://empoway.lk; tech@empoway.lk)'
        }
      }, (res) => {
        if ([301, 302, 307].includes(res.statusCode) && res.headers.location) {
          return fetchUrl(res.headers.location, redirects - 1);
        }

        if (res.statusCode !== 200) {
          return resolve({ ok: false, file: outName, status: res.statusCode });
        }

        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(dest).size;
          if (size < 8000) {
            return resolve({ ok: false, file: outName, size, error: 'Too small' });
          }
          console.log(`[OK] Downloaded ${outName} (${size} bytes)`);
          resolve({ ok: true, file: outName, size });
        });
      }).on('error', (err) => {
        resolve({ ok: false, file: outName, error: err.message });
      });
    }

    fetchUrl(url);
  });
}

const batch2 = [
  { file: '20160122_Sri_Lanka_3645_Colombo_sRGB_(25144304823).jpg', out: 'bmich-colombo.jpg' },
  { file: 'Colombo_-_Galle_Face.jpg', out: 'galle-face-green.jpg' },
  { file: 'Blue_lotus_tower.jpg', out: 'lotus-tower-colombo.jpg' },
  { file: 'Gangaramaya_Temple.JPG', out: 'gangaramaya-temple.jpg' },
  { file: 'Dehiwala_Zoo.jpg', out: 'dehiwala-zoo.jpg' },
  { file: '170120_Durdans_Hospital.jpg', out: 'durdans-facade.jpg' },
  { file: 'SL_Colombo_asv2020-01_img11_Maradana_train_station.jpg', out: 'maradana-station-platform.jpg' },
  { file: 'WerangaR_Old_Parliament_Building_Sri_Lanka.JPG', out: 'old-parliament-front.jpg' },
  { file: 'Independence_Commemoration_Hall_Independence_Square_Colombo.jpg', out: 'independence-hall-pillars.jpg' },
  { file: 'Viharamahadevi_Park_including_the_Cenotaph_War_Memorial_and_the_Public_Library_Colombo.jpg', out: 'viharamahadevi-statue.jpg' }
];

async function run() {
  console.log(`Checking/downloading batch 2 (${batch2.length} items)...`);
  for (const b of batch2) {
    const res = await downloadImage(b.file, b.out);
    if (!res.ok) console.log(`[FAILED] ${b.out}: ${res.error || res.status}`);
    await new Promise(r => setTimeout(r, 600));
  }
}

run();

