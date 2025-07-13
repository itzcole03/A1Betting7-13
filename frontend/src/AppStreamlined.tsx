import React, { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { LoadingSpinner } from './components/shared/ui/LoadingSpinner';
import { Toaster } from './components/common/notifications/Toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Crown, Settings, User } from 'lucide-react';

// Import the three main pages with fallbacks
const LockedBetsPage = React.lazy(() =>
  import('./components/pages/EnhancedLockedBetsPage').catch(() => ({
    default: () => (
      <div className='p-8 text-center'>
        <h2 className='text-2xl font-bold text-white mb-4'>🎯 Locked Bets</h2>
        <p className='text-gray-400'>Loading enhanced betting predictions...</p>
      </div>
    ),
  }))
);
const LiveStreamPage = React.lazy(() =>
  import('./components/pages/EnhancedLiveStreamPage').catch(() => ({
    default: () => (
      <div className='p-8 text-center'>
        <h2 className='text-2xl font-bold text-white mb-4'>📺 Live Stream</h2>
        <p className='text-gray-400'>Live streaming functionality coming soon...</p>
      </div>
    ),
  }))
);
const SettingsAdminPage = React.lazy(() =>
  import('./components/pages/UnifiedSettingsAdminPage').catch(() =>
    import('./components/pages/SimpleSettingsPage').catch(() => ({
      default: () => (
        <div className='p-8 text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>⚙️ Settings</h2>
          <p className='text-gray-400'>Settings panel loading...</p>
        </div>
      ),
    }))
  )
);

// Navigation component
const Navigation = ({
  currentPage,
  setCurrentPage,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}) => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.permissions?.includes('admin');

  return (
    <nav className='bg-gray-900 border-b border-cyan-500/30 p-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='text-2xl font-bold text-cyan-400'>A1Betting</div>
          <div className='text-sm text-gray-400'>Ultra-Enhanced Platform</div>
          <div className='px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium'>
            ✅ Validated
          </div>
          {isAdmin && (
            <div className='flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-400 rounded-full text-xs font-medium'>
              <Crown className='w-3 h-3' />
              <span>Admin</span>
            </div>
          )}
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex space-x-4'>
            <button
              onClick={() => setCurrentPage('locked-bets')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'locked-bets'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎯 Locked Bets
            </button>

            <button
              onClick={() => setCurrentPage('live-stream')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'live-stream'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📺 Live Stream
            </button>

            <button
              onClick={() => setCurrentPage('settings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'settings'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isAdmin ? (
                <>
                  <Settings className='w-4 h-4 inline mr-1' />
                  Admin Panel
                </>
              ) : (
                '⚙️ Settings'
              )}
            </button>
          </div>

          {isAuthenticated && (
            <div className='flex items-center space-x-2 ml-4 px-3 py-2 bg-gray-800 rounded-lg'>
              <div className='w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className='text-gray-300 text-sm'>{user?.email?.split('@')[0] || 'User'}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const AppStreamlinedContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('locked-bets');
  const [isLoading, setIsLoading] = useState(false); // Start with false for faster loading
  const [settingsPageError, setSettingsPageError] = useState(false);
  const [showAdminMode, setShowAdminMode] = useState(false);

  useEffect(() => {
    console.log('🚀 A1Betting Ultra-Enhanced Platform initialized');
    console.log('📍 AppStreamlined component mounted successfully');
    console.log('📄 Current page:', currentPage);
    setIsLoading(false);
  }, []);

  const renderCurrentPage = () => {
    try {
      switch (currentPage) {
        case 'locked-bets':
          return <LockedBetsPage />;
        case 'live-stream':
          return <LiveStreamPage />;
        case 'settings':
          return <SettingsAdminPage />;
        default:
          return <LockedBetsPage />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className='flex items-center justify-center h-64 text-white'>
          <div className='text-center'>
            <div className='text-red-400 mb-2'>⚠️ Component Error</div>
            <div className='text-gray-400'>Unable to load {currentPage} page</div>
            <button
              onClick={() => setCurrentPage('locked-bets')}
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Return to Locked Bets
            </button>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-900 text-white'>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

        <main className='min-h-screen'>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className='flex items-center justify-center h-64'>
                  <LoadingSpinner />
                  <div className='ml-3 text-gray-400'>Loading component...</div>
                </div>
              }
            >
              {renderCurrentPage()}
            </Suspense>
          </ErrorBoundary>
        </main>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

const AppStreamlined: React.FC = () => {
  return (
    <AuthProvider>
      <AppStreamlinedContent />
    </AuthProvider>
  );
};

export default AppStreamlined;
