import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, checkAdminStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect non-admin users
  if (!checkAdminStatus()) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='max-w-md w-full mx-auto p-8'>
          <div className='bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center'>
            <AlertTriangle className='w-12 h-12 text-red-400 mx-auto mb-4' />
            <h2 className='text-xl font-bold text-white mb-2'>Access Denied</h2>
            <p className='text-gray-300 mb-4'>
              You don't have permission to access the admin dashboard. This area is restricted to
              verified administrators only.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className='flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors mx-auto'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-300'>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-900'>
      {/* Admin Header Bar */}
      <div className='bg-slate-800/90 backdrop-blur-lg border-b border-slate-700/50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => (window.location.href = '/')}
              className='flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Exit Admin Mode</span>
            </button>

            <div className='flex items-center space-x-2'>
              <Shield className='w-5 h-5 text-purple-400' />
              <span className='text-white font-medium'>Admin Dashboard</span>
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='text-right'>
              <p className='text-sm text-gray-300'>{user?.email || 'Admin User'}</p>
              <p className='text-xs text-purple-400'>Administrator</p>
            </div>
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>
                {(user?.email || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Dashboard Content */}
      <div className='relative'>
        <iframe
          src='/admin-dashboard.html'
          className='w-full h-screen border-0'
          title='Admin Dashboard'
          style={{
            minHeight: 'calc(100vh - 80px)',
            backgroundColor: '#0f172a',
          }}
          onLoad={() => {
            // Optional: Add any post-load communication with iframe
            console.log('Admin dashboard loaded');
          }}
        />

        {/* Fallback content if iframe fails */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='flex items-center justify-center h-full'>
            <div className='bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-xl p-8 max-w-md mx-auto text-center pointer-events-auto'>
              <AlertTriangle className='w-12 h-12 text-yellow-400 mx-auto mb-4' />
              <h3 className='text-xl font-bold text-white mb-2'>Dashboard Loading</h3>
              <p className='text-gray-300 mb-4'>
                If the admin dashboard doesn't load properly, it may still be initializing.
              </p>
              <button
                onClick={() => window.location.reload()}
                className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all'
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
