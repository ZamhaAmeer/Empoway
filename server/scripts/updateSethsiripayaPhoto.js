const fs = require('fs');
const path = require('path');
const { Place, Photograph } = require('../models');

const newUpload = 'C:/Users/HP/.gemini/antigravity/brain/d75f607d-f073-43c2-bf32-7d98e3618470/.user_uploaded/media_1794197964589_06e1f386.jpg';

const clientDest = path.resolve(__dirname, '../../client/public/places/sethsiripaya-battaramulla.jpg');
const serverDest = path.resolve(__dirname, '../uploads/places/sethsiripaya-battaramulla.jpg');

async function update() {
  console.log('Copying new Sethsiripaya administrative complex image...');
  fs.copyFileSync(newUpload, clientDest);
  fs.copyFileSync(newUpload, serverDest);

  console.log(`Copied to ${clientDest} (${fs.statSync(clientDest).size} bytes)`);
  console.log(`Copied to ${serverDest} (${fs.statSync(serverDest).size} bytes)`);

  console.log('\nUpdating Database Photograph records...');

  // Place 17: Sethsiripaya Stage II
  const p17 = await Place.findByPk(17, { include: [{ model: Photograph, as: 'photographs' }] });
  if (p17 && p17.photographs.length > 0) {
    await p17.photographs[0].update({
      url: '/places/sethsiripaya-battaramulla.jpg',
      caption: 'Sethsiripaya Administrative Complex Stage II Battaramulla ministries complex',
      isCover: true
    });
    console.log(`Updated Place #17 Photo: ${p17.photographs[0].url}`);
  }

  // Place 76: Sethsiripaya Administrative Complex
  const p76 = await Place.findByPk(76, { include: [{ model: Photograph, as: 'photographs' }] });
  if (p76 && p76.photographs.length > 0) {
    await p76.photographs[0].update({
      url: '/places/sethsiripaya-battaramulla.jpg',
      caption: 'Sethsiripaya Administrative Complex Battaramulla government ministries hub',
      isCover: true
    });
    console.log(`Updated Place #76 Photo: ${p76.photographs[0].url}`);
  }

  // Place 16: Suhurupaya
  const p16 = await Place.findByPk(16, { include: [{ model: Photograph, as: 'photographs' }] });
  if (p16 && p16.photographs.length > 0) {
    await p16.photographs[0].update({
      url: '/places/suhurupaya-battaramulla.jpg',
      caption: 'Department of Immigration & Emigration Suhurupaya Battaramulla',
      isCover: true
    });
    console.log(`Updated Place #16 Photo: ${p16.photographs[0].url}`);
  }

  // Place 73: Suhurupaya
  const p73 = await Place.findByPk(73, { include: [{ model: Photograph, as: 'photographs' }] });
  if (p73 && p73.photographs.length > 0) {
    await p73.photographs[0].update({
      url: '/places/suhurupaya-battaramulla.jpg',
      caption: 'Department of Immigration and Emigration "Suhurupaya" Battaramulla',
      isCover: true
    });
    console.log(`Updated Place #73 Photo: ${p73.photographs[0].url}`);
  }

  console.log('\nFinished updating Sethsiripaya and Suhurupaya!');
  process.exit(0);
}

update().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

