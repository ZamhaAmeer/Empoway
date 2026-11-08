import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileCheck2,
  Trash2,
  Edit3,
  History,
  Users,
  Building2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  UploadCloud,
  Plus,
  FileText,
  Copy,
  Search,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'directory' | 'reports' | 'manage' | 'duplicates' | 'logs' | 'users'
  const [stats, setStats] = useState(null);
  const [pendingPlaces, setPendingPlaces] = useState([]);
  const [reports, setReports] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [logs, setLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [adminOrgs, setAdminOrgs] = useState([]);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [directorySubTab, setDirectorySubTab] = useState('orgs'); // 'orgs' | 'add_branch' | 'csv'
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Organization modal state
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgForm, setOrgForm] = useState({
    name: '',
    code: '',
    categorySlug: 'government-offices',
    sector: 'public',
    headquartersAddress: '',
    headquartersCity: 'Colombo',
    website: '',
    contactPhone: '',
    contactEmail: '',
    dataSource: 'Colombo District Registry'
  });

  // Branch create state
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchForm, setBranchForm] = useState({
    organizationId: '',
    branchName: '',
    name: '',
    categoryId: '1',
    address: '',
    cityOrArea: 'Colombo 03',
    district: 'Colombo',
    latitude: '6.9061',
    longitude: '79.8524',
    dataSource: 'Official Branch Directory',
    institutionType: 'public'
  });

  // CSV Import state
  const [csvText, setCsvText] = useState('');
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvPublishing, setCsvPublishing] = useState(false);

  // Verification modal / state
  const [verifyingPlace, setVerifyingPlace] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('VERIFIED');
  const [verificationNotes, setVerificationNotes] = useState('');

  // Reject modal state
  const [rejectingPlace, setRejectingPlace] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (!isAdmin && user) {
      navigate('/dashboard');
    }
  }, [isAdmin, user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, reportsRes, placesRes, logsRes, usersRes, orgsRes, dupsRes, catsRes] = await Promise.all([
        api.getAdminStats(),
        api.getPendingPlaces(),
        api.getAllReports(),
        api.getPlaces({ sortBy: 'recent', limit: 150 }),
        api.getAdminLogs(),
        api.getAdminUsers(),
        api.adminGetOrganizations(),
        api.adminGetDuplicates(),
        api.getCategories()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (pendingRes.success) setPendingPlaces(pendingRes.places || []);
      if (reportsRes.success) setReports(reportsRes.reports || []);
      if (placesRes.success) setAllPlaces(placesRes.places || []);
      if (logsRes.success) setLogs(logsRes.logs || []);
      if (usersRes.success) setUsersList(usersRes.users || []);
      if (orgsRes.success) setAdminOrgs(orgsRes.organizations || []);
      if (dupsRes.success) setDuplicateGroups(dupsRes.duplicateGroups || []);
      if (catsRes.success) setCategories(catsRes.categories || []);
    } catch (err) {
      console.error('Error loading admin console:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 3500);
  };

  const handleApprovePlace = async (placeId) => {
    try {
      const res = await api.approvePlace(placeId, {
        accessibilityStatus: verifyStatus,
        verificationNotes
      });
      if (res.success) {
        showFeedback('success', `Approved: "${res.place.name}"`);
        setVerifyingPlace(null);
        setVerificationNotes('');
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Approval failed.');
    }
  };

  const handleRejectPlace = async () => {
    if (!rejectingPlace) return;
    try {
      const res = await api.rejectPlace(rejectingPlace.id, rejectReason);
      if (res.success) {
        showFeedback('success', `Rejected: "${rejectingPlace.name}"`);
        setRejectingPlace(null);
        setRejectReason('');
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Rejection failed.');
    }
  };

  const handleReviewReport = async (reportId, status, adminNotes = '', resolutionNotes = '', updateFeature = false, featureName = '', featureValue = '') => {
    try {
      const res = await api.reviewReport(reportId, {
        status,
        adminNotes: adminNotes || `Status updated to ${status} by moderation auditor`,
        resolutionNotes,
        updateFeature,
        featureName,
        featureValue
      });
      if (res.success) {
        showFeedback('success', `Report #${reportId} status set to ${status}.`);
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Report action failed.');
    }
  };

  const handleDeletePlace = async (placeId, placeName) => {
    if (!window.confirm(`Are you sure you want to delete "${placeName}"? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await api.deletePlace(placeId);
      if (res.success) {
        showFeedback('success', `Deleted: "${placeName}"`);
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Delete failed.');
    }
  };

  // Handle Organization Create / Update
  const handleSaveOrg = async (e) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        const res = await api.adminUpdateOrganization(editingOrg.id, orgForm);
        if (res.success) {
          showFeedback('success', `Updated organisation "${res.organization.name}"`);
          setShowOrgModal(false);
          setEditingOrg(null);
          loadData();
        }
      } else {
        const res = await api.adminCreateOrganization(orgForm);
        if (res.success) {
          showFeedback('success', `Created organisation "${res.organization.name}"`);
          setShowOrgModal(false);
          loadData();
        }
      }
    } catch (err) {
      showFeedback('error', err.message || 'Organisation operation failed');
    }
  };

  const handleDeleteOrg = async (orgId, orgName) => {
    if (!window.confirm(`Are you sure you want to delete "${orgName}"? Sibling branches will be unlinked.`)) {
      return;
    }
    try {
      const res = await api.adminDeleteOrganization(orgId);
      if (res.success) {
        showFeedback('success', res.message || 'Organisation deleted');
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Failed to delete organisation');
    }
  };

  // Handle Branch Place Create
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      const lat = parseFloat(branchForm.latitude);
      const lng = parseFloat(branchForm.longitude);
      if (isNaN(lat) || isNaN(lng) || lat < 6.6 || lat > 7.15 || lng < 79.7 || lng > 80.35) {
        showFeedback('error', 'Coordinates must be inside Colombo District boundaries (Lat: 6.6–7.15, Lng: 79.7–80.35)');
        return;
      }

      const res = await api.adminCreatePlace({
        ...branchForm,
        latitude: lat,
        longitude: lng,
        district: 'Colombo',
        accessibilityStatus: 'NOT_YET_ASSESSED'
      });

      if (res.success) {
        showFeedback('success', `Added "${res.place.name}" to Colombo directory!`);
        setShowBranchModal(false);
        setBranchForm({
          organizationId: '',
          branchName: '',
          name: '',
          categoryId: '1',
          address: '',
          cityOrArea: 'Colombo 03',
          district: 'Colombo',
          latitude: '6.9061',
          longitude: '79.8524',
          dataSource: 'Official Branch Directory',
          institutionType: 'public'
        });
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Failed to create branch place');
    }
  };

  // Handle CSV Import Preview
  const handlePreviewCsv = async () => {
    if (!csvText.trim()) {
      showFeedback('error', 'Please paste CSV content to validate.');
      return;
    }
    setCsvLoading(true);
    try {
      const res = await api.adminImportCsv({ csvData: csvText });
      if (res.success) {
        setCsvPreview(res);
        showFeedback('success', `Parsed ${res.totalRows} rows: ${res.validCount} valid, ${res.duplicateCount} duplicate warnings.`);
      }
    } catch (err) {
      showFeedback('error', err.message || 'CSV parsing failed.');
    } finally {
      setCsvLoading(false);
    }
  };

  // Handle CSV Publish
  const handlePublishCsv = async () => {
    if (!csvPreview || !csvPreview.preview) return;
    const validPlaces = csvPreview.preview.filter((p) => p.isValid);
    if (validPlaces.length === 0) {
      showFeedback('error', 'No valid rows available to publish.');
      return;
    }
    setCsvPublishing(true);
    try {
      const res = await api.adminPublishCsv(validPlaces);
      if (res.success) {
        showFeedback('success', res.message || `Published ${res.createdCount} places!`);
        setCsvText('');
        setCsvPreview(null);
        loadData();
      }
    } catch (err) {
      showFeedback('error', err.message || 'Publish batch failed.');
    } finally {
      setCsvPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-empoway-coffee to-empoway-coffee-dark text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-empoway-peach" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              EMPOWAY Admin & Moderation Console
            </h1>
          </div>
          <p className="text-xs text-white/80">
            Colombo Pilot Lead Auditor: Review submissions, verify accessibility evidence, and moderate community reports.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {feedback.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
            Pending Review
          </span>
          <span className="text-2xl font-extrabold text-amber-600 block mt-1">
            {stats?.pendingPlaces ?? 0}
          </span>
          <span className="text-[10px] text-empoway-muted block">Awaiting audit</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Verified Places
          </span>
          <span className="text-2xl font-extrabold text-emerald-700 block mt-1">
            {stats?.verifiedPlaces ?? 0}
          </span>
          <span className="text-[10px] text-empoway-muted block">Physically confirmed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block">
            Unassessed Places
          </span>
          <span className="text-2xl font-extrabold text-slate-700 block mt-1">
            {stats?.unassessedPlaces ?? 0}
          </span>
          <span className="text-[10px] text-empoway-muted block">Directory catalog</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-terracotta block">
            Organizations
          </span>
          <span className="text-2xl font-extrabold text-empoway-terracotta block mt-1">
            {stats?.totalOrganizations ?? adminOrgs.length}
          </span>
          <span className="text-[10px] text-empoway-muted block">Parent entities</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
            Condition Reports
          </span>
          <span className="text-2xl font-extrabold text-rose-600 block mt-1">
            {stats?.pendingReports ?? 0}
          </span>
          <span className="text-[10px] text-empoway-muted block">Barrier alerts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-empoway-blush/70 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-coffee block">
            Total Users
          </span>
          <span className="text-2xl font-extrabold text-empoway-coffee block mt-1">
            {stats?.totalUsers ?? 0}
          </span>
          <span className="text-[10px] text-empoway-muted block">Community network</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-empoway-blush/60 pb-3">
        {[
          { id: 'pending', label: `Pending Submissions (${pendingPlaces.length})` },
          { id: 'directory', label: `Colombo Directory & Orgs (${adminOrgs.length})` },
          { id: 'reports', label: `Accessibility Reports (${reports.length})` },
          { id: 'manage', label: `All Places (${allPlaces.length})` },
          { id: 'duplicates', label: `Duplicate Checker (${duplicateGroups.length})` },
          { id: 'logs', label: `Audit Trail (${logs.length})` },
          { id: 'users', label: `Users (${usersList.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-empoway-terracotta text-white shadow-xs'
                : 'bg-white text-empoway-coffee hover:bg-empoway-cream border border-empoway-blush/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PENDING PLACES QUEUE */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
          <h2 className="text-base font-bold text-empoway-coffee">
            Submissions Requiring Moderator Approval
          </h2>

          {pendingPlaces.length === 0 ? (
            <div className="py-12 text-center text-xs text-empoway-muted">
              No pending place submissions in queue. All community submissions have been moderated.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPlaces.map((pl) => (
                <div
                  key={pl.id}
                  className="p-5 rounded-2xl bg-empoway-ivory border border-empoway-blush/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                          PENDING REVIEW
                        </span>
                        <span className="text-xs font-semibold text-empoway-terracotta">
                          {pl.category?.name}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-empoway-coffee">
                        {pl.name}
                      </h3>
                      <p className="text-xs text-empoway-muted">
                        {pl.address} ({pl.cityOrArea}, {pl.district})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingPlace(pl);
                          setVerifyStatus('COMMUNITY_REPORTED');
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Submission</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRejectingPlace(pl)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-empoway-blush/50">
                    <div>
                      <span className="text-[10px] text-empoway-muted block">Entrance Steps:</span>
                      <strong>{pl.numberOfSteps} step(s)</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-empoway-muted block">Ramp Condition:</span>
                      <strong className="truncate block">{pl.rampCondition || 'None'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-empoway-muted block">Elevator:</span>
                      <strong className="truncate block">{pl.elevatorLocation || 'None'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-empoway-muted block">Submitted By:</span>
                      <strong>{pl.submitter?.fullName || 'Community User'}</strong>
                    </div>
                  </div>

                  {pl.photographs && pl.photographs.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {pl.photographs.map((photo, i) => (
                        <img
                          key={i}
                          src={photo.url}
                          alt="Evidence"
                          className="w-16 h-14 rounded-lg object-cover border border-empoway-blush"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: COLOMBO DISTRICT DIRECTORY & ORGANISATIONS */}
      {activeTab === 'directory' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-empoway-cream">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-empoway-terracotta" />
                <h2 className="text-base font-bold text-empoway-coffee">
                  Colombo District Directory Management
                </h2>
              </div>
              <p className="text-xs text-empoway-muted mt-0.5">
                Manage parent organisations, branches across 13 Divisional Secretariats, and bulk CSV directory batches.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingOrg(null);
                  setOrgForm({
                    name: '',
                    code: '',
                    categorySlug: 'government-offices',
                    sector: 'public',
                    headquartersAddress: '',
                    headquartersCity: 'Colombo',
                    website: '',
                    contactPhone: '',
                    contactEmail: '',
                    dataSource: 'Colombo District Registry'
                  });
                  setShowOrgModal(true);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Organisation</span>
              </button>
            </div>
          </div>

          {/* Sub Tab Controls */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDirectorySubTab('orgs')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                directorySubTab === 'orgs'
                  ? 'bg-empoway-coffee text-white font-bold'
                  : 'bg-empoway-cream text-empoway-coffee hover:bg-empoway-blush'
              }`}
            >
              Parent Organisations ({adminOrgs.length})
            </button>
            <button
              type="button"
              onClick={() => setDirectorySubTab('add_branch')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                directorySubTab === 'add_branch'
                  ? 'bg-empoway-coffee text-white font-bold'
                  : 'bg-empoway-cream text-empoway-coffee hover:bg-empoway-blush'
              }`}
            >
              + Add Branch Location
            </button>
            <button
              type="button"
              onClick={() => setDirectorySubTab('csv')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                directorySubTab === 'csv'
                  ? 'bg-empoway-coffee text-white font-bold'
                  : 'bg-empoway-cream text-empoway-coffee hover:bg-empoway-blush'
              }`}
            >
              CSV Bulk Importer & Preview
            </button>
          </div>

          {/* SUBTAB 1: ORGANISATIONS LIST */}
          {directorySubTab === 'orgs' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-empoway-cream text-empoway-coffee-dark uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="p-3 rounded-l-xl">Organisation Name</th>
                      <th className="p-3">Sector</th>
                      <th className="p-3">Headquarters</th>
                      <th className="p-3 text-center">Branches</th>
                      <th className="p-3">Website / Contact</th>
                      <th className="p-3 text-right rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-empoway-cream">
                    {adminOrgs.map((org) => (
                      <tr key={org.id} className="hover:bg-empoway-ivory/60 transition-colors">
                        <td className="p-3 font-bold text-empoway-coffee max-w-xs">
                          <div>{org.name}</div>
                          <span className="text-[10px] font-mono text-empoway-muted">{org.code}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            org.sector === 'public'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : org.sector === 'private'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-stone-100 text-stone-800'
                          }`}>
                            {org.sector || 'public'}
                          </span>
                        </td>
                        <td className="p-3 text-empoway-muted text-[11px] max-w-xs truncate">
                          {org.headquartersAddress || 'Colombo District'}
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-extrabold text-empoway-terracotta bg-empoway-cream px-2 py-0.5 rounded-full">
                            {org.branches ? org.branches.length : 0}
                          </span>
                        </td>
                        <td className="p-3 text-[11px]">
                          {org.website ? (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-empoway-terracotta hover:underline inline-flex items-center gap-1"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-empoway-muted">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setBranchForm({
                                organizationId: String(org.id),
                                branchName: '',
                                name: `${org.name} - `,
                                categoryId: '1',
                                address: '',
                                cityOrArea: 'Colombo 03',
                                district: 'Colombo',
                                latitude: '6.9061',
                                longitude: '79.8524',
                                dataSource: 'Official Branch Directory',
                                institutionType: org.sector || 'public'
                              });
                              setDirectorySubTab('add_branch');
                            }}
                            className="px-2 py-1 rounded-lg bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee font-semibold text-[11px]"
                            title="Add branch for this organisation"
                          >
                            + Branch
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOrg(org);
                              setOrgForm({
                                name: org.name,
                                code: org.code,
                                categorySlug: org.categorySlug || 'government-offices',
                                sector: org.sector || 'public',
                                headquartersAddress: org.headquartersAddress || '',
                                headquartersCity: org.headquartersCity || 'Colombo',
                                website: org.website || '',
                                contactPhone: org.contactPhone || '',
                                contactEmail: org.contactEmail || '',
                                dataSource: org.dataSource || 'Colombo District Registry'
                              });
                              setShowOrgModal(true);
                            }}
                            className="p-1 rounded-lg text-empoway-coffee hover:bg-empoway-cream"
                            title="Edit organisation"
                          >
                            <Edit3 className="w-4 h-4 inline" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrg(org.id, org.name)}
                            className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Delete organisation"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 2: ADD BRANCH FORM */}
          {directorySubTab === 'add_branch' && (
            <form onSubmit={handleCreateBranch} className="space-y-4 max-w-2xl bg-empoway-ivory/50 p-5 rounded-2xl border border-empoway-blush/60">
              <h3 className="text-sm font-bold text-empoway-coffee flex items-center gap-2">
                <MapPin className="w-4 h-4 text-empoway-terracotta" />
                <span>Add Physical Branch / Location to Colombo Directory</span>
              </h3>
              <p className="text-xs text-empoway-muted">
                Locations added here will automatically start as <strong>Not Yet Assessed</strong> with all features marked <strong>Unknown</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Parent Organisation</label>
                  <select
                    value={branchForm.organizationId}
                    onChange={(e) => {
                      const selOrg = adminOrgs.find((o) => String(o.id) === e.target.value);
                      setBranchForm((prev) => ({
                        ...prev,
                        organizationId: e.target.value,
                        institutionType: selOrg?.sector || 'public',
                        name: selOrg ? `${selOrg.name} - ${prev.branchName || ''}`.trim() : prev.name
                      }));
                    }}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  >
                    <option value="">-- Standalone (No parent organisation) --</option>
                    {adminOrgs.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Branch Name (e.g. Maharagama Branch)</label>
                  <input
                    type="text"
                    value={branchForm.branchName}
                    onChange={(e) => {
                      const bName = e.target.value;
                      const selOrg = adminOrgs.find((o) => String(o.id) === branchForm.organizationId);
                      setBranchForm((prev) => ({
                        ...prev,
                        branchName: bName,
                        name: selOrg ? `${selOrg.name} - ${bName}` : bName
                      }));
                    }}
                    placeholder="e.g. Nugegoda Branch"
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Full Place Display Name *</label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="e.g. Bank of Ceylon - Nugegoda Branch"
                  className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Category *</label>
                  <select
                    value={branchForm.categoryId}
                    onChange={(e) => setBranchForm({ ...branchForm, categoryId: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Area / Town in Colombo *</label>
                  <input
                    type="text"
                    required
                    value={branchForm.cityOrArea}
                    onChange={(e) => setBranchForm({ ...branchForm, cityOrArea: e.target.value })}
                    placeholder="e.g. Maharagama, Dehiwala, Colombo 03..."
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  placeholder="e.g. 120 High Level Road, Maharagama"
                  className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Latitude (Colombo District: 6.6 - 7.15) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={branchForm.latitude}
                    onChange={(e) => setBranchForm({ ...branchForm, latitude: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Longitude (Colombo District: 79.7 - 80.35) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={branchForm.longitude}
                    onChange={(e) => setBranchForm({ ...branchForm, longitude: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Data Source</label>
                  <input
                    type="text"
                    value={branchForm.dataSource}
                    onChange={(e) => setBranchForm({ ...branchForm, dataSource: e.target.value })}
                    placeholder="e.g. Official Institutional Registry"
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-empoway-coffee mb-1">Sector</label>
                  <select
                    value={branchForm.institutionType}
                    onChange={(e) => setBranchForm({ ...branchForm, institutionType: e.target.value })}
                    className="w-full p-2 text-xs rounded-xl bg-white border border-empoway-blush"
                  >
                    <option value="public">Public / Government</option>
                    <option value="private">Private Sector</option>
                    <option value="corporate">Corporate</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDirectorySubTab('orgs')}
                  className="px-4 py-2 text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white rounded-xl shadow-xs"
                >
                  Save Branch to Directory
                </button>
              </div>
            </form>
          )}

          {/* SUBTAB 3: CSV BULK IMPORTER */}
          {directorySubTab === 'csv' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-empoway-ivory border border-empoway-blush/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-empoway-coffee flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-empoway-terracotta" />
                    <span>CSV Format Requirements for Colombo District</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setCsvText(
`name,branchName,organizationCode,categorySlug,address,cityOrArea,district,latitude,longitude,contactPhone,dataSource
National Hospital of Sri Lanka - Outpatient Dispensary,OPD Center,nhsl,hospitals-healthcare,Regent Street Colombo 10,Colombo 10,Colombo,6.9208,79.8687,+94 11 269 1111,Ministry of Health Registry
People's Bank - Kaduwela Branch,Kaduwela Branch,peoples-bank,banks-financial,Main Street Kaduwela,Kaduwela,Colombo,6.9351,79.9832,+94 11 253 8200,Official People's Bank Directory
University of Colombo - Faculty of Law,Faculty of Law,uoc,universities-education,Philip Gunewardena Mawatha Colombo 07,Colombo 07,Colombo,6.9038,79.8601,+94 11 258 5691,University of Colombo Registrar`
                      );
                    }}
                    className="text-[11px] font-bold text-empoway-terracotta hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Insert Sample Colombo CSV</span>
                  </button>
                </div>
                <p className="text-empoway-muted text-[11px]">
                  Columns supported: <code>name, branchName, organizationCode, categorySlug, address, cityOrArea, district, latitude, longitude, contactPhone, dataSource</code>. Coordinates are checked against Colombo boundaries and places automatically initialize as <strong>Not Yet Assessed</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                  Paste Raw CSV Data or Edit Lines:
                </label>
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="Paste CSV here with header row..."
                  className="w-full p-3 font-mono text-xs rounded-xl bg-white border border-empoway-blush focus:border-empoway-terracotta"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={csvLoading || !csvText.trim()}
                  onClick={handlePreviewCsv}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-empoway-coffee hover:bg-empoway-coffee-dark text-white disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{csvLoading ? 'Validating CSV...' : 'Preview & Validate Batch'}</span>
                </button>
              </div>

              {/* CSV Preview Results Table */}
              {csvPreview && (
                <div className="space-y-4 pt-3 border-t border-empoway-cream">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-empoway-cream/70 p-4 rounded-2xl border border-empoway-champagne">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span>Total Rows: <strong>{csvPreview.totalRows}</strong></span>
                      <span className="text-emerald-700">Valid: <strong>{csvPreview.validCount}</strong></span>
                      {csvPreview.hasErrors && (
                        <span className="text-rose-700">Errors: <strong>{csvPreview.totalRows - csvPreview.validCount}</strong></span>
                      )}
                      {csvPreview.duplicateCount > 0 && (
                        <span className="text-amber-800">Duplicate Candidates: <strong>{csvPreview.duplicateCount}</strong></span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={csvPublishing || csvPreview.validCount === 0}
                      onClick={handlePublishCsv}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 shadow-xs flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{csvPublishing ? 'Publishing...' : `Publish ${csvPreview.validCount} Valid Places`}</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto max-h-72 border border-empoway-blush/60 rounded-2xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-empoway-ivory sticky top-0 uppercase text-[10px] font-bold text-empoway-coffee">
                        <tr>
                          <th className="p-2.5">Row</th>
                          <th className="p-2.5">Validation</th>
                          <th className="p-2.5">Place Name</th>
                          <th className="p-2.5">Branch</th>
                          <th className="p-2.5">Area</th>
                          <th className="p-2.5">Coordinates</th>
                          <th className="p-2.5">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-empoway-cream bg-white">
                        {csvPreview.preview.map((p) => (
                          <tr key={p.rowNumber} className={p.isValid ? 'hover:bg-emerald-50/30' : 'bg-rose-50/40'}>
                            <td className="p-2.5 font-bold">{p.rowNumber}</td>
                            <td className="p-2.5">
                              {p.isValid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                  <CheckCircle className="w-3.5 h-3.5" /> Valid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px]">
                                  <XCircle className="w-3.5 h-3.5" /> Invalid
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-semibold text-empoway-coffee max-w-xs truncate">{p.name}</td>
                            <td className="p-2.5 text-empoway-muted">{p.branchName || '-'}</td>
                            <td className="p-2.5">{p.cityOrArea}</td>
                            <td className="p-2.5 font-mono text-[10px]">
                              {p.latitude ? `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}` : 'Invalid'}
                            </td>
                            <td className="p-2.5 text-[11px]">
                              {p.validationErrors && p.validationErrors.length > 0 ? (
                                <span className="text-rose-700 font-medium">{p.validationErrors.join(', ')}</span>
                              ) : p.isDuplicate ? (
                                <span className="text-amber-800 font-medium">⚠️ Duplicate name candidate</span>
                              ) : (
                                <span className="text-emerald-700">Ready to publish</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACCESSIBILITY REPORTS & BARRIER TRACKING QUEUE */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-empoway-cream">
            <div>
              <h2 className="text-base font-bold text-empoway-coffee">
                Barrier Tracking & Accessibility Reports ({reports.length})
              </h2>
              <p className="text-xs text-empoway-muted mt-0.5">
                Audit community observations, manage active barriers, and verify resolution lifecycles.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-empoway-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Confirmed Barriers</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ml-2" />
              <span>Resolved</span>
            </div>
          </div>

          <div className="divide-y divide-empoway-cream">
            {reports.length === 0 ? (
              <p className="py-8 text-center text-xs text-empoway-muted">
                No accessibility reports or active barriers currently in the queue.
              </p>
            ) : (
              reports.map((rep) => {
                const isBarrier = rep.reportType === 'BARRIER_REPORT' || rep.barrierType;
                const statusColor =
                  rep.status === 'RESOLVED' || rep.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : rep.status === 'CONFIRMED'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : rep.status === 'UNDER_REVIEW'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : rep.status === 'REJECTED'
                    ? 'bg-stone-100 text-stone-700 border-stone-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300';

                return (
                  <div key={rep.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                          {rep.status}
                        </span>
                        <span className="font-bold text-sm text-empoway-coffee">
                          {rep.place ? (
                            <Link to={`/places/${rep.place.id}`} className="hover:underline hover:text-empoway-terracotta">
                              {rep.place.name}
                            </Link>
                          ) : 'Unassigned Place'}
                        </span>
                        <span className="text-xs text-empoway-caramel font-semibold">
                          ({isBarrier ? (rep.barrierType ? rep.barrierType.replace(/_/g, ' ') : 'BARRIER') : rep.reportType})
                        </span>
                      </div>

                      <span className="text-[11px] text-empoway-muted self-start sm:self-auto">
                        Reported: {new Date(rep.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-xs text-empoway-coffee/90 leading-relaxed bg-empoway-ivory p-3.5 rounded-2xl border border-empoway-blush/60">
                      {rep.description}
                    </p>

                    {rep.evidencePhotoUrl && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-empoway-muted font-medium">Attached photo:</span>
                        <a
                          href={rep.evidencePhotoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-empoway-terracotta hover:underline font-bold inline-flex items-center gap-1"
                        >
                          <span>View Evidence Image</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {rep.resolutionNotes && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                        <strong>Resolution note:</strong> {rep.resolutionNotes}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-empoway-muted pt-1">
                      <span>
                        Reporter: <strong>{rep.reporter?.fullName || 'Community User'}</strong> ({rep.reporter?.email || 'unlisted'})
                      </span>

                      {/* Barrier Lifecycle Controls */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {rep.status !== 'UNDER_REVIEW' && rep.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => handleReviewReport(rep.id, 'UNDER_REVIEW', 'Investigation initiated by auditor')}
                            className="px-2.5 py-1 rounded-lg font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                          >
                            Under Review
                          </button>
                        )}

                        {rep.status !== 'CONFIRMED' && rep.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => {
                              const note = window.prompt('Auditor confirmation note (optional):', 'Confirmed physical barrier on site');
                              handleReviewReport(rep.id, 'CONFIRMED', note || 'Confirmed barrier');
                            }}
                            className="px-2.5 py-1 rounded-lg font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          >
                            Confirm Barrier
                          </button>
                        )}

                        {rep.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => {
                              const resNote = window.prompt('Enter barrier repair / resolution notes:', 'Repaired and verified accessible by facility management');
                              if (resNote) {
                                handleReviewReport(rep.id, 'RESOLVED', 'Barrier resolved', resNote, true, rep.featureName, 'AVAILABLE');
                              }
                            }}
                            className="px-3 py-1 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          >
                            Mark Resolved
                          </button>
                        )}

                        {rep.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleReviewReport(rep.id, 'REJECTED', 'Dismissed as invalid or duplicate')}
                            className="px-2.5 py-1 rounded-lg font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALL PLACES MANAGEMENT */}
      {activeTab === 'manage' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-empoway-coffee">
              Colombo Directory Places ({allPlaces.length})
            </h2>
            <Link
              to="/submit-place"
              className="px-3.5 py-1.5 rounded-xl bg-empoway-terracotta text-white text-xs font-bold"
            >
              + Add Place
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-empoway-cream text-empoway-coffee-dark uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Place Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Demo Data?</th>
                  <th className="p-3 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-empoway-cream">
                {allPlaces.map((pl) => (
                  <tr key={pl.id} className="hover:bg-empoway-ivory/60 transition-colors">
                    <td className="p-3 font-semibold text-empoway-coffee max-w-xs truncate">
                      <Link to={`/places/${pl.id}`} className="hover:text-empoway-terracotta">
                        {pl.name}
                      </Link>
                    </td>
                    <td className="p-3 text-empoway-muted">{pl.category?.name}</td>
                    <td className="p-3 text-empoway-coffee">{pl.cityOrArea}</td>
                    <td className="p-3">
                      <StatusBadge status={pl.accessibilityStatus} size="sm" />
                    </td>
                    <td className="p-3">
                      {pl.isDemoData ? (
                        <span className="text-[10px] font-bold text-empoway-caramel bg-empoway-cream px-2 py-0.5 rounded">
                          Pilot Demo
                        </span>
                      ) : (
                        <span className="text-[10px] text-empoway-muted">Live</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setVerifyingPlace(pl);
                          setVerifyStatus(pl.accessibilityStatus === 'VERIFIED' ? 'COMMUNITY_REPORTED' : 'VERIFIED');
                          setVerificationNotes(pl.verificationNotes || '');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-empoway-cream text-empoway-coffee hover:bg-empoway-blush font-semibold"
                        title="Change Status / Verification Audit"
                      >
                        Verify / Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePlace(pl.id, pl.name)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-50"
                        title="Delete place"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: DUPLICATE CHECKER SCANNER */}
      {activeTab === 'duplicates' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-empoway-cream">
            <div>
              <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
                <Copy className="w-4 h-4 text-empoway-terracotta" />
                <span>Duplicate Place Detection ({duplicateGroups.length} groups found)</span>
              </h2>
              <p className="text-xs text-empoway-muted mt-0.5">
                Scans for places with identical names, addresses, or overlapping geographic coordinates (&lt;25m proximity).
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const res = await api.adminGetDuplicates();
                if (res.success) {
                  setDuplicateGroups(res.duplicateGroups || []);
                  showFeedback('success', `Scan complete: ${res.count} duplicate groups found.`);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-scan Directory</span>
            </button>
          </div>

          {duplicateGroups.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-empoway-coffee">No Duplicates Detected!</h3>
              <p className="text-xs text-empoway-muted max-w-sm mx-auto">
                All places in the Colombo District directory have distinct names, addresses, and spatial coordinates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {duplicateGroups.map((group, gIdx) => (
                <div key={gIdx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                    <span>Potential Duplicate Group #{gIdx + 1} ({group.length} records)</span>
                    <span className="text-[11px] text-amber-800 font-normal">Candidate match: "{group[0]?.name}"</span>
                  </div>
                  <div className="divide-y divide-amber-200/60">
                    {group.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <Link to={`/places/${item.id}`} className="font-bold text-empoway-coffee hover:underline">
                            #{item.id} {item.name} {item.branchName && `(${item.branchName})`}
                          </Link>
                          <p className="text-[11px] text-empoway-muted">{item.address} • {item.cityOrArea}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.accessibilityStatus} size="sm" />
                          <button
                            type="button"
                            onClick={() => handleDeletePlace(item.id, item.name)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-100"
                            title="Delete redundant copy"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
          <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
            <History className="w-4 h-4 text-empoway-terracotta" />
            <span>Audit Trail & Moderation History</span>
          </h2>

          <div className="divide-y divide-empoway-cream">
            {logs.map((log) => (
              <div key={log.id} className="py-3 text-xs space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-empoway-coffee">
                    [{log.action}] {log.targetType} #{log.targetId}
                  </span>
                  <span className="text-[11px] text-empoway-muted">
                    {new Date(log.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
                <p className="text-empoway-muted">{log.details}</p>
                {log.admin && (
                  <span className="text-[10px] text-empoway-caramel block">
                    By Moderator: {log.admin.fullName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-empoway-blush/70 shadow-card space-y-4">
          <h2 className="text-base font-bold text-empoway-coffee flex items-center gap-2">
            <Users className="w-4 h-4 text-empoway-terracotta" />
            <span>Community Contributors & Administrators</span>
          </h2>

          <div className="divide-y divide-empoway-cream">
            {usersList.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-empoway-coffee">{u.fullName}</span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-empoway-cream text-empoway-coffee'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-empoway-muted">{u.email}</span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-empoway-terracotta">{u.contributionCount || 0}</span>
                  <span className="text-[11px] text-empoway-muted block">Contributions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VERIFY / APPROVE MODAL */}
      {verifyingPlace && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-empoway-blush space-y-4">
            <h3 className="text-base font-bold text-empoway-coffee">
              Approve / Audit Place: {verifyingPlace.name}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Verification Status to Assign:
              </label>
              <select
                value={verifyStatus}
                onChange={(e) => setVerifyStatus(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
              >
                <option value="COMMUNITY_REPORTED">COMMUNITY REPORTED (Standard user submission)</option>
                <option value="VERIFIED">VERIFIED (Physically assessed by auditor)</option>
                <option value="UNKNOWN">UNKNOWN (Pending verification)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">
                Auditor Assessment Notes:
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Details of physical audit, ramp angle, tactile paving..."
                className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingPlace(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApprovePlace(verifyingPlace.id)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingPlace && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-empoway-blush space-y-4">
            <h3 className="text-base font-bold text-rose-800">
              Reject Submission: {rejectingPlace.name}
            </h3>
            <p className="text-xs text-empoway-muted">
              Please specify the reason for rejecting this community submission (e.g. invalid location, duplicate).
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingPlace(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectPlace}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Reject Place
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ORGANISATION MODAL */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <form onSubmit={handleSaveOrg} className="bg-white rounded-2xl max-w-lg w-full p-6 border border-empoway-blush space-y-4">
            <h3 className="text-base font-bold text-empoway-coffee">
              {editingOrg ? `Edit Organisation: ${editingOrg.name}` : 'Register New Parent Organisation'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Organisation Name *</label>
                <input
                  type="text"
                  required
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  placeholder="e.g. Asiri Health Group"
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Unique Slug / Code *</label>
                <input
                  type="text"
                  required
                  value={orgForm.code}
                  onChange={(e) => setOrgForm({ ...orgForm, code: e.target.value })}
                  placeholder="e.g. asiri-health"
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Sector *</label>
                <select
                  value={orgForm.sector}
                  onChange={(e) => setOrgForm({ ...orgForm, sector: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                >
                  <option value="public">Public / Government</option>
                  <option value="private">Private Sector</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Headquarters City</label>
                <input
                  type="text"
                  value={orgForm.headquartersCity}
                  onChange={(e) => setOrgForm({ ...orgForm, headquartersCity: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-empoway-coffee mb-1">Headquarters Address</label>
              <input
                type="text"
                value={orgForm.headquartersAddress}
                onChange={(e) => setOrgForm({ ...orgForm, headquartersAddress: e.target.value })}
                placeholder="e.g. 181 Kirula Road, Colombo 05"
                className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Official Website</label>
                <input
                  type="url"
                  value={orgForm.website}
                  onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-empoway-coffee mb-1">Official Contact Phone</label>
                <input
                  type="text"
                  value={orgForm.contactPhone}
                  onChange={(e) => setOrgForm({ ...orgForm, contactPhone: e.target.value })}
                  placeholder="+94 11 ..."
                  className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowOrgModal(false);
                  setEditingOrg(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-empoway-coffee hover:bg-empoway-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white shadow-xs"
              >
                {editingOrg ? 'Save Changes' : 'Create Organisation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

