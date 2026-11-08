import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  ChevronDown,
  Lock,
  Scale,
  Settings,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';

export const Navbar = () => {
  const { user, isAdmin, logout, promptLogin } = useAuth();
  const { t } = usePreferences();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'text-empoway-terracotta bg-empoway-cream dark:bg-[#2b1e18] font-bold'
        : 'text-empoway-coffee dark:text-empoway-ivory hover:text-empoway-terracotta hover:bg-empoway-cream/50 dark:hover:bg-[#2b1e18]/60'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#18110e]/95 backdrop-blur-md border-b border-empoway-blush/80 dark:border-[#3d2c24] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand with authentic EMPOWAY icon */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-empoway-cream dark:bg-[#2b1e18] border border-empoway-blush/80 dark:border-[#3d2c24] flex items-center justify-center p-1.5 shadow-soft group-hover:scale-105 group-hover:border-empoway-terracotta/50 transition-all">
              <img
                src="/logo-icon.png"
                alt="EMPOWAY"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-heading text-xl font-extrabold tracking-tight text-empoway-coffee dark:text-white group-hover:text-empoway-terracotta transition-colors leading-none">
                EMPOWAY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-empoway-caramel dark:text-empoway-peach mt-0.5 leading-none">
                Empowering Every Journey
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <NavLink to="/" end className={navLinkClass}>
              {t('home')}
            </NavLink>
            <NavLink
              to="/explore"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Explore Places',
                    message: 'Create your account or sign in to explore all public locations in Colombo, view interactive accessibility maps, and apply advanced wheelchair filters.',
                    actionName: 'explore places directory',
                    redirectPath: '/explore'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center gap-1.5">
                <span>{t('explore')}</span>
                {!user && <Lock className="w-3 h-3 text-empoway-muted opacity-70" />}
              </span>
            </NavLink>
            <NavLink
              to="/compare"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Compare Places',
                    message: 'Create your account or sign in to compare physical accessibility scores and features of public places side-by-side.',
                    actionName: 'compare places',
                    redirectPath: '/compare'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-empoway-terracotta" />
                <span>{t('compare')}</span>
                {!user && <Lock className="w-3 h-3 text-empoway-muted opacity-70" />}
              </span>
            </NavLink>
            <NavLink
              to="/journey"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Plan Journey',
                    message: 'Create your account or sign in to plan accessible routes and inspect corridor support across Colombo.',
                    actionName: 'plan accessible journey',
                    redirectPath: '/journey'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-empoway-terracotta" />
                <span>{t('journey')}</span>
                {!user && <Lock className="w-3 h-3 text-empoway-muted opacity-70" />}
              </span>
            </NavLink>
            <NavLink to="/colombo-pilot" className={navLinkClass}>
              <span className="inline-flex items-center gap-1">
                <span>{t('colomboPilot')}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-empoway-peach/25 text-empoway-terracotta-dark dark:text-empoway-peach text-[10px] font-bold">
                  Live
                </span>
              </span>
            </NavLink>
            <Link
              to="/explore?status=VERIFIED"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to View Verified Locations',
                    message: 'Create your account or sign in to view auditor-verified accessible destinations in Colombo with physical ramp measurements.',
                    actionName: 'view verified locations',
                    redirectPath: '/explore?status=VERIFIED'
                  });
                }
              }}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center gap-1"
            >
              <span>{t('verifiedLocations')}</span>
              {!user && <Lock className="w-3 h-3 opacity-70" />}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/submit-place"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Submit Location',
                    message: 'Create your account or sign in to add a new accessible place to the community directory.',
                    actionName: 'submit a new place',
                    redirectPath: '/submit-place'
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-soft hover:shadow-card active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('sharePlace')}</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-empoway-blush dark:border-[#3d2c24] bg-white dark:bg-[#241a15] hover:bg-empoway-cream/50 dark:hover:bg-[#2b1e18] transition-colors"
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src={user.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=EMPOWAY'}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-lg object-cover bg-empoway-peach/30"
                  />
                  <span className="text-xs font-bold text-empoway-coffee dark:text-white max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-empoway-muted dark:text-empoway-peach" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#241a15] rounded-2xl border border-empoway-blush dark:border-[#3d2c24] shadow-elevated py-2 z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-empoway-cream dark:border-[#382820]">
                      <p className="text-xs font-bold text-empoway-coffee dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-empoway-muted dark:text-empoway-peach/70 truncate">
                        {user.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                          {t('adminConsole')}
                        </span>
                      )}
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-cream/70 dark:hover:bg-[#2b1e18] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-empoway-caramel" />
                      <span>{t('myProfile')}</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-cream/70 dark:hover:bg-[#2b1e18] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-empoway-terracotta" />
                      <span>{t('settings')}</span>
                    </Link>

                    <Link
                      to="/organization"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-cream/70 dark:hover:bg-[#2b1e18] transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-empoway-caramel" />
                      <span>{t('orgPortal')}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-empoway-terracotta hover:bg-empoway-cream/70 dark:hover:bg-[#2b1e18] transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-empoway-terracotta" />
                        <span>{t('adminConsole')}</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-empoway-cream dark:border-[#382820]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('signOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-cream dark:hover:bg-[#2b1e18] transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] hover:bg-empoway-blush dark:hover:bg-[#382820] text-empoway-coffee dark:text-white border border-empoway-champagne dark:border-[#443229] transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/submit-place"
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Submit Location',
                    message: 'Create your account or sign in to add a new accessible place to the community directory.',
                    actionName: 'submit a new place',
                    redirectPath: '/submit-place'
                  });
                }
              }}
              className="p-2 rounded-xl bg-empoway-terracotta text-white"
              title={t('sharePlace')}
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-empoway-coffee dark:text-white hover:bg-empoway-cream dark:hover:bg-[#2b1e18]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#18110e] border-b border-empoway-blush dark:border-[#3d2c24] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              {t('home')}
            </NavLink>
            <NavLink
              to="/explore"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Explore Places',
                    message: 'Create your account or sign in to explore all public locations in Colombo, view interactive accessibility maps, and apply advanced wheelchair filters.',
                    actionName: 'explore places directory',
                    redirectPath: '/explore'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center justify-between">
                <span>{t('explore')}</span>
                {!user && <Lock className="w-3.5 h-3.5 text-empoway-muted" />}
              </span>
            </NavLink>
            <NavLink
              to="/compare"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Compare Places',
                    message: 'Create your account or sign in to compare physical accessibility scores and features of public places side-by-side.',
                    actionName: 'compare places',
                    redirectPath: '/compare'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center justify-between">
                <span>{t('compare')}</span>
                {!user && <Lock className="w-3.5 h-3.5 text-empoway-muted" />}
              </span>
            </NavLink>
            <NavLink
              to="/journey"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (!user) {
                  e.preventDefault();
                  promptLogin({
                    title: 'Sign In to Plan Journey',
                    message: 'Create your account or sign in to plan accessible routes and inspect corridor support across Colombo.',
                    actionName: 'plan accessible journey',
                    redirectPath: '/journey'
                  });
                }
              }}
              className={navLinkClass}
            >
              <span className="flex items-center justify-between">
                <span>{t('journey')}</span>
                {!user && <Lock className="w-3.5 h-3.5 text-empoway-muted" />}
              </span>
            </NavLink>
            <NavLink
              to="/colombo-pilot"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClass}
            >
              {t('colomboPilot')}
            </NavLink>
          </nav>

          <div className="pt-3 border-t border-empoway-cream dark:border-[#382820] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-white flex items-center gap-2.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-empoway-caramel" />
                  <span>{t('myProfile')}</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-white flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-empoway-terracotta" />
                  <span>{t('settings')}</span>
                </Link>
                <Link
                  to="/organization"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-white flex items-center gap-2.5"
                >
                  <Building2 className="w-4 h-4 text-empoway-caramel" />
                  <span>{t('orgPortal')}</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-peach/20 dark:bg-purple-950/40 text-empoway-terracotta dark:text-purple-300 flex items-center gap-2.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t('adminConsole')}</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('signOut')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-white flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-empoway-terracotta" />
                  <span>{t('settings')}</span>
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-4 text-center rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-white border border-empoway-champagne dark:border-[#443229]"
                  >
                    {t('signIn')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-4 text-center rounded-xl text-xs font-bold bg-empoway-terracotta text-white"
                  >
                    {t('register')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
