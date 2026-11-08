import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Info,
  Heart,
  Baby,
  Footprints,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

// Icon resolver for presets
const getPresetIcon = (id) => {
  switch (id) {
    case 'power_wheelchair':
      return <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'manual_wheelchair':
      return (
        <span className="text-sm" role="img" aria-label="wheelchair">
          ♿
        </span>
      );
    case 'walking_aid':
      return <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'stroller':
      return <Baby className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'limited_mobility':
      return <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    default:
      return <Sliders className="w-4 h-4 text-empoway-terracotta" />;
  }
};

export const PersonalAccessibilityMatch = ({ place, initialMatch = null }) => {
  const { mobilityProfile, setMobilityProfile, mobilityPresets, t, translateFeature } = usePreferences();
  const { user } = useAuth();

  // Active testing profile (can test other presets without permanently changing default)
  const [activeProfileType, setActiveProfileType] = useState(
    mobilityProfile?.type || 'manual_wheelchair'
  );
  const [matchData, setMatchData] = useState(initialMatch);
  const [loading, setLoading] = useState(!initialMatch);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Sync active profile type when context mobilityProfile changes
  useEffect(() => {
    if (mobilityProfile?.type && !initialMatch) {
      setActiveProfileType(mobilityProfile.type);
    }
  }, [mobilityProfile?.type]);

  // Fetch or recompute match whenever active profile changes
  useEffect(() => {
    let isMounted = true;
    const fetchMatch = async () => {
      setLoading(true);
      try {
        const res = await api.getPersonalMatch(place.id, {
          profileType: activeProfileType,
          customNeeds: activeProfileType === 'custom' ? mobilityProfile?.customNeeds : undefined
        });
        if (isMounted && res.success && res.match) {
          setMatchData(res.match);
        }
      } catch (err) {
        console.error('Error fetching personal match:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMatch();
    return () => {
      isMounted = false;
    };
  }, [place?.id, activeProfileType, JSON.stringify(mobilityProfile?.customNeeds)]);

  if (!place) return null;

  const currentPreset = mobilityPresets.find((p) => p.id === activeProfileType) || mobilityPresets[1];
  const isDefaultProfile = mobilityProfile?.type === activeProfileType;

  const score = matchData?.matchScore ?? 0;
  const verdict = matchData?.verdict || 'MODERATE';
  const verdictLabel = matchData?.verdictLabel || t('moderateMatch');

  // Verdict theme colours
  const verdictColors = {
    EXCELLENT: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-300 dark:border-emerald-800',
      text: 'text-emerald-900 dark:text-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border-emerald-300',
      ring: 'text-emerald-600 dark:text-emerald-400'
    },
    MODERATE: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-300 dark:border-amber-800',
      text: 'text-amber-900 dark:text-amber-200',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border-amber-300',
      ring: 'text-amber-600 dark:text-amber-400'
    },
    LIMITED: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-300 dark:border-rose-800',
      text: 'text-rose-900 dark:text-rose-200',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 border-rose-300',
      ring: 'text-rose-600 dark:text-rose-400'
    }
  }[verdict] || {
    bg: 'bg-empoway-ivory dark:bg-[#201713]',
    border: 'border-empoway-blush/80 dark:border-[#3d2c24]',
    text: 'text-empoway-coffee dark:text-empoway-ivory',
    badge: 'bg-empoway-cream text-empoway-coffee border-empoway-blush',
    ring: 'text-empoway-terracotta'
  };

  return (
    <div className="bg-white dark:bg-[#241a15] rounded-3xl p-6 sm:p-7 border border-empoway-blush/80 dark:border-[#3d2c24] shadow-card space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-empoway-cream dark:border-[#382820] gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-terracotta border border-empoway-terracotta/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-heading font-extrabold text-empoway-coffee dark:text-white">
                {t('personalMatchTitle')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-empoway-terracotta/10 text-empoway-terracotta border border-empoway-terracotta/20">
                Colombo Pilot
              </span>
            </div>
            <p className="text-xs text-empoway-muted dark:text-empoway-peach/75 mt-0.5 leading-relaxed">
              {t('personalMatchSubtitle')}
            </p>
          </div>
        </div>

        {/* Saved vs Tested Status Badge */}
        {isDefaultProfile ? (
          <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('mySavedProfile')}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMobilityProfile({
                type: activeProfileType,
                customNeeds: currentPreset.defaultNeeds
              });
            }}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-blush transition-colors border border-empoway-blush"
            title="Set this as your default mobility profile"
          >
            <span>Set as Default</span>
            <ChevronRight className="w-3 h-3 text-empoway-terracotta" />
          </button>
        )}
      </div>

      {/* Preset Mobility Aid Switcher Pills */}
      <div>
        <label className="text-[11px] uppercase tracking-wider font-extrabold text-empoway-muted dark:text-empoway-peach/70 block mb-2">
          {t('switchProfile')}
        </label>
        <div className="flex flex-wrap gap-2">
          {mobilityPresets.map((preset) => {
            const isActive = activeProfileType === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setActiveProfileType(preset.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-empoway-terracotta text-white shadow-soft ring-2 ring-empoway-terracotta/30'
                    : 'bg-empoway-ivory dark:bg-[#1f1713] text-empoway-coffee dark:text-empoway-ivory/80 hover:bg-empoway-cream dark:hover:bg-[#2b1e18] border border-empoway-blush/70 dark:border-[#3d2c24]'
                }`}
              >
                <span>{getPresetIcon(preset.id)}</span>
                <span>{t(preset.nameKey, preset.badge)}</span>
                {isActive && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Match Score & Verdict Card */}
      <div className={`p-5 rounded-2xl border-2 transition-all ${verdictColors.bg} ${verdictColors.border}`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
          {/* Circular Score Visual */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-[#18110e] border border-empoway-blush/60 dark:border-[#382820] shadow-soft">
              <span className={`text-2xl font-black font-heading tracking-tight ${verdictColors.ring}`}>
                {score}%
              </span>
              <span className="absolute -bottom-2 text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded-md bg-empoway-coffee text-white dark:bg-empoway-ivory dark:text-empoway-coffee">
                Match
              </span>
            </div>

            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border mb-1.5 ${verdictColors.badge}`}>
                {verdictLabel}
              </span>
              <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                {t(currentPreset.nameKey, currentPreset.badge)}
              </h4>
              <p className="text-[11px] text-empoway-muted dark:text-empoway-peach/75">
                {matchData?.criticalMetCount || 0} of {matchData?.criticalTotalCount || 0} critical requirements met
              </p>
            </div>
          </div>

          {/* Personalized Compatibility Summary Note */}
          <div className="flex-1 text-xs space-y-1.5 sm:border-l sm:border-empoway-cream dark:sm:border-[#382820] sm:pl-5">
            <p className="text-empoway-coffee dark:text-white/90 leading-relaxed font-medium">
              {matchData?.advice || t('moderateMatch')}
            </p>
            {matchData?.barrierWarnings && matchData.barrierWarnings.length > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 text-[11px] space-y-1">
                {matchData.barrierWarnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toggle Detailed Breakdown Button */}
        <div className="mt-4 pt-3 border-t border-empoway-cream/70 dark:border-[#382820] flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs font-bold text-empoway-terracotta hover:underline flex items-center gap-1"
          >
            <span>{showBreakdown ? 'Hide Criteria Breakdown' : 'View Criteria Breakdown'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showBreakdown ? 'rotate-90' : ''}`} />
          </button>
          <span className="text-[11px] text-empoway-muted dark:text-empoway-peach/70">
            {matchData?.breakdown?.length || 0} features assessed
          </span>
        </div>

        {/* Feature Breakdown Table / Grid */}
        {showBreakdown && matchData?.breakdown && (
          <div className="mt-4 pt-3 border-t border-empoway-cream/60 dark:border-[#382820] space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {matchData.breakdown.map((item) => {
                const isMet = item.matchType === 'MET';
                const isPartial = item.matchType === 'PARTIAL';
                const isUnmet = item.matchType === 'UNMET';

                return (
                  <div
                    key={item.key}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#1f1713] border border-empoway-blush/60 dark:border-[#382820] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {isMet ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isPartial ? (
                        <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : isUnmet ? (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-empoway-coffee dark:text-white block leading-snug">
                          {translateFeature(item.key)}
                        </span>
                        {item.isCritical && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-700 dark:text-amber-400">
                            Must-Have for Profile
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isMet
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : isPartial
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : isUnmet
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAccessibilityMatch;

