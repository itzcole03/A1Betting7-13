import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { authService, User, PasswordChangeRequest } from '../services/AuthService';

/**
 * AuthContextType
 * Provides authentication state and actions for the app.
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  requiresPasswordChange: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: PasswordChangeRequest) => Promise<void>;
  checkAdminStatus: () => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 * Wrap your app with this provider to enable authentication state and actions.
 * @param {ReactNode} children
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      setIsAdmin(u.role === 'admin' || u.permissions?.includes('admin') || false);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      setUser(null);
      setIsAdmin(false);
    } catch (e: any) {
      setError(e.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.register(email, password);
      setUser(u);
      setIsAdmin(u.role === 'admin' || u.permissions?.includes('admin') || false);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = () => {
    return isAdmin && user && (user.role === 'admin' || user.permissions?.includes('admin'));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, isAdmin, login, logout, register, setUser, checkAdminStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth
 * Access the authentication context in any component.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
