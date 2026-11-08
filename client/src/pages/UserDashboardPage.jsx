import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  LayoutDashboard,
  PlusCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Heart,
  Zap,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export const UserDashboardPage = () => {
  const { user, favorites } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'reports' | 'favourites'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [meRes, placesRes] = await Promise.all([
          api.getMe(),
          api.getPlaces({ limit: 100 })
        ]);
        if (meRes.success) {
          setProfileData(meRes);
        }
        if (placesRes.success && placesRes.places) {
          const currentFavorites = favorites || [];
          setFavoritePlaces(placesRes.places.filter((p) => currentFavorites.includes(String(p.id))));
        }
      } catch (err) {
        console.error('Error fetching user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [favorites]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-empoway-terracotta border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-empoway-muted">Loading your dashboard...</p>
      </div>
    );
  }

  const currentUser = profileData?.user || user;
  const submittedPlaces = profileData?.submittedPlaces || [];
  const submittedReports = profileData?.submittedReports || [];

  const pendingPlacesCount = submittedPlaces.filter((p) => p.approvalStatus === 'PENDING').length;
  const approvedPlacesCount = submittedPlaces.filter((p) => p.approvalStatus === 'APPROVED').length;
  const rejectedPlacesCount = submittedPlaces.filter((p) => p.approvalStatus === 'REJECTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=EMPOWAY'}
            alt={currentUser?.fullName}
            className="w-16 h-16 rounded-2xl object-cover bg-empoway-cream border-2 border-empoway-blush"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-empoway-coffee">
                Ayubowan, {currentUser?.fullName}!
              </h1>
              {currentUser?.role === 'admin' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  Lead Auditor
                </span>
              )}
            </div>
            <p className="text-xs text-empoway-muted mt-0.5">
              {currentUser?.bio || 'Mobility contributor helping make Colombo accessible.'}
            </p>
          </div>
        </div>

        <Link
          to="/submit-place"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white text-xs font-bold transition-all shadow-xs self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit a Place</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-empoway-blush/60 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-empoway-muted block">
            Total Contributions
          </span>
          <span className="text-3xl font-extrabold text-empoway-coffee block mt-1">
            {currentUser?.contributionCount || 0}
          </span>
          <span className="text-[10px] text-empoway-caramel block">Logged entries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-empoway-blush/60 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
            Approved Places
          </span>
          <span className="text-3xl font-extrabold text-emerald-700 block mt-1">
            {approvedPlacesCount}
          </span>
          <span className="text-[10px] text-empoway-muted block">Live in directory</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-empoway-blush/60 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
            Pending Review
          </span>
          <span className="text-3xl font-extrabold text-amber-600 block mt-1">
            {pendingPlacesCount}
          </span>
          <span className="text-[10px] text-empoway-muted block">In moderation queue</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-empoway-blush/60 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-empoway-coffee block">
            Reports Submitted
          </span>
          <span className="text-3xl font-extrabold text-empoway-terracotta block mt-1">
            {submittedReports.length}
          </span>
          <span className="text-[10px] text-empoway-muted block">Condition logs</span>
        </div>
      </div>

      {/* Mobility Profile Quick Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-empoway-ivory dark:bg-[#201713] border border-empoway-blush/80 dark:border-[#3d2c24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-empoway-terracotta/10 dark:bg-empoway-terracotta/20 text-empoway-terracotta border border-empoway-terracotta/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-empoway-coffee dark:text-white">
                Personal Mobility Profile
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-empoway-terracotta text-white">
                Active
              </span>
            </div>
            <p className="text-xs text-empoway-muted dark:text-empoway-peach/75 mt-0.5">
              Equipment: <strong className="text-empoway-coffee dark:text-white capitalize">{currentUser?.mobilityProfile?.type ? currentUser.mobilityProfile.type.replace('_', ' ') : 'Manual Wheelchair'}</strong> • Powers personalized compatibility scores across all places in Colombo.
            </p>
          </div>
        </div>

        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#2b1e18] text-empoway-coffee dark:text-empoway-ivory border border-empoway-blush hover:bg-empoway-cream transition-colors self-start sm:self-auto shrink-0"
        >
          <span>Adjust Profile</span>
          <ArrowRight className="w-3.5 h-3.5 text-empoway-terracotta" />
        </Link>
      </div>

      {/* Tabbed Activity Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-6">
        <div className="flex items-center gap-3 border-b border-empoway-cream pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={`text-xs font-bold pb-2 relative transition-colors ${
              activeTab === 'places'
                ? 'text-empoway-terracotta border-b-2 border-empoway-terracotta'
                : 'text-empoway-muted hover:text-empoway-coffee'
            }`}
          >
            My Submitted Places ({submittedPlaces.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`text-xs font-bold pb-2 relative transition-colors ${
              activeTab === 'reports'
                ? 'text-empoway-terracotta border-b-2 border-empoway-terracotta'
                : 'text-empoway-muted hover:text-empoway-coffee'
            }`}
          >
            My Accessibility Reports ({submittedReports.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favourites')}
            className={`text-xs font-bold pb-2 relative transition-colors flex items-center gap-1.5 ${
              activeTab === 'favourites'
                ? 'text-empoway-terracotta border-b-2 border-empoway-terracotta'
                : 'text-empoway-muted hover:text-empoway-coffee'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Favourites ({favoritePlaces.length})</span>
          </button>
        </div>

        {/* Tab 1: Submitted Places */}
        {activeTab === 'places' && (
          <div className="space-y-4">
            {submittedPlaces.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileCheck2 className="w-10 h-10 text-empoway-champagne mx-auto" />
                <p className="text-xs text-empoway-muted">
                  You haven't submitted any places yet.
                </p>
                <Link
                  to="/submit-place"
                  className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta text-white"
                >
                  Share Your First Location
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-empoway-cream">
                {submittedPlaces.map((pl) => (
                  <div key={pl.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-empoway-coffee">
                          {pl.name}
                        </h4>
                        {/* Approval status pill */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pl.approvalStatus === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pl.approvalStatus === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {pl.approvalStatus}
                        </span>
                      </div>
                      <p className="text-xs text-empoway-muted">
                        {pl.address} ({pl.cityOrArea})
                      </p>
                      <span className="text-[11px] text-empoway-muted block">
                        Submitted on: {new Date(pl.createdAt).toLocaleDateString('en-GB')}
                      </span>
                    </div>

                    {pl.approvalStatus === 'APPROVED' ? (
                      <Link
                        to={`/places/${pl.id}`}
                        className="text-xs font-bold text-empoway-terracotta hover:underline inline-flex items-center gap-1"
                      >
                        View Public Page <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs text-amber-800 italic">
                        Under Moderation Review
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Submitted Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {submittedReports.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-empoway-champagne mx-auto" />
                <p className="text-xs text-empoway-muted">
                  No accessibility updates or correction reports submitted.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-empoway-cream">
                {submittedReports.map((rep) => (
                  <div key={rep.id} className="py-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-empoway-coffee">
                        {rep.place?.name || `Place #${rep.placeId}`}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rep.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-xs text-empoway-muted">
                      {rep.description}
                    </p>
                    <span className="text-[11px] text-empoway-muted block">
                      Type: {rep.reportType} • Submitted on: {new Date(rep.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Favourites */}
        {activeTab === 'favourites' && (
          <div className="space-y-4">
            {favoritePlaces.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-empoway-champagne mx-auto" />
                <p className="text-xs text-empoway-muted">
                  You haven't saved any favourite places yet.
                </p>
                <Link
                  to="/explore"
                  className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-empoway-terracotta text-white hover:bg-empoway-terracotta-dark transition-colors"
                >
                  Explore Accessible Places
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoritePlaces.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-4 rounded-2xl border border-empoway-blush/70 bg-empoway-ivory/50 flex items-start gap-4 hover:border-empoway-terracotta/40 transition-colors"
                  >
                    <img
                      src={
                        pl.photographs?.find(p => p.isCover)?.url ||
                        pl.photographs?.[0]?.url ||
                        '/places/colombo-city-centre.jpg'
                      }
                      alt={pl.name}
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith('/places/colombo-city-centre.jpg')) {
                          e.currentTarget.src = '/places/colombo-city-centre.jpg';
                        }
                      }}
                      className="w-20 h-20 rounded-xl object-cover bg-empoway-coffee shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-empoway-coffee truncate">
                          {pl.name}
                        </h4>
                        <StatusBadge status={pl.accessibilityStatus} size="sm" />
                      </div>
                      <p className="text-xs text-empoway-muted truncate">
                        {pl.cityOrArea}, {pl.district || 'Colombo'}
                      </p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-empoway-caramel">
                          {pl.category?.name || 'Public Place'}
                        </span>
                        <Link
                          to={`/places/${pl.id}`}
                          className="text-xs font-bold text-empoway-terracotta hover:underline inline-flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;

