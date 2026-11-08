import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion';
import {
  Hospital,
  GraduationCap,
  Landmark,
  Building2,
  Utensils,
  ShoppingBag,
  Hotel,
  ArrowRight,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { cardReveal3D, reducedMotionVariants } from '../utils/animations';
import use3DCardTilt from '../hooks/use3DCardTilt';

const ICON_MAP = {
  Hospital,
  GraduationCap,
  Landmark,
  Building2,
  Utensils,
  ShoppingBag,
  Hotel
};

const CATEGORY_IMAGES = {
  'hospitals-healthcare': '/places/national-hospital-colombo.jpg',
  'universities-education': '/places/uoc-science-faculty.jpg',
  'banks-financial-services': '/places/boc-tower-colombo.jpg',
  'government-offices': '/places/colombo-town-hall.jpg',
  'restaurants-cafes': '/places/arcade-independence-square.jpg',
  'shopping-public-places': '/places/one-galle-face-mall.jpg',
  'hotels-accommodation': '/places/galle-face-hotel.jpg',
  'corporate-headquarters': '/places/colombo-city-centre.jpg',
  'transport-travel': '/places/colombo-fort-station.jpg',
  'cultural-public-attractions': '/places/independence-memorial-hall.jpg'
};

export const CategoryCard = ({ category, index = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const { user, promptLogin } = useAuth();
  const { t, translateCategory } = usePreferences();
  const IconComponent = ICON_MAP[category.iconName] || Building2;
  const bgImage =
    CATEGORY_IMAGES[category.slug] ||
    '/places/colombo-city-centre.jpg';

  const categoryTitle = translateCategory(category.slug || category.name) || category.name;

  // Responsive 3D physics tilt with touch fallback
  const {
    cardRef,
    isHovered,
    isTouchDevice,
    disable3D,
    rotateX,
    rotateY,
    sheenX,
    sheenY,
    panX,
    panY,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  } = use3DCardTilt({ maxTilt: 8, stiffness: 260, damping: 20 });

  // Dynamic light sheen following cursor on desktop
  const spotlightBg = useMotionTemplate`radial-gradient(circle 260px at ${sheenX} ${sheenY}, rgba(255, 255, 255, 0.28), rgba(233, 165, 141, 0.18) 32%, transparent 75%)`;

  const handleCategoryClick = (e) => {
    if (!user) {
      e.preventDefault();
      promptLogin({
        title: `Sign In to Explore ${categoryTitle}`,
        message: `Create your account or sign in to explore all accessible ${categoryTitle} locations in Colombo with interactive maps and filters.`,
        actionName: `explore ${categoryTitle} directory`,
        redirectPath: `/explore?categorySlug=${category.slug}`
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
      custom={{ delay: (index % 4) * 0.07 }}
      className={`h-full ${disable3D ? '' : '[perspective:1000px]'}`}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: disable3D ? 'flat' : 'preserve-3d'
        }}
        whileHover={
          disable3D
            ? {}
            : {
                y: -8,
                transition: { type: 'spring', stiffness: 320, damping: 22 }
              }
        }
        whileTap={{
          scale: 0.97,
          transition: { type: 'spring', stiffness: 400, damping: 25 }
        }}
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-empoway-blush/60 hover:border-empoway-peach shadow-card transition-colors duration-300 flex flex-col justify-end min-h-[160px] sm:min-h-[190px] md:min-h-[210px] h-full select-none"
      >
        <Link
          to={`/explore?categorySlug=${category.slug}`}
          onClick={handleCategoryClick}
          className="absolute inset-0 z-30 focus:outline-none focus:ring-2 focus:ring-empoway-terracotta rounded-2xl sm:rounded-3xl"
          aria-label={`Explore ${categoryTitle}`}
        />

        {/* Dynamic Interactive Cursor Spotlight Sheen (Desktop Only) */}
        {!disable3D && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: spotlightBg
            }}
          />
        )}

        {/* Dynamic Border Shimmer on Hover */}
        <div
          className={`pointer-events-none absolute inset-0 z-25 rounded-2xl sm:rounded-3xl border-2 border-empoway-peach/50 transition-opacity duration-300 ${
            isHovered && !isTouchDevice ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Background Photography with Responsive Sizing */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            src={bgImage}
            alt={categoryTitle}
            style={{
              x: panX,
              y: panY
            }}
            className="w-[108%] h-[108%] -top-[4%] -left-[4%] relative object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-empoway-coffee/95 via-empoway-coffee/60 to-empoway-coffee/20 transition-colors duration-300" />
        </div>

        {/* Card Content with Responsive Padding & 3D Layering */}
        <div
          className="relative z-10 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between h-full pointer-events-none"
          style={{ transform: disable3D ? 'none' : 'translateZ(24px)' }}
        >
          {/* Top Row: Floating Icon + Count Badge */}
          <div className="flex items-center justify-between mb-auto gap-2">
            <div
              style={{ transform: disable3D ? 'none' : 'translateZ(38px)' }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center group-hover:bg-empoway-terracotta group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md shrink-0"
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <span
              style={{ transform: disable3D ? 'none' : 'translateZ(28px)' }}
              className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md text-white/95 border border-white/20 flex items-center gap-1 shadow-sm group-hover:border-empoway-peach/50 transition-colors truncate"
            >
              {!user && <Lock className="w-2.5 h-2.5 text-empoway-peach shrink-0" />}
              <span className="truncate">
                {category.placeCount || 0} {t('placesCount')}
              </span>
            </span>
          </div>

          {/* Bottom Row: Title + Animated Spring Arrow */}
          <div
            className="pt-4 sm:pt-6 flex items-end justify-between gap-2"
            style={{ transform: disable3D ? 'none' : 'translateZ(32px)' }}
          >
            <div className="min-w-0 pr-1">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-empoway-peach/90 block mb-0.5 opacity-90">
                Directory
              </span>
              <h3 className="text-xs sm:text-base md:text-lg font-bold text-white group-hover:text-empoway-peach transition-colors duration-200 leading-snug drop-shadow-sm line-clamp-2">
                {categoryTitle}
              </h3>
            </div>

            <div
              style={{ transform: disable3D ? 'none' : 'translateZ(34px)' }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center text-white/90 group-hover:text-white group-hover:bg-empoway-terracotta shrink-0 group-hover:translate-x-1.5 group-hover:scale-105 transition-all duration-300 shadow-sm"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;
