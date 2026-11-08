const https = require('https');

function getWikiPageImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
    https.get(url, { headers: { 'User-Agent': 'EmpowayApp/1.0 (info@empoway.lk)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          for (const pid of Object.keys(pages)) {
            if (pages[pid].thumbnail) {
              return resolve({ title, source: pages[pid].thumbnail.source });
            }
          }
          resolve({ title, source: null });
        } catch (e) {
          resolve({ title, source: null, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ title, source: null, error: err.message }));
  });
}

const articles = [
  'University of Moratuwa',
  'University of Colombo',
  'University of Sri Jayewardenepura',
  'Open University of Sri Lanka',
  'Sri Lanka Institute of Information Technology',
  'National Hospital of Sri Lanka',
  'Lady Ridgeway Hospital for Children',
  'Colombo South Teaching Hospital',
  'National Eye Hospital (Sri Lanka)',
  'Sri Jayewardenepura General Hospital',
  'Colombo Fort railway station',
  'Maradana railway station',
  'Bambalapitiya railway station',
  'Moratuwa railway station',
  'National Museum of Colombo',
  'Colombo Town Hall',
  'Old Parliament Building, Colombo',
  'Nelum Pokuna Mahinda Rajapaksa Theatre',
  'Bandaranaike Memorial International Conference Hall',
  'Independence Memorial Hall',
  'Galle Face Green',
  'Galle Face Hotel',
  'Mount Lavinia Hotel',
  'Viharamahadevi Park',
  'Sugathadasa Stadium',
  'Seethawaka Wet Zone Botanic Gardens',
  'Colombo City Centre',
  'One Galle Face',
  'Durdans Hospital',
  'Bank of Ceylon Tower',
  'Central Bank of Sri Lanka'
];

async function run() {
  for (const a of articles) {
    const res = await getWikiPageImage(a);
    console.log(`${res.source ? '✓' : '✗'} ${res.title} => ${res.source ? res.source.substring(0, 80) + '...' : 'NONE'}`);
  }
}

run();

