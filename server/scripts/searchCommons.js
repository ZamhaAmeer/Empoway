const https = require('https');

function wikiSearch(term) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=6&format=json`;
    https.get(url, { headers: { 'User-Agent': 'EmpowayApp/1.0 (info@empoway.lk)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = (json.query?.search || []).map(r => r.title.replace(/^File:/, ''));
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
    'University of Moratuwa',
    'NSBM Green University',
    'Suhurupaya',
    'Sethsiripaya',
    'Makumbura Multimodal',
    'Majestic City Colombo',
    'Liberty Plaza Colombo',
    'Cinnamon Lakeside',
    'Kingsbury Hotel Colombo',
    'Galle Face Green',
    'Colombo Fort',
    'National Eye Hospital Colombo',
    'Apeksha Hospital',
    'Lanka Hospitals Colombo',
    'Nawaloka Hospital',
    'Dialog Axiata',
    'Sri Lanka Telecom'
  ];

  for (const q of queries) {
    const files = await wikiSearch(q);
    console.log(`\n=== Query: "${q}" ===`);
    console.log(files.slice(0, 4).join('\n'));
  }
}

run();

