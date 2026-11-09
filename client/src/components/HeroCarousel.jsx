import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

/**
 * Verified accessibility hero slides stored locally in /public/images/hero/
 * High-resolution (1920px+ wide) landscape photography representing authentic
 * wheelchair accessibility across healthcare, cultural hubs, commercial centers,
 * and universal public spaces.
 */
export const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero/hero-slide-1.jpg',
    tagline: 'Starting in Colombo, Expanding Across Sri Lanka',
    location: 'Colombo Fort Heritage & Modern Skyline • Colombo 01',
    highlight: 'Accessible Urban Spaces & Public Heritage',
    alt: 'Golden hour panoramic view of historic red-roofed colonial architecture and modern skyscrapers in Colombo Fort'
  },
  {
    id: 2,
    image: '/images/hero/hero-slide-2.jpg',
    tagline: 'Healthcare & Medical Access',
    location: 'Hospitals & Medical Facilities • Colombo 10',
    highlight: 'Accessible Hospital Entrances & Care Support',
    alt: 'Healthcare facility entrance with clear step-free wheelchair accessibility and patient care support'
  },
  {
    id: 3,
    image: '/images/hero/hero-slide-3.jpg',
    tagline: 'Cultural Hubs & Higher Education',
    location: 'Universities, Libraries & Cultural Centers • Colombo 07',
    highlight: 'Spacious Aisles, Elevators & Step-Free Halls',
    alt: 'Grand modern cultural library and civic institution with wide accessible walkways and inclusive design'
  },
  {
    id: 4,
    image: '/images/hero/hero-slide-4.jpg',
    tagline: 'Commercial Hubs & Shopping Centers',
    location: 'Modern Shopping Malls & Retail Hubs • Colombo',
    highlight: 'Level Store Entrances & Wide Shopping Corridors',
    alt: 'Wheelchair user navigating a modern multi-level shopping mall with accessible retail stores and wide concourses'
  },
  {
    id: 5,
    image: '/images/hero/hero-slide-5.jpg',
    tagline: 'Universal Architectural Design',
    location: 'Civic Centers & Public Institutions • Colombo',
    highlight: 'Dedicated Ramps with Double Safety Rails',
    alt: 'Public medical institution building entrance featuring an accessible wheelchair ramp and wide double doors'
  }
];

export const HeroCarousel = () => {
  const { t } = usePreferences();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchEndXRef = useRef(0);
  const touchEndYRef = useRef(0);

  const totalSlides = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  /**
   * Automatic slideshowing:
   * - Starts automatically the moment a visitor enters the website.
   * - Cycles smoothly every 4 seconds (4000ms) in an infinite loop.
   * - Does NOT pause merely from the mouse pointer resting on the screen.
   * - Resets the 4-second timer whenever the slide changes (via currentSlide in deps),
   *   so manual navigation (arrows or dots) gives the user a fresh 4 seconds on that slide.
   * - Can be manually paused/resumed via the Play/Pause control in the bottom status bar.
   */
  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide, isPaused, totalSlides]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
    touchEndYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartXRef.current - touchEndXRef.current;
    const diffY = touchStartYRef.current - touchEndYRef.current;

    // Detect horizontal swipe
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPaused((prev) => !prev);
    }
  };

  return (
    <section
      className="relative w-full h-[84vh] min-h-[620px] max-h-[920px] overflow-hidden bg-empoway-coffee select-none"
      aria-roledescription="carousel"
      aria-label="EMPOWAY Featured Accessibility Journeys"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* FULL-SCREEN SLIDES BACKGROUND PHOTOGRAPHS */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = currentSlide === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className={`w-full h-full object-cover object-center transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Cinematic Multi-layered Full-Screen Gradient Overlays */}
            {/* 1. Deep Coffee gradient from bottom to top for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-empoway-coffee/95 via-empoway-coffee/65 to-black/35 pointer-events-none" />
            {/* 2. Side Ambient Tint for text prominence */}
            <div className="absolute inset-0 bg-gradient-to-r from-empoway-coffee/90 via-empoway-coffee/40 to-transparent pointer-events-none" />
            {/* 3. Subtle Warm Peach ambient tint */}
            <div className="absolute inset-0 bg-empoway-terracotta/10 mix-blend-overlay pointer-events-none" />
          </div>
        );
      })}

      {/* TOP STATUS BADGES (Aligned within container) */}
      <div className="absolute top-6 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Live Dedicated Colombo City Badge */}
          <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-empoway-blush/80 shadow-card text-xs font-bold text-empoway-coffee">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('colomboPilotPill')}</span>
            <span className="text-empoway-muted">•</span>
            <span className="text-empoway-terracotta">{t('colomboTaglineBadge')}</span>
          </div>

          {/* Slide Theme / Location Badge */}
          <div className="pointer-events-auto hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-empoway-coffee/85 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-card">
            <MapPin className="w-3.5 h-3.5 text-empoway-peach shrink-0" />
            <span className="truncate max-w-xs">{t(`slide${HERO_SLIDES[currentSlide].id}Location`, HERO_SLIDES[currentSlide].location)}</span>
          </div>
        </div>
      </div>

      {/* MAIN HERO CONTENT - Overlaid Text (Full-screen aligned with max-w-7xl) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24 lg:pb-28">
          <div className="max-w-3xl space-y-4 sm:space-y-6 pointer-events-auto">
            {/* Brand Wordmark & Tagline */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-empoway-peach/25 border border-empoway-peach/40 backdrop-blur-md shadow-xs">
              <Sparkles className="w-4 h-4 text-empoway-peach" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-empoway-champagne">
                {t('heroTagline')}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
              {t('heroHeading1')}{' '}
              <span className="text-empoway-peach relative inline-block">
                {t('heroHeadingAccessible')}
                <svg
                  className="absolute -bottom-2 left-0 w-full text-empoway-terracotta/70"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/95 leading-relaxed font-normal max-w-2xl drop-shadow-sm">
              {t('heroDescription')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-card hover:shadow-elevated active:scale-98"
              >
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{t('explorePlacesBtn')}</span>
              </Link>

              <Link
                to="/submit-place"
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold bg-white/95 hover:bg-white text-empoway-coffee border border-empoway-champagne/80 transition-all shadow-card hover:shadow-elevated backdrop-blur-md active:scale-98"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-empoway-terracotta" />
                <span>{t('sharePlaceBtn')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ARROW CONTROLS (Full-screen Edge-positioned) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous photograph slide"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/45 hover:bg-empoway-terracotta text-white border border-white/20 backdrop-blur-md transition-all shadow-card hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empoway-peach"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next photograph slide"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-black/45 hover:bg-empoway-terracotta text-white border border-white/20 backdrop-blur-md transition-all shadow-card hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empoway-peach"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* BOTTOM CAROUSEL STATUS BAR (Pagination Dots, Play/Pause & Counter) */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-card">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume automatic slideshow' : 'Pause automatic slideshow'}
          className="p-1 rounded-lg text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empoway-peach"
          title={isPaused ? 'Resume autoplay (4s)' : 'Pause autoplay'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current text-empoway-peach" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Slides">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}: ${slide.tagline}`}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-empoway-peach ${
                  isActive
                    ? 'w-7 sm:w-8 bg-empoway-peach shadow-xs'
                    : 'w-2.5 bg-white/40 hover:bg-white/75'
                }`}
              />
            );
          })}
        </div>

        {/* Slide Index Counter */}
        <span className="text-[11px] font-mono font-bold text-white/95 pl-1 select-none">
          0{currentSlide + 1} / 0{totalSlides}
        </span>
      </div>
    </section>
  );
};

export default HeroCarousel;
