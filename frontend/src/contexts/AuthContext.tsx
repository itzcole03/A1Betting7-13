import React, { ReactNode, createContext, useContext, useState } from 'react';

/**
 * AuthContextType
 * Provides authentication state and actions for the app.
 * @property {any} user - Current user object or null
 * @property {boolean} loading - Loading state for auth actions
 * @property {string | null} error - Error message for auth actions
 * @property {boolean} isAdmin - Whether current user has admin privileges
 * @property {(email: string, password: string) => Promise<void>} login - Login function
 * @property {() => Promise<void>} logout - Logout function
 * @property {(email: string, password: string) => Promise<void>} register - Register function
 * @property {(user: any) => void} setUser - Setter for user
 * @property {() => boolean} checkAdminStatus - Check if user has admin privileges
 */
export interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  setUser: (user: any) => void;
  checkAdminStatus: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Placeholder authService (replace with real implementation)
const authService = {
  login: async (email: string, password: string) => {
    // Simulate admin detection based on email (in real app, this would come from server)
    const isAdminUser =
      email.toLowerCase().includes('admin') || email.toLowerCase().includes('cole');
    return {
      id: 1,
      email,
      role: isAdminUser ? 'admin' : 'user',
      permissions: isAdminUser ? ['admin', 'user'] : ['user'],
    };
  },
  logout: async () => {},
  register: async (email: string, password: string) => {
    const isAdminUser =
      email.toLowerCase().includes('admin') || email.toLowerCase().includes('cole');
    return {
      id: 2,
      email,
      role: isAdminUser ? 'admin' : 'user',
      permissions: isAdminUser ? ['admin', 'user'] : ['user'],
    };
  },
};

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
