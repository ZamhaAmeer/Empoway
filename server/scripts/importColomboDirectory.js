const { sequelize, Category, Organization, Place, AccessibilityFeature, User } = require('../models');
const { initDatabase } = require('../config/database');
const { ORGANIZATIONS, PLACES } = require('../seeders/colomboDistrictDirectoryData');

const importColomboDirectory = async () => {
  try {
    console.log('================================================================');
    console.log('  EMPOWAY – Importing Colombo District Organisation Directory');
    console.log('================================================================');

    await initDatabase();
    await sequelize.sync({ alter: true });

    // 1. Ensure all categories exist
    const newCategories = [
      {
        name: 'Corporate Organisations and Headquarters',
        slug: 'corporate-headquarters',
        iconName: 'Building',
        description: 'Large commercial headquarters, corporate offices and enterprise towers.',
        displayOrder: 8
      },
      {
        name: 'Transport and Travel Hubs',
        slug: 'transport-travel',
        iconName: 'Train',
        description: 'Major railway stations, bus interchanges, multimodal terminals and transit facilities.',
        displayOrder: 9
      },
      {
        name: 'Cultural, Parks and Public Sites',
        slug: 'cultural-public-attractions',
        iconName: 'Landmark',
        description: 'Libraries, national museums, public parks, sports stadiums and exhibition centres.',
        displayOrder: 10
      }
    ];

    for (const cat of newCategories) {
      const [record, created] = await Category.findOrCreate({
        where: { slug: cat.slug },
        defaults: cat
      });
      if (created) {
        console.log(`[Category] Created new category: ${cat.name}`);
      }
    }

    const allCategories = await Category.findAll();
    const categoryMap = {};
    allCategories.forEach((c) => {
      categoryMap[c.slug] = c.id;
    });

    // 2. Upsert Organizations
    console.log(`\n[Organisations] Processing ${ORGANIZATIONS.length} parent organisations...`);
    const orgMap = {};
    let orgCreatedCount = 0;
    let orgUpdatedCount = 0;

    for (const orgData of ORGANIZATIONS) {
      let org = await Organization.findOne({ where: { code: orgData.code } });
      if (!org) {
        org = await Organization.create(orgData);
        orgCreatedCount++;
      } else {
        await org.update(orgData);
        orgUpdatedCount++;
      }
      orgMap[orgData.code] = org.id;
    }
    console.log(`[Organisations] Finished: ${orgCreatedCount} created, ${orgUpdatedCount} updated.`);

    // 3. Upsert Places / Branches
    console.log(`\n[Places] Processing ${PLACES.length} Colombo District places & branches...`);
    let placeCreatedCount = 0;
    let placeUpdatedCount = 0;
    const areasCovered = new Set();
    const categoriesCovered = new Set();

    for (const pData of PLACES) {
      const orgId = pData.organizationCode ? orgMap[pData.organizationCode] : null;
      const categoryId = categoryMap[pData.categorySlug] || categoryMap['government-offices'] || 1;

      areasCovered.add(pData.cityOrArea);
      categoriesCovered.add(pData.categorySlug);

      // Check if place exists by exact or matching name
      let place = await Place.findOne({
        where: { name: pData.name }
      });

      if (!place) {
        // Create place with initial status NOT_YET_ASSESSED
        place = await Place.create({
          name: pData.name,
          organizationId: orgId,
          branchName: pData.branchName,
          categoryId,
          address: pData.address,
          district: 'Colombo',
          cityOrArea: pData.cityOrArea,
          latitude: pData.latitude,
          longitude: pData.longitude,
          description: pData.description,
          contactPhone: pData.contactPhone,
          contactEmail: pData.contactEmail,
          contactWebsite: pData.contactWebsite,
          institutionType: pData.institutionType || 'public',
          dataSource: pData.dataSource,
          accessibilityStatus: 'NOT_YET_ASSESSED',
          approvalStatus: 'APPROVED'
        });

        // Initialize empty assessment checklist (All features UNKNOWN as required)
        await AccessibilityFeature.create({
          placeId: place.id,
          stepFreeEntrance: 'UNKNOWN',
          wheelchairRamp: 'UNKNOWN',
          elevator: 'UNKNOWN',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'UNKNOWN',
          wheelchairPathways: 'UNKNOWN',
          accessibleCounters: 'UNKNOWN',
          featureNotes: 'Initial directory listing across Colombo District. Accessibility audit has not yet been physically verified.'
        });

        placeCreatedCount++;
      } else {
        // Update metadata & link to parent organisation without overwriting any existing physical verification
        const updateFields = {
          district: 'Colombo',
          organizationId: orgId || place.organizationId,
          branchName: pData.branchName || place.branchName,
          dataSource: pData.dataSource || place.dataSource,
          institutionType: pData.institutionType || place.institutionType
        };
        // Update contact/coords if previously empty
        if (!place.latitude || place.latitude === 0) updateFields.latitude = pData.latitude;
        if (!place.longitude || place.longitude === 0) updateFields.longitude = pData.longitude;
        if (!place.contactPhone) updateFields.contactPhone = pData.contactPhone;
        if (!place.contactWebsite) updateFields.contactWebsite = pData.contactWebsite;

        await place.update(updateFields);

        // Ensure accessibilityFeature exists
        const feat = await AccessibilityFeature.findOne({ where: { placeId: place.id } });
        if (!feat) {
          await AccessibilityFeature.create({
            placeId: place.id,
            stepFreeEntrance: 'UNKNOWN',
            wheelchairRamp: 'UNKNOWN',
            elevator: 'UNKNOWN',
            accessibleToilet: 'UNKNOWN',
            accessibleParking: 'UNKNOWN',
            wideDoorways: 'UNKNOWN',
            wheelchairPathways: 'UNKNOWN',
            accessibleCounters: 'UNKNOWN'
          });
        }

        placeUpdatedCount++;
      }
    }

    const totalPlacesInColombo = await Place.count({ where: { district: 'Colombo' } });
    const totalOrganizations = await Organization.count();
    const notYetAssessedCount = await Place.count({ where: { accessibilityStatus: 'NOT_YET_ASSESSED' } });
    const verifiedCount = await Place.count({ where: { accessibilityStatus: 'VERIFIED' } });

    console.log('\n================================================================');
    console.log('  COLOMBO DISTRICT DIRECTORY IMPORT SUMMARY:');
    console.log('================================================================');
    console.log(`  Total Places in Colombo District: ${totalPlacesInColombo}`);
    console.log(`  Newly Added Directory Places:     ${placeCreatedCount}`);
    console.log(`  Updated / Linked Places:          ${placeUpdatedCount}`);
    console.log(`  Total Parent Organisations:       ${totalOrganizations}`);
    console.log(`  Not Yet Assessed (Initial State): ${notYetAssessedCount}`);
    console.log(`  Physically Verified Places:       ${verifiedCount}`);
    console.log(`  Unique Areas Covered:             ${areasCovered.size} areas (${Array.from(areasCovered).join(', ')})`);
    console.log(`  Unique Categories Covered:        ${categoriesCovered.size} categories`);
    console.log('================================================================\n');

    return {
      success: true,
      totalPlacesInColombo,
      placeCreatedCount,
      placeUpdatedCount,
      totalOrganizations,
      notYetAssessedCount,
      verifiedCount,
      areasCovered: Array.from(areasCovered),
      categoriesCovered: Array.from(categoriesCovered)
    };
  } catch (error) {
    console.error('[Import Error]', error);
    throw error;
  }
};

if (require.main === module) {
  importColomboDirectory()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = importColomboDirectory;
