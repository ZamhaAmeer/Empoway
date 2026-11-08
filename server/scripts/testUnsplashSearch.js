const https = require('https');

function searchUnsplash(query) {
  return new Promise((resolve) => {
    // Unsplash public source search or standard photo endpoint
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = (json.results || []).map(r => ({
            id: r.id,
            description: r.description || r.alt_description,
            url: r.urls?.regular
          }));
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    'Colombo Sri Lanka',
    'Colombo Lotus tower',
    'Galle Face Colombo',
    'Colombo train',
    'Colombo city skyline',
    'Sri Lanka university',
    'Sri Lanka architecture'
  ];

  for (const q of queries) {
    const res = await searchUnsplash(q);
    console.log(`\n=== "${q}" (${res.length} results) ===`);
    res.slice(0, 3).forEach(r => console.log(`- ${r.description} => ${r.url}`));
  }
}

run();

