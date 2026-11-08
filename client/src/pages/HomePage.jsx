import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileCheck2,
  Sparkles,
  Lock,
  UserPlus,
  LogIn,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import HeroCarousel from '../components/HeroCarousel';
import CategoryCard from '../components/CategoryCard';
import PlaceCard from '../components/PlaceCard';
import {
  staggerContainer,
  deckStagger,
  cardReveal,
  cardReveal3D,
  fadeInUp,
  reducedMotionVariants
} from '../utils/animations';

export const HomePage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { user, promptLogin } = useAuth();
  const { t, translateCategory } = usePreferences();
  const [categories, setCategories] = useState([]);
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [searchName, setSearchName] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, placesRes, statsRes] = await Promise.all([
          api.getCategories(),
          api.getSamplePreviewPlaces(),
          api.getPublicStats()
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (placesRes.success) setFeaturedPlaces((placesRes.places || []).slice(0, 3));
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchName.trim()) params.append('search', searchName.trim());
    if (searchLocation.trim()) params.append('cityOrArea', searchLocation.trim());
    if (searchCategory) params.append('categorySlug', searchCategory);

    if (!user) {
      promptLogin({
        title: 'Sign In to Access Advanced Search',
        message: 'Create your account or sign in to search and filter verified accessible places across Colombo.',
        actionName: 'search and filter places',
        redirectPath: `/explore?${params.toString()}`
      });
      return;
    }

    navigate(`/explore?${params.toString()}`);
  };

  const handleQuickAreaSearch = (area) => {
    if (!user) {
      promptLogin({
        title: `Sign In to Explore ${area}`,
        message: `Create your account or sign in to explore accessible locations in ${area} with interactive maps.`,
        actionName: `explore ${area}`,
        redirectPath: `/explore?cityOrArea=${encodeURIComponent(area)}`
      });
      return;
    }
    navigate(`/explore?cityOrArea=${encodeURIComponent(area)}`);
  };

  return (
    <div className="pb-24">
      {/* 1. CINEMATIC HERO IMAGE CAROUSEL */}
      <HeroCarousel />

      <div className="space-y-20 md:space-y-28">
        {/* 2. STREAMLINED SEARCH SECTION */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-30"
        >
          <div className="bg-white dark:bg-[#241a15] rounded-3xl p-5 sm:p-7 border border-empoway-blush/60 dark:border-[#3d2c24] shadow-elevated transition-shadow duration-300">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Place Name Input */}
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-empoway-terracotta" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder={t('placeNamePlaceholder')}
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl bg-empoway-ivory dark:bg-[#1a120e] border border-empoway-blush dark:border-[#443229] text-empoway-coffee dark:text-empoway-ivory placeholder:text-empoway-muted/70 focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
                />
              </div>

              {/* Area Input */}
              <div className="md:col-span-3 relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-empoway-caramel" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder={t('areaPlaceholder')}
                  className="w-full pl-10 pr-3 py-3 text-xs rounded-xl bg-empoway-ivory dark:bg-[#1a120e] border border-empoway-blush dark:border-[#443229] text-empoway-coffee dark:text-empoway-ivory placeholder:text-empoway-muted/70 focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
                />
              </div>

              {/* Category Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full py-3 px-3 text-xs rounded-xl bg-empoway-ivory dark:bg-[#1a120e] border border-empoway-blush dark:border-[#443229] text-empoway-coffee dark:text-empoway-ivory focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {translateCategory(cat.slug || cat.name) || cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-soft hover:shadow-card flex items-center justify-center gap-2 active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('searchButton')}</span>
                </button>
              </div>
            </form>

            {/* Quick Area Pills */}
            <div className="mt-3.5 pt-3 border-t border-empoway-cream dark:border-[#382820] flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-empoway-muted uppercase tracking-wider">
                {t('popularAreas')}
              </span>
              {['Colombo 07', 'Colombo Fort', 'Kollupitiya', 'Borella', 'Galle Face'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleQuickAreaSearch(area)}
                  className="px-2.5 py-1 rounded-lg bg-empoway-cream dark:bg-[#2b1e18] hover:bg-empoway-peach/25 text-empoway-coffee dark:text-empoway-ivory text-[11px] font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3. CLEAN IMPACT METRICS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                label: t('totalPlacesAssessed'),
                val: stats ? stats.totalPlaces : '33',
                color: 'text-empoway-terracotta'
              },
              {
                label: t('physicallyVerified'),
                val: stats ? stats.verifiedPlaces : '18',
                color: 'text-emerald-600 dark:text-emerald-400'
              },
              {
                label: t('communityReports'),
                val: stats ? stats.communityReported : '10',
                color: 'text-amber-600 dark:text-amber-400'
              },
              {
                label: t('communityAdvocates'),
                val: stats ? stats.communityContributors : '14',
                color: 'text-empoway-coffee dark:text-empoway-peach'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
                whileHover={
                  shouldReduceMotion
                    ? {}
                    : {
                      y: -6,
                      scale: 1.025,
                      transition: { type: 'spring', stiffness: 320, damping: 20 }
                    }
                }
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-[#241a15] p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-empoway-blush/60 dark:border-[#3d2c24] hover:border-empoway-peach shadow-soft hover:shadow-[0_20px_40px_-12px_rgba(185,111,84,0.25)] text-center group transition-colors duration-300"
              >
                <span className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${item.color} block tracking-tight group-hover:scale-105 transition-transform duration-200`}>
                  {item.val}
                </span>
                <span className="text-[11px] sm:text-xs md:text-sm font-bold text-empoway-coffee dark:text-empoway-ivory block mt-1 leading-snug">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 4. EXPLORE BY CATEGORY */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" id="categories">
          <div className="flex items-end justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-empoway-terracotta block mb-1">
                {t('browseByCategory')}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-empoway-coffee dark:text-white tracking-tight">
                {t('exploreFacilityType')}
              </h2>
            </div>

            <Link
              to="/explore"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to View All Categories',
                    message: 'Create your account or sign in to explore all public facilities and categories across Colombo.',
                    actionName: 'explore all categories',
                    redirectPath: '/explore'
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-empoway-terracotta hover:underline shrink-0"
            >
              <span>{t('viewFullDirectory')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={deckStagger}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          >
            {categories.slice(0, 8).map((cat, idx) => (
              <CategoryCard key={cat.id} category={cat} index={idx} />
            ))}
          </motion.div>
        </section>

        {/* 5. THREE PILLARS (Clean, Visual & Minimalist) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee dark:text-white tracking-tight">
              Built for Independence & Confidence
            </h2>
            <p className="text-xs sm:text-sm text-empoway-muted dark:text-empoway-peach/70 mt-1.5">
              Clear physical measurements and verified facts before you leave home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
              variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
              custom={{ delay: 0 }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                    y: -6,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 320, damping: 20 }
                  }
              }
              whileTap={{ scale: 0.98 }}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#241a15] border border-empoway-blush/60 dark:border-[#3d2c24] hover:border-empoway-peach shadow-soft hover:shadow-[0_20px_40px_-12px_rgba(185,111,84,0.25)] space-y-3 group transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-empoway-coffee dark:text-white group-hover:text-empoway-terracotta transition-colors duration-200">
                Physically Audited
              </h3>
              <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 leading-relaxed">
                Ramp slopes, doorway widths (85cm+), and elevator access verified on-site with photographic proof.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
              variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
              custom={{ delay: 0.08 }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                    y: -6,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 320, damping: 20 }
                  }
              }
              whileTap={{ scale: 0.98 }}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#241a15] border border-empoway-blush/60 dark:border-[#3d2c24] hover:border-empoway-peach shadow-soft hover:shadow-[0_20px_40px_-12px_rgba(185,111,84,0.25)] space-y-3 group transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-empoway-coffee dark:text-white group-hover:text-empoway-terracotta transition-colors duration-200">
                Zero Guesswork
              </h3>
              <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 leading-relaxed">
                Transparent status badges: Verified, Community Reported, or Unknown. Never assume accessibility without data.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15, margin: '0px 0px -40px 0px' }}
              variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
              custom={{ delay: 0.16 }}
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                    y: -6,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 320, damping: 20 }
                  }
              }
              whileTap={{ scale: 0.98 }}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#241a15] border border-empoway-blush/60 dark:border-[#3d2c24] hover:border-empoway-peach shadow-soft hover:shadow-[0_20px_40px_-12px_rgba(185,111,84,0.25)] space-y-3 group transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-empoway-peach/20 dark:bg-empoway-coffee text-empoway-terracotta flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-empoway-coffee dark:text-white group-hover:text-empoway-terracotta transition-colors duration-200">
                Smart Assistance
              </h3>
              <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 leading-relaxed">
                Consult our AI Assistant for instant wheelchair advice, accessible restrooms, and route recommendations across Colombo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 6. SAMPLE PLACE PREVIEWS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-empoway-terracotta block mb-1">
                {t('featuredAudits')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee dark:text-white tracking-tight">
                {t('physicalPreviews')}
              </h2>
            </div>

            <Link
              to="/explore"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Explore All Places',
                    message: 'Create your account or sign in to explore all public locations in Colombo with interactive maps and complete accessibility details.',
                    actionName: 'explore complete directory',
                    redirectPath: '/explore'
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-empoway-terracotta hover:underline shrink-0"
            >
              <span>{t('viewAllPlaces')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={deckStagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {featuredPlaces.slice(0, 3).map((place, idx) => (
              <PlaceCard key={place.id} place={place} index={idx} isSample={true} />
            ))}
          </motion.div>
        </section>

        {/* 7. ELEGANT REGISTRATION CTA */}
        <motion.section
          id="register-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={shouldReduceMotion ? reducedMotionVariants : fadeInUp}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-empoway-coffee dark:bg-[#1f1713] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-elevated border border-empoway-blush/20">
            <div className="max-w-2xl mx-auto text-center space-y-5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-empoway-peach border border-white/15">
                <UserPlus className="w-3.5 h-3.5" />
                <span>EMPOWAY Community</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                {t('bePartOfAccessibleSL')}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal max-w-lg mx-auto">
                {t('registerBannerDesc')}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-card hover:scale-105 active:scale-98"
                >
                  {t('createAccountBtn')}
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 hover:scale-105 active:scale-98"
                >
                  {t('signInBtn')}
                </Link>
              </div>

              {/* Trust Badges in a single sleek row */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/70">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free Access</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-empoway-peach" />
                  <span>Verified Public Audits</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Colombo District Pilot</span>
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
