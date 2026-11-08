const https = require('https');

function followRedirect(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        return resolve(followRedirect(res.headers.location, maxRedirects - 1));
      }
      resolve({ statusCode: res.statusCode, contentType: res.headers['content-type'], finalUrl: url });
    }).on('error', reject);
  });
}

async function test() {
  const testFiles = [
    'Colombo_Fort_Railway_Station.JPG',
    'Colombo_Town_Hall.JPG',
    'National_Museum_of_Colombo.jpg',
    'Sri_Lanka_Independence_Square.jpg',
    'Arcade_Independence_Square.jpg',
    'Galle_Face_Hotel_01.jpg'
  ];

  for (const f of testFiles) {
    const orig = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=1000`;
    const res = await followRedirect(orig);
    console.log(`[${res.statusCode}] ${res.contentType} => ${res.finalUrl.substring(0, 70)}...`);
  }
}

test().catch(console.error);

