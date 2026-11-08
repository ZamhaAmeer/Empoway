const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('client/public/places');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

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
        console.error(`[ERR] Too many redirects for ${fileName}`);
        return resolve({ ok: false, file: outName });
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
          console.error(`[ERR] Status ${res.statusCode} for ${fileName}`);
          return resolve({ ok: false, file: outName, status: res.statusCode });
        }

        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const size = fs.statSync(dest).size;
          if (size < 8000) {
            console.error(`[WARN] File too small (${size} bytes) for ${fileName}`);
            return resolve({ ok: false, file: outName, size });
          }
          console.log(`[OK] Downloaded ${outName} (${size} bytes)`);
          resolve({ ok: true, file: outName, size });
        });
      }).on('error', (err) => {
        console.error(`[ERR] ${err.message} for ${fileName}`);
        resolve({ ok: false, file: outName, error: err.message });
      });
    }

    fetchUrl(url);
  });
}

const downloads = [
  { file: 'Colombo_Fort_Railway_Station.JPG', out: 'colombo-fort-station.jpg' },
  { file: 'Colombo_Town_Hall.JPG', out: 'colombo-town-hall.jpg' },
  { file: 'National_Museum_of_Colombo.jpg', out: 'national-museum-colombo.jpg' },
  { file: 'Sri_Lanka_Independence_Square.jpg', out: 'independence-memorial-hall.jpg' },
  { file: 'Arcade_Independence_Square.jpg', out: 'arcade-independence-square.jpg' },
  { file: 'Nelum_Pokuna_Mahinda_Rajapaksa_Theatre.jpg', out: 'nelum-pokuna-theatre.jpg' },
  { file: 'Colombo_Public_Library.jpg', out: 'colombo-public-library.jpg' },
  { file: 'Viharamahadevi_Park.jpg', out: 'viharamahadevi-park.jpg' },
  { file: 'Galle_Face_Hotel_01.jpg', out: 'galle-face-hotel.jpg' },
  { file: 'Mount_Lavinia_Hotel_Sri_Lanka_(30039549556).jpg', out: 'mount-lavinia-hotel.jpg' },
  { file: 'Hilton_Colombo_Skyline.jpg', out: 'hilton-colombo.jpg' },
  { file: 'Taj_Samudra_Hotel.jpg', out: 'taj-samudra-hotel.jpg' },
  { file: 'Cinnamon_Grand_Hotel_interior.jpg', out: 'cinnamon-grand-hotel.jpg' },
  { file: 'Maradana_railway_station.jpg', out: 'maradana-railway-station.jpg' },
  { file: 'Bambalapitiya_Railway_Station.jpg', out: 'bambalapitiya-railway-station.jpg' },
  { file: 'MoratuwaBahnhof.jpg', out: 'moratuwa-railway-station.jpg' },
  { file: 'Pettah_Floating_Market_Colombo,_Sri_Lanka.jpg', out: 'pettah-bus-stand.jpg' },
  { file: 'Diyatha_uyana.jpg', out: 'diyatha-uyana.jpg' },
  { file: 'Seethawaka_Botanical_Garden,_July_2016.jpg', out: 'seethawaka-botanic-gardens.jpg' },
  { file: 'Sugatadasa_Stadium.jpg', out: 'sugathadasa-stadium.jpg' },
  { file: 'Colombo_One_Galle_Face.jpg', out: 'one-galle-face-mall.jpg' },
  { file: 'UG-LK_Photowalk_-_Colombo_City_Centre_-_2017-03-12.jpg', out: 'colombo-city-centre.jpg' },
  { file: 'Havelock_City,_Sri_Lanka,_003.jpg', out: 'havelock-city-mall.jpg' },
  { file: 'Old_Parliament_Building_Colombo.jpg', out: 'presidential-secretariat.jpg' },
  { file: 'Supreme_Court_Colombo.jpg', out: 'supreme-court-colombo.jpg' },
  { file: 'National_Hospital_Colombo_-_panoramio.jpg', out: 'national-hospital-colombo.jpg' },
  { file: 'Lrh1.jpg', out: 'lady-ridgeway-hospital.jpg' },
  { file: 'Colombo_South_Teaching_Hospital.jpg', out: 'kalubowila-hospital.jpg' },
  { file: 'Front_view_of_Durdans_Heart_Centre_Building_Durdans_Hospital.jpg', out: 'durdans-hospital.jpg' },
  { file: 'Bank_of_Ceylon_Head_Office_-_panoramio.jpg', out: 'boc-tower-colombo.jpg' },
  { file: 'HNB_Tower.jpg', out: 'hnb-tower-colombo.jpg' },
  { file: 'Central_Bank_of_Sri_Lanka_Building.jpg', out: 'central-bank-colombo.jpg' },
  { file: 'SL_Colombo_asv2020-01_img25_Cargills_Building.jpg', out: 'cargills-building-fort.jpg' },
  { file: 'University_of_Colombo_Faculty_of_Science_-_panoramio.jpg', out: 'uoc-science-faculty.jpg' },
  { file: 'Colombo_Medical_College_UoC.jpg', out: 'uoc-medical-faculty.jpg' },
  { file: 'Sri_Jayewardenepura_University_Sri_Lanka.jpg', out: 'usj-university.jpg' },
  { file: 'Open_University_of_Sri_Lanka.jpg', out: 'open-university-sri-lanka.jpg' },
  { file: 'SLIIT_Faculty_of_Computing_Building.jpg', out: 'sliit-malabe-campus.jpg' }
];

async function run() {
  console.log(`Starting download of ${downloads.length} authentic Colombo place photos...`);
  let okCount = 0;
  for (const item of downloads) {
    const res = await downloadImage(item.file, item.out);
    if (res.ok) okCount++;
    // Polite delay
    await new Promise(r => setTimeout(r, 600));
  }
  console.log(`Finished: ${okCount}/${downloads.length} photos ready in client/public/places/`);
}

run();

