import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiCall from '../utils/apiCall';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cd_user')) || null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiCall('GET', '/auth/me')
      .then(data => { setUser(data.user); localStorage.setItem('cd_user', JSON.stringify(data.user)); })
      .catch(() => { localStorage.removeItem('cd_user'); setUser(null); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, []);

  const signIn = useCallback(async (email, otp) => {
    const data = await apiCall('POST', '/auth/verify-otp', { email, otp });
    localStorage.setItem('cd_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const signOut = useCallback(async () => {
    await apiCall('POST', '/auth/logout').catch(() => {});
    localStorage.removeItem('cd_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
