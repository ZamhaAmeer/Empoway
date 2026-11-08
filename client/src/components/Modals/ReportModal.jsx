import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ReportModal = ({ isOpen, onClose, place, onReportSubmitted }) => {
  const [reportType, setReportType] = useState('BARRIER_REPORT');
  const [barrierType, setBarrierType] = useState('DAMAGED_RAMP');
  const [featureName, setFeatureName] = useState('Wheelchair Ramp');
  const [reportedStatus, setReportedStatus] = useState('NOT_AVAILABLE');
  const [description, setDescription] = useState('');
  const [evidencePhotoUrl, setEvidencePhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !place) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a descriptive explanation of what you observed.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.submitReport({
        placeId: place.id,
        reportType,
        barrierType: reportType === 'BARRIER_REPORT' ? barrierType : null,
        featureName: reportType === 'UPDATE_FEATURES' ? featureName : null,
        reportedStatus: reportType === 'UPDATE_FEATURES' ? reportedStatus : (reportType === 'BARRIER_REPORT' ? 'NOT_AVAILABLE' : null),
        evidencePhotoUrl: evidencePhotoUrl.trim() || null,
        description: description.trim()
      });

      if (res.success) {
        setSuccess(true);
        if (onReportSubmitted) onReportSubmitted(res.report);
        setTimeout(() => {
          setSuccess(false);
          setDescription('');
          setEvidencePhotoUrl('');
          onClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-empoway-blush shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-empoway-cream/70 border-b border-empoway-blush/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-empoway-terracotta/10 text-empoway-terracotta">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-empoway-coffee">
                Report Barrier or Information Update
              </h3>
              <p className="text-xs text-empoway-muted truncate max-w-xs">
                Location: {place.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-empoway-muted hover:text-empoway-coffee hover:bg-empoway-cream transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-empoway-coffee">
              Report Logged Successfully
            </h4>
            <p className="text-xs text-empoway-muted max-w-sm mx-auto leading-relaxed">
              Thank you for keeping physical accessibility data accurate for Sri Lanka. Our verification auditors will inspect your report and update the barrier tracking timeline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-empoway-coffee mb-1.5">
                Select Report Objective
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReportType('BARRIER_REPORT')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    reportType === 'BARRIER_REPORT'
                      ? 'border-rose-400 bg-rose-50 text-rose-800'
                      : 'border-empoway-blush text-empoway-coffee hover:bg-empoway-ivory'
                  }`}
                >
                  Report Barrier
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('UPDATE_FEATURES')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    reportType === 'UPDATE_FEATURES'
                      ? 'border-empoway-terracotta bg-empoway-cream text-empoway-terracotta'
                      : 'border-empoway-blush text-empoway-coffee hover:bg-empoway-ivory'
                  }`}
                >
                  Feature Update
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('REPORT_INCORRECT_INFO')}
                  className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    reportType === 'REPORT_INCORRECT_INFO'
                      ? 'border-amber-400 bg-amber-50 text-amber-800'
                      : 'border-empoway-blush text-empoway-coffee hover:bg-empoway-ivory'
                  }`}
                >
                  Outdated Info
                </button>
              </div>
            </div>

            {reportType === 'BARRIER_REPORT' && (
              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                  Type of Physical Barrier Encountered
                </label>
                <select
                  value={barrierType}
                  onChange={(e) => setBarrierType(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                >
                  <option value="DAMAGED_RAMP">Ramp is damaged, broken or hazardous slope</option>
                  <option value="BLOCKED_ENTRANCE">Entrance is blocked by vehicles, gates or steps</option>
                  <option value="ELEVATOR_OUT_OF_ORDER">Elevator / Lift is not working or under repair</option>
                  <option value="TOILET_UNAVAILABLE">Accessible toilet is locked, repurposed or unavailable</option>
                  <option value="OTHER">Other unexpected physical access obstruction</option>
                </select>
              </div>
            )}

            {reportType === 'UPDATE_FEATURES' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Feature
                  </label>
                  <select
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  >
                    <option value="Wheelchair-accessible Entrance">Wheelchair-accessible Entrance</option>
                    <option value="Ramp Availability">Ramp Availability</option>
                    <option value="Elevator Availability">Elevator Availability</option>
                    <option value="Accessible Toilet">Accessible Toilet</option>
                    <option value="Accessible Parking">Accessible Parking</option>
                    <option value="Wide Entrance & Doorways">Wide Entrance & Doorways</option>
                    <option value="Wheelchair Pathways">Wheelchair Pathways</option>
                    <option value="Accessible Counters">Accessible Counters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Observed Status
                  </label>
                  <select
                    value={reportedStatus}
                    onChange={(e) => setReportedStatus(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  >
                    <option value="AVAILABLE">Available & Functional</option>
                    <option value="NEEDS_VERIFICATION">Needs Physical Verification</option>
                    <option value="NOT_AVAILABLE">Not Available / Non-existent</option>
                    <option value="UNKNOWN">Unknown / Inaccessible</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Evidence Details & Description <span className="text-empoway-terracotta">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the barrier or observation clearly (e.g. lift out of service with maintenance notice, steep curb without dropped ramp, locked gate)..."
                className="w-full p-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta placeholder:text-empoway-muted/70 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Supporting Photo URL (Optional Evidence)
              </label>
              <input
                type="url"
                value={evidencePhotoUrl}
                onChange={(e) => setEvidencePhotoUrl(e.target.value)}
                placeholder="https://example.com/barrier-photo.jpg"
                className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta placeholder:text-empoway-muted/70"
              />
              <p className="text-[11px] text-empoway-muted mt-1">
                You can also upload camera photos directly via the "Add Photos" button on the place page.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-empoway-cream">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-xs disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;

