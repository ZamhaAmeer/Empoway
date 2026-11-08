import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import AuthRequiredModal from '../components/Modals/AuthRequiredModal';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('empoway_token'));
  const [loading, setLoading] = useState(true);

  // Global Auth Required Modal State
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    title: 'Sign In Required',
    message: 'Please sign in or create an account to access this feature.',
    actionName: 'continue',
    redirectPath: ''
  });

  // Favorites state (persisted per user)
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('empoway_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Initialize and check current token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('empoway_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('empoway_token');
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.warn('[AuthContext] Token validation failed:', err.message);
          localStorage.removeItem('empoway_token');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem('empoway_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (fullName, email, password, bio) => {
    const res = await api.register(fullName, email, password, bio);
    if (res.success && res.token) {
      localStorage.setItem('empoway_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('empoway_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('[AuthContext] Error refreshing user:', err);
    }
  };

  // Trigger modal when an unauthenticated user attempts a restricted action
  const promptLogin = ({ title, message, actionName, redirectPath } = {}) => {
    setAuthModal({
      isOpen: true,
      title: title || 'Sign In Required',
      message: message || 'Please sign in or create an account to access this feature.',
      actionName: actionName || 'continue',
      redirectPath: redirectPath || ''
    });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Favorites helpers
  const isFavorite = (placeId) => {
    if (!placeId) return false;
    return favorites.includes(String(placeId));
  };

  const toggleFavorite = (placeId, redirectPath = '') => {
    if (!user) {
      promptLogin({
        title: 'Sign In to Save Favourites',
        message: 'Create your account or sign in to save accessible places to your personal favourites list.',
        actionName: 'save places to your favourites',
        redirectPath: redirectPath || `/places/${placeId}`
      });
      return false;
    }

    const idStr = String(placeId);
    setFavorites((prev) => {
      const exists = prev.includes(idStr);
      const next = exists ? prev.filter((id) => id !== idStr) : [...prev, idStr];
      try {
        localStorage.setItem('empoway_favorites', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return true;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        promptLogin,
        closeAuthModal,
        favorites,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
      <AuthRequiredModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        title={authModal.title}
        message={authModal.message}
        actionName={authModal.actionName}
        redirectPath={authModal.redirectPath}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
