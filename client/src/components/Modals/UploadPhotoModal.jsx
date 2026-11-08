import React, { useState } from 'react';
import { X, UploadCloud, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const UploadPhotoModal = ({ isOpen, onClose, place, onPhotosUploaded }) => {
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [facilityType, setFacilityType] = useState('ENTRANCE');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !place) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('Photo size exceeds 5MB limit.');
        return;
      }
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !photoUrl.trim()) {
      setError('Please select an image file or provide an image URL.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (file) {
        formData.append('photos', file);
      }
      if (photoUrl.trim()) {
        formData.append('photoUrl', photoUrl.trim());
      }
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }
      formData.append('facilityType', facilityType);

      const res = await api.uploadPlacePhotos(place.id, formData);
      if (res.success) {
        setSuccess(true);
        if (onPhotosUploaded) onPhotosUploaded(res.photos);
        setTimeout(() => {
          setSuccess(false);
          setFile(null);
          setFilePreview(null);
          setPhotoUrl('');
          setCaption('');
          setFacilityType('ENTRANCE');
          onClose();
        }, 1600);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-empoway-blush shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-empoway-cream/70 border-b border-empoway-blush/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-empoway-terracotta/10 text-empoway-terracotta">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-empoway-coffee">
                Upload Accessibility Photo
              </h3>
              <p className="text-xs text-empoway-muted truncate max-w-xs">
                For {place.name}
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

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-empoway-coffee">
              Photo Uploaded Successfully
            </h4>
            <p className="text-xs text-empoway-muted">
              Thank you for contributing visual evidence of accessibility conditions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* File Input */}
            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1.5">
                Select Photo File (JPEG, PNG, WebP)
              </label>
              <div className="border-2 border-dashed border-empoway-blush hover:border-empoway-terracotta rounded-xl p-4 text-center cursor-pointer transition-colors bg-empoway-ivory/50">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label htmlFor="photo-upload-input" className="cursor-pointer block">
                  {filePreview ? (
                    <div className="space-y-2">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="h-32 mx-auto rounded-lg object-cover"
                      />
                      <span className="text-xs text-empoway-terracotta font-semibold block">
                        Change chosen image ({file?.name})
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <UploadCloud className="w-8 h-8 text-empoway-terracotta mx-auto mb-1" />
                      <span className="text-xs font-bold text-empoway-coffee block">
                        Click to select image file
                      </span>
                      <span className="text-[11px] text-empoway-muted block">
                        Max file size: 5MB
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-empoway-cream" />
              <span className="flex-shrink mx-3 text-[11px] text-empoway-muted uppercase font-bold tracking-wider">
                Or Photo Web Link
              </span>
              <div className="flex-grow border-t border-empoway-cream" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Image URL (optional if file chosen)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/ramp-entrance.jpg"
                className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Accessibility Facility Shown
              </label>
              <select
                value={facilityType}
                onChange={(e) => setFacilityType(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              >
                <option value="ENTRANCE">Main / Step-free Entrance</option>
                <option value="RAMP">Wheelchair Ramp & Slope</option>
                <option value="ELEVATOR">Elevator / Passenger Lift</option>
                <option value="TOILET">Wheelchair-accessible Restroom</option>
                <option value="PARKING">Designated Accessible Parking</option>
                <option value="PATHWAY">Internal Corridors / Pathways</option>
                <option value="COUNTERS">Accessible Customer Service Counter</option>
                <option value="GENERAL">General Overview & Surroundings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Photo Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. South entrance ramp with handrails and flat doorway"
                className="w-full py-2 px-3 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-empoway-cream">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-xs disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Save Photograph'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadPhotoModal;

