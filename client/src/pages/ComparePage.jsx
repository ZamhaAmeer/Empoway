import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  Users,
  HelpCircle,
  AlertCircle,
  Check,
  X,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  Info,
  Footprints,
  Maximize,
  ArrowUpDown,
  Car,
  DoorOpen,
  Route,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { FEATURE_CONFIG, getStatusBadge } from '../components/FeatureChecklist';

export const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const place1Id = searchParams.get('place1') || '';
  const place2Id = searchParams.get('place2') || '';

  const [allPlaces, setAllPlaces] = useState([]);
  const [selectedP1, setSelectedP1] = useState(place1Id);
  const [selectedP2, setSelectedP2] = useState(place2Id);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load all available places for selection dropdowns
  useEffect(() => {
    const loadPlacesList = async () => {
      try {
        const res = await api.getPlaces({ limit: 100 });
        if (res.success && res.places) {
          setAllPlaces(res.places);
          // If no initial selection, default to first two
          if (!selectedP1 && res.places.length > 0) {
            setSelectedP1(String(res.places[0].id));
          }
          if (!selectedP2 && res.places.length > 1) {
            setSelectedP2(String(res.places[1].id));
          }
        }
      } catch (err) {
        console.error('Failed to load places for comparison:', err);
      }
    };
    loadPlacesList();
  }, []);

  // Sync with searchParams
  useEffect(() => {
    if (selectedP1 && selectedP2) {
      setSearchParams({ place1: selectedP1, place2: selectedP2 }, { replace: true });
    }
  }, [selectedP1, selectedP2, setSearchParams]);

  // Fetch side-by-side comparison
  useEffect(() => {
    if (!selectedP1 || !selectedP2) return;

    if (selectedP1 === selectedP2) {
      setError('Please select two different places to compare.');
      setComparisonData(null);
      return;
    }

    const fetchComparison = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.comparePlaces(selectedP1, selectedP2);
        if (res.success) {
          setComparisonData(res);
        } else {
          setError(res.message || 'Failed to compare locations.');
        }
      } catch (err) {
        setError(err.message || 'Unable to fetch comparison data.');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [selectedP1, selectedP2]);

  const p1 = comparisonData?.place1;
  const p2 = comparisonData?.place2;
  const comparison = comparisonData?.featureComparison || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-empoway-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-empoway-terracotta transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <Link to="/explore" className="hover:text-empoway-terracotta transition-colors">
          Colombo Places
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <span className="font-semibold text-empoway-coffee">
          Side-by-Side Place Comparison
        </span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-empoway-terracotta/10 text-empoway-terracotta flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-empoway-terracotta/10 text-empoway-terracotta border border-empoway-terracotta/20">
              Comparative Analysis
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee">
              Compare Public Places
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-empoway-muted leading-relaxed max-w-3xl">
          Evaluate physical accessibility side-by-side before planning your journey. Features are evaluated against Sri Lankan Gazette No. 1467/15 criteria.
          <strong className="text-empoway-coffee ml-1">Missing or unverified information is never treated as a positive or negative result.</strong>
        </p>
      </div>

      {/* Place Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Place 1 Selector */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-empoway-blush/70 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-empoway-coffee uppercase tracking-wider">
            Primary Location (Place A)
          </label>
          <select
            value={selectedP1}
            onChange={(e) => setSelectedP1(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee font-semibold focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
          >
            {allPlaces.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name} ({pl.cityOrArea}) – {pl.accessibilityStatus}
              </option>
            ))}
          </select>
        </div>

        {/* Place 2 Selector */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-empoway-blush/70 shadow-xs space-y-2">
          <label className="block text-xs font-bold text-empoway-coffee uppercase tracking-wider">
            Comparison Location (Place B)
          </label>
          <select
            value={selectedP2}
            onChange={(e) => setSelectedP2(e.target.value)}
            className="w-full p-3 text-xs sm:text-sm rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee font-semibold focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
          >
            {allPlaces.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name} ({pl.cityOrArea}) – {pl.accessibilityStatus}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-empoway-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-empoway-muted font-medium">Calculating comparative scores...</p>
        </div>
      )}

      {/* Comparison Grid */}
      {comparisonData && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[p1, p2].map((place, idx) => {
              const sc = place.scorecard || {};
              const scoreColor =
                sc.score >= 75
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : sc.score >= 40
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200';

              return (
                <div
                  key={place.id}
                  className="bg-white rounded-3xl p-6 border border-empoway-blush/80 shadow-card space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-empoway-cream">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-terracotta">
                        {idx === 0 ? 'Place A' : 'Place B'} • {place.category?.name}
                      </span>
                      <h2 className="text-xl font-bold text-empoway-coffee mt-0.5">
                        <Link to={`/places/${place.id}`} className="hover:underline">
                          {place.name}
                        </Link>
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-empoway-muted mt-1">
                        <MapPin className="w-3.5 h-3.5 text-empoway-terracotta shrink-0" />
                        <span>{place.address} ({place.cityOrArea})</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-2xl border text-center min-w-[90px] ${scoreColor}`}>
                      <div className="text-2xl font-extrabold">{sc.score}%</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider">Score</div>
                    </div>
                  </div>

                  {/* Verification Status & Last Updated */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-empoway-ivory border border-empoway-blush/40">
                      <span className="text-[10px] uppercase font-bold text-empoway-muted block">Verification</span>
                      <StatusBadge status={place.accessibilityStatus} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-empoway-ivory border border-empoway-blush/40">
                      <span className="text-[10px] uppercase font-bold text-empoway-muted block">Last Audit / Update</span>
                      <span className="font-semibold text-empoway-coffee">
                        {place.lastVerifiedDate
                          ? new Date(place.lastVerifiedDate).toLocaleDateString('en-GB')
                          : 'Pending Audit'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Feature Counts */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="font-bold text-emerald-800">{sc.available}</div>
                      <div className="text-[9px] text-emerald-700">Available</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="font-bold text-amber-800">{sc.needsVerification}</div>
                      <div className="text-[9px] text-amber-700">Pending</div>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                      <div className="font-bold text-rose-800">{sc.notAvailable}</div>
                      <div className="text-[9px] text-rose-700">Absent</div>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
                      <div className="font-bold text-stone-700">{sc.unknown}</div>
                      <div className="text-[9px] text-stone-600">Unknown</div>
                    </div>
                  </div>

                  <Link
                    to={`/places/${place.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-empoway-terracotta hover:underline pt-1"
                  >
                    <span>View full accessibility profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Detailed Feature Comparison Table */}
          <div className="bg-white rounded-3xl border border-empoway-blush/80 shadow-card overflow-hidden">
            <div className="p-6 bg-empoway-cream/40 border-b border-empoway-blush/60">
              <h3 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                <Info className="w-4 h-4 text-empoway-terracotta" />
                <span>Feature-by-Feature Detailed Comparison</span>
              </h3>
              <p className="text-xs text-empoway-muted mt-0.5">
                Side-by-side breakdown across the 8 key physical access dimensions.
              </p>
            </div>

            <div className="divide-y divide-empoway-blush/40">
              {comparison.map((item) => {
                const badge1 = getStatusBadge(item.place1Status);
                const badge2 = getStatusBadge(item.place2Status);
                const Icon1 = badge1.icon;
                const Icon2 = badge2.icon;

                return (
                  <div key={item.key} className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    {/* Feature Label */}
                    <div className="md:col-span-4">
                      <span className="text-xs sm:text-sm font-bold text-empoway-coffee block">
                        {item.label}
                      </span>
                    </div>

                    {/* Place 1 Status */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-muted md:hidden">
                        Place A:
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge1.badgeClass}`}>
                        <Icon1 className="w-3.5 h-3.5" />
                        <span>{badge1.label}</span>
                      </span>
                    </div>

                    {/* Place 2 Status */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-muted md:hidden">
                        Place B:
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge2.badgeClass}`}>
                        <Icon2 className="w-3.5 h-3.5" />
                        <span>{badge2.label}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePage;

