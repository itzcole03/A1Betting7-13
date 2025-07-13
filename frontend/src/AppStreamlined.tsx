import React, { Suspense, useState, useEffect } from 'react';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { LoadingSpinner } from './components/shared/ui/LoadingSpinner';
import { Toaster } from './components/common/notifications/Toaster';

// Import the three main pages
const LockedBetsPage = React.lazy(() => import('./components/pages/EnhancedLockedBetsPage'));
const LiveStreamPage = React.lazy(() => import('./components/pages/EnhancedLiveStreamPage'));
const SettingsAdminPage = React.lazy(() => import('./components/pages/UnifiedSettingsAdminPage'));

// Navigation component
const Navigation = ({
  currentPage,
  setCurrentPage,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}) => {
  return (
    <nav className='bg-gray-900 border-b border-cyan-500/30 p-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='text-2xl font-bold text-cyan-400'>A1Betting</div>
          <div className='text-sm text-gray-400'>Ultra-Enhanced Platform</div>
        </div>

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
            ⚙️ Settings
          </button>
        </div>
      </div>
    </nav>
  );
};

const AppStreamlined: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('locked-bets');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 A1Betting Ultra-Enhanced Platform initialized');
    setIsLoading(false);
  }, []);

  const renderCurrentPage = () => {
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
          <Suspense
            fallback={
              <div className='flex items-center justify-center h-64'>
                <LoadingSpinner />
              </div>
            }
          >
            {renderCurrentPage()}
          </Suspense>
        </main>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default AppStreamlined;
