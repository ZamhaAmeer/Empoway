import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutGrid,
  List,
  Map as MapIcon,
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Building2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import MapView from '../components/MapView';
import FilterPanel from '../components/FilterPanel';
import StatusBadge from '../components/StatusBadge';
import { usePreferences } from '../context/PreferencesContext';
import { deckStagger, reducedMotionVariants } from '../utils/animations';

export const ExplorePage = () => {
  const { t, translateCategory, translateStatus, mobilityProfile } = usePreferences();
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorySlug') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');
  const [selectedOrganization, setSelectedOrganization] = useState(searchParams.get('organizationId') || '');
  const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlacesCount, setTotalPlacesCount] = useState(0);

  const [featureFilters, setFeatureFilters] = useState({
    stepFreeEntrance: '',
    wheelchairRamp: '',
    elevator: '',
    accessibleToilet: '',
    accessibleParking: '',
    wideDoorways: '',
    wheelchairPathways: '',
    accessibleCounters: ''
  });

  // View state: 'grid' | 'list' | 'map' | 'split'
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with searchParams on mount or param changes
  useEffect(() => {
    const qSearch = searchParams.get('search');
    const qCat = searchParams.get('categorySlug');
    const qStatus = searchParams.get('status');
    const qArea = searchParams.get('area');
    const qOrg = searchParams.get('organizationId');
    if (qSearch !== null) setSearch(qSearch);
    if (qCat !== null) setSelectedCategory(qCat);
    if (qStatus !== null) setSelectedStatus(qStatus);
    if (qArea !== null) setSelectedArea(qArea);
    if (qOrg !== null) setSelectedOrganization(qOrg);
  }, [searchParams]);

  // Load Metadata (Categories, Areas, Organizations) once
  useEffect(() => {
    const loadDirectoryMeta = async () => {
      try {
        const [catRes, areaRes, orgRes] = await Promise.all([
          api.getCategories(),
          api.getAreas(),
          api.getOrganizations()
        ]);
        if (catRes.success) setCategories(catRes.categories || []);
        if (areaRes.success) setAreas(areaRes.areas || []);
        if (orgRes.success) setOrganizations(orgRes.organizations || []);
      } catch (err) {
        console.error('Error loading directory metadata:', err);
      }
    };
    loadDirectoryMeta();
  }, []);

  // Fetch places whenever filters or page change
  useEffect(() => {
    const fetchFilteredPlaces = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          categorySlug: selectedCategory || undefined,
          cityOrArea: selectedArea || undefined,
          organizationId: selectedOrganization || undefined,
          institutionType: selectedSector || undefined,
          status: selectedStatus || undefined,
          sortBy,
          page: currentPage,
          limit: viewMode === 'map' ? 100 : 18,
          district: 'Colombo',
          mobilityProfile: mobilityProfile?.type || 'manual_wheelchair'
        };

        // Add feature filters if set to AVAILABLE
        Object.entries(featureFilters).forEach(([key, val]) => {
          if (val) params[key] = val;
        });

        const res = await api.getPlaces(params);
        if (res.success) {
          setPlaces(res.places || []);
          setTotalPlacesCount(res.totalCount || res.places?.length || 0);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredPlaces();
  }, [
    search,
    selectedCategory,
    selectedArea,
    selectedOrganization,
    selectedSector,
    selectedStatus,
    featureFilters,
    sortBy,
    currentPage,
    viewMode,
    mobilityProfile?.type
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedArea('');
    setSelectedOrganization('');
    setSelectedSector('');
    setSelectedStatus('');
    setSortBy('recent');
    setCurrentPage(1);
    setFeatureFilters({
      stepFreeEntrance: '',
      wheelchairRamp: '',
      elevator: '',
      accessibleToilet: '',
      accessibleParking: '',
      wideDoorways: '',
      wheelchairPathways: '',
      accessibleCounters: ''
    });
    setSearchParams({});
  };

  const activeFeatureCount = Object.values(featureFilters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-empoway-blush/60 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-empoway-muted mb-1">
            <span>EMPOWAY</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-empoway-terracotta font-semibold">{t('exploreBreadcrumb', 'Colombo Directory')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee">
            {t('exploreTitle')}
          </h1>
          <p className="text-xs text-empoway-muted mt-1">
            {t('exploreSubtitle')}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 rounded-xl bg-white border border-empoway-blush flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'grid'
                  ? 'bg-empoway-cream text-empoway-terracotta'
                  : 'text-empoway-coffee hover:bg-empoway-cream/50'
                }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t('grid')}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'list'
                  ? 'bg-empoway-cream text-empoway-terracotta'
                  : 'text-empoway-coffee hover:bg-empoway-cream/50'
                }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('list')}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${viewMode === 'map'
                  ? 'bg-empoway-cream text-empoway-terracotta'
                  : 'text-empoway-coffee hover:bg-empoway-cream/50'
                }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{t('map')}</span>
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-empoway-cream border border-empoway-champagne text-empoway-coffee text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-empoway-terracotta" />
            <span>Filters {activeFeatureCount > 0 && `(${activeFeatureCount})`}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <FilterPanel
            search={search}
            setSearch={(val) => { setSearch(val); setCurrentPage(1); }}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
            areas={areas}
            selectedArea={selectedArea}
            setSelectedArea={(val) => { setSelectedArea(val); setCurrentPage(1); }}
            organizations={organizations}
            selectedOrganization={selectedOrganization}
            setSelectedOrganization={(val) => { setSelectedOrganization(val); setCurrentPage(1); }}
            selectedSector={selectedSector}
            setSelectedSector={(val) => { setSelectedSector(val); setCurrentPage(1); }}
            selectedStatus={selectedStatus}
            setSelectedStatus={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
            featureFilters={featureFilters}
            setFeatureFilters={(val) => { setFeatureFilters(val); setCurrentPage(1); }}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Modal/Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto p-4 border border-empoway-blush">
              <FilterPanel
                search={search}
                setSearch={(val) => { setSearch(val); setCurrentPage(1); }}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={(val) => { setSelectedCategory(val); setCurrentPage(1); }}
                areas={areas}
                selectedArea={selectedArea}
                setSelectedArea={(val) => { setSelectedArea(val); setCurrentPage(1); }}
                organizations={organizations}
                selectedOrganization={selectedOrganization}
                setSelectedOrganization={(val) => { setSelectedOrganization(val); setCurrentPage(1); }}
                selectedSector={selectedSector}
                setSelectedSector={(val) => { setSelectedSector(val); setCurrentPage(1); }}
                selectedStatus={selectedStatus}
                setSelectedStatus={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
                featureFilters={featureFilters}
                setFeatureFilters={(val) => { setFeatureFilters(val); setCurrentPage(1); }}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onReset={handleResetFilters}
              />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-2.5 rounded-xl bg-empoway-terracotta text-white font-bold text-xs"
              >
                Apply & View ({totalPlacesCount} places)
              </button>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Chips Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-3 rounded-2xl border border-empoway-blush/60 shadow-xs text-xs text-empoway-coffee">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold">
                Showing {places.length} of {totalPlacesCount} {totalPlacesCount === 1 ? 'place' : 'places'}
              </span>
              {selectedArea && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-empoway-cream border border-empoway-champagne text-[11px] font-semibold text-empoway-coffee">
                  📍 {selectedArea}
                </span>
              )}
              {selectedOrganization && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-empoway-cream border border-empoway-champagne text-[11px] font-semibold text-empoway-coffee">
                  🏛️ {organizations.find((o) => String(o.id) === String(selectedOrganization))?.name || 'Organization'}
                </span>
              )}
              {selectedSector && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-empoway-cream border border-empoway-champagne text-[11px] font-semibold text-empoway-coffee uppercase">
                  {selectedSector}
                </span>
              )}
              {selectedStatus && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-empoway-cream border border-empoway-champagne text-[11px] font-semibold text-empoway-coffee">
                  {selectedStatus.replace('_', ' ')}
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-empoway-cream border border-empoway-champagne text-[11px] font-semibold text-empoway-coffee">
                  {translateCategory(selectedCategory) || selectedCategory}
                </span>
              )}
            </div>

            <span className="text-empoway-muted text-[11px]">
              Colombo District Directory
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-empoway-blush/60">
              <div className="w-10 h-10 border-4 border-empoway-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-empoway-muted font-medium">
                Loading accessibility directory...
              </p>
            </div>
          ) : places.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-4 bg-white rounded-3xl border border-empoway-blush shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-empoway-cream text-empoway-terracotta flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-empoway-coffee">
                {t('noPlacesFound')}
              </h3>
              <p className="text-xs text-empoway-muted max-w-md mx-auto leading-relaxed">
                {t('adjustFilters')}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-empoway-terracotta text-white hover:bg-empoway-terracotta-dark transition-all shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('resetFiltersBtn')}</span>
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Full Map View */
            <div className="space-y-4">
              <MapView places={places} height="600px" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {places.slice(0, 4).map((place, idx) => (
                  <PlaceCard key={place.id} place={place} index={idx} />
                ))}
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* List View with Scroll Reveal */
            <div className="space-y-3 sm:space-y-4">
              {places.map((place, idx) => (
                <motion.div
                  key={place.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1, margin: '0px 0px -30px 0px' }}
                  variants={shouldReduceMotion ? reducedMotionVariants : cardReveal}
                  custom={{ delay: (idx % 6) * 0.05 }}
                  className="bg-white dark:bg-[#241a15] rounded-2xl border border-empoway-blush/60 dark:border-[#3d2c24] p-3.5 sm:p-4 shadow-card hover:shadow-elevated transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <img
                      src={
                        place.photographs && place.photographs.length > 0
                          ? place.photographs.find(p => p.isCover)?.url || place.photographs[0].url
                          : '/places/colombo-city-centre.jpg'
                      }
                      alt={place.name}
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith('/places/colombo-city-centre.jpg')) {
                          e.currentTarget.src = '/places/colombo-city-centre.jpg';
                        }
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-empoway-cream"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-empoway-terracotta">
                          {place.category?.name}
                        </span>
                        <span>•</span>
                        <StatusBadge status={place.accessibilityStatus} size="sm" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-empoway-coffee dark:text-white">
                        {place.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-empoway-muted dark:text-empoway-peach/70 line-clamp-1 mt-0.5">
                        {place.address} ({place.cityOrArea})
                      </p>
                    </div>
                  </div>

                  <a
                    href={`/places/${place.id}`}
                    className="shrink-0 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border border-empoway-champagne transition-colors self-stretch sm:self-auto text-center"
                  >
                    View Accessibility Profile &rarr;
                  </a>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Grid View with 3D Deck Cascade */
            <motion.div
              key={`grid-${currentPage}-${selectedCategory}-${selectedArea}-${sortBy}-${search}`}
              initial="hidden"
              animate="visible"
              variants={shouldReduceMotion ? reducedMotionVariants : deckStagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {places.map((place, idx) => (
                <PlaceCard key={place.id} place={place} index={idx} />
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 pt-4 border-t border-empoway-blush/60 flex items-center justify-between text-xs text-empoway-coffee">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-white border border-empoway-blush font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-empoway-cream transition-colors"
              >
                &larr; Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setCurrentPage(num);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl font-bold transition-all ${
                      currentPage === num
                        ? 'bg-empoway-terracotta text-white shadow-xs'
                        : 'bg-white border border-empoway-blush text-empoway-coffee hover:bg-empoway-cream'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl bg-white border border-empoway-blush font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-empoway-cream transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

