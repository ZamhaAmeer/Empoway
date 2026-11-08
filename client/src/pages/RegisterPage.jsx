import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserPlus, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { t } = usePreferences();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
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
      const res = await register(fullName.trim(), email.trim(), password, bio.trim());
      if (res.success) {
        if (destination) {
          navigate(destination, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Friendly reason banner if redirected from an auth-required action */}
      {redirectMessage && (
        <div className="p-4 rounded-2xl bg-empoway-cream border border-empoway-champagne text-xs text-empoway-coffee flex items-start gap-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-empoway-terracotta shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-empoway-coffee">Account Registration Required</p>
            <p className="text-empoway-muted mt-0.5 leading-relaxed">{redirectMessage}</p>
          </div>
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-empoway-terracotta/10 text-empoway-terracotta flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-empoway-coffee">
          Join EMPOWAY
        </h1>
        <p className="text-xs text-empoway-muted">
          Contribute accessibility information and make public spaces navigable for everyone.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-empoway-coffee mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ruwanthi Perera"
              className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-empoway-coffee mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.lk"
              className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-empoway-coffee mb-1">
              Password (minimum 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-empoway-coffee mb-1">
              Your Mobility Interest / Bio (Optional)
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Wheelchair user commuting in Colombo, caregiver, therapist, or urban advocate..."
              className="w-full p-2.5 text-xs rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
            />
          </div>

          <div className="p-3 rounded-xl bg-empoway-cream/70 border border-empoway-blush/60 text-[11px] text-empoway-coffee flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-empoway-terracotta shrink-0 mt-0.5" />
            <p>
              By registering, you agree to submit transparent, honest accessibility observations.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{loading ? t('loading') : t('register')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-empoway-cream text-center text-xs text-empoway-muted">
          Already registered?{' '}
          <Link to="/login" state={location.state} className="font-bold text-empoway-terracotta hover:underline">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

