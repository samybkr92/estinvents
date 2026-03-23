import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('estin_token');
    const stored = localStorage.getItem('estin_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
        // Verify token is still valid
        api.get('/auth/me')
          .then(res => setUser(res.data.user))
          .catch(() => { localStorage.removeItem('estin_token'); localStorage.removeItem('estin_user'); setUser(null); })
          .finally(() => setLoading(false));
      } catch { setLoading(false); }
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('estin_token', token);
    localStorage.setItem('estin_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('estin_token', token);
    localStorage.setItem('estin_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('estin_token');
    localStorage.removeItem('estin_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('estin_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
