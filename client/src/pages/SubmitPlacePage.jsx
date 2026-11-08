import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Camera,
  CheckCircle2,
  Info,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  X,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';
import LocationPickerMap from '../components/LocationPickerMap';
import { FEATURE_CONFIG } from '../components/FeatureChecklist';
import { useAuth } from '../context/AuthContext';

export const SubmitPlacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    address: '',
    district: 'Colombo',
    cityOrArea: '',
    latitude: 6.9271,
    longitude: 79.8612,
    description: '',
    contactPhone: '',
    contactEmail: '',
    contactWebsite: '',
    entranceDetails: '',
    rampCondition: '',
    numberOfSteps: 0,
    elevatorLocation: '',
    limitationsNotes: '',
    featureNotes: ''
  });

  // 8 Accessibility Features
  const [featureStates, setFeatureStates] = useState({
    stepFreeEntrance: 'UNKNOWN',
    wheelchairRamp: 'UNKNOWN',
    elevator: 'UNKNOWN',
    accessibleToilet: 'UNKNOWN',
    accessibleParking: 'UNKNOWN',
    wideDoorways: 'UNKNOWN',
    wheelchairPathways: 'UNKNOWN',
    accessibleCounters: 'UNKNOWN'
  });

  // Photographs
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [manualPhotoUrl, setManualPhotoUrl] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.categories) {
          setCategories(res.categories);
          if (res.categories.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: res.categories[0].id }));
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (featureKey, status) => {
    setFeatureStates((prev) => ({ ...prev, [featureKey]: status }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const valid = selectedFiles.filter((f) => f.size <= 5 * 1024 * 1024);
    if (valid.length < selectedFiles.length) {
      setError('Some files exceeded the 5MB size limit and were skipped.');
    }
    setPhotos((prev) => [...prev, ...valid]);

    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const addManualUrl = () => {
    if (manualPhotoUrl.trim()) {
      setPhotoPreviews((prev) => [...prev, manualPhotoUrl.trim()]);
      setManualPhotoUrl('');
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please provide the place name.');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category.');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter the street address.');
      return false;
    }
    if (!formData.cityOrArea.trim()) {
      setError('Please provide the city or area (e.g. Colombo 07, Fort).');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('categoryId', formData.categoryId);
      payload.append('address', formData.address.trim());
      payload.append('district', formData.district);
      payload.append('cityOrArea', formData.cityOrArea.trim());
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);
      payload.append('description', formData.description.trim());
      payload.append('contactPhone', formData.contactPhone.trim());
      payload.append('contactEmail', formData.contactEmail.trim());
      payload.append('contactWebsite', formData.contactWebsite.trim());
      payload.append('entranceDetails', formData.entranceDetails.trim());
      payload.append('rampCondition', formData.rampCondition.trim());
      payload.append('numberOfSteps', formData.numberOfSteps);
      payload.append('elevatorLocation', formData.elevatorLocation.trim());
      payload.append('limitationsNotes', formData.limitationsNotes.trim());
      payload.append('featureNotes', formData.featureNotes.trim());

      // Features
      Object.entries(featureStates).forEach(([k, v]) => {
        payload.append(k, v);
      });

      // Photos
      photos.forEach((file) => {
        payload.append('photos', file);
      });

      // Pass any manual URLs
      const urlList = photoPreviews.filter((p) => p.startsWith('http'));
      if (urlList.length > 0) {
        payload.append('photoUrls', JSON.stringify(urlList));
      }

      const res = await api.submitPlace(payload);
      if (res.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit place. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-card">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-empoway-coffee">
            Place Submitted for Verification
          </h2>
          <p className="text-xs sm:text-sm text-empoway-muted leading-relaxed max-w-md mx-auto">
            Thank you! Your place submission has been saved to the moderation queue. Our team reviews submissions to ensure transparent and reliable evidence before publishing.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-empoway-cream/70 border border-empoway-blush text-xs text-empoway-coffee text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-empoway-terracotta">
            <ShieldCheck className="w-4 h-4" />
            <span>Why is moderation required?</span>
          </div>
          <p className="text-empoway-muted leading-relaxed">
            EMPOWAY maintains high trust by distinguishing community reports from physical assessments. Your submission will appear in the directory as soon as approved.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border border-empoway-champagne"
          >
            Go to My Dashboard
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white shadow-xs"
          >
            Explore Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-empoway-terracotta block">
          Colombo Accessibility Contribution
        </span>
        <h1 className="text-3xl font-extrabold text-empoway-coffee">
          Share a Place & Accessibility Details
        </h1>
        <p className="text-xs sm:text-sm text-empoway-muted max-w-xl mx-auto leading-relaxed">
          Provide accurate mobility details about public buildings in Colombo. Every ramp, wide door and elevator note empowers someone’s journey.
        </p>

        {/* Notice of review */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-900 mt-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>New submissions enter a review queue before public display</span>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {[
          { step: 1, title: '1. Place Details' },
          { step: 2, title: '2. Map Location' },
          { step: 3, title: '3. Accessibility' },
          { step: 4, title: '4. Photos & Review' }
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => {
              if (s.step === 1 || validateStep1()) setCurrentStep(s.step);
            }}
            className={`py-2.5 px-2 rounded-xl border transition-all ${
              currentStep === s.step
                ? 'bg-empoway-terracotta text-white border-empoway-terracotta shadow-xs'
                : currentStep > s.step
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-empoway-muted border-empoway-blush/60'
            }`}
          >
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic Place Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-empoway-coffee border-b border-empoway-cream pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-empoway-terracotta" />
                <span>Basic Place Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Place Name <span className="text-empoway-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. National Hospital of Sri Lanka, Colombo Town Hall"
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Category <span className="text-empoway-terracotta">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    City / Area in Colombo <span className="text-empoway-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="cityOrArea"
                    value={formData.cityOrArea}
                    onChange={handleInputChange}
                    placeholder="e.g. Colombo 07, Cinnamon Gardens, Fort, Borella"
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Street Address <span className="text-empoway-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. F. R. Senanayake Mawatha, Colombo 00700"
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Place Overview & Public Services
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe what services or departments are housed here..."
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+94 11 268 4290"
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                    Official Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="contactWebsite"
                    value={formData.contactWebsite}
                    onChange={handleInputChange}
                    placeholder="https://example.gov.lk"
                    className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold shadow-xs"
                >
                  <span>Continue to Map Pin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Map Location Pin */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-empoway-coffee border-b border-empoway-cream pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-empoway-terracotta" />
                <span>Pin Location on Colombo Map</span>
              </h2>

              <p className="text-xs text-empoway-muted">
                Drag the marker or click directly on the building entrance to record coordinates.
              </p>

              <LocationPickerMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={({ latitude, longitude }) => {
                  setFormData((prev) => ({ ...prev, latitude, longitude }));
                }}
                height="400px"
              />

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold shadow-xs"
                >
                  <span>Continue to Accessibility Checklist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Accessibility Assessment Checklist */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-base font-bold text-empoway-coffee border-b border-empoway-cream pb-2">
                  Core Accessibility Assessment Checklist
                </h2>
                <p className="text-xs text-empoway-muted mt-1">
                  Mark what you verified or observed. If you did not inspect a feature, leave it as <strong>Unknown</strong>.
                </p>
              </div>

              {/* 8 Feature Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FEATURE_CONFIG.map((f) => {
                  const stateVal = featureStates[f.key];
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.key}
                      className="p-3 rounded-2xl border border-empoway-blush/70 bg-empoway-ivory/50 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-empoway-terracotta shrink-0" />
                        <span className="text-xs font-bold text-empoway-coffee">
                          {f.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                        {[
                          { val: 'AVAILABLE', label: 'Available', color: 'bg-emerald-600 text-white' },
                          { val: 'NOT_AVAILABLE', label: 'Not Available', color: 'bg-rose-600 text-white' },
                          { val: 'UNKNOWN', label: 'Unknown', color: 'bg-stone-500 text-white' }
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => handleFeatureChange(f.key, btn.val)}
                            className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                              stateVal === btn.val
                                ? `${btn.color} border-transparent shadow-xs font-bold`
                                : 'bg-white text-empoway-coffee border-empoway-blush/60 hover:bg-empoway-cream'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed condition questions */}
              <div className="p-4 rounded-2xl bg-empoway-cream/50 border border-empoway-blush space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-empoway-coffee">
                  Physical Condition Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                      Entrance Steps (0 if completely flat)
                    </label>
                    <input
                      type="number"
                      min={0}
                      name="numberOfSteps"
                      value={formData.numberOfSteps}
                      onChange={handleInputChange}
                      className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush text-empoway-coffee"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                      Ramp Condition & Slope
                    </label>
                    <input
                      type="text"
                      name="rampCondition"
                      value={formData.rampCondition}
                      onChange={handleInputChange}
                      placeholder="e.g. Gentle 1:12 slope with dual handrails"
                      className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush text-empoway-coffee"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                      Entrance Door Details
                    </label>
                    <input
                      type="text"
                      name="entranceDetails"
                      value={formData.entranceDetails}
                      onChange={handleInputChange}
                      placeholder="e.g. Automatic sliding doors, wide swing door"
                      className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush text-empoway-coffee"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                      Elevator Details & Location
                    </label>
                    <input
                      type="text"
                      name="elevatorLocation"
                      value={formData.elevatorLocation}
                      onChange={handleInputChange}
                      placeholder="e.g. Central lobby, braille buttons present"
                      className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush text-empoway-coffee"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                      Known Mobility Limitations or Obstacles
                    </label>
                    <input
                      type="text"
                      name="limitationsNotes"
                      value={formData.limitationsNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Steep parking ramp, high counter window, gravel paths"
                      className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush text-empoway-coffee"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold shadow-xs"
                >
                  <span>Continue to Photos & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Photographs & Submission */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-empoway-coffee border-b border-empoway-cream pb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-empoway-terracotta" />
                <span>Upload Photographs & Evidence</span>
              </h2>

              <p className="text-xs text-empoway-muted">
                Photographs of entrance ramps, stairs, doorway widths and restrooms provide vital visual evidence for travelers.
              </p>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-empoway-blush hover:border-empoway-terracotta rounded-2xl p-6 text-center bg-empoway-ivory/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="multi-photo-input"
                />
                <label htmlFor="multi-photo-input" className="cursor-pointer block space-y-2">
                  <UploadCloud className="w-10 h-10 text-empoway-terracotta mx-auto" />
                  <span className="text-xs font-bold text-empoway-coffee block">
                    Select photos from your device
                  </span>
                  <span className="text-[11px] text-empoway-muted block">
                    Supported: JPG, PNG, WebP (Max 5MB each)
                  </span>
                </label>
              </div>

              {/* Web image url */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={manualPhotoUrl}
                  onChange={(e) => setManualPhotoUrl(e.target.value)}
                  placeholder="Or paste an image web link (https://...)"
                  className="flex-1 p-2 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee"
                />
                <button
                  type="button"
                  onClick={addManualUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee border border-empoway-champagne"
                >
                  Add Link
                </button>
              </div>

              {/* Previews */}
              {photoPreviews.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-empoway-coffee block">
                    Selected Photographs ({photoPreviews.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {photoPreviews.map((src, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden h-24 border border-empoway-blush group">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary review notice */}
              <div className="p-4 rounded-2xl bg-empoway-cream/70 border border-empoway-blush text-xs space-y-1">
                <span className="font-bold text-empoway-coffee block">
                  Transparency & Submission Notice
                </span>
                <p className="text-empoway-muted leading-relaxed">
                  By submitting this place, you confirm that your recorded notes represent honest observations. The place will enter the pending review queue with <strong>Community Reported</strong> status upon approval.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold shadow-card disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Complete Place Submission'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubmitPlacePage;

