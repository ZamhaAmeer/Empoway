import React, { useState } from 'react';
import {
  Check,
  X,
  HelpCircle,
  AlertCircle,
  Footprints,
  Maximize,
  ArrowUpDown,
  Car,
  DoorOpen,
  Route,
  UserCheck,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';

export const FEATURE_CONFIG = [
  {
    key: 'stepFreeEntrance',
    label: 'Wheelchair-accessible Entrance',
    icon: Footprints,
    description: 'Ground-level entry with zero threshold barriers or flush threshold.'
  },
  {
    key: 'wheelchairRamp',
    label: 'Ramp Availability',
    icon: Maximize,
    description: 'Ramped approach with safe gradient (1:12 or gentler) and sturdy handrails.'
  },
  {
    key: 'elevator',
    label: 'Elevator Availability',
    icon: ArrowUpDown,
    description: 'Operating elevator accessing upper or multi-story public service floors.'
  },
  {
    key: 'accessibleToilet',
    label: 'Accessible Toilet',
    icon: DoorOpen,
    description: 'Spacious wheelchair-accessible restroom with grab rails and level entry.'
  },
  {
    key: 'accessibleParking',
    label: 'Accessible Parking',
    icon: Car,
    description: 'Designated extra-wide parking bay close to main accessible entrance.'
  },
  {
    key: 'wideDoorways',
    label: 'Wide Entrance & Doorways',
    icon: DoorOpen,
    description: 'Doors and passageways minimum 85+ cm wide for easy wheelchair clearance.'
  },
  {
    key: 'wheelchairPathways',
    label: 'Wheelchair-friendly Pathways',
    icon: Route,
    description: 'Smooth, paved, non-slip internal corridors and level connections.'
  },
  {
    key: 'accessibleCounters',
    label: 'Accessible Service Counters',
    icon: UserCheck,
    description: 'Lowered reception, ticket or customer service desk (75–80 cm height).'
  }
];

export const getStatusBadge = (status, t) => {
  const norm = (status || 'UNKNOWN').toUpperCase();
  switch (norm) {
    case 'AVAILABLE':
      return {
        label: t ? t('available') : 'Available',
        badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300',
        icon: Check,
        iconClass: 'text-emerald-700 bg-emerald-200/60'
      };
    case 'NOT_AVAILABLE':
      return {
        label: t ? t('notAvailable') : 'Not Available',
        badgeClass: 'bg-rose-100/80 text-rose-800 border-rose-300',
        icon: X,
        iconClass: 'text-rose-700 bg-rose-200/60'
      };
    case 'NEEDS_VERIFICATION':
      return {
        label: t ? t('needsVerification') : 'Needs Verification',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertCircle,
        iconClass: 'text-amber-700 bg-amber-200/60'
      };
    case 'UNKNOWN':
    default:
      return {
        label: t ? t('unknown') : 'Unknown',
        badgeClass: 'bg-stone-100 text-stone-600 border-stone-200',
        icon: HelpCircle,
        iconClass: 'text-stone-500 bg-stone-200/70'
      };
  }
};

export const AccessibilityScorecard = ({ scorecard, placeName }) => {
  const [showFormula, setShowFormula] = useState(false);
  const { t } = usePreferences();

  if (!scorecard) return null;

  const {
    accessibilityScore = 0,
    dataCompleteness = 0,
    availableCount = 0,
    needsVerificationCount = 0,
    notAvailableCount = 0,
    unknownCount = 0,
    pointsEarned = 0
  } = scorecard;

  const scoreColor =
    accessibilityScore >= 75
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : accessibilityScore >= 40
        ? 'text-amber-700 bg-amber-50 border-amber-200'
        : 'text-rose-700 bg-rose-50 border-rose-200';

  const barColor =
    accessibilityScore >= 75
      ? 'bg-emerald-600'
      : accessibilityScore >= 40
        ? 'bg-amber-500'
        : 'bg-rose-500';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/80 shadow-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-empoway-cream">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-empoway-terracotta/10 text-empoway-terracotta border border-empoway-terracotta/20">
              {t('transparentAudit')}
            </span>
            <span className="text-xs text-empoway-muted">{t('physicalStandards')}</span>
          </div>
          <h3 className="text-xl font-bold text-empoway-coffee mt-1">
            {t('scorecardTitle')}
          </h3>
          <p className="text-xs text-empoway-muted">
            {t('multiPointEvaluation')} {placeName || 'this location'}.
          </p>
        </div>

        {/* Score Pill Display */}
        <div className="flex items-center gap-3">
          <div className={`p-4 rounded-2xl border text-center min-w-[120px] ${scoreColor}`}>
            <div className="text-3xl font-extrabold tracking-tight">
              {accessibilityScore}%
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
              {t('scorecard')}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars (Score & Data Completeness) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/40 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-empoway-coffee">
            <span>{t('scoreRatio')}</span>
            <span>{pointsEarned} / 8.0 {t('points')}</span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${Math.min(accessibilityScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-empoway-muted leading-tight">
            {t('verifiedCriteriaNote')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/40 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-empoway-coffee">
            <span>{t('dataCompleteness')}</span>
            <span>{dataCompleteness}%</span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-empoway-terracotta rounded-full transition-all duration-700"
              style={{ width: `${Math.min(dataCompleteness, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-empoway-muted leading-tight">
            {8 - (unknownCount || 0)} of 8 accessibility criteria physically audited or reported.
          </p>
        </div>
      </div>

      {/* Formula Explanation Collapsible */}
      <div className="border-t border-empoway-cream pt-4">
        <button
          type="button"
          onClick={() => setShowFormula(!showFormula)}
          className="text-xs font-semibold text-empoway-terracotta hover:text-empoway-terracotta-dark flex items-center gap-1.5 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>{t('howScoreCalculated')}</span>
          {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormula && (
          <div className="mt-3 p-4 rounded-2xl bg-empoway-cream/50 border border-empoway-champagne/80 text-xs space-y-2 text-empoway-coffee">
            <p className="leading-relaxed">
              {t('scoreExplanation')}
            </p>
            <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-empoway-blush space-y-1">
              <div>Current: ({availableCount} × 1.0) + ({needsVerificationCount} × 0.5) = {pointsEarned} Points</div>
              <div className="font-bold text-empoway-terracotta">
                Final Score: ({pointsEarned} ÷ 8) × 100% = {accessibilityScore}%
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-empoway-muted text-[11px]">
              <li><strong>{t('available')} (1.0 pt):</strong> Confirmed accessible facility adhering to physical criteria.</li>
              <li><strong>{t('needsVerification')} (0.5 pt):</strong> Reported by community members, scheduled for on-site audit.</li>
              <li><strong>{t('notAvailable')} (0.0 pt):</strong> Confirmed absence or barrier preventing wheelchair use.</li>
              <li><strong>{t('unknown')} (0.0 pt):</strong> Insufficient information; never counted as accessible.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const FeatureChecklist = ({ features = {}, compact = false, showNotes = true }) => {
  const { t } = usePreferences();

  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FEATURE_CONFIG.map((item) => {
          const val = features[item.key] || 'UNKNOWN';
          const cfg = getStatusBadge(val, t);
          const Icon = item.icon;
          const StatusIcon = cfg.icon;
          const label = t(item.key) || item.label;

          return (
            <div
              key={item.key}
              className={`p-2 rounded-lg border flex items-center justify-between text-xs transition-colors ${val === 'AVAILABLE'
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : val === 'NEEDS_VERIFICATION'
                    ? 'bg-amber-50/50 border-amber-200'
                    : val === 'NOT_AVAILABLE'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-empoway-ivory border-empoway-blush/60'
                }`}
              title={`${label}: ${cfg.label}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Icon className="w-3.5 h-3.5 text-empoway-coffee/70 shrink-0" />
                <span className="truncate text-empoway-coffee font-medium">{label}</span>
              </div>
              <span className={`shrink-0 p-0.5 rounded-full ${cfg.iconClass}`}>
                <StatusIcon className="w-3 h-3" />
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FEATURE_CONFIG.map((item) => {
          const val = features[item.key] || 'UNKNOWN';
          const cfg = getStatusBadge(val, t);
          const Icon = item.icon;
          const StatusIcon = cfg.icon;
          const label = t(item.key) || item.label;
          const description = t(`desc_${item.key}`) || item.description;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-2xl border transition-all duration-200 ${val === 'AVAILABLE'
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                  : val === 'NEEDS_VERIFICATION'
                    ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                    : val === 'NOT_AVAILABLE'
                      ? 'bg-rose-50/30 border-rose-200 shadow-xs'
                      : 'bg-white border-empoway-blush/60'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-empoway-cream text-empoway-terracotta shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-empoway-coffee leading-snug">
                      {label}
                    </h4>
                    <p className="text-xs text-empoway-muted mt-0.5 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${cfg.badgeClass}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{cfg.label}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNotes && features.featureNotes && (
        <div className="p-4 rounded-2xl bg-empoway-cream/70 border border-empoway-champagne/80 text-xs text-empoway-coffee">
          <span className="font-bold text-empoway-coffee-dark block mb-1">
            Additional Physical Auditor Notes:
          </span>
          <p className="leading-relaxed text-empoway-coffee/90">{features.featureNotes}</p>
        </div>
      )}
    </div>
  );
};

export default FeatureChecklist;
