import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiChatbot from './components/AiChatbot';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PlaceDetailPage from './pages/PlaceDetailPage';
import ComparePage from './pages/ComparePage';
import JourneyPlannerPage from './pages/JourneyPlannerPage';
import OrganizationPortalPage from './pages/OrganizationPortalPage';
import SubmitPlacePage from './pages/SubmitPlacePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPilotPage from './pages/AboutPilotPage';
import SettingsPage from './pages/SettingsPage';

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location, message: 'Admin authentication required.' }} replace />;
  }
  return children;
};

// Protected Route Component for Logged in Users with friendly reason state
const ProtectedRoute = ({ children, reason = 'access this feature' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: `Please sign in or create an account to ${reason}.`
        }}
        replace
      />
    );
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-empoway-ivory dark:bg-[#18110e] text-empoway-coffee dark:text-empoway-ivory transition-colors">
      <Navbar isHome={isHome} />
      <main className={`flex-1 ${isHome ? '' : 'pt-16'}`}>
            <Routes>
              {/* Public Routes (Accessible Before Login) */}
              <Route path="/" element={<HomePage />} />
              <Route path="/colombo-pilot" element={<AboutPilotPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes (Authentication Required - Registration First) */}
              <Route
                path="/explore"
                element={
                  <ProtectedRoute reason="explore all locations, view interactive accessibility maps, and apply advanced filters">
                    <ExplorePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/places/:id"
                element={
                  <ProtectedRoute reason="view complete accessibility audits, ramp measurements, and verified photographs">
                    <PlaceDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/compare"
                element={
                  <ProtectedRoute reason="compare accessibility features side-by-side">
                    <ComparePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/journey"
                element={
                  <ProtectedRoute reason="plan your accessible journey and view corridor facilities">
                    <JourneyPlannerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/submit-place"
                element={
                  <ProtectedRoute reason="submit a new accessible location">
                    <SubmitPlacePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute reason="access your personal contributor dashboard">
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organization"
                element={
                  <ProtectedRoute reason="access the institutional organization management portal">
                    <OrganizationPortalPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Moderation Console */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <AiChatbot />
        </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PreferencesProvider>
          <AppContent />
        </PreferencesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
