const { sequelize, Place, Photograph, Category } = require('../models');
const { initDatabase } = require('../config/database');

async function check() {
  await initDatabase();
  const places = await Place.findAll({
    attributes: ['id', 'name', 'branchName', 'cityOrArea'],
    include: [
      {
        model: Photograph,
        as: 'photographs',
        attributes: ['id', 'url', 'caption', 'isCover']
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }
    ],
    order: [['id', 'ASC']]
  });

  console.log(`Total places in DB: ${places.length}`);
  const summary = places.map(p => ({
    id: p.id,
    name: p.name,
    area: p.cityOrArea,
    category: p.category?.name,
    photoCount: p.photographs?.length || 0,
    coverPhoto: p.photographs?.find(ph => ph.isCover)?.url || p.photographs?.[0]?.url || 'NONE',
    caption: p.photographs?.find(ph => ph.isCover)?.caption || p.photographs?.[0]?.caption || ''
  }));

  console.log(JSON.stringify(summary.slice(0, 15), null, 2));
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});

