const fs = require('fs');
const path = require('path');
const { Place, Photograph } = require('../models');

const uploadsDir = 'C:/Users/HP/.gemini/antigravity/brain/d75f607d-f073-43c2-bf32-7d98e3618470/.user_uploaded';

const mappings = [
  {
    name: 'slt',
    src: path.join(uploadsDir, 'media_1794139116142_87cebc72.jpg'),
    destNames: ['slt-headquarters.jpg'],
    placeIds: [84],
    caption: 'Sri Lanka Telecom (SLT-MOBITEL) – Telecom HQ Lotus Road Fort'
  },
  {
    name: 'havelock',
    src: path.join(uploadsDir, 'media_1794139138058_effd4038.jpg'),
    destNames: ['havelock-city-mall.jpg'],
    placeIds: [88],
    caption: 'Havelock City Mall Havelock Road Colombo 05 luxury retail and lifestyle mall'
  },
  {
    name: 'sethsiripaya (and suhurupaya)',
    src: path.join(uploadsDir, 'media_1794139198518_f8b94a23.jpg'),
    destNames: ['sethsiripaya-battaramulla.jpg', 'suhurupaya-battaramulla.jpg'],
    placeIds: [16, 17, 73, 76],
    caption: 'Department of Immigration & Emigration / Suhurupaya & Sethsiripaya Complex Battaramulla'
  },
  {
    name: 'apeksha',
    src: path.join(uploadsDir, 'media_1794139223654_ec50fd84.jpg'),
    destNames: ['apeksha-hospital.jpg'],
    placeIds: [38],
    caption: 'Apeksha Hospital Maharagama (National Cancer Institute) specialized oncology center'
  },
  {
    name: 'eye hospital',
    src: path.join(uploadsDir, 'media_1794139265541_6d05c11c.jpg'),
    destNames: ['national-eye-hospital.jpg'],
    placeIds: [36],
    caption: 'National Eye Hospital Colombo 10 specialized ophthalmic referral hospital'
  }
];

const clientPlacesDir = path.resolve(__dirname, '../../client/public/places');
const serverPlacesDir = path.resolve(__dirname, '../uploads/places');

async function run() {
  console.log('--- Step 1: Copying images ---');
  if (!fs.existsSync(clientPlacesDir)) fs.mkdirSync(clientPlacesDir, { recursive: true });
  if (!fs.existsSync(serverPlacesDir)) fs.mkdirSync(serverPlacesDir, { recursive: true });

  for (const item of mappings) {
    if (!fs.existsSync(item.src)) {
      console.error(`Source file not found: ${item.src}`);
      continue;
    }
    const stat = fs.statSync(item.src);
    console.log(`Found source for ${item.name}: ${item.src} (${stat.size} bytes)`);

    for (const destName of item.destNames) {
      const clientDest = path.join(clientPlacesDir, destName);
      const serverDest = path.join(serverPlacesDir, destName);

      fs.copyFileSync(item.src, clientDest);
      fs.copyFileSync(item.src, serverDest);

      console.log(`  -> Copied to client: ${clientDest} (${fs.statSync(clientDest).size} bytes)`);
      console.log(`  -> Copied to server: ${serverDest} (${fs.statSync(serverDest).size} bytes)`);
    }
  }

  console.log('\n--- Step 2: Verifying & Updating Database Records ---');
  for (const item of mappings) {
    for (const placeId of item.placeIds) {
      const place = await Place.findByPk(placeId, {
        include: [{ model: Photograph, as: 'photographs' }]
      });

      if (!place) {
        console.warn(`Place ${placeId} not found in database!`);
        continue;
      }

      console.log(`Place #${place.id}: "${place.name}"`);
      // Update or create photograph
      const existingPhotos = place.photographs || [];
      const primaryUrl = `/places/${item.destNames[0]}`;

      if (existingPhotos.length > 0) {
        for (const photo of existingPhotos) {
          await photo.update({
            url: primaryUrl,
            caption: item.caption,
            isCover: true
          });
          console.log(`  Updated Photograph #${photo.id}: url=${photo.url}`);
        }
      } else {
        const newPhoto = await Photograph.create({
          placeId: place.id,
          url: primaryUrl,
          caption: item.caption,
          isCover: true
        });
        console.log(`  Created Photograph #${newPhoto.id}: url=${newPhoto.url}`);
      }
    }
  }

  console.log('\n--- Done applying custom user photos! ---');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

