import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Menu, X, Settings, User, Bell, TrendingUp } from 'lucide-react';
import { Navigation } from './Navigation';
import { cn } from '../../lib/utils';
import { HolographicText, CyberButton, GlowCard, ParticleField } from '../ui';

interface AppShellProps {
  children: React.ReactNode;
  activeView?: string;
  onNavigate?: (viewId: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Mock search results - replace with actual search logic
      const mockResults = [
        {
          id: 'moneymaker',
          title: 'Money Maker',
          description: 'AI-powered betting recommendations',
        },
        { id: 'analytics', title: 'ML Analytics', description: '47+ machine learning models' },
        {
          id: 'arbitrage',
          title: 'Arbitrage Scanner',
          description: 'Real-time arbitrage opportunities',
        },
        { id: 'prizepicks', title: 'PrizePicks Pro', description: 'Daily fantasy optimization' },
      ].filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative'>
      {/* Enhanced Cyber Background Effects */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <ParticleField variant='cyber' density='medium' speed='slow' interactive={true} />
      </div>
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <div
          className='absolute inset-0 opacity-30'
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(6, 255, 165, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(6, 255, 165, 0.15) 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Mobile Header */}
      <header className='lg:hidden relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 rounded-lg text-white hover:bg-slate-800/50 transition-colors'
            >
              {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </button>
            <HolographicText size='lg' intensity='medium' glow={true}>
              A1BETTING
            </HolographicText>
          </div>

          <div className='flex items-center space-x-2'>
            <CyberButton
              variant='primary'
              size='sm'
              glow={true}
              onClick={() => {
                // Handle notifications
                console.log('Notifications clicked');
              }}
            >
              <Bell className='w-5 h-5' />
            </CyberButton>
            <CyberButton
              variant='neon'
              size='sm'
              glow={true}
              onClick={() => {
                // Handle user menu
                console.log('User menu clicked');
              }}
            >
              <User className='w-5 h-5' />
            </CyberButton>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className='hidden lg:block relative z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-white' />
                </div>
                <div>
                  <HolographicText size='xl' intensity='high' glow={true}>
                    A1BETTING
                  </HolographicText>
                  <p className='text-xs text-gray-400'>Ultimate Sports Intelligence Platform</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className='flex-1 max-w-2xl mx-8 relative'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search features, games, or insights...'
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all'
                />
              </div>

              {/* Search Results */}
              <AnimatePresence>
                {isSearchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden z-50'
                  >
                    {searchResults.map(result => (
                      <button
                        key={result.id}
                        className='w-full px-4 py-3 text-left hover:bg-slate-700/50 border-b border-slate-700/30 last:border-b-0 transition-colors'
                        onClick={() => {
                          // Handle navigation to result
                          if (onNavigate) {
                            onNavigate(result.id);
                          }
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className='font-medium text-white'>{result.title}</div>
                        <div className='text-sm text-gray-400'>{result.description}</div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className='flex items-center space-x-4'>
              <div className='hidden md:flex items-center space-x-4 text-sm'>
                <div className='text-green-400 font-medium'>+$18,420</div>
                <div className='text-cyan-400'>ROI: +847%</div>
              </div>

              <div className='flex items-center space-x-2'>
                <CyberButton
                  variant='primary'
                  size='sm'
                  glow={true}
                  className='relative'
                  onClick={() => {
                    // Handle notifications
                    console.log('Notifications clicked');
                  }}
                >
                  <Bell className='w-5 h-5' />
                  <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center'>
                    3
                  </span>
                </CyberButton>

                <CyberButton
                  variant='secondary'
                  size='sm'
                  glow={true}
                  onClick={() => {
                    // Handle settings
                    if (onNavigate) {
                      onNavigate('settings');
                    }
                    console.log('Settings clicked');
                  }}
                >
                  <Settings className='w-5 h-5' />
                </CyberButton>

                <div className='flex items-center space-x-3 ml-2'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center'>
                    <span className='text-slate-900 font-bold text-sm'>🤖</span>
                  </div>
                  <div className='hidden xl:block'>
                    <div className='text-sm font-medium text-white'>AlphaBot</div>
                    <div className='text-xs text-gray-400'>Elite Trader</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='flex relative z-30'>
        {/* Navigation Sidebar */}
        <Navigation
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          activeView={activeView}
          onNavigate={onNavigate}
        />

        {/* Main Content Area */}
        <main className='flex-1 min-h-screen'>
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='lg:hidden fixed inset-0 bg-black/50 z-40'
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Page Content */}
          <div className='p-6 lg:p-8'>
            <GlowCard
              variant='cyber'
              intensity='medium'
              animate={true}
              hover={false}
              className='min-h-full'
            >
              {children}
            </GlowCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
