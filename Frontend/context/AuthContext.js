import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiWrapper from '../services/ApiWrapper';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar sesión al iniciar
    AsyncStorage.getItem('userSession').then(data => {
      if (data) setUser(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const login = async (username, password) => {
    const userData = await ApiWrapper.login(username, password);
    if (userData) {
      await AsyncStorage.setItem('userSession', JSON.stringify(userData));
      setUser(userData);
    }
    return userData;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userSession');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return {
    ...ctx,
    isLoggedIn: !!ctx.user, // true si hay usuario autenticado
  };
}
