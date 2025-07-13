import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Tv,
  Monitor,
  RotateCcw,
  Volume2,
  VolumeX,
  Activity,
  Target,
  TrendingUp,
  AlertCircle,
  Eye,
  Clock,
  DollarSign,
  Zap,
  BarChart3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { unifiedApiService } from '../../services/unifiedApiService';
import { LiveGameContext, EnhancedPrediction } from '../../types/enhancedBetting';

interface LiveGame {
  id: string;
  home_team: string;
  away_team: string;
  sport: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  score?: {
    home: number;
    away: number;
  };
  time?: string;
  relevant_bets: number;
}

const EnhancedLiveStreamPage: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState('https://the.streameast.app/v91');
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const [streamBlocked, setStreamBlocked] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Enhanced features
  const [liveGames, setLiveGames] = useState<LiveGame[]>([]);
  const [gameContext, setGameContext] = useState<LiveGameContext | null>(null);
  const [relevantBets, setRelevantBets] = useState<any[]>([]);
  const [liveOpportunities, setLiveOpportunities] = useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Initialize with mock live games
    const mockGames: LiveGame[] = [
      {
        id: 'lal-bos',
        home_team: 'LAL',
        away_team: 'BOS',
        sport: 'NBA',
        status: 'in_progress',
        score: { home: 98, away: 102 },
        time: 'Q3 8:45',
        relevant_bets: 3,
      },
      {
        id: 'gsw-mia',
        home_team: 'GSW',
        away_team: 'MIA',
        sport: 'NBA',
        status: 'in_progress',
        score: { home: 85, away: 79 },
        time: 'Q3 2:15',
        relevant_bets: 2,
      },
      {
        id: 'buf-kc',
        home_team: 'BUF',
        away_team: 'KC',
        sport: 'NFL',
        status: 'in_progress',
        score: { home: 21, away: 17 },
        time: 'Q4 12:30',
        relevant_bets: 4,
      },
    ];

    setLiveGames(mockGames);
    if (!selectedGame && mockGames.length > 0) {
      setSelectedGame(mockGames[0].id);
    }

    toast.success('📺 Enhanced live stream loaded with betting context');
  }, []);

  useEffect(() => {
    if (selectedGame && autoRefresh) {
      fetchGameContext(selectedGame);

      // Auto-refresh game context every 30 seconds
      const interval = setInterval(() => {
        fetchGameContext(selectedGame);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [selectedGame, autoRefresh]);

  const fetchGameContext = async (gameId: string) => {
    try {
      const response = await unifiedApiService.getLiveGameContext(gameId, true);
      setGameContext(response.live_context);
      setRelevantBets(response.relevant_bets);
      setLiveOpportunities(response.live_opportunities);
    } catch (error) {
      console.error('Error fetching game context:', error);
      // Use mock data for development
      setGameContext({
        game_id: gameId,
        status: 'in_progress',
        current_time: 'Q3 8:45',
        score: {
          home: { team: 'LAL', score: 98 },
          away: { team: 'BOS', score: 102 },
        },
        relevant_bets: [
          {
            bet_id: 'bet-1',
            player_name: 'LeBron James',
            team: 'LAL',
            stat_type: 'Points',
            line_score: 25.5,
            current_performance: 18,
            pace_to_hit: 'ON_PACE',
            confidence: 87.5,
            live_adjustment: 2.3,
          },
        ],
        live_opportunities: [
          {
            type: 'LIVE_ADJUST',
            description: 'LeBron James showing strong scoring pace',
            confidence: 89.8,
            recommended_action: 'INCREASE_STAKE',
          },
        ],
        last_update: new Date().toISOString(),
      });
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setStreamBlocked(false);
    setLoadAttempts(prev => prev + 1);

    const iframe = document.getElementById('stream-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }

    // Check if still loading after 10 seconds
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setStreamBlocked(true);
        toast.error('Stream may be blocked - try opening in new tab');
      }
    }, 10000);
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('stream-iframe') as HTMLIFrameElement;
    if (iframe) {
      if (!isFullscreen) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const openInNewTab = () => {
    window.open(streamUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUrlChange = () => {
    if (tempUrl.trim()) {
      setStreamUrl(tempUrl.trim());
      setShowUrlEditor(false);
      setTempUrl('');
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
      toast.success('Stream URL updated!');
    }
  };

  const openUrlEditor = () => {
    setTempUrl(streamUrl);
    setShowUrlEditor(true);
  };

  const streamPresets = [
    { name: 'StreamEast v91', url: 'https://the.streameast.app/v91' },
    { name: 'StreamEast Main', url: 'https://the.streameast.app' },
    { name: 'SportSurge', url: 'https://sportsurge.net' },
    { name: 'ESPN', url: 'https://www.espn.com/watch' },
  ];

  const handlePresetUrl = (url: string) => {
    setStreamUrl(url);
    setTempUrl('');
    setShowUrlEditor(false);
    setIsLoading(true);
    setStreamBlocked(false);
    setLoadAttempts(0);
    setTimeout(() => setIsLoading(false), 3000);
    toast.success('Stream URL updated!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'text-green-400';
      case 'scheduled':
        return 'text-yellow-400';
      case 'completed':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'ON_PACE':
        return 'text-green-400';
      case 'AHEAD_PACE':
        return 'text-blue-400';
      case 'BEHIND_PACE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INCREASE_STAKE':
        return 'text-green-400';
      case 'HOLD':
        return 'text-yellow-400';
      case 'CONSIDER_EXIT':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 p-6'>
      <div className='max-w-[1800px] mx-auto'>
        {/* Enhanced Header */}
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2'>
                📺 Live Stream Intelligence
              </h1>
              <p className='text-gray-400'>
                Watch live games with real-time betting context and opportunities
              </p>
            </div>

            <div className='flex items-center space-x-3'>
              <button
                onClick={() => setShowOverlay(!showOverlay)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showOverlay
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Eye className='w-4 h-4' />
                <span>{showOverlay ? 'Hide' : 'Show'} Overlay</span>
              </button>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                <span>Auto-Refresh</span>
              </button>

              <button
                onClick={handleReload}
                className='flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors'
              >
                <RotateCcw className='w-4 h-4' />
                <span>Reload</span>
              </button>

              <button
                onClick={openUrlEditor}
                className='flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
              >
                <Monitor className='w-4 h-4' />
                <span>Change URL</span>
              </button>

              <button
                onClick={openInNewTab}
                className='flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                <span>New Tab</span>
              </button>
            </div>
          </div>

          {/* Live Games Dashboard */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            {liveGames.map(game => (
              <motion.div
                key={game.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedGame === game.id
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedGame(game.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        game.status === 'in_progress'
                          ? 'bg-green-400 animate-pulse'
                          : game.status === 'scheduled'
                            ? 'bg-yellow-400'
                            : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className='text-sm font-medium text-white'>{game.sport}</span>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(game.status)}`}>
                    {game.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className='text-center mb-2'>
                  <div className='text-lg font-bold text-white'>
                    {game.away_team} @ {game.home_team}
                  </div>
                  {game.score && (
                    <div className='text-2xl font-bold text-cyan-400'>
                      {game.score.away} - {game.score.home}
                    </div>
                  )}
                  {game.time && <div className='text-sm text-gray-400'>{game.time}</div>}
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-1'>
                    <Target className='w-4 h-4 text-purple-400' />
                    <span className='text-sm text-gray-400'>{game.relevant_bets} bets</span>
                  </div>
                  {selectedGame === game.id && (
                    <div className='px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium'>
                      WATCHING
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* URL Editor Modal */}
        <AnimatePresence>
          {showUrlEditor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
              onClick={() => setShowUrlEditor(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className='bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md'
                onClick={e => e.stopPropagation()}
              >
                <h3 className='text-xl font-bold text-white mb-4'>Change Stream URL</h3>

                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>Stream URL</label>
                  <input
                    type='url'
                    value={tempUrl}
                    onChange={e => setTempUrl(e.target.value)}
                    className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                    placeholder='Enter stream URL...'
                    autoFocus
                  />
                </div>

                <div className='mb-4'>
                  <p className='text-sm text-gray-400'>
                    Current URL: <span className='text-cyan-400'>{streamUrl}</span>
                  </p>
                </div>

                <div className='flex space-x-3'>
                  <button
                    onClick={handleUrlChange}
                    className='flex-1 py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors'
                  >
                    Update URL
                  </button>
                  <button
                    onClick={() => setShowUrlEditor(false)}
                    className='flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className='grid grid-cols-12 gap-6'>
          {/* Enhanced Stream Area */}
          <div className='col-span-12 lg:col-span-8'>
            <div className='relative bg-black rounded-lg overflow-hidden border border-gray-700 shadow-2xl'>
              {/* Stream Controls Bar */}
              <div className='absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                      <span className='text-white text-sm font-medium'>LIVE</span>
                    </div>
                    <div className='text-gray-300 text-sm'>
                      {streamUrl.includes('streameast') ? 'StreamEast' : 'Live Stream'}
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className='p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors'
                    >
                      {isMuted ? (
                        <VolumeX className='h-4 w-4 text-white' />
                      ) : (
                        <Volume2 className='h-4 w-4 text-white' />
                      )}
                    </button>

                    <button
                      onClick={handleFullscreen}
                      className='p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors'
                    >
                      <Monitor className='h-4 w-4 text-white' />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className='absolute inset-0 bg-gray-900/95 flex items-center justify-center z-20'>
                  <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-6'></div>
                    <div className='text-white text-lg font-medium mb-2'>Loading Stream</div>
                    <div className='text-gray-400 text-sm'>
                      Connecting to{' '}
                      {streamUrl.includes('streameast') ? 'StreamEast' : 'streaming service'}...
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {(streamBlocked || loadAttempts > 2) && !isLoading && (
                <div className='absolute bottom-4 left-4 right-4 z-25'>
                  <div className='bg-red-900/80 backdrop-blur-sm border border-red-500/50 rounded-lg p-4'>
                    <div className='text-red-300 text-sm mb-2 text-center'>
                      ⚠️ Stream Blocked or Unavailable
                    </div>
                    <div className='text-gray-300 text-xs mb-3 text-center'>
                      Many streaming sites block iframe embedding for security.
                    </div>

                    <div className='grid grid-cols-1 gap-2 mb-3'>
                      <button
                        onClick={openInNewTab}
                        className='w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded transition-colors flex items-center justify-center gap-2'
                      >
                        <ExternalLink className='h-4 w-4' />
                        Open in New Tab (Recommended)
                      </button>

                      <div className='grid grid-cols-2 gap-2'>
                        <button
                          onClick={openUrlEditor}
                          className='px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors'
                        >
                          Try Different URL
                        </button>
                        <button
                          onClick={handleReload}
                          className='px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors'
                        >
                          Retry ({loadAttempts}/3)
                        </button>
                      </div>
                    </div>

                    <div className='text-gray-400 text-xs text-center'>
                      💡 Tip: For best streaming experience, open in a dedicated browser tab
                    </div>
                  </div>
                </div>
              )}

              {/* Betting Context Overlay */}
              <AnimatePresence>
                {showOverlay && gameContext && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='absolute top-16 left-4 right-4 z-20 pointer-events-none'
                  >
                    <div className='bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4'>
                      <div className='grid grid-cols-3 gap-4'>
                        {/* Game Info */}
                        <div className='text-center'>
                          <div className='text-xs text-gray-400 mb-1'>Current Game</div>
                          <div className='text-lg font-bold text-white'>
                            {gameContext.score.away.team} {gameContext.score.away.score} -{' '}
                            {gameContext.score.home.score} {gameContext.score.home.team}
                          </div>
                          <div className='text-sm text-cyan-400'>{gameContext.current_time}</div>
                        </div>

                        {/* Active Bets */}
                        <div className='text-center'>
                          <div className='text-xs text-gray-400 mb-1'>Active Bets</div>
                          <div className='text-2xl font-bold text-green-400'>
                            {relevantBets.length}
                          </div>
                          <div className='text-xs text-gray-400'>Tracking performance</div>
                        </div>

                        {/* Live Opportunities */}
                        <div className='text-center'>
                          <div className='text-xs text-gray-400 mb-1'>Opportunities</div>
                          <div className='text-2xl font-bold text-purple-400'>
                            {liveOpportunities.length}
                          </div>
                          <div className='text-xs text-gray-400'>Live adjustments</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Video Stream Container */}
              <div className='relative w-full' style={{ aspectRatio: '16/9' }}>
                <iframe
                  id='stream-iframe'
                  src={streamUrl}
                  className='absolute inset-0 w-full h-full border-0'
                  title='Live Sports Stream'
                  allowFullScreen
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
                  referrerPolicy='no-referrer-when-downgrade'
                  sandbox='allow-scripts allow-same-origin allow-presentation allow-forms'
                  onLoad={() => {
                    setIsLoading(false);
                    setStreamBlocked(false);
                    console.log('Stream loaded successfully');
                    toast.success('Stream connected successfully!');
                  }}
                  onError={e => {
                    setIsLoading(false);
                    setStreamBlocked(true);
                    console.error('Stream failed to load:', e);
                    toast.error('Stream blocked or unavailable');
                  }}
                />
              </div>

              {/* Alternative Loading Message for Blocked Content */}
              {!isLoading && (
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                  <div className='text-center text-white/50 p-8'>
                    <Tv className='h-16 w-16 mx-auto mb-4 opacity-30' />
                    <div className='text-lg font-medium mb-2'>Stream Content</div>
                    <div className='text-sm'>
                      If the stream doesn't appear, the site may block embedding.
                      <br />
                      Use "Open in New Tab" for the best viewing experience.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Context Panel */}
          <div className='col-span-12 lg:col-span-4 space-y-6'>
            {/* Relevant Bets */}
            <div className='bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-bold text-white flex items-center space-x-2'>
                  <Target className='w-5 h-5 text-green-400' />
                  <span>Live Bet Tracking</span>
                </h3>
                <div className='px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium'>
                  {relevantBets.length} Active
                </div>
              </div>

              <div className='space-y-3'>
                {relevantBets.length > 0 ? (
                  relevantBets.map((bet, index) => (
                    <div
                      key={index}
                      className='p-3 bg-gray-700/30 rounded-lg border border-gray-600/50'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <div className='font-medium text-white'>{bet.player_name}</div>
                        <div className={`text-sm font-semibold ${getPaceColor(bet.pace_to_hit)}`}>
                          {bet.pace_to_hit.replace('_', ' ')}
                        </div>
                      </div>

                      <div className='text-sm text-gray-400 mb-2'>
                        {bet.stat_type} • Line: {bet.line_score}
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-300'>
                          Current:{' '}
                          <span className='text-cyan-400 font-medium'>
                            {bet.current_performance}
                          </span>
                        </div>
                        <div className='text-sm text-gray-300'>
                          Confidence:{' '}
                          <span className='text-green-400 font-medium'>
                            {bet.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {bet.live_adjustment !== 0 && (
                        <div className='mt-2 text-xs text-purple-400'>
                          Live adjustment: {bet.live_adjustment > 0 ? '+' : ''}
                          {bet.live_adjustment.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className='text-center py-6'>
                    <Target className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                    <p className='text-gray-400 text-sm'>No active bets for this game</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Opportunities */}
            <div className='bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-purple-500/30 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-bold text-white flex items-center space-x-2'>
                  <Zap className='w-5 h-5 text-purple-400' />
                  <span>Live Opportunities</span>
                </h3>
                <div className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium'>
                  {liveOpportunities.length} Available
                </div>
              </div>

              <div className='space-y-3'>
                {liveOpportunities.length > 0 ? (
                  liveOpportunities.map((opp, index) => (
                    <div
                      key={index}
                      className='p-3 bg-gray-700/30 rounded-lg border border-gray-600/50'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='text-sm font-medium text-white'>{opp.description}</div>
                        <div
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            opp.recommended_action === 'INCREASE_STAKE'
                              ? 'bg-green-500/20 text-green-400'
                              : opp.recommended_action === 'HOLD'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {opp.recommended_action.replace('_', ' ')}
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='text-sm text-gray-400'>{opp.type}</div>
                        <div className='text-sm text-purple-400 font-medium'>
                          {opp.confidence.toFixed(1)}% confidence
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-6'>
                    <Zap className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                    <p className='text-gray-400 text-sm'>No live opportunities detected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Info */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-2'>
                  <Tv className='w-4 h-4 text-cyan-400' />
                  <span className='text-sm text-gray-400'>Stream Source</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  <span className='text-green-400 text-xs font-medium'>Live</span>
                </div>
              </div>

              <div className='text-white text-sm font-medium mb-2'>{streamUrl}</div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className='p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors'
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className='w-4 h-4' /> : <Volume2 className='w-4 h-4' />}
                </button>

                <button
                  onClick={handleFullscreen}
                  className='p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors'
                  title='Fullscreen'
                >
                  <Monitor className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-white mb-3'>⚡ Quick Actions</h4>
              <div className='space-y-2'>
                <button
                  onClick={() => (window.location.href = '/?page=locked-bets')}
                  className='w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors'
                >
                  <div className='text-cyan-400 text-sm font-medium'>🎯 View All Bets</div>
                </button>
                <button
                  onClick={() => (window.location.href = '/?page=settings')}
                  className='w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors'
                >
                  <div className='text-cyan-400 text-sm font-medium'>⚙️ Settings</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className='mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4'>
          <div className='flex items-start space-x-3'>
            <AlertCircle className='w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5' />
            <div>
              <div className='text-yellow-400 font-medium text-sm mb-1'>
                Enhanced Stream Disclaimer
              </div>
              <div className='text-gray-300 text-sm'>
                Live betting context and opportunities are provided for informational purposes.
                Real-time data may have delays. A1Betting is not responsible for external streaming
                content or betting decisions based on this information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLiveStreamPage;
