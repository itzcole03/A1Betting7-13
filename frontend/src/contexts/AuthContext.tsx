import React, { ReactNode, createContext, useContext, useState } from 'react';

/**
 * AuthContextType
 * Provides authentication state and actions for the app.
 * @property {any} user - Current user object or null
 * @property {boolean} loading - Loading state for auth actions
 * @property {string | null} error - Error message for auth actions
 * @property {(email: string, password: string) => Promise<void>} login - Login function
 * @property {() => Promise<void>} logout - Logout function
 * @property {(email: string, password: string) => Promise<void>} register - Register function
 * @property {(user: any) => void} setUser - Setter for user
 */
export interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Placeholder authService (replace with real implementation)
const authService = {
  login: async (email: string, password: string) => ({ id: 1, email }),
  logout: async () => {},
  register: async (email: string, password: string) => ({ id: 2, email }),
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = await authService.login(email, password);
      setUser(u);
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
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register, setUser }}>
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
