const fs = require('fs');
const { Place, Category } = require('../models');
const { initDatabase } = require('../config/database');

async function dump() {
  await initDatabase();
  const places = await Place.findAll({
    attributes: ['id', 'name', 'cityOrArea', 'categoryId'],
    include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    order: [['id', 'ASC']]
  });

  const list = places.map(p => ({
    id: p.id,
    name: p.name,
    city: p.cityOrArea,
    catSlug: p.category?.slug,
    catName: p.category?.name
  }));

  fs.writeFileSync('server/scripts/allPlacesDump.json', JSON.stringify(list, null, 2));
  console.log(`Wrote ${list.length} places to server/scripts/allPlacesDump.json`);
  process.exit(0);
}

dump().catch(console.error);

