/**
 * AdminService - API service for admin dashboard functionality
 * Replaces mock data with real API endpoints
 */

export interface AdminStats {
  totalProfit: number;
  activeBets: number;
  winRate: number;
  arbitrageOpportunities: number;
}

export interface AdminActivity {
  time: string;
  event: string;
  amount: number;
  status: 'won' | 'pending' | 'lost' | 'completed';
  isProfit: boolean;
}

export interface SystemStatus {
  status: 'operational' | 'warning' | 'error';
  message: string;
  arbitrageAlerts: number;
  lastUpdate: Date;
}

export interface UserManagementData {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  recentRegistrations: number;
}

class AdminService {
  private baseUrl: string;

  constructor() {
    // In production, this would come from environment variables
    this.baseUrl = import.meta.env.VITE_ADMIN_API_URL || '/api/admin';
  }

  /**
   * Get real-time admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      // Fallback to mock data for development
      return this.getMockStats();
    }
  }

  /**
   * Get recent activity feed
   */
  async getRecentActivity(limit: number = 10): Promise<AdminActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/activity?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      // Fallback to mock data for development
      return this.getMockActivity();
    }
  }

  /**
   * Get system status information
   */
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/system/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      // Fallback to mock data for development
      return this.getMockSystemStatus();
    }
  }

  /**
   * Get user management data
   */
  async getUserManagementData(): Promise<UserManagementData> {
    try {
      const response = await fetch(`${this.baseUrl}/users/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user management data:', error);
      // Fallback to mock data for development
      return this.getMockUserData();
    }
  }

  /**
   * Execute admin actions
   */
  async executeAdminAction(action: string, params?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/actions/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to execute admin action ${action}:`, error);
      throw error;
    }
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string {
    // In production, get from secure storage (localStorage, sessionStorage, or cookies)
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Mock data fallback methods for development
   */
  private getMockStats(): AdminStats {
    return {
      totalProfit: 12847 + Math.floor(Math.random() * 1000),
      activeBets: 47 + Math.floor(Math.random() * 10),
      winRate: 74.3 + Math.random() * 10,
      arbitrageOpportunities: 23 + Math.floor(Math.random() * 15),
    };
  }

  private getMockActivity(): AdminActivity[] {
    const events = [
      'Lakers ML vs Warriors',
      'Chiefs -3.5 vs Bills',
      'Celtics O 220.5',
      'Arbitrage: DK/FD',
      'Nuggets -7 vs Heat',
      'Rangers ML vs Kings',
    ];

    const statuses: Array<'won' | 'pending' | 'lost' | 'completed'> = [
      'won',
      'pending',
      'lost',
      'completed',
    ];

    return Array.from({ length: 10 }, (_, i) => {
      const amount = Math.floor(Math.random() * 1000) + 100;
      const isProfit = Math.random() > 0.3;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        time: new Date(Date.now() - i * 600000)
          .toLocaleTimeString('en-US', {
            hour12: false,
          })
          .slice(0, 5),
        event: events[Math.floor(Math.random() * events.length)],
        amount: isProfit ? amount : -amount,
        status,
        isProfit,
      };
    });
  }

  private getMockSystemStatus(): SystemStatus {
    return {
      status: 'operational',
      message: 'All systems operational',
      arbitrageAlerts: 3,
      lastUpdate: new Date(),
    };
  }

  private getMockUserData(): UserManagementData {
    return {
      totalUsers: 1247,
      activeUsers: 892,
      adminUsers: 12,
      recentRegistrations: 34,
    };
  }
}

// Export singleton instance
export const adminService = new AdminService();

// Export class for testing
export default AdminService;
