import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useReducedMotion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Check,
  X,
  HelpCircle,
  Building2,
  Footprints,
  Maximize,
  ArrowUpDown,
  DoorOpen,
  Car,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { StatusBadge } from './StatusBadge';
import { cardReveal3D, reducedMotionVariants } from '../utils/animations';
import use3DCardTilt from '../hooks/use3DCardTilt';

export const PlaceCard = ({ place, index = 0, isSample = false }) => {
  const shouldReduceMotion = useReducedMotion();
  const { user, isFavorite, toggleFavorite, promptLogin } = useAuth();
  const { t, translateCategory } = usePreferences();
  if (!place) return null;

  const favorited = isFavorite(place.id);

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
  } = use3DCardTilt({ maxTilt: 6.5, stiffness: 280, damping: 22 });

  // Dynamic light sheen following cursor on desktop
  const spotlightBg = useMotionTemplate`radial-gradient(circle 320px at ${sheenX} ${sheenY}, rgba(233, 165, 141, 0.22), rgba(185, 111, 84, 0.08) 35%, transparent 75%)`;

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(place.id, `/places/${place.id}`);
  };

  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault();
      promptLogin({
        title: 'Sign In to View Full Profile',
        message: 'Create your account or sign in to view complete ramp measurements, doorway widths, elevator details, and verified photographs.',
        actionName: 'view full place profile',
        redirectPath: `/places/${place.id}`
      });
    }
  };

  // Cover photo
  const coverPhoto =
    place.photographs && place.photographs.length > 0
      ? place.photographs.find((p) => p.isCover)?.url || place.photographs[0].url
      : '/places/colombo-city-centre.jpg';

  const feat = place.accessibilityFeature || {};

  const quickFeatures = [
    { key: 'ramp', label: t('ramp'), val: feat.wheelchairRamp, icon: Maximize },
    { key: 'stepFree', label: t('stepFree'), val: feat.stepFreeEntrance, icon: Footprints },
    { key: 'elevatorShort', label: t('elevatorShort'), val: feat.elevator, icon: ArrowUpDown },
    { key: 'toilet', label: t('toilet'), val: feat.accessibleToilet, icon: DoorOpen },
    { key: 'parking', label: t('parking'), val: feat.accessibleParking, icon: Car }
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -40px 0px' }}
      variants={shouldReduceMotion ? reducedMotionVariants : cardReveal3D}
      custom={{ delay: (index % 4) * 0.08 }}
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
          scale: 0.98,
          transition: { type: 'spring', stiffness: 400, damping: 25 }
        }}
        className="group relative bg-white dark:bg-[#241a15] rounded-2xl sm:rounded-3xl border border-empoway-blush/60 dark:border-[#3d2c24] hover:border-empoway-peach dark:hover:border-empoway-peach/60 overflow-hidden shadow-soft hover:shadow-[0_24px_50px_-12px_rgba(185,111,84,0.32),0_8px_20px_-4px_rgba(104,70,56,0.18)] transition-colors duration-300 flex flex-col h-full select-none"
      >
        {/* Dynamic Interactive Cursor Spotlight Sheen (Desktop Only) */}
        {!disable3D && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: spotlightBg
            }}
          />
        )}

        {/* Dynamic Border Shimmer on Hover */}
        <div
          className={`pointer-events-none absolute inset-0 z-35 rounded-2xl sm:rounded-3xl border-2 border-empoway-peach/40 dark:border-empoway-peach/30 transition-opacity duration-300 ${
            isHovered && !isTouchDevice ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Image Container with Responsive Height & Zoom */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-empoway-coffee shrink-0">
          <motion.img
            src={coverPhoto}
            alt={place.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + '/places/colombo-city-centre.jpg' && !e.currentTarget.src.endsWith('/places/colombo-city-centre.jpg')) {
                e.currentTarget.src = '/places/colombo-city-centre.jpg';
              }
            }}
            style={{
              x: panX,
              y: panY
            }}
            className="w-[108%] h-[108%] -top-[4%] -left-[4%] relative object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-empoway-coffee/90 via-empoway-coffee/30 to-black/15 group-hover:from-empoway-coffee/75 transition-colors duration-300" />

          {/* Top Badges & Favourites Heart with Responsive Padding */}
          <div
            className="absolute top-2.5 left-2.5 right-2.5 sm:top-3.5 sm:left-3.5 sm:right-3.5 flex items-start justify-between gap-1.5 sm:gap-2 z-10"
            style={{ transform: disable3D ? 'none' : 'translateZ(30px)' }}
          >
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white/95 dark:bg-[#1f1713]/95 text-empoway-coffee dark:text-white backdrop-blur-md shadow-card border border-empoway-blush/60 dark:border-[#3d2c24] group-hover:border-empoway-peach/60 transition-colors">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-empoway-terracotta shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-[130px]">
                {translateCategory(place.category?.slug || place.category?.name) ||
                  place.category?.name ||
                  'Public Place'}
              </span>
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <StatusBadge status={place.accessibilityStatus} size="sm" />

              <motion.button
                type="button"
                onClick={handleFavoriteToggle}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.88 }}
                aria-label={favorited ? 'Remove from favourites' : 'Save to favourites'}
                title={favorited ? 'Saved in favourites' : 'Save to favourites'}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md transition-colors duration-200 shadow-card flex items-center justify-center ${
                  favorited
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/90 dark:bg-black/40 text-stone-600 dark:text-stone-300 hover:text-rose-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Bottom Area Pill & Match Score with Responsive Sizing */}
          <div
            className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3.5 sm:right-3.5 flex items-center justify-between text-white text-xs z-10 gap-1.5"
            style={{ transform: disable3D ? 'none' : 'translateZ(26px)' }}
          >
            <span className="flex items-center gap-1 font-semibold bg-black/55 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] border border-white/20 truncate">
              <MapPin className="w-3 h-3 text-empoway-peach shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[170px]">
                {place.cityOrArea}, {place.district || 'Colombo'}
              </span>
            </span>

            {place.personalMatch && (
              <span
                title={`${place.personalMatch.score}% personal compatibility for your mobility profile`}
                className={`flex items-center gap-1 font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] backdrop-blur-md shadow-sm border shrink-0 ${
                  place.personalMatch.score >= 85
                    ? 'bg-emerald-600/90 text-white border-emerald-400/50'
                    : place.personalMatch.score >= 60
                    ? 'bg-amber-600/90 text-white border-amber-400/50'
                    : 'bg-rose-600/90 text-white border-rose-400/50'
                }`}
              >
                <span>{place.personalMatch.score}% Match</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area with Responsive Padding & Typography */}
        <div
          className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between"
          style={{ transform: disable3D ? 'none' : 'translateZ(20px)' }}
        >
          <div>
            {place.organization && (
              <div className="mb-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-empoway-terracotta">
                <span className="truncate max-w-[170px] sm:max-w-[210px]">{place.organization.name}</span>
                {place.branchName && (
                  <span className="px-1.5 py-0.5 rounded bg-empoway-cream dark:bg-[#34241d] border border-empoway-champagne/80 text-[9px] sm:text-[10px] font-semibold text-empoway-coffee dark:text-empoway-peach shrink-0">
                    {place.branchName}
                  </span>
                )}
              </div>
            )}
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-empoway-coffee dark:text-white group-hover:text-empoway-terracotta transition-colors duration-200 line-clamp-1">
              <Link to={`/places/${place.id}`} onClick={handleProfileClick}>
                {place.name}
              </Link>
            </h3>
            <p className="text-[11px] sm:text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5 sm:mt-1 line-clamp-1">
              {place.address}
            </p>

            {/* Accessible Transport Connection Snippet */}
            {place.transportSummary && (
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-empoway-muted dark:text-empoway-peach/70">
                {place.transportSummary.nearestBusDistance && (
                  <span className="flex items-center gap-1 font-medium">
                    <span>🚌</span>
                    <span>{place.transportSummary.nearestBusDistance} to bus</span>
                  </span>
                )}
                {place.transportSummary.nearestRailStation && (
                  <span className="flex items-center gap-1 font-medium">
                    <span>🚆</span>
                    <span className="truncate max-w-[120px] sm:max-w-[140px]">
                      {place.transportSummary.nearestRailStation.replace(' Railway Station', '')} (
                      {place.transportSummary.nearestRailDistance})
                    </span>
                  </span>
                )}
              </div>
            )}

            {/* Feature Pills with Responsive Wrap & Padding */}
            <div
              className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-empoway-cream dark:border-[#382820] flex flex-wrap gap-1 sm:gap-1.5"
              style={{ transform: disable3D ? 'none' : 'translateZ(26px)' }}
            >
              {quickFeatures.map((f, idx) => {
                const isAvail = f.val === 'AVAILABLE';
                const isNot = f.val === 'NOT_AVAILABLE';
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-semibold border transition-all duration-200 ${
                      isAvail
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-2xs'
                        : isNot
                        ? 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900/60 opacity-70'
                        : 'bg-stone-50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 opacity-60'
                    }`}
                  >
                    <span>{f.label}</span>
                    {isAvail ? (
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : isNot ? (
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 shrink-0" />
                    ) : (
                      <HelpCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400 shrink-0" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Footer Action with Responsive Touch Targets */}
          <div
            className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-empoway-cream dark:border-[#382820] flex items-center justify-between text-xs"
            style={{ transform: disable3D ? 'none' : 'translateZ(24px)' }}
          >
            <span className="text-[10px] sm:text-[11px] text-empoway-muted dark:text-empoway-peach/60 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-empoway-caramel shrink-0" />
              <span className="truncate max-w-[90px] sm:max-w-none">
                {place.lastVerifiedDate ? t('verified') : t('communityLogged')}
              </span>
            </span>

            <Link
              to={`/places/${place.id}`}
              onClick={handleProfileClick}
              className="inline-flex items-center gap-1 font-bold text-empoway-terracotta hover:text-empoway-peach transition-colors py-1 pl-2"
            >
              <span className="text-[11px] sm:text-xs">
                {!user ? t('viewProfileSignIn') : t('viewProfile')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlaceCard;
