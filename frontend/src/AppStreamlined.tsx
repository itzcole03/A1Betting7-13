import React, { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { LoadingSpinner } from './components/shared/ui/LoadingSpinner';
import { Toaster } from './components/common/notifications/Toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Crown, Settings, User, ToggleLeft, ToggleRight } from 'lucide-react';

// Import the admin wrapper component
const AdminWrapper = React.lazy(() => import('./components/comprehensive/AdminWrapper'));

// Import the full admin App content (without AuthProvider wrapper)
const FullAdminApp = React.lazy(() =>
  import('./App').then(module => ({ default: module.AppContent }))
);

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
  showAdminMode,
  setShowAdminMode,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  showAdminMode: boolean;
  setShowAdminMode: (show: boolean) => void;
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
            <div className='relative group'>
              {/* Animated background glow */}
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-30 blur-sm rounded-full animate-pulse group-hover:opacity-50 transition-opacity duration-300' />

              {/* Main admin badge */}
              <div className='relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/30 via-violet-600/25 to-cyan-600/30 backdrop-blur-sm text-white rounded-full text-xs font-semibold border border-purple-400/40 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105'>
                {/* Animated crown icon */}
                <div className='relative'>
                  <Crown
                    className='w-4 h-4 text-yellow-300 filter drop-shadow-sm'
                    fill='currentColor'
                  />
                  <div className='absolute inset-0 rounded-full bg-yellow-300/20 blur-sm animate-pulse' />
                </div>

                {/* Admin text with gradient */}
                <span className='bg-gradient-to-r from-yellow-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent font-bold tracking-wide'>
                  ADMIN
                </span>

                {/* Animated status dot */}
                <div className='relative'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
                  <div className='absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75' />
                </div>
              </div>

              {/* Subtle tooltip on hover */}
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
                Administrator Access Active
                <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45' />
              </div>
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
            <div className='flex items-center space-x-3 ml-4'>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminMode(!showAdminMode)}
                  className={`group relative flex items-center space-x-3 px-5 py-3 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105 ${
                    showAdminMode
                      ? 'bg-gradient-to-r from-purple-600/30 via-violet-600/25 to-cyan-600/30 text-white shadow-2xl shadow-purple-500/30 border border-purple-400/50 backdrop-blur-lg'
                      : 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 text-slate-300 hover:from-slate-700/70 hover:to-slate-600/70 border border-slate-600/40 backdrop-blur-sm hover:border-slate-500/60 hover:shadow-lg hover:shadow-slate-500/20'
                  }`}
                  title={
                    showAdminMode
                      ? 'Switch to User Mode - Click to disable admin features'
                      : 'Switch to Admin Mode - Click to enable full admin access'
                  }
                >
                  {/* Enhanced glow effect for admin mode */}
                  {showAdminMode && (
                    <>
                      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500' />
                      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/10 to-cyan-400/10 animate-pulse' />
                    </>
                  )}

                  <div className='relative flex items-center space-x-3'>
                    {showAdminMode ? (
                      <>
                        {/* Enhanced admin mode indicator */}
                        <div className='relative'>
                          <Crown
                            className='w-5 h-5 text-yellow-300 filter drop-shadow-lg animate-pulse'
                            fill='currentColor'
                          />
                          <div className='absolute inset-0 rounded-full bg-yellow-300/30 blur-md animate-pulse' />
                          <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping' />
                        </div>

                        <div className='flex flex-col items-start'>
                          <span className='text-sm font-bold bg-gradient-to-r from-yellow-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent tracking-wide'>
                            ADMIN MODE
                          </span>
                          <span className='text-xs text-purple-300/80 font-medium'>
                            Full Access
                          </span>
                        </div>

                        <div className='flex items-center space-x-1'>
                          <ToggleRight className='w-5 h-5 text-cyan-300 animate-pulse filter drop-shadow-sm' />
                          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Enhanced user mode indicator */}
                        <div className='relative'>
                          <User className='w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors duration-300 filter drop-shadow-sm' />
                          <div className='absolute inset-0 rounded-full bg-slate-400/0 group-hover:bg-slate-400/20 blur-sm transition-all duration-300' />
                        </div>

                        <div className='flex flex-col items-start'>
                          <span className='text-sm font-semibold group-hover:text-white transition-colors duration-300'>
                            User Mode
                          </span>
                          <span className='text-xs text-slate-500 group-hover:text-slate-400 font-medium transition-colors duration-300'>
                            Standard Access
                          </span>
                        </div>

                        <div className='flex items-center space-x-1'>
                          <ToggleLeft className='w-5 h-5 text-slate-400 group-hover:text-slate-300 transition-colors duration-300 filter drop-shadow-sm' />
                          <div className='w-2 h-2 bg-slate-500 rounded-full group-hover:bg-slate-400 transition-colors duration-300' />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Enhanced hover tooltip */}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-black/90 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-white/10 backdrop-blur-sm'>
                    {showAdminMode ? (
                      <div className='flex items-center space-x-2'>
                        <Crown className='w-3 h-3 text-yellow-300' fill='currentColor' />
                        <span>Click to switch to User Mode</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2'>
                        <User className='w-3 h-3 text-slate-300' />
                        <span>Click to enable Admin Mode</span>
                      </div>
                    )}
                    <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-l border-t border-white/10' />
                  </div>
                </button>
              )}

              <div className='flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg'>
                <div className='w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className='text-gray-300 text-sm'>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
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

  // If admin mode is enabled, render the full admin app
  if (showAdminMode) {
    return (
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className='min-h-screen bg-gray-900 flex items-center justify-center'>
              <LoadingSpinner />
              <div className='ml-3 text-gray-400'>Loading Admin Mode...</div>
            </div>
          }
        >
          <AdminWrapper onToggleUserMode={() => setShowAdminMode(false)} />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gray-900 text-white'>
        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          showAdminMode={showAdminMode}
          setShowAdminMode={setShowAdminMode}
        />

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
