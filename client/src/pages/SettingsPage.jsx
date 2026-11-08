import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Sun,
  Moon,
  Globe,
  Check,
  CheckCircle2,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  Sliders,
  Eye,
  Languages,
  Zap,
  Footprints,
  Baby,
  Heart,
  HelpCircle
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';

const getPresetIcon = (id) => {
  switch (id) {
    case 'power_wheelchair':
      return <Zap className="w-5 h-5 text-amber-500" />;
    case 'manual_wheelchair':
      return <span className="text-lg">♿</span>;
    case 'walking_aid':
      return <Footprints className="w-5 h-5 text-emerald-500" />;
    case 'stroller':
      return <Baby className="w-5 h-5 text-blue-500" />;
    case 'limited_mobility':
      return <Heart className="w-5 h-5 text-rose-500" />;
    default:
      return <Sliders className="w-5 h-5 text-empoway-terracotta" />;
  }
};

const SettingsPage = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    mobilityProfile,
    setMobilityProfile,
    mobilityPresets,
    savingNotice,
    t,
    translateFeature
  } = usePreferences();
  const { user } = useAuth();
  const [showCustomNeeds, setShowCustomNeeds] = useState(false);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto transition-colors">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs font-semibold text-empoway-muted dark:text-empoway-peach/70 mb-6 gap-2">
        <Link to="/" className="hover:text-empoway-terracotta transition-colors">
          {t('home')}
        </Link>
        <span>/</span>
        <span className="text-empoway-coffee dark:text-empoway-ivory font-bold">
          {t('settings')}
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-empoway-blush/60 dark:border-[#3d2c24] gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-terracotta border border-empoway-terracotta/20">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-empoway-coffee dark:text-white tracking-tight">
              {t('settingsTitle')}
            </h1>
            <p className="text-sm text-empoway-muted dark:text-empoway-peach/80 mt-1 max-w-2xl leading-relaxed">
              {t('settingsSubtitle')}
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="self-start md:self-auto">
          {user ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-soft">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Synced with {user.fullName.split(' ')[0]}'s account</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-soft">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Guest session (Saved locally)</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Save Notification Toast */}
      {savingNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-elevated animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{savingNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-extrabold">Instant</span>
        </div>
      )}

      <div className="space-y-10">
        {/* SECTION A: APPEARANCE */}
        <section aria-labelledby="appearance-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-empoway-peach/20 dark:bg-empoway-coffee text-empoway-terracotta">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 id="appearance-heading" className="text-xl font-heading font-bold text-empoway-coffee dark:text-white">
                  {t('appearance')}
                </h2>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/80 mt-0.5">
                  {t('appearanceDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* LIGHT MODE CARD */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                theme === 'light'
                  ? 'border-empoway-terracotta bg-white dark:bg-[#2b1f1a] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                  : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      theme === 'light'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-peach'
                    }`}
                  >
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-empoway-coffee dark:text-white flex items-center gap-2">
                      <span>{t('lightMode')}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-empoway-peach/20 text-empoway-terracotta">
                        Default
                      </span>
                    </h3>
                    <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                      {t('lightModeSubtitle')}
                    </p>
                  </div>
                </div>

                {theme === 'light' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-empoway-terracotta text-white text-xs font-bold shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('activeBadge')}</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-empoway-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('selectOption')} →
                  </span>
                )}
              </div>

              <p className="text-xs text-empoway-coffee/80 dark:text-empoway-ivory/80 leading-relaxed mb-5">
                {t('lightModeDescription')}
              </p>

              {/* Light Mode Color Swatch Preview */}
              <div className="pt-4 border-t border-empoway-cream dark:border-[#382820] flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md border border-stone-300 bg-[#FFF9F0]" title="Ivory (#FFF9F0)" />
                  <span className="w-5 h-5 rounded-md bg-[#B96F54]" title="Terracotta (#B96F54)" />
                  <span className="w-5 h-5 rounded-md bg-[#684638]" title="Coffee Brown (#684638)" />
                  <span className="w-5 h-5 rounded-md bg-[#E9A58D]" title="Sunset Peach (#E9A58D)" />
                </div>
                <span className="text-[11px] font-semibold text-empoway-muted dark:text-empoway-peach/70">
                  Warm Colombo Palette
                </span>
              </div>
            </button>

            {/* DARK MODE CARD */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                theme === 'dark'
                  ? 'border-empoway-terracotta bg-[#241a15] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                  : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      theme === 'dark'
                        ? 'bg-empoway-terracotta text-white shadow-soft'
                        : 'bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-peach'
                    }`}
                  >
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-empoway-coffee dark:text-white flex items-center gap-2">
                      <span>{t('darkMode')}</span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                        OLED Friendly
                      </span>
                    </h3>
                    <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                      {t('darkModeSubtitle')}
                    </p>
                  </div>
                </div>

                {theme === 'dark' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-empoway-terracotta text-white text-xs font-bold shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('activeBadge')}</span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-empoway-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('selectOption')} →
                  </span>
                )}
              </div>

              <p className="text-xs text-empoway-coffee/80 dark:text-empoway-ivory/80 leading-relaxed mb-5">
                {t('darkModeDescription')}
              </p>

              {/* Dark Mode Color Swatch Preview */}
              <div className="pt-4 border-t border-empoway-cream dark:border-[#382820] flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md border border-neutral-700 bg-[#18110e]" title="Dark Base (#18110E)" />
                  <span className="w-5 h-5 rounded-md bg-[#241a15]" title="Surface Card (#241A15)" />
                  <span className="w-5 h-5 rounded-md bg-[#B96F54]" title="Terracotta (#B96F54)" />
                  <span className="w-5 h-5 rounded-md bg-[#F8EEE5]" title="Cream Text (#F8EEE5)" />
                </div>
                <span className="text-[11px] font-semibold text-empoway-muted dark:text-empoway-peach/70">
                  High Contrast Coffee
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION B: LANGUAGE */}
        <section aria-labelledby="language-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-empoway-peach/20 dark:bg-empoway-coffee text-empoway-terracotta">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h2 id="language-heading" className="text-xl font-heading font-bold text-empoway-coffee dark:text-white">
                  {t('language')}
                </h2>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/80 mt-0.5">
                  {t('languageDesc')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {/* ENGLISH OPTION */}
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                language === 'en'
                  ? 'border-empoway-terracotta bg-white dark:bg-[#2b1f1a] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                  : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-xl bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-peach flex items-center justify-center font-black text-sm border border-empoway-blush/80 dark:border-[#3d2c24]">
                  EN
                </div>
                {language === 'en' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-empoway-terracotta text-white text-[11px] font-bold">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-empoway-coffee dark:text-white">
                  {t('english')}
                </h3>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                  {t('englishSubtitle')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-empoway-cream dark:border-[#382820]">
                <p className="text-[11px] font-medium text-empoway-coffee/80 dark:text-empoway-ivory/80 leading-relaxed italic">
                  "Wheelchair Ramp • Step-free Entrance • Scorecard"
                </p>
              </div>
            </button>

            {/* SINHALA OPTION */}
            <button
              type="button"
              onClick={() => setLanguage('si')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                language === 'si'
                  ? 'border-empoway-terracotta bg-white dark:bg-[#2b1f1a] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                  : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-xl bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-peach flex items-center justify-center font-black text-sm border border-empoway-blush/80 dark:border-[#3d2c24]">
                  සිං
                </div>
                {language === 'si' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-empoway-terracotta text-white text-[11px] font-bold">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-empoway-coffee dark:text-white">
                  {t('sinhala')}
                </h3>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                  {t('sinhalaSubtitle')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-empoway-cream dark:border-[#382820]">
                <p className="text-[11px] font-medium text-empoway-coffee/80 dark:text-empoway-ivory/80 leading-relaxed italic">
                  "රෝද පුටු බෑවුම • පඩි රහිත පිවිසුම • ලකුණු පුවරුව"
                </p>
              </div>
            </button>

            {/* TAMIL OPTION */}
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                language === 'ta'
                  ? 'border-empoway-terracotta bg-white dark:bg-[#2b1f1a] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                  : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className="w-10 h-10 rounded-xl bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-peach flex items-center justify-center font-black text-sm border border-empoway-blush/80 dark:border-[#3d2c24]">
                  தம
                </div>
                {language === 'ta' && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-empoway-terracotta text-white text-[11px] font-bold">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-empoway-coffee dark:text-white">
                  {t('tamil')}
                </h3>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                  {t('tamilSubtitle')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-empoway-cream dark:border-[#382820]">
                <p className="text-[11px] font-medium text-empoway-coffee/80 dark:text-empoway-ivory/80 leading-relaxed italic">
                  "சக்கர நாற்காலி சாய்வுதளம் • படி இல்லாத நுழைவாயில்"
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* SECTION C: MOBILITY & PERSONAL ACCESSIBILITY PROFILE */}
        <section aria-labelledby="mobility-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-empoway-peach/20 dark:bg-empoway-coffee text-empoway-terracotta">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 id="mobility-heading" className="text-xl font-heading font-bold text-empoway-coffee dark:text-white">
                  {t('mobilityProfileTitle')}
                </h2>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/80 mt-0.5">
                  {t('mobilityProfileSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Preset Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {mobilityPresets.map((preset) => {
              const isActive = mobilityProfile?.type === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setMobilityProfile({
                      type: preset.id,
                      customNeeds: preset.defaultNeeds
                    });
                  }}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group shadow-soft hover:shadow-card ${
                    isActive
                      ? 'border-empoway-terracotta bg-white dark:bg-[#2b1f1a] ring-2 ring-empoway-terracotta/20 shadow-elevated'
                      : 'border-empoway-blush/70 dark:border-[#3d2c24] bg-white/70 dark:bg-[#1f1713] hover:border-empoway-terracotta/50'
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <div className="w-10 h-10 rounded-xl bg-empoway-cream dark:bg-[#2b1e18] flex items-center justify-center border border-empoway-blush/80 dark:border-[#3d2c24]">
                      {getPresetIcon(preset.id)}
                    </div>
                    {isActive ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-empoway-terracotta text-white text-[11px] font-bold shadow-sm">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-empoway-terracotta opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-empoway-coffee dark:text-white">
                      {t(preset.nameKey, preset.badge)}
                    </h3>
                    <p className="text-xs text-empoway-muted dark:text-empoway-peach/75 mt-1 leading-relaxed">
                      {t(preset.descKey, '')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Fine-Tuning Requirements Checklist Toggle */}
          <div className="p-5 rounded-2xl bg-empoway-ivory dark:bg-[#1f1713] border border-empoway-blush/80 dark:border-[#3d2c24] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-empoway-coffee dark:text-white flex items-center gap-2">
                  <span>Fine-Tune Required Facilities</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-ivory">
                    Custom Criteria
                  </span>
                </h4>
                <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                  Select which features are strictly required for your visits. Places lacking these will flag barrier warnings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomNeeds(!showCustomNeeds)}
                className="text-xs font-bold text-empoway-terracotta hover:underline"
              >
                {showCustomNeeds ? 'Hide Checklist' : 'Customize Criteria'}
              </button>
            </div>

            {showCustomNeeds && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
                {[
                  { key: 'stepFreeEntrance', label: 'Step-Free Entrance' },
                  { key: 'wheelchairRamp', label: 'Ramp Access' },
                  { key: 'elevator', label: 'Elevator Available' },
                  { key: 'accessibleToilet', label: 'Accessible Restroom' },
                  { key: 'accessibleParking', label: 'Accessible Parking' },
                  { key: 'wideDoorways', label: 'Wide Doorways (≥85cm)' },
                  { key: 'wheelchairPathways', label: 'Wheelchair Pathways' },
                  { key: 'accessibleCounters', label: 'Lower Service Counters' }
                ].map((crit) => {
                  const currentNeeds = mobilityProfile?.customNeeds || {};
                  const isChecked = !!currentNeeds[crit.key];

                  return (
                    <label
                      key={crit.key}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-empoway-terracotta/10 border-empoway-terracotta dark:bg-empoway-terracotta/20 text-empoway-coffee dark:text-white'
                          : 'bg-white dark:bg-[#2b1e18] border-empoway-blush/60 dark:border-[#382820] text-empoway-coffee/70 dark:text-empoway-ivory/70 hover:border-empoway-blush'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">{crit.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const updated = {
                            type: 'custom',
                            customNeeds: {
                              ...currentNeeds,
                              [crit.key]: e.target.checked
                            }
                          };
                          setMobilityProfile(updated);
                        }}
                        className="rounded text-empoway-terracotta focus:ring-empoway-terracotta w-4 h-4 ml-2"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION D: PERSISTENCE & ACCOUNT STATUS */}
        <section className="p-6 rounded-2xl border border-empoway-blush/80 dark:border-[#3d2c24] bg-white dark:bg-[#241a15] shadow-soft">
          {user ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={user.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=EMPOWAY'}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-empoway-blush"
                />
                <div>
                  <h4 className="text-sm font-bold text-empoway-coffee dark:text-white flex items-center gap-2">
                    <span>{user.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      Account Synced
                    </span>
                  </h4>
                  <p className="text-xs text-empoway-muted dark:text-empoway-peach/70 mt-0.5">
                    {t('accountSyncedNotice')}
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-blush/60 dark:hover:bg-[#382820] transition-colors border border-empoway-champagne dark:border-[#443229]"
              >
                <User className="w-3.5 h-3.5 text-empoway-terracotta" />
                <span>{t('myProfile')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                    Want your preferences on every device?
                  </h4>
                  <p className="text-xs text-empoway-muted dark:text-empoway-peach/80 mt-1 max-w-xl leading-relaxed">
                    {t('guestNotice')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to="/login"
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-bold text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-cream dark:hover:bg-[#2b1e18] border border-empoway-blush transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  to="/register"
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white shadow-soft transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;

