import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Share2,
  Camera,
  AlertTriangle,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Building2,
  Info,
  Footprints,
  Maximize,
  ArrowUpDown,
  Layers,
  Heart,
  MessageSquare,
  Scale,
  ShieldAlert,
  Clock,
  Check,
  X,
  Filter
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge, { DemoDataBadge } from '../components/StatusBadge';
import FeatureChecklist, { AccessibilityScorecard } from '../components/FeatureChecklist';
import PersonalAccessibilityMatch from '../components/PersonalAccessibilityMatch';
import AccessibleTransportChecker from '../components/AccessibleTransportChecker';
import MapView from '../components/MapView';
import ReportModal from '../components/Modals/ReportModal';
import UploadPhotoModal from '../components/Modals/UploadPhotoModal';
import ShareModal from '../components/Modals/ShareModal';

export const PlaceDetailPage = () => {
  const { id } = useParams();
  const { user, isFavorite, toggleFavorite, promptLogin } = useAuth();
  const [place, setPlace] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [personalMatch, setPersonalMatch] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [activeBarriers, setActiveBarriers] = useState([]);
  const [resolvedBarriers, setResolvedBarriers] = useState([]);
  const [updatesHistory, setUpdatesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [facilityFilter, setFacilityFilter] = useState('ALL');

  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const fetchPlace = async () => {
    try {
      const res = await api.getPlaceById(id);
      if (res.success && res.place) {
        setPlace({
          ...res.place,
          siblingBranches: res.siblingBranches || res.place.siblingBranches || []
        });
        setScorecard(res.scorecard || null);
        setPersonalMatch(res.personalMatch || null);
        setTransportData(res.transportConnections || null);
        setActiveBarriers(res.activeBarriers || []);
        setResolvedBarriers(res.resolvedBarriers || []);
        setUpdatesHistory(res.updatesHistory || res.place.reports || []);
      }
    } catch (err) {
      console.error('Error loading place:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-empoway-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-empoway-muted font-medium">
          Loading verified accessibility profile...
        </p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-empoway-coffee">
          Place Profile Not Found
        </h2>
        <p className="text-xs text-empoway-muted">
          The requested location could not be located in our database or may have been unlisted.
        </p>
        <Link
          to="/explore"
          className="inline-block px-5 py-2.5 rounded-xl bg-empoway-terracotta text-white text-xs font-bold"
        >
          Back to Places Directory
        </Link>
      </div>
    );
  }

  const allPhotos =
    place.photographs && place.photographs.length > 0
      ? place.photographs
      : [
          {
            url: '/places/colombo-city-centre.jpg',
            caption: 'Main entrance area',
            facilityType: 'ENTRANCE',
            isVerifiedEvidence: false
          }
        ];

  const filteredPhotos =
    facilityFilter === 'ALL'
      ? allPhotos
      : allPhotos.filter((p) => (p.facilityType || 'GENERAL').toUpperCase() === facilityFilter);

  const activePhotosList = filteredPhotos.length > 0 ? filteredPhotos : allPhotos;
  const currentPhoto = activePhotosList[activePhotoIdx] || activePhotosList[0];
  const feat = place.accessibilityFeature || {};

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-empoway-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-empoway-terracotta transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <Link to="/explore" className="hover:text-empoway-terracotta transition-colors">
          Colombo Places
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <Link
          to={`/explore?categorySlug=${place.category?.slug}`}
          className="hover:text-empoway-terracotta transition-colors"
        >
          {place.category?.name || 'Category'}
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <span className="font-semibold text-empoway-coffee truncate max-w-xs">
          {place.name}
        </span>
      </nav>

      {/* Header Profile Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-empoway-cream text-empoway-coffee border border-empoway-champagne">
                {place.category?.name}
              </span>
              <StatusBadge status={place.accessibilityStatus} size="md" showDescription={true} />
              {place.isDemoData && <DemoDataBadge size="md" />}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-empoway-coffee">
              {place.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-empoway-muted pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-empoway-terracotta shrink-0" />
                <span className="text-empoway-coffee font-medium">{place.address} ({place.cityOrArea}, {place.district})</span>
              </span>

              {place.lastVerifiedDate ? (
                <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    Physically Verified: {new Date(place.lastVerifiedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </span>
              ) : (
                <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Community logged • Pending physical audit
                </span>
              )}

              <span className="text-empoway-muted">
                Created: {new Date(place.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2 self-start">
            {/* Compare Place */}
            <Link
              to={`/compare?place1=${place.id}`}
              className="p-2.5 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold transition-colors border border-empoway-champagne flex items-center gap-1.5 shadow-2xs"
              title="Compare side-by-side with another place"
            >
              <Scale className="w-4 h-4 text-empoway-terracotta" />
              <span>Compare</span>
            </Link>

            {/* Save to Favourites Toggle */}
            <button
              type="button"
              onClick={() => toggleFavorite(place.id, `/places/${place.id}`)}
              className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                isFavorite(place.id)
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                  : 'bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border-empoway-champagne'
              }`}
              title={isFavorite(place.id) ? 'Saved in your favourites' : 'Save to favourites (Sign in required)'}
            >
              <Heart className={`w-4 h-4 ${isFavorite(place.id) ? 'text-rose-600 fill-current' : 'text-empoway-terracotta'}`} />
              <span>{isFavorite(place.id) ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold transition-colors border border-empoway-champagne flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-empoway-terracotta" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  promptLogin({
                    title: 'Sign In to Upload Photos',
                    message: 'Create your account or sign in to upload accessibility photographs for this place.',
                    actionName: 'upload accessibility photographs',
                    redirectPath: `/places/${place.id}`
                  });
                  return;
                }
                setUploadModalOpen(true);
              }}
              className="p-2.5 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold transition-colors border border-empoway-champagne flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-empoway-terracotta" />
              <span>Add Evidence Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  promptLogin({
                    title: 'Sign In to Submit Report',
                    message: 'Create your account or sign in to add accessibility observations or report changes for this place.',
                    actionName: 'submit an accessibility report',
                    redirectPath: `/places/${place.id}`
                  });
                  return;
                }
                setReportModalOpen(true);
              }}
              className="p-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Barrier / Inaccuracy</span>
            </button>
          </div>
        </div>

        {/* Active Physical Barrier Alerts */}
        {activeBarriers.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-200 text-rose-800 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-rose-900">
                  Active Accessibility Barrier Warning ({activeBarriers.length})
                </h3>
                <p className="text-xs text-rose-800">
                  Wheelchair users and commuters should take note of these reported hurdles before planning a physical visit.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {activeBarriers.map((barrier) => (
                <div key={barrier.id} className="p-3.5 rounded-xl bg-white border border-rose-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-rose-900">
                      {barrier.barrierType ? barrier.barrierType.replace(/_/g, ' ') : (barrier.featureName || 'Physical Barrier Encountered')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                      {barrier.status}
                    </span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">{barrier.description}</p>
                  <div className="text-[10px] text-stone-500 pt-1 flex flex-wrap items-center gap-3">
                    <span>Reported: {new Date(barrier.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {barrier.adminNotes && (
                      <span className="text-amber-800 font-semibold">• Auditor Note: {barrier.adminNotes}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional Description */}
        {place.description && (
          <p className="text-xs sm:text-sm text-empoway-coffee/90 leading-relaxed pt-2 border-t border-empoway-cream">
            {place.description}
          </p>
        )}
      </div>

      {/* Directory Status Notice: Not Yet Assessed */}
      {place.accessibilityStatus === 'NOT_YET_ASSESSED' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 border border-slate-300 text-slate-800 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-200 text-slate-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Colombo District Directory Listing • Awaiting Physical Accessibility Assessment
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                This public facility is catalogued in our Colombo District Directory from verified institutional registries ({place.dataSource || 'Official Public Registry'}).
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pl-12">
            In compliance with EMPOWAY's verification integrity standards, all 8 physical features are marked as <strong>Unknown</strong> and no accessibility points are assigned until a physical site audit or verified evidence report is reviewed and approved. If you have visited this location, you can contribute photos or report accessibility features using the buttons above.
          </p>
        </div>
      )}

      {/* Parent Organization & Colombo Branches Card */}
      {place.organization && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-empoway-cream">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-empoway-terracotta/10 text-empoway-terracotta flex items-center justify-center font-black text-sm shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-empoway-coffee">
                    {place.organization.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-empoway-cream text-empoway-coffee border border-empoway-champagne">
                    {place.organization.sector || place.institutionType || 'Public'} Sector
                  </span>
                </div>
                {place.branchName && (
                  <p className="text-xs text-empoway-terracotta font-semibold mt-0.5">
                    Branch: {place.branchName} ({place.cityOrArea})
                  </p>
                )}
              </div>
            </div>

            {place.organization.website && (
              <a
                href={place.organization.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-empoway-terracotta hover:text-empoway-terracotta-dark self-start sm:self-auto"
              >
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-empoway-coffee">
            {place.organization.headquartersAddress && (
              <div className="p-3 rounded-xl bg-empoway-ivory border border-empoway-blush/50">
                <span className="text-[10px] uppercase font-bold text-empoway-muted block">Headquarters</span>
                <span className="font-semibold block mt-0.5">{place.organization.headquartersAddress}</span>
              </div>
            )}
            <div className="p-3 rounded-xl bg-empoway-ivory border border-empoway-blush/50">
              <span className="text-[10px] uppercase font-bold text-empoway-muted block">Data Source</span>
              <span className="font-semibold block mt-0.5">{place.dataSource || place.organization.dataSource || 'Colombo Directory Pilot'}</span>
            </div>
            <div className="p-3 rounded-xl bg-empoway-ivory border border-empoway-blush/50">
              <span className="text-[10px] uppercase font-bold text-empoway-muted block">Administrative District</span>
              <span className="font-semibold block mt-0.5">Colombo District, Sri Lanka</span>
            </div>
          </div>

          {/* Sibling Branches in Colombo */}
          {place.siblingBranches && place.siblingBranches.length > 0 && (
            <div className="pt-3 border-t border-empoway-cream space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-empoway-coffee">
                Other {place.organization.name} Branches in Colombo ({place.siblingBranches.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {place.siblingBranches.map((branch) => (
                  <Link
                    key={branch.id}
                    to={`/places/${branch.id}`}
                    className="p-3 rounded-xl bg-white hover:bg-empoway-cream/60 border border-empoway-blush/80 hover:border-empoway-terracotta transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-empoway-coffee group-hover:text-empoway-terracotta transition-colors line-clamp-1">
                        {branch.branchName || branch.name}
                      </p>
                      <p className="text-[11px] text-empoway-muted line-clamp-1">
                        {branch.cityOrArea}
                      </p>
                    </div>
                    <StatusBadge status={branch.accessibilityStatus} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prominent Transparent Accessibility Scorecard */}
      <AccessibilityScorecard scorecard={scorecard} placeName={place.name} />

      {/* Feature 1: Personal Accessibility Match (Tailored to individual equipment) */}
      <PersonalAccessibilityMatch place={place} initialMatch={personalMatch} />

      {/* Main Grid: Gallery & Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Evidence Photos & Condition Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Photo Gallery Viewer */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-empoway-blush/70 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-empoway-cream">
              <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                <Camera className="w-4 h-4 text-empoway-terracotta" />
                <span>Accessibility Evidence Photographs</span>
              </h2>
              <span className="text-xs text-empoway-muted font-medium">
                {activePhotosList.length} photograph(s)
              </span>
            </div>

            {/* Facility Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {[
                { id: 'ALL', label: 'All Photos' },
                { id: 'ENTRANCE', label: 'Entrance' },
                { id: 'RAMP', label: 'Ramps' },
                { id: 'ELEVATOR', label: 'Elevators' },
                { id: 'TOILET', label: 'Restrooms' },
                { id: 'PARKING', label: 'Parking' },
                { id: 'PATHWAY', label: 'Pathways' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFacilityFilter(f.id);
                    setActivePhotoIdx(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                    facilityFilter === f.id
                      ? 'bg-empoway-terracotta text-white border-empoway-terracotta shadow-xs'
                      : 'bg-empoway-cream text-empoway-coffee border-empoway-champagne hover:bg-empoway-blush'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Main Active Photo */}
            <div className="relative rounded-2xl overflow-hidden bg-empoway-cream h-72 sm:h-96">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption || place.name}
                className="w-full h-full object-cover"
              />

              {/* Verified Evidence Badge Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {currentPhoto.isVerifiedEvidence && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Audit Photo</span>
                  </span>
                )}
                {currentPhoto.facilityType && currentPhoto.facilityType !== 'GENERAL' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-xs text-white">
                    Facility: {currentPhoto.facilityType}
                  </span>
                )}
              </div>

              {currentPhoto.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 text-white text-xs space-y-1">
                  <span className="font-semibold block">{currentPhoto.caption}</span>
                  {currentPhoto.uploader && (
                    <span className="text-[11px] text-stone-300 block">
                      Uploaded by {currentPhoto.uploader.fullName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {activePhotosList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {activePhotosList.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-empoway-terracotta ring-2 ring-empoway-terracotta/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Physical Accessibility Conditions Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-empoway-coffee flex items-center gap-2 border-b border-empoway-cream pb-3">
              <Info className="w-5 h-5 text-empoway-terracotta" />
              <span>Physical Access Assessment Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-empoway-muted block">
                  Entrance & Steps
                </span>
                <p className="font-semibold text-empoway-coffee text-sm">
                  {place.numberOfSteps === 0
                    ? 'Step-Free Access (0 steps)'
                    : `${place.numberOfSteps} step(s) encountered`}
                </p>
                <p className="text-empoway-muted leading-relaxed">
                  {place.entranceDetails || 'Standard ground-level threshold.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-empoway-muted block">
                  Ramp Slope & Condition
                </span>
                <p className="font-semibold text-empoway-coffee text-sm">
                  {feat.wheelchairRamp === 'AVAILABLE' ? 'Permanent Ramp Available' : 'No Permanent Ramp'}
                </p>
                <p className="text-empoway-muted leading-relaxed">
                  {place.rampCondition || 'Condition details not specified.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-empoway-muted block">
                  Elevator / Lift Facility
                </span>
                <p className="font-semibold text-empoway-coffee text-sm">
                  {feat.elevator === 'AVAILABLE' ? 'Elevator Operating' : 'No Public Elevator'}
                </p>
                <p className="text-empoway-muted leading-relaxed">
                  {place.elevatorLocation || 'Single-story facility or location unnoted.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-bold text-empoway-muted block">
                  Known Mobility Limitations
                </span>
                <p className="font-semibold text-empoway-coffee text-sm">
                  {place.limitationsNotes ? 'Noted Barriers' : 'No Critical Limitations Noted'}
                </p>
                <p className="text-empoway-muted leading-relaxed">
                  {place.limitationsNotes || 'No restrictive hurdles reported for wheelchair users.'}
                </p>
              </div>
            </div>

            {/* Official Verification Audit Notes */}
            {place.verificationNotes && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Physical Auditor Verification Notes</span>
                </div>
                <p className="leading-relaxed">{place.verificationNotes}</p>
                {place.verifier && (
                  <p className="text-[11px] text-emerald-800 pt-1 font-semibold">
                    Audited by: {place.verifier.fullName}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Feature 2: Accessible Transport Connection Checker (Colombo transit links & corridor) */}
          <AccessibleTransportChecker place={place} transportData={transportData} />

          {/* Community Reports and Barrier Updates History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-empoway-cream pb-3">
              <div>
                <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-empoway-terracotta" />
                  <span>Physical Audit & Barrier Update History</span>
                </h2>
                <p className="text-xs text-empoway-muted mt-0.5">
                  Logged inspections, reported issues, and verified resolutions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    promptLogin({
                      title: 'Sign In to Submit Report',
                      message: 'Create your account or sign in to add accessibility observations or report changes for this place.',
                      actionName: 'submit an accessibility update',
                      redirectPath: `/places/${place.id}`
                    });
                    return;
                  }
                  setReportModalOpen(true);
                }}
                className="text-xs font-bold text-empoway-terracotta hover:underline"
              >
                + Log Observation
              </button>
            </div>

            {updatesHistory && updatesHistory.length > 0 ? (
              <div className="space-y-3">
                {updatesHistory.map((rep) => {
                  const isResolved = rep.status === 'RESOLVED';
                  const isConfirmed = rep.status === 'CONFIRMED';
                  const isUnderReview = rep.status === 'UNDER_REVIEW' || rep.status === 'SUBMITTED' || rep.status === 'PENDING';

                  const badgeClass = isResolved
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : isConfirmed
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300';

                  return (
                    <div
                      key={rep.id}
                      className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-empoway-coffee">
                          {rep.barrierType
                            ? rep.barrierType.replace(/_/g, ' ')
                            : (rep.featureName || rep.reportType)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                            {rep.status}
                          </span>
                          <span className="text-[11px] text-empoway-muted">
                            {new Date(rep.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <p className="text-empoway-coffee/90 leading-relaxed">
                        {rep.description}
                      </p>

                      {rep.resolutionNotes && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                          <strong>Resolution note:</strong> {rep.resolutionNotes}
                          {rep.resolvedAt && (
                            <span className="block text-[10px] text-emerald-700 mt-0.5">
                              Resolved on {new Date(rep.resolvedAt).toLocaleDateString('en-GB')}
                            </span>
                          )}
                        </div>
                      )}

                      {rep.adminNotes && !rep.resolutionNotes && (
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                          <strong>Moderation status note:</strong> {rep.adminNotes}
                        </div>
                      )}

                      {rep.reporter && (
                        <div className="text-[10px] text-empoway-muted pt-1">
                          Reported by community contributor: {rep.reporter.fullName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-empoway-muted">
                  No barriers or revisions logged recently. Notice a change in ramp condition, entrance accessibility, or elevator functionality?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      promptLogin({
                        title: 'Sign In to Share Observations',
                        message: 'Create your account or sign in to share accessibility observations for this place.',
                        actionName: 'share accessibility observations',
                        redirectPath: `/places/${place.id}`
                      });
                      return;
                    }
                    setReportModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border border-empoway-champagne transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-empoway-terracotta" />
                  <span>Share Accessibility Observation</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): 8-Feature Scorecard & Location Map */}
        <div className="lg:col-span-5 space-y-6">
          {/* Complete 8-Feature Accessibility Checklist */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-empoway-caramel block mb-1">
                Universal Criteria
              </span>
              <h2 className="text-lg font-bold text-empoway-coffee">
                8 Core Accessibility Criteria
              </h2>
              <p className="text-xs text-empoway-muted mt-0.5">
                Evaluated against Sri Lankan Gazette No. 1467/15 and international accessibility standards.
              </p>
            </div>

            <FeatureChecklist features={feat} compact={false} showNotes={true} />
          </div>

          {/* Embedded Colombo Location Map */}
          <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-empoway-coffee flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-empoway-terracotta" />
                <span>Location in Colombo</span>
              </h3>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-empoway-terracotta hover:underline"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden border border-empoway-blush/60">
              <MapView
                places={[place]}
                center={[place.latitude, place.longitude]}
                zoom={15}
                height="100%"
              />
            </div>

            <div className="text-xs text-empoway-muted font-mono bg-empoway-cream/50 p-2.5 rounded-xl border border-empoway-blush/40 flex items-center justify-between">
              <span>Lat: {place.latitude.toFixed(5)}</span>
              <span>Lng: {place.longitude.toFixed(5)}</span>
            </div>
          </div>

          {/* Contact Details Card */}
          {(place.contactPhone || place.contactEmail || place.contactWebsite) && (
            <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-3">
              <h3 className="text-sm font-bold text-empoway-coffee border-b border-empoway-cream pb-2">
                Facility Contact Details
              </h3>
              <div className="space-y-2 text-xs">
                {place.contactPhone && (
                  <div className="flex items-center gap-2.5 text-empoway-coffee">
                    <Phone className="w-4 h-4 text-empoway-caramel shrink-0" />
                    <a href={`tel:${place.contactPhone}`} className="hover:underline font-medium">
                      {place.contactPhone}
                    </a>
                  </div>
                )}
                {place.contactEmail && (
                  <div className="flex items-center gap-2.5 text-empoway-coffee">
                    <Mail className="w-4 h-4 text-empoway-caramel shrink-0" />
                    <a href={`mailto:${place.contactEmail}`} className="hover:underline font-medium">
                      {place.contactEmail}
                    </a>
                  </div>
                )}
                {place.contactWebsite && (
                  <div className="flex items-center gap-2.5 text-empoway-coffee">
                    <Globe className="w-4 h-4 text-empoway-caramel shrink-0" />
                    <a
                      href={place.contactWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium truncate"
                    >
                      {place.contactWebsite}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        place={place}
        onReportSubmitted={fetchPlace}
      />
      <UploadPhotoModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        place={place}
        onPhotosUploaded={fetchPlace}
      />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        place={place}
      />
    </div>
  );
};

export default PlaceDetailPage;

