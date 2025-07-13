/**
 * AuthService - Handles authentication with temporary passwords and forced password changes
 */

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
  isFirstLogin?: boolean;
  mustChangePassword?: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  requiresPasswordChange?: boolean;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
  token?: string;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || '/api';

    // Auto-login Cole in development
    if (process.env.NODE_ENV === 'development') {
      this.initializeDevelopmentAuth();
    }
  }

  /**
   * Initialize development authentication for Cole
   */
  private initializeDevelopmentAuth(): void {
    // Check if Cole is already logged in
    const existingUser = this.getUser();
    if (existingUser?.email?.toLowerCase().includes('cole')) {
      return; // Already logged in
    }

    // Auto-login Cole for development
    const coleUser: User = {
      id: 'cole_admin_dev',
      email: 'cole@example.com',
      role: 'admin',
      permissions: ['admin', 'user', 'super_admin'],
      isFirstLogin: false,
      mustChangePassword: false,
      createdAt: new Date(),
      lastLogin: new Date(),
    };

    const token = 'dev_token_cole_admin';
    this.setAuthData(token, coleUser);

    console.log('🔐 [DEV] Auto-authenticated Cole as Super Admin');
  }

  /**
   * Login with email and password (supports temporary passwords)
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Store auth data if login successful
      if (data.success && data.token && data.user) {
        this.setAuthData(data.token, data.user);
      }

      return data;
    } catch (error) {
      console.error('Login failed:', error);

      // For demo purposes, simulate login logic
      if (process.env.NODE_ENV === 'development') {
        return this.simulateLogin(email, password);
      }

      throw error;
    }
  }

  /**
   * Change password (required for first login with temporary password)
   */
  async changePassword(data: PasswordChangeRequest): Promise<PasswordChangeResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Validation
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    if (data.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
      throw new Error(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Password change failed' }));
        throw new Error(errorData.message || 'Password change failed');
      }

      const result = await response.json();

      // Update stored user data if password change successful
      if (result.success && result.token) {
        const currentUser = this.getUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            isFirstLogin: false,
            mustChangePassword: false,
            lastLogin: new Date(),
          };
          this.setAuthData(result.token, updatedUser);
        }
      }

      return result;
    } catch (error) {
      console.error('Password change failed:', error);

      // For demo purposes, simulate password change
      if (process.env.NODE_ENV === 'development') {
        return this.simulatePasswordChange(data);
      }

      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const token = this.getToken();

    try {
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Get current user from storage
   */
  getUser(): User | null {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.getToken() && this.getUser());
  }

  /**
   * Check if user has admin privileges
   */
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin' || user?.permissions?.includes('admin') || false;
  }

  /**
   * Check if user needs to change password
   */
  requiresPasswordChange(): boolean {
    const user = this.getUser();
    return user?.mustChangePassword || user?.isFirstLogin || false;
  }

  /**
   * Set authentication data in storage
   */
  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Clear authentication data from storage
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * Generate temporary password for demo
   */
  generateTempPassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Demo simulation methods for development
   */
  private async simulateLogin(email: string, password: string): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for demo credentials
    const isAdminUser =
      email.toLowerCase().includes('admin') || email.toLowerCase().includes('cole');
    const isDemoTempPassword = password === 'TempPass123' || password.startsWith('temp');

    // Simulate different scenarios
    if (email === 'invalid@example.com') {
      throw new Error('User not found');
    }

    if (password === 'wrongpassword') {
      throw new Error('Invalid password');
    }

    // Create mock user
    const user: User = {
      id: `user_${Date.now()}`,
      email: email.toLowerCase(),
      role: isAdminUser ? 'admin' : 'user',
      permissions: isAdminUser ? ['admin', 'user'] : ['user'],
      isFirstLogin: isDemoTempPassword,
      mustChangePassword: isDemoTempPassword,
      createdAt: new Date(),
      lastLogin: isDemoTempPassword ? undefined : new Date(),
    };

    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('🔐 [DEMO] Login simulation:', {
      user: user.email,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      requiresPasswordChange: user.mustChangePassword,
    });

    return {
      success: true,
      user,
      token,
      message: 'Login successful',
      requiresPasswordChange: user.mustChangePassword,
    };
  }

  private async simulatePasswordChange(
    data: PasswordChangeRequest
  ): Promise<PasswordChangeResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('🔒 [DEMO] Password change simulation:', {
      currentPassword: data.currentPassword,
      newPasswordLength: data.newPassword.length,
      timestamp: new Date().toISOString(),
    });

    const newToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      message: 'Password changed successfully',
      token: newToken,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export class for testing
export default AuthService;
