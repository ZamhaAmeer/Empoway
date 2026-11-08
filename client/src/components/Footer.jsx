import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export const Footer = () => {
  const { t, translateCategory } = usePreferences();

  return (
    <footer className="bg-white dark:bg-[#18110e] border-t border-empoway-blush/60 dark:border-[#3d2c24] mt-auto text-empoway-coffee dark:text-empoway-ivory transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-empoway-cream dark:bg-[#2b1e18] border border-empoway-blush/80 dark:border-[#3d2c24] flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 group-hover:border-empoway-terracotta/50 transition-all">
                <img
                  src="/logo-icon.png"
                  alt="EMPOWAY"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-lg font-extrabold tracking-tight text-empoway-coffee dark:text-white leading-none">
                  EMPOWAY
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-empoway-caramel dark:text-empoway-peach mt-0.5 leading-none">
                  Empowering Every Journey
                </span>
              </div>
            </Link>

            <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 leading-relaxed max-w-sm">
              Sri Lanka's dedicated physical accessibility platform. Providing verified ramp measurements, step-free access, and wheelchair clarity for Colombo.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-empoway-muted dark:text-empoway-peach/70 pt-1">
              <MapPin className="w-3.5 h-3.5 text-empoway-terracotta shrink-0" />
              <span>Colombo District Pilot, Sri Lanka</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-empoway-coffee dark:text-white">
              {t('platform')}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/explore" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {t('explore')}
                </Link>
              </li>
              <li>
                <Link to="/explore?status=VERIFIED" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {t('verifiedLocations')}
                </Link>
              </li>
              <li>
                <Link to="/submit-place" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {t('sharePlace')}
                </Link>
              </li>
              <li>
                <Link to="/journey" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {t('journey')}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {t('settingsAndPreferences')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-empoway-coffee dark:text-white">
              {t('keyCategories')}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/explore?categorySlug=hospitals-healthcare" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {translateCategory('hospitals-healthcare')}
                </Link>
              </li>
              <li>
                <Link to="/explore?categorySlug=universities-education" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {translateCategory('universities-education')}
                </Link>
              </li>
              <li>
                <Link to="/explore?categorySlug=banks-financial-services" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {translateCategory('banks-financial-services')}
                </Link>
              </li>
              <li>
                <Link to="/explore?categorySlug=government-offices" className="text-empoway-muted hover:text-empoway-terracotta transition-colors">
                  {translateCategory('government-offices')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-empoway-cream dark:border-[#382820] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-empoway-muted dark:text-empoway-peach/70">
          <p>
            &copy; {new Date().getFullYear()} EMPOWAY. Colombo Accessibility Pilot.
          </p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Empowering inclusive mobility in Sri Lanka</span>
            <Heart className="w-3 h-3 text-empoway-terracotta fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
