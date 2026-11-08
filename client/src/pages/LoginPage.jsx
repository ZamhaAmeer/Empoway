import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, ShieldAlert, User, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = usePreferences();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        if (destination) {
          navigate(destination, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14 sm:py-20 space-y-6">
      {/* Friendly reason banner if redirected from an auth-required action */}
      {redirectMessage && (
        <div className="p-4 rounded-2xl bg-empoway-cream border border-empoway-champagne text-xs text-empoway-coffee flex items-start gap-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-empoway-terracotta shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-extrabold text-empoway-coffee block">Authentication Required</span>
            <span className="text-empoway-muted mt-0.5 block leading-relaxed">{redirectMessage}</span>
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-empoway-terracotta/10 text-empoway-terracotta flex items-center justify-center mx-auto mb-3 shadow-xs">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee tracking-tight">
          Sign In to EMPOWAY
        </h1>
        <p className="text-xs text-empoway-muted">
          Access your contributor dashboard, submit locations, and save favourites.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/80 shadow-card">
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-empoway-coffee mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-empoway-coffee">
                Password
              </label>
              <span className="text-[11px] text-empoway-muted cursor-not-allowed">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-card hover:shadow-elevated disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <>
                <span>{t('signIn')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill for Colombo Pilot Testing */}
        <div className="mt-6 pt-5 border-t border-empoway-cream space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-empoway-muted block">
            Quick-Fill Colombo Pilot Logins:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => fillDemo('admin@empoway.lk')}
              className="p-2 rounded-lg bg-empoway-cream/70 hover:bg-empoway-cream text-empoway-coffee font-semibold text-left transition-colors flex items-center justify-between"
            >
              <span>Admin Auditor</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-empoway-peach/40 text-empoway-terracotta font-bold">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('saman@empoway.lk')}
              className="p-2 rounded-lg bg-empoway-cream/70 hover:bg-empoway-cream text-empoway-coffee font-semibold text-left transition-colors flex items-center justify-between"
            >
              <span>Community Contributor</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Member</span>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-empoway-muted">
        Don&apos;t have an account yet?{' '}
        <Link
          to="/register"
          state={location.state}
          className="font-bold text-empoway-terracotta hover:underline"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
