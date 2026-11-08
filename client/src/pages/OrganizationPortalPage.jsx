import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Upload,
  Camera,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Save,
  Check,
  ChevronRight,
  Info,
  Lock,
  ArrowRight,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { FEATURE_CONFIG, getStatusBadge } from '../components/FeatureChecklist';
import UploadPhotoModal from '../components/Modals/UploadPhotoModal';

export const OrganizationPortalPage = () => {
  const { user, isAdmin } = useAuth();
  const isOrg = user?.role === 'organization' || isAdmin;

  const [venue, setVenue] = useState(null);
  const [orgMeta, setOrgMeta] = useState({ name: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Editable form fields
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [entranceDetails, setEntranceDetails] = useState('');
  const [rampCondition, setRampCondition] = useState('');
  const [numberOfSteps, setNumberOfSteps] = useState(0);
  const [elevatorLocation, setElevatorLocation] = useState('');
  const [limitationsNotes, setLimitationsNotes] = useState('');
  const [features, setFeatures] = useState({});

  // Response state for reports
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [markResolved, setMarkResolved] = useState(false);

  const loadVenueData = async () => {
    if (!isOrg) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.getMyOrgVenue();
      if (res.success && res.place) {
        const p = res.place;
        setVenue(p);
        setOrgMeta({
          name: res.organizationName || p.name,
          type: res.organizationType || 'Partner Facility'
        });
        setDescription(p.description || '');
        setContactPhone(p.contactPhone || '');
        setContactEmail(p.contactEmail || '');
        setContactWebsite(p.contactWebsite || '');
        setEntranceDetails(p.entranceDetails || '');
        setRampCondition(p.rampCondition || '');
        setNumberOfSteps(p.numberOfSteps || 0);
        setElevatorLocation(p.elevatorLocation || '');
        setLimitationsNotes(p.limitationsNotes || '');

        const f = p.accessibilityFeature ? p.accessibilityFeature : {};
        setFeatures({
          stepFreeEntrance: f.stepFreeEntrance || 'UNKNOWN',
          wheelchairRamp: f.wheelchairRamp || 'UNKNOWN',
          elevator: f.elevator || 'UNKNOWN',
          accessibleToilet: f.accessibleToilet || 'UNKNOWN',
          accessibleParking: f.accessibleParking || 'UNKNOWN',
          wideDoorways: f.wideDoorways || 'UNKNOWN',
          wheelchairPathways: f.wheelchairPathways || 'UNKNOWN',
          accessibleCounters: f.accessibleCounters || 'UNKNOWN'
        });
      }
    } catch (err) {
      console.error('Error loading organization venue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenueData();
  }, [isOrg]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
  };

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    if (!venue) return;

    setSaving(true);
    try {
      const res = await api.updateOrgVenue(venue.id, {
        description,
        contactPhone,
        contactEmail,
        contactWebsite,
        entranceDetails,
        rampCondition,
        numberOfSteps: parseInt(numberOfSteps, 10),
        elevatorLocation,
        limitationsNotes,
        features
      });

      if (res.success) {
        showFeedback('success', 'Facility accessibility updates saved successfully.');
        loadVenueData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Failed to update venue details.');
    } finally {
      setSaving(false);
    }
  };

  const handleRespondToReport = async (reportId) => {
    if (!responseText.trim()) return;

    try {
      const res = await api.respondToOrgReport(reportId, responseText, markResolved);
      if (res.success) {
        showFeedback('success', 'Official facility response posted successfully.');
        setSelectedReportId(null);
        setResponseText('');
        setMarkResolved(false);
        loadVenueData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Failed to submit response.');
    }
  };

  // If user is an ordinary member without organisation credentials
  if (!isOrg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-empoway-blush/80 shadow-card text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-empoway-cream border border-empoway-champagne flex items-center justify-center mx-auto text-empoway-terracotta shadow-xs">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-empoway-peach/20 text-empoway-terracotta border border-empoway-peach/40">
              Institutional Accreditation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee">
              EMPOWAY Organisation Portal
            </h1>
            <p className="text-xs sm:text-sm text-empoway-muted leading-relaxed">
              This portal is strictly reserved for accredited public venues, healthcare facilities, universities, commercial banks, and government agencies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 text-xs text-left space-y-3 max-w-xl mx-auto">
            <h3 className="font-bold text-empoway-coffee text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Organisation Access Permissions</span>
            </h3>
            <ul className="space-y-2 text-empoway-coffee/90 list-disc pl-5">
              <li>Manage and audit official facility entrance details, ramps, and elevators.</li>
              <li>Upload verified photographic evidence of accessible toilets and parking bays.</li>
              <li>Respond directly to user-reported accessibility barriers and log repair milestones.</li>
              <li>Earn official EMPOWAY Institutional Accessibility Certification for Colombo.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-xl bg-empoway-terracotta text-white text-xs font-bold shadow-xs hover:bg-empoway-terracotta-dark transition-all"
            >
              Back to Places Directory
            </Link>
            <Link
              to="/colombo-pilot"
              className="px-6 py-2.5 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold border border-empoway-champagne transition-all"
            >
              Learn About Colombo Pilot Accreditation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-empoway-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-empoway-muted font-medium">Loading organization management console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-empoway-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-empoway-terracotta transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <span className="font-semibold text-empoway-coffee">Organisation Portal</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-empoway-coffee to-empoway-coffee-dark text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-empoway-peach" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              Organisation Management Portal
            </h1>
          </div>
          <p className="text-xs text-white/80">
            Institutional administration for <strong>{venue?.name || orgMeta.name}</strong> • Colombo, Sri Lanka
          </p>
        </div>

        <div className="flex items-center gap-2">
          {venue && (
            <Link
              to={`/places/${venue.id}`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>View Public Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Venue Management Form */}
      {venue ? (
        <form onSubmit={handleSaveVenue} className="space-y-8">
          {/* Section 1: Venue Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/80 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-empoway-cream pb-3">
              <div>
                <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-empoway-terracotta" />
                  <span>Facility Identification & Public Contact</span>
                </h2>
                <p className="text-xs text-empoway-muted mt-0.5">
                  Ensure public contact details and accessible transit assistance numbers are up to date.
                </p>
              </div>
              <StatusBadge status={venue.accessibilityStatus} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 011 269 1111"
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                />
              </div>

              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Public Inquiries Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="info@institution.lk"
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                />
              </div>

              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  placeholder="https://institution.lk"
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Facility Overview & Mobility Advisory
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your facility layout, recommended drop-off zones, and porter assistance availability..."
                className="w-full p-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              />
            </div>
          </div>

          {/* Section 2: Core 8 Accessibility Features */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/80 shadow-card space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-terracotta block">
                Gazette No. 1467/15 Criteria
              </span>
              <h2 className="text-base font-bold text-empoway-coffee">
                Manage 8 Core Accessibility Features
              </h2>
              <p className="text-xs text-empoway-muted mt-0.5">
                Set the authentic status for each physical accessibility dimension. Never mark an unconfirmed feature as available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURE_CONFIG.map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-empoway-coffee">{item.label}</span>
                    <span className="text-[10px] text-empoway-muted">{item.key}</span>
                  </div>

                  <select
                    value={features[item.key] || 'UNKNOWN'}
                    onChange={(e) =>
                      setFeatures({ ...features, [item.key]: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-white border border-empoway-blush text-empoway-coffee font-semibold focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  >
                    <option value="AVAILABLE">Available & Functional</option>
                    <option value="NOT_AVAILABLE">Not Available / Absent</option>
                    <option value="NEEDS_VERIFICATION">Needs Physical Verification</option>
                    <option value="UNKNOWN">Unknown / Not Documented</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Entrance and Ramp details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Entrance Steps Encountered
                </label>
                <input
                  type="number"
                  min="0"
                  value={numberOfSteps}
                  onChange={(e) => setNumberOfSteps(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee"
                />
              </div>

              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Ramp Slope & Condition
                </label>
                <input
                  type="text"
                  value={rampCondition}
                  onChange={(e) => setRampCondition(e.target.value)}
                  placeholder="e.g. 1:14 slope with stainless handrails"
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee"
                />
              </div>

              <div>
                <label className="block font-semibold text-empoway-coffee mb-1">
                  Passenger Elevator Location
                </label>
                <input
                  type="text"
                  value={elevatorLocation}
                  onChange={(e) => setElevatorLocation(e.target.value)}
                  placeholder="e.g. Ground floor lobby, West Wing"
                  className="w-full p-2.5 rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee"
                />
              </div>
            </div>
          </div>

          {/* Section 3: User Reported Issues & Barrier Response Desk */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/80 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-empoway-cream pb-3">
              <div>
                <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-empoway-terracotta" />
                  <span>Barrier Response Desk ({venue.reports?.length || 0})</span>
                </h2>
                <p className="text-xs text-empoway-muted mt-0.5">
                  Review physical barriers reported by commuters at your venue and publish official management updates.
                </p>
              </div>
            </div>

            {venue.reports && venue.reports.length > 0 ? (
              <div className="space-y-4">
                {venue.reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-empoway-coffee">
                        {rep.barrierType ? rep.barrierType.replace(/_/g, ' ') : (rep.featureName || rep.reportType)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        {rep.status}
                      </span>
                    </div>

                    <p className="text-empoway-coffee/90 leading-relaxed">
                      "{rep.description}"
                    </p>

                    {rep.resolutionNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px]">
                        <strong>Previous response:</strong> {rep.resolutionNotes}
                      </div>
                    )}

                    {selectedReportId === rep.id ? (
                      <div className="pt-2 space-y-2 border-t border-empoway-blush/40">
                        <textarea
                          rows={2}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write official facility response (e.g. Elevator repaired on Nov 3; new handrail installed)..."
                          className="w-full p-2.5 rounded-xl bg-white border border-empoway-blush text-xs text-empoway-coffee"
                        />
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1.5 text-xs text-empoway-coffee cursor-pointer">
                            <input
                              type="checkbox"
                              checked={markResolved}
                              onChange={(e) => setMarkResolved(e.target.checked)}
                              className="rounded text-empoway-terracotta"
                            />
                            <span>Mark this barrier issue as fully RESOLVED</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedReportId(null)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-empoway-muted hover:text-empoway-coffee"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRespondToReport(rep.id)}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-empoway-terracotta text-white shadow-xs hover:bg-empoway-terracotta-dark"
                            >
                              Publish Response
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReportId(rep.id);
                          setResponseText('');
                        }}
                        className="text-xs font-bold text-empoway-terracotta hover:underline inline-block pt-1"
                      >
                        + Post Official Facility Response
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-xs text-empoway-muted">
                No barriers or inaccuracy reports have been logged for your venue.
              </p>
            )}
          </div>

          {/* Save Bar */}
          <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-empoway-coffee text-white shadow-elevated flex items-center justify-between">
            <span className="text-xs font-semibold">
              Save changes to update EMPOWAY's public accessibility index.
            </span>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Updates...' : 'Save Venue Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-empoway-blush/80 text-center space-y-3">
          <p className="text-xs text-empoway-muted">
            No venue is currently assigned to this account. Contact the EMPOWAY administrator to associate your facility ID.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationPortalPage;

