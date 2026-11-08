const https = require('https');
const fs = require('fs');

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'EmpowayAccessibilityPlatform/1.0 (https://empoway.lk; tech@empoway.lk)'
      }
    }, (res) => {
      if ([301, 302, 307].includes(res.statusCode)) {
        return resolve(downloadImage(res.headers.location, destPath));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} (${res.headers['content-type']})`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(fs.statSync(destPath).size);
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const size = await downloadImage('https://commons.wikimedia.org/wiki/Special:FilePath/Colombo_Fort_Railway_Station.JPG?width=800', 'client/public/places/fort_station.jpg');
    console.log('Success! Downloaded size:', size);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();

