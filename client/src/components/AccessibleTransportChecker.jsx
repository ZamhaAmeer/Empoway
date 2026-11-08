import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Train,
  Bus,
  Car,
  Footprints,
  Phone,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';

export const AccessibleTransportChecker = ({ place, transportData }) => {
  const { t } = usePreferences();
  const [selectedMode, setSelectedMode] = useState('bus'); // 'bus' | 'rail' | 'dropoff' | 'corridor'

  if (!place || !transportData) return null;

  const {
    transitScore = 75,
    connectivityVerdict = 'GOOD',
    verdictLabel = 'Accessible Transit Links Available',
    verdictColor = 'emerald',
    nearestBus,
    nearestRail,
    corridor,
    dropOff,
    transitTips = []
  } = transportData;

  const pLat = parseFloat(place.latitude);
  const pLng = parseFloat(place.longitude);

  // External Google Maps walking route link
  const originLat = selectedMode === 'rail' && nearestRail ? nearestRail.lat : nearestBus?.lat || pLat;
  const originLng = selectedMode === 'rail' && nearestRail ? nearestRail.lng : nearestBus?.lng || pLng;
  const googleWalkDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${pLat},${pLng}&travelmode=walking`;

  return (
    <div className="bg-white dark:bg-[#241a15] rounded-3xl p-6 sm:p-7 border border-empoway-blush/80 dark:border-[#3d2c24] shadow-card space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-empoway-cream dark:border-[#382820] gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-terracotta border border-empoway-terracotta/20 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-heading font-extrabold text-empoway-coffee dark:text-white">
                {t('transportTitle')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Colombo Transit
              </span>
            </div>
            <p className="text-xs text-empoway-muted dark:text-empoway-peach/75 mt-0.5 leading-relaxed">
              {t('transportSubtitle')}
            </p>
          </div>
        </div>

        {/* Connectivity Score Badge */}
        <div className="self-start sm:self-center flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-empoway-ivory dark:bg-[#1f1713] border border-empoway-blush/80 dark:border-[#3d2c24] text-xs">
          <span className="text-[11px] font-semibold text-empoway-muted dark:text-empoway-peach/70">
            Transit Index:
          </span>
          <span className="font-heading font-extrabold text-empoway-terracotta text-sm">
            {transitScore}/100
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setSelectedMode('bus')}
          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
            selectedMode === 'bus'
              ? 'border-empoway-terracotta bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-coffee dark:text-white ring-2 ring-empoway-terracotta/20'
              : 'border-empoway-blush/60 dark:border-[#382820] bg-empoway-ivory/60 dark:bg-[#1a120e] hover:bg-empoway-cream text-empoway-coffee/80 dark:text-empoway-ivory/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Bus className="w-4 h-4 text-empoway-terracotta" />
            <span className="text-[10px] font-bold text-empoway-muted dark:text-empoway-peach/70">
              {nearestBus ? nearestBus.formattedDistance : '—'}
            </span>
          </div>
          <span className="text-xs font-bold leading-tight">{t('busConnection')}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('rail')}
          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
            selectedMode === 'rail'
              ? 'border-empoway-terracotta bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-coffee dark:text-white ring-2 ring-empoway-terracotta/20'
              : 'border-empoway-blush/60 dark:border-[#382820] bg-empoway-ivory/60 dark:bg-[#1a120e] hover:bg-empoway-cream text-empoway-coffee/80 dark:text-empoway-ivory/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Train className="w-4 h-4 text-empoway-terracotta" />
            <span className="text-[10px] font-bold text-empoway-muted dark:text-empoway-peach/70">
              {nearestRail ? nearestRail.formattedDistance : '—'}
            </span>
          </div>
          <span className="text-xs font-bold leading-tight">{t('railConnection')}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('dropoff')}
          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
            selectedMode === 'dropoff'
              ? 'border-empoway-terracotta bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-coffee dark:text-white ring-2 ring-empoway-terracotta/20'
              : 'border-empoway-blush/60 dark:border-[#382820] bg-empoway-ivory/60 dark:bg-[#1a120e] hover:bg-empoway-cream text-empoway-coffee/80 dark:text-empoway-ivory/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Car className="w-4 h-4 text-empoway-terracotta" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Direct
            </span>
          </div>
          <span className="text-xs font-bold leading-tight">{t('dropOffConnection')}</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('corridor')}
          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
            selectedMode === 'corridor'
              ? 'border-empoway-terracotta bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-coffee dark:text-white ring-2 ring-empoway-terracotta/20'
              : 'border-empoway-blush/60 dark:border-[#382820] bg-empoway-ivory/60 dark:bg-[#1a120e] hover:bg-empoway-cream text-empoway-coffee/80 dark:text-empoway-ivory/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <Footprints className="w-4 h-4 text-empoway-terracotta" />
            <span className="text-[10px] font-bold text-empoway-muted dark:text-empoway-peach/70">
              {corridor?.curbRampStatus || 'Kerbs'}
            </span>
          </div>
          <span className="text-xs font-bold leading-tight">{t('corridorConnection')}</span>
        </button>
      </div>

      {/* Mode Details Display Area */}
      <div className="p-5 rounded-2xl bg-empoway-ivory dark:bg-[#1f1713] border border-empoway-blush/70 dark:border-[#3d2c24] space-y-4">
        {/* BUS TAB */}
        {selectedMode === 'bus' && nearestBus && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-empoway-cream dark:border-[#382820] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-empoway-caramel block">
                  {t('nearestStop')}
                </span>
                <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                  {nearestBus.name}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-empoway-terracotta text-sm">
                  {nearestBus.formattedDistance}
                </span>
                <span className="text-empoway-muted dark:text-empoway-peach/70">
                  (~{nearestBus.rollingMinutes} min roll)
                </span>
              </div>
            </div>

            {/* Bus Features & Routes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Connecting Routes
                </span>
                <div className="flex flex-wrap gap-1">
                  {nearestBus.routes?.map((r, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded-md bg-empoway-cream dark:bg-[#1c1410] font-bold text-empoway-coffee dark:text-empoway-ivory text-[10px]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Kerb & Dropped Ramps
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                    nearestBus.curbRampsPresent
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {nearestBus.curbRampsPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{nearestBus.curbRampsPresent ? 'Dropped Kerb Available' : 'High Roadside Kerb (15cm)'}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Low-Floor Pilot Fleet
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                    nearestBus.lowFloorBusService
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {nearestBus.lowFloorBusService ? <CheckCircle2 className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                  <span>{nearestBus.lowFloorBusService ? 'Operated on Corridor' : 'Standard High-Floor Buses'}</span>
                </span>
              </div>
            </div>

            <p className="text-empoway-coffee/90 dark:text-empoway-ivory/80 leading-relaxed italic bg-white/60 dark:bg-[#2b1e18]/60 p-3 rounded-xl border border-empoway-blush/40 dark:border-[#382820]">
              "{nearestBus.notes}"
            </p>
          </div>
        )}

        {/* RAIL TAB */}
        {selectedMode === 'rail' && nearestRail && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-empoway-cream dark:border-[#382820] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-empoway-caramel block">
                  {t('nearestStation')}
                </span>
                <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                  {nearestRail.name}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-empoway-terracotta text-sm">
                  {nearestRail.formattedDistance}
                </span>
                <span className="text-empoway-muted dark:text-empoway-peach/70">
                  (~{nearestRail.rollingMinutes} min roll)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Connecting Lines
                </span>
                <p className="font-bold text-empoway-coffee dark:text-white">
                  {nearestRail.lines?.join(', ')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Platform Access
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                    nearestRail.stepFreePlatformAccess
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {nearestRail.stepFreePlatformAccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{nearestRail.stepFreePlatformAccess ? 'Step-Free Entrance' : 'Overpass Steps Without Lift'}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Station Assistance
                </span>
                {nearestRail.assistancePhone ? (
                  <a
                    href={`tel:${nearestRail.assistancePhone}`}
                    className="inline-flex items-center gap-1 text-empoway-terracotta font-bold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{nearestRail.assistancePhone}</span>
                  </a>
                ) : (
                  <span className="text-stone-500 font-medium">Station Master Desk</span>
                )}
              </div>
            </div>

            <p className="text-empoway-coffee/90 dark:text-empoway-ivory/80 leading-relaxed italic bg-white/60 dark:bg-[#2b1e18]/60 p-3 rounded-xl border border-empoway-blush/40 dark:border-[#382820]">
              "{nearestRail.notes}"
            </p>
          </div>
        )}

        {/* DROP-OFF TAB */}
        {selectedMode === 'dropoff' && dropOff && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-empoway-cream dark:border-[#382820] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-empoway-caramel block">
                Vehicle Access Assessment
              </span>
              <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                Portico & Vehicle Drop-off Point
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Entrance Transition
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{dropOff.suitability === 'EXCELLENT' ? 'Level / Ramped Kerb Drop-Off' : 'Driver Assistance Needed for Kerb'}</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Weather Shelter
                </span>
                <span className="font-semibold text-empoway-coffee dark:text-white">
                  {dropOff.shelteredPortico ? 'Covered porch / Canopy available' : 'Open-air curbside unloading'}
                </span>
              </div>
            </div>

            <p className="text-empoway-coffee/90 dark:text-empoway-ivory/80 leading-relaxed bg-white/60 dark:bg-[#2b1e18]/60 p-3 rounded-xl border border-empoway-blush/40 dark:border-[#382820]">
              {dropOff.vehicleAccessNotes}
            </p>
          </div>
        )}

        {/* CORRIDOR TAB */}
        {selectedMode === 'corridor' && corridor && (
          <div className="space-y-4 text-xs">
            <div className="border-b border-empoway-cream dark:border-[#382820] pb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-empoway-caramel block">
                Last-Mile Pedestrian Walkway
              </span>
              <h4 className="text-sm font-bold text-empoway-coffee dark:text-white">
                Sidewalk & Kerb Ramp Condition ({place.cityOrArea})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Dropped Kerb Standard
                </span>
                <span className="font-bold text-empoway-coffee dark:text-white">
                  {corridor.curbRampStatus === 'EXCELLENT'
                    ? 'Frequent Dropped Kerbs (1:10 slope)'
                    : corridor.curbRampStatus === 'MODERATE'
                    ? 'Partial Dropped Kerbs at Major Corners'
                    : 'High Roadside Kerbs (15-20cm)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#2b1e18] border border-empoway-blush/60 dark:border-[#382820]">
                <span className="text-[10px] text-empoway-muted dark:text-empoway-peach/70 block mb-1">
                  Pavement Surface Quality
                </span>
                <span className="font-bold text-empoway-coffee dark:text-white">
                  {corridor.sidewalkQuality === 'HIGH'
                    ? 'Paved Continuous Concrete Pavers'
                    : corridor.sidewalkQuality === 'MODERATE'
                    ? 'Paved Sidewalk with Driveway Inverts'
                    : 'Variable / Narrow Pavement'}
                </span>
              </div>
            </div>

            <p className="text-empoway-coffee/90 dark:text-empoway-ivory/80 leading-relaxed bg-white/60 dark:bg-[#2b1e18]/60 p-3 rounded-xl border border-empoway-blush/40 dark:border-[#382820]">
              {corridor.corridorAdvice}
            </p>
          </div>
        )}
      </div>

      {/* Practical Colombo Transit Tips List */}
      {transitTips && transitTips.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Colombo Transit Practical Advice</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {transitTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <a
          href={googleWalkDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white shadow-soft transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t('openWalkingRoute')}</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>

        <Link
          to={`/journey`}
          state={{ destPlace: place }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-empoway-cream dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-ivory hover:bg-empoway-blush transition-colors border border-empoway-champagne dark:border-[#443229]"
        >
          <Compass className="w-3.5 h-3.5 text-empoway-terracotta" />
          <span>Open in Journey Planner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default AccessibleTransportChecker;

