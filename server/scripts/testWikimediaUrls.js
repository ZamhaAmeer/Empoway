const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'EmpowayAccessibilityBot/1.0 (https://empoway.lk; contact@empoway.lk)'
        },
        timeout: 10000
      }, (res) => {
        // follow redirect
        if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) && res.headers.location) {
          resolve({ status: res.statusCode, location: res.headers.location, ok: true });
        } else {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
        }
      });
      req.on('error', (err) => resolve({ status: 'ERR', error: err.message, ok: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 'TIMEOUT', ok: false });
      });
    } catch (e) {
      resolve({ status: 'EXCEPTION', error: e.message, ok: false });
    }
  });
}

const testList = [
  'Colombo_Fort_Railway_Station.JPG',
  'Colombo_Town_Hall.JPG',
  'National_Museum_of_Colombo.jpg',
  'Sri_Lanka_Independence_Square.jpg',
  'Arcade_Independence_Square.jpg',
  'Nelum_Pokuna_Mahinda_Rajapaksa_Theatre.jpg',
  'Colombo_Public_Library.jpg',
  'Viharamahadevi_Park.jpg',
  'Galle_Face_Hotel_01.jpg',
  'Mount_Lavinia_Hotel_Sri_Lanka_(30039549556).jpg',
  'Hilton_Colombo_Skyline.jpg',
  'Taj_Samudra_Hotel.jpg',
  'Cinnamon_Grand_Hotel_interior.jpg',
  'Maradana_railway_station.jpg',
  'Bambalapitiya_Railway_Station.jpg',
  'MoratuwaBahnhof.jpg',
  'Pettah_Floating_Market_Colombo,_Sri_Lanka.jpg',
  'Dehiwala_Zoo.jpg',
  'Diyatha_uyana.jpg',
  'Seethawaka_Botanical_Garden,_July_2016.jpg',
  'Sugatadasa_Stadium.jpg',
  'Colombo_One_Galle_Face.jpg',
  'UG-LK_Photowalk_-_Colombo_City_Centre_-_2017-03-12.jpg',
  'Havelock_City,_Sri_Lanka,_003.jpg',
  'Old_Parliament_Building_Colombo.jpg',
  'Supreme_Court_Colombo.jpg',
  'National_Hospital_Colombo_-_panoramio.jpg',
  'Lrh1.jpg',
  'Colombo_South_Teaching_Hospital.jpg',
  'Front_view_of_Durdans_Heart_Centre_Building_Durdans_Hospital.jpg',
  'Bank_of_Ceylon_Head_Office_-_panoramio.jpg',
  'HNB_Tower.jpg',
  'Central_Bank_of_Sri_Lanka_Building.jpg',
  'SL_Colombo_asv2020-01_img25_Cargills_Building.jpg',
  'University_of_Colombo_Faculty_of_Science_-_panoramio.jpg',
  'Colombo_Medical_College_UoC.jpg',
  'Sri_Jayewardenepura_University_Sri_Lanka.jpg',
  'Open_University_of_Sri_Lanka.jpg',
  'SLIIT_Faculty_of_Computing_Building.jpg',
  'NSBM_Green_University_Sri_Lanka.jpg'
];

async function run() {
  console.log(`Checking ${testList.length} files...`);
  for (const f of testList) {
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=1000`;
    const res = await checkUrl(url);
    console.log(`${res.ok ? '✓' : '✗'} [${res.status}] ${f}`);
  }
}

run();

