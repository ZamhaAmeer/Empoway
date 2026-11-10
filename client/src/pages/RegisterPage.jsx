import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UserPlus,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { AuthJourneyBackground } from '../components/AuthJourneyBackground';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { t } = usePreferences();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Return destination if redirected from a protected feature (preserves query params)
  const targetLocation = location.state?.from;
  const destination = typeof targetLocation === 'string'
    ? targetLocation
    : targetLocation?.pathname
      ? `${targetLocation.pathname}${targetLocation.search || ''}`
      : null;
  const redirectMessage = location.state?.message || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please provide full name, email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await register(fullName.trim(), email.trim(), password, '');
      if (res.success) {
        if (destination) {
          navigate(destination, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden bg-gradient-to-b from-empoway-ivory via-empoway-cream/40 to-empoway-ivory dark:from-[#140d0a] dark:via-[#1a120e] dark:to-[#140d0a]">
      {/* Dynamic Journey Moving Patterns & Waypoints Background */}
      <AuthJourneyBackground />

      {/* 4. Floating Main Container */}
      <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-[#1f1713]/95 backdrop-blur-xl rounded-[2rem] border border-white/80 dark:border-white/10 shadow-[0_20px_50px_-10px_rgba(104,70,56,0.16)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Column: Visual Artwork (Zero text clutter) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 text-white select-none overflow-hidden">
          {/* Edge-to-edge photo with cinematic overlay */}
          <img
            src="/images/hero/hero-slide-1.jpg"
            alt="Colombo Fort Skyline"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-empoway-terracotta/15 mix-blend-overlay" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo-icon.png" alt="EMPOWAY" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-extrabold text-lg text-white tracking-tight drop-shadow-sm">
              EMPOWAY
            </span>
          </div>

          {/* Floating Glass Showcase Card */}
          <div className="relative z-10">
            <div className="p-5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live in Colombo
                </span>
                <span className="text-white/80 font-mono text-[11px]">104 Places</span>
              </div>
              <p className="text-sm font-bold text-white leading-snug drop-shadow-sm">
                Empowering every journey with verified accessibility in Sri Lanka.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-white/80 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs">Ramps</span>
                <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs">Door Clearance</span>
                <span className="px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-xs">Restrooms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek, High-Impact Form with Rich Ambient Background */}
        <div className="relative overflow-hidden lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-gradient-to-br from-white via-empoway-ivory/70 to-empoway-cream/40 dark:from-[#221813] dark:via-[#1c1410] dark:to-[#150f0c]">
          {/* 1. Interior Ambient Glow Auras */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-bl from-empoway-terracotta/15 via-empoway-peach/10 to-transparent rounded-full blur-2xl pointer-events-none select-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-empoway-caramel/15 via-empoway-champagne/15 to-transparent rounded-full blur-2xl pointer-events-none select-none" />

          {/* 2. Concentric Cartographic Radar / Compass Rings */}
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-empoway-terracotta/12 dark:border-empoway-peach/10 pointer-events-none select-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-dashed border-empoway-terracotta/10 dark:border-empoway-peach/5 pointer-events-none select-none" />
          <div className="absolute -top-48 -right-48 w-[480px] h-[480px] rounded-full border border-empoway-terracotta/5 pointer-events-none select-none" />

          {/* 3. Fine Dot Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#b96f54_1.1px,transparent_1.1px)] [background-size:22px_22px] opacity-[0.06] dark:opacity-[0.04] pointer-events-none select-none" />

          {/* 4. Subtle Artistic Compass Watermark in bottom corner */}
          <div className="absolute -bottom-8 -right-8 w-44 h-44 text-empoway-terracotta/[0.07] dark:text-empoway-peach/[0.05] pointer-events-none select-none">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M100 10 L100 190 M10 100 L190 100" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
              <polygon points="100,20 106,45 100,40 94,45" />
              <polygon points="100,180 106,155 100,160 94,155" />
              <polygon points="180,100 155,106 160,100 155,94" />
              <polygon points="20,100 45,106 40,100 45,94" />
            </svg>
          </div>

          <div className="relative z-10 max-w-md w-full mx-auto space-y-6">
            {/* Minimal Segmented Switcher: Sign In vs Create Account */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/70 dark:bg-[#150f0c]/80 backdrop-blur-sm border border-empoway-blush/80 dark:border-[#38261e] shadow-2xs">
              <Link
                to="/login"
                state={location.state}
                className="py-2 rounded-xl text-xs font-bold text-empoway-coffee dark:text-empoway-ivory hover:text-empoway-terracotta transition-colors flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <div className="py-2 rounded-xl bg-empoway-terracotta text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </div>
            </div>

            {/* Header Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee dark:text-white tracking-tight">
                Create an account
              </h1>
              <p className="text-xs text-empoway-muted dark:text-empoway-cream/70">
                Join the accessibility community across Colombo.
              </p>
            </div>

            {/* Optional redirect banner */}
            {redirectMessage && (
              <div className="p-3.5 rounded-xl bg-empoway-cream/80 border border-empoway-champagne text-xs text-empoway-coffee flex items-start gap-2.5 shadow-2xs">
                <Sparkles className="w-4 h-4 text-empoway-terracotta shrink-0 mt-0.5" />
                <span className="text-empoway-muted leading-relaxed">{redirectMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-empoway-coffee dark:text-empoway-ivory mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-empoway-muted/70" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ruwanthi Perera"
                    required
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-white/80 dark:bg-[#150f0c]/85 border border-empoway-blush dark:border-[#38261e] text-empoway-coffee dark:text-empoway-ivory placeholder:text-empoway-muted/60 focus:border-empoway-terracotta focus:ring-2 focus:ring-empoway-terracotta/20 transition-all outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-empoway-coffee dark:text-empoway-ivory mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-empoway-muted/70" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.lk"
                    required
                    className="w-full pl-10 pr-4 py-3 text-xs rounded-xl bg-white/80 dark:bg-[#150f0c]/85 border border-empoway-blush dark:border-[#38261e] text-empoway-coffee dark:text-empoway-ivory placeholder:text-empoway-muted/60 focus:border-empoway-terracotta focus:ring-2 focus:ring-empoway-terracotta/20 transition-all outline-none shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-empoway-coffee dark:text-empoway-ivory mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-empoway-muted/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-3 text-xs rounded-xl bg-white/80 dark:bg-[#150f0c]/85 border border-empoway-blush dark:border-[#38261e] text-empoway-coffee dark:text-empoway-ivory placeholder:text-empoway-muted/60 focus:border-empoway-terracotta focus:ring-2 focus:ring-empoway-terracotta/20 transition-all outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-empoway-muted hover:text-empoway-coffee dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-empoway-terracotta to-[#c5553b] hover:from-empoway-terracotta-dark hover:to-empoway-terracotta text-white transition-all shadow-md hover:shadow-lg hover:shadow-empoway-terracotta/25 disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Switch */}
            <div className="text-center text-xs text-empoway-muted dark:text-empoway-cream/70 pt-1">
              Already have an account?{' '}
              <Link
                to="/login"
                state={location.state}
                className="font-bold text-empoway-terracotta hover:underline ml-0.5"
              >
                Sign In
              </Link>
            </div>

            {/* Subtle Trust Line */}
            <div className="pt-2 border-t border-empoway-blush/40 dark:border-white/5 flex items-center justify-center gap-2 text-[11px] text-empoway-muted/75 dark:text-empoway-cream/60">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Free community access
              </span>
              <span>•</span>
              <span>Colombo Pilot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
