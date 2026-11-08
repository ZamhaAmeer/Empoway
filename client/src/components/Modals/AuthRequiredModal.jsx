import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  UserPlus,
  LogIn,
  X,
  ShieldCheck,
  Heart,
  PlusCircle,
  Camera,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const AuthRequiredModal = ({
  isOpen,
  onClose,
  title = 'Account Required',
  message = 'Please sign in or create an account to access this feature.',
  actionName = 'continue',
  redirectPath
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const targetPath = redirectPath || (location.pathname + (location.search || ''));

  const handleSignIn = () => {
    onClose();
    navigate('/login', {
      state: {
        from: targetPath,
        message: `Please sign in to ${actionName}.`
      }
    });
  };

  const handleRegister = () => {
    onClose();
    navigate('/register', {
      state: {
        from: targetPath,
        message: `Create your account to ${actionName}.`
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-empoway-coffee/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-empoway-blush/80 z-10 overflow-hidden"
        >
          {/* Subtle Ambient Background Accent */}
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-empoway-peach/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-empoway-terracotta/15 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-empoway-muted hover:text-empoway-coffee hover:bg-empoway-cream transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Icon */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-empoway-terracotta/15 border border-empoway-peach/30 text-empoway-terracotta flex items-center justify-center shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-empoway-cream border border-empoway-blush text-[11px] font-bold text-empoway-coffee">
              <Sparkles className="w-3.5 h-3.5 text-empoway-terracotta" />
              <span>Community Participation Standard</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-empoway-coffee tracking-tight">
              {title}
            </h3>

            <p className="text-xs sm:text-sm text-empoway-muted leading-relaxed max-w-sm">
              {message}
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="mt-5 p-3.5 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-2 text-xs text-empoway-coffee">
            <div className="flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider text-empoway-muted">
              <span>Why register with EMPOWAY?</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-empoway-muted/90">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Maintain audited, reliable accessibility records</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-empoway-terracotta shrink-0" />
                <span>Save favourite accessible places for fast trip planning</span>
              </li>
              <li className="flex items-center gap-2">
                <PlusCircle className="w-3.5 h-3.5 text-empoway-caramel shrink-0" />
                <span>Track your community submissions in your dashboard</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full py-3.5 px-5 rounded-2xl bg-empoway-terracotta hover:bg-empoway-terracotta-dark text-white font-bold text-xs sm:text-sm shadow-card hover:shadow-elevated transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Your Account</span>
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full py-3.5 px-5 rounded-2xl bg-empoway-cream hover:bg-empoway-blush/60 text-empoway-coffee border border-empoway-champagne font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <UserPlus className="w-4 h-4 text-empoway-terracotta" />
              <span>Create a Free Account</span>
            </button>
          </div>

          {/* Guest dismiss link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-semibold text-empoway-muted hover:text-empoway-coffee transition-colors"
            >
              Continue exploring public places as a guest
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthRequiredModal;
