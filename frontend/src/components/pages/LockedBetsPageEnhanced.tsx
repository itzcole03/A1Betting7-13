import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  MessageCircle,
  Filter,
  ChevronDown,
  Star,
  Award,
  Clock,
  Activity,
  BarChart3,
  Trophy,
  Sparkles,
  Brain,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PropOllamaChatBox from '../shared/PropOllamaChatBox';

interface LockedBet {
  id: string;
  player_name: string;
  team: string;
  sport: string;
  stat_type: string;
  line_score: number;
  recommendation: 'OVER' | 'UNDER';
  confidence: number;
  ensemble_confidence: number;
  win_probability: number;
  expected_value: number;
  kelly_fraction: number;
  risk_score: number;
  source: string;
  opponent?: string;
  venue?: string;
  ai_explanation?: {
    explanation: string;
    key_factors: string[];
    risk_level: string;
  };
  value_rating: number;
  kelly_percentage: number;
}

const LockedBetsPageEnhanced: React.FC = () => {
  const [lockedBets, setLockedBets] = useState<LockedBet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(70);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [sortBy, setSortBy] = useState<'confidence' | 'value' | 'risk'>('confidence');
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchLockedBets = async () => {
    try {
      setIsLoading(true);

      // Build API URL with filters
      const params = new URLSearchParams();
      if (selectedSport !== 'ALL') {
        params.append('sport', selectedSport);
      }
      params.append('min_confidence', minConfidence.toString());
      params.append('enhanced', 'true');

      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://localhost:8000/api/prizepicks/props?${params}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Sort by confidence and expected value
      const sortedBets = data.sort((a: LockedBet, b: LockedBet) => {
        return b.ensemble_confidence * b.expected_value - a.ensemble_confidence * a.expected_value;
      });

      setLockedBets(sortedBets);
      setLastUpdate(new Date());
      toast.success(`🎯 Loaded ${sortedBets.length} locked bets with ML predictions`);
    } catch (error) {
      console.error('Error fetching locked bets:', error);

      // If backend is unavailable, show mock data
      if (
        error instanceof Error &&
        (error.name === 'AbortError' || error.message.includes('fetch'))
      ) {
        console.log('Backend unavailable, using mock data...');
        toast.error('🔌 Backend offline - Using demo data');

        // Enhanced mock data with more variety
        const mockBets: LockedBet[] = [
          {
            id: 'mock-1',
            player_name: 'Luka Dončić',
            team: 'DAL',
            sport: 'NBA',
            stat_type: 'Points',
            line_score: 28.5,
            recommendation: 'OVER',
            confidence: 91.2,
            ensemble_confidence: 91.2,
            win_probability: 0.845,
            expected_value: 3.24,
            kelly_fraction: 0.12,
            risk_score: 18,
            source: 'PrizePicks',
            opponent: 'LAL',
            venue: 'American Airlines Center',
            ai_explanation: {
              explanation:
                'Exceptional scoring form vs Lakers defense. High pace game expected with over/under at 238.5. Dončić averages 32.1 PPG in last 10 games.',
              key_factors: [
                'Recent scoring surge',
                'Pace advantage',
                'Defensive matchup',
                'Rest advantage',
              ],
              risk_level: 'Low',
            },
            value_rating: 9.1,
            kelly_percentage: 12.3,
          },
          {
            id: 'mock-2',
            player_name: 'Josh Allen',
            team: 'BUF',
            sport: 'NFL',
            stat_type: 'Passing Yards',
            line_score: 267.5,
            recommendation: 'OVER',
            confidence: 86.7,
            ensemble_confidence: 86.7,
            win_probability: 0.783,
            expected_value: 2.45,
            kelly_fraction: 0.09,
            risk_score: 28,
            source: 'PrizePicks',
            opponent: 'MIA',
            venue: 'Highmark Stadium',
            ai_explanation: {
              explanation:
                'Perfect weather conditions for passing. Miami ranks 28th in pass defense allowing 267.8 YPG. Allen has exceeded this line in 7/10 home games.',
              key_factors: [
                'Weather conditions',
                'Pass defense ranking',
                'Home performance',
                'Divisional matchup',
              ],
              risk_level: 'Medium',
            },
            value_rating: 8.7,
            kelly_percentage: 9.2,
          },
          {
            id: 'mock-3',
            player_name: 'Connor McDavid',
            team: 'EDM',
            sport: 'NHL',
            stat_type: 'Points',
            line_score: 1.5,
            recommendation: 'OVER',
            confidence: 88.9,
            ensemble_confidence: 88.9,
            win_probability: 0.801,
            expected_value: 2.78,
            kelly_fraction: 0.11,
            risk_score: 22,
            source: 'PrizePicks',
            opponent: 'CGY',
            venue: 'Rogers Place',
            ai_explanation: {
              explanation:
                'McDavid has recorded 2+ points in 8 of last 10 games vs Calgary. Power play opportunities expected in this rivalry matchup.',
              key_factors: [
                'Historical vs opponent',
                'Power play upside',
                'Home ice advantage',
                'Line chemistry',
              ],
              risk_level: 'Low',
            },
            value_rating: 8.9,
            kelly_percentage: 10.8,
          },
        ].filter(
          bet =>
            (selectedSport === 'ALL' || bet.sport === selectedSport) &&
            bet.ensemble_confidence >= minConfidence
        );

        setLockedBets(mockBets);
        setLastUpdate(new Date());
      } else {
        toast.error('Failed to load locked bets');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLockedBets();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchLockedBets, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedSport, minConfidence, autoRefresh]);

  // Sort bets based on selected criteria
  const sortedBets = [...lockedBets].sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.ensemble_confidence - a.ensemble_confidence;
      case 'value':
        return b.expected_value - a.expected_value;
      case 'risk':
        return a.risk_score - b.risk_score;
      default:
        return b.ensemble_confidence - a.ensemble_confidence;
    }
  });

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90)
      return {
        text: '🔥 ELITE',
        color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      };
    if (confidence >= 85)
      return {
        text: '⭐ PREMIUM',
        color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      };
    if (confidence >= 80)
      return { text: '✅ STRONG', color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' };
    return { text: '📊 GOOD', color: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' };
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 20) return { text: 'LOW RISK', color: 'text-green-400 bg-green-500/10' };
    if (riskScore <= 40) return { text: 'MEDIUM RISK', color: 'text-yellow-400 bg-yellow-500/10' };
    return { text: 'HIGH RISK', color: 'text-red-400 bg-red-500/10' };
  };

  const getBetCard = (bet: LockedBet, index: number) => {
    const confidenceBadge = getConfidenceBadge(bet.ensemble_confidence);
    const riskBadge = getRiskBadge(bet.risk_score);

    return (
      <div
        key={bet.id}
        className='group relative bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-1'
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Premium Indicator */}
        {bet.ensemble_confidence >= 90 && (
          <div className='absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg'>
            <Sparkles className='w-3 h-3' />
            <span>ELITE</span>
          </div>
        )}

        {/* Header */}
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='flex items-center space-x-3 mb-2'>
              <h3 className='text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors'>
                {bet.player_name}
              </h3>
              <div className='flex items-center space-x-2'>
                <span className='px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm font-medium'>
                  {bet.team}
                </span>
                <span className='px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-sm font-medium'>
                  {bet.sport}
                </span>
              </div>
            </div>

            <div className='flex items-center space-x-4 text-sm text-gray-400'>
              <span className='flex items-center space-x-1'>
                <Target className='w-4 h-4' />
                <span>{bet.stat_type}</span>
              </span>
              {bet.opponent && (
                <span className='flex items-center space-x-1'>
                  <Shield className='w-4 h-4' />
                  <span>vs {bet.opponent}</span>
                </span>
              )}
              {bet.venue && (
                <span className='flex items-center space-x-1'>
                  <Activity className='w-4 h-4' />
                  <span>@ {bet.venue}</span>
                </span>
              )}
            </div>
          </div>

          <div className='text-right'>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${confidenceBadge.color} mb-2`}
            >
              {confidenceBadge.text}
            </div>
            <div className='text-sm text-gray-400'>{bet.source}</div>
          </div>
        </div>

        {/* Main Betting Info */}
        <div className='bg-gray-900/50 rounded-lg p-4 mb-4'>
          <div className='grid grid-cols-3 gap-4 text-center'>
            <div>
              <div className='text-sm text-gray-400 mb-1'>Line</div>
              <div className='text-2xl font-bold text-white'>{bet.line_score}</div>
            </div>
            <div>
              <div className='text-sm text-gray-400 mb-1'>Recommendation</div>
              <div
                className={`text-2xl font-bold ${
                  bet.recommendation === 'OVER'
                    ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                    : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}
              >
                {bet.recommendation}
              </div>
            </div>
            <div>
              <div className='text-sm text-gray-400 mb-1'>Expected Value</div>
              <div className='text-2xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'>
                +{bet.expected_value.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
          <div className='bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-3 text-center'>
            <div className='flex items-center justify-center mb-1'>
              <Brain className='w-4 h-4 text-cyan-400 mr-1' />
              <span className='text-xs text-gray-400'>ML Confidence</span>
            </div>
            <div className='text-lg font-bold text-cyan-400'>
              {bet.ensemble_confidence.toFixed(1)}%
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5 mt-1'>
              <div
                className='bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full'
                style={{ width: `${bet.ensemble_confidence}%` }}
              />
            </div>
          </div>

          <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-3 text-center'>
            <div className='flex items-center justify-center mb-1'>
              <TrendingUp className='w-4 h-4 text-green-400 mr-1' />
              <span className='text-xs text-gray-400'>Win Probability</span>
            </div>
            <div className='text-lg font-bold text-green-400'>
              {(bet.win_probability * 100).toFixed(1)}%
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5 mt-1'>
              <div
                className='bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full'
                style={{ width: `${bet.win_probability * 100}%` }}
              />
            </div>
          </div>

          <div className='bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-lg p-3 text-center'>
            <div className='flex items-center justify-center mb-1'>
              <BarChart3 className='w-4 h-4 text-purple-400 mr-1' />
              <span className='text-xs text-gray-400'>Kelly %</span>
            </div>
            <div className='text-lg font-bold text-purple-400'>
              {bet.kelly_percentage.toFixed(1)}%
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5 mt-1'>
              <div
                className='bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full'
                style={{ width: `${Math.min(bet.kelly_percentage * 5, 100)}%` }}
              />
            </div>
          </div>

          <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-3 text-center'>
            <div className='flex items-center justify-center mb-1'>
              <AlertTriangle className='w-4 h-4 text-yellow-400 mr-1' />
              <span className='text-xs text-gray-400'>Risk Score</span>
            </div>
            <div className={`text-lg font-bold ${riskBadge.color.split(' ')[0]}`}>
              {bet.risk_score.toFixed(0)}/100
            </div>
            <div className='w-full bg-gray-700 rounded-full h-1.5 mt-1'>
              <div
                className={`h-1.5 rounded-full ${
                  bet.risk_score <= 20
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                    : bet.risk_score <= 40
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${bet.risk_score}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Explanation */}
        {bet.ai_explanation && (
          <div className='bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg p-4'>
            <div className='flex items-start space-x-3'>
              <div className='p-2 bg-blue-500/20 rounded-lg'>
                <Brain className='w-4 h-4 text-blue-400' />
              </div>
              <div className='flex-1'>
                <h4 className='text-sm font-semibold text-blue-400 mb-2'>AI Analysis</h4>
                <p className='text-sm text-gray-300 mb-3'>{bet.ai_explanation.explanation}</p>

                {bet.ai_explanation.key_factors && bet.ai_explanation.key_factors.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {bet.ai_explanation.key_factors.map((factor, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20'
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Risk Badge */}
        <div className='mt-4 flex justify-between items-center'>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${riskBadge.color}`}>
            {riskBadge.text}
          </div>
          <div className='text-xs text-gray-400'>
            Value Rating: {bet.value_rating.toFixed(1)}/10
          </div>
        </div>
      </div>
    );
  };

  const uniqueSports = ['ALL', ...Array.from(new Set(lockedBets.map(bet => bet.sport)))];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent'></div>
      <div className='absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl'></div>
      <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl'></div>

      <div className='relative z-10 p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Enhanced Header */}
          <div className='mb-8'>
            <div className='text-center mb-8'>
              <div className='inline-flex items-center space-x-3 mb-4'>
                <div className='p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl'>
                  <Trophy className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h1 className='text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent'>
                    Elite Locked Bets
                  </h1>
                  <p className='text-lg text-gray-400'>AI-Powered Sports Betting Intelligence</p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className='flex items-center justify-center space-x-6 mb-6'>
                <div className='flex items-center space-x-2 px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-full border border-cyan-500/30'>
                  <Brain className='w-4 h-4' />
                  <span className='text-sm font-medium'>PropOllama AI Active</span>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                </div>
                <div className='flex items-center space-x-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-full border border-green-500/30'>
                  <Activity className='w-4 h-4' />
                  <span className='text-sm font-medium'>Real-time Data</span>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                </div>
                <div className='flex items-center space-x-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full border border-purple-500/30'>
                  <Target className='w-4 h-4' />
                  <span className='text-sm font-medium'>ML Ensemble</span>
                  <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Dashboard */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
              <div className='bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 text-center'>
                <div className='flex items-center justify-center mb-3'>
                  <div className='p-2 bg-cyan-500/20 rounded-lg'>
                    <Target className='w-6 h-6 text-cyan-400' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-1'>{sortedBets.length}</div>
                <div className='text-sm text-gray-400'>Active Bets</div>
              </div>

              <div className='bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center'>
                <div className='flex items-center justify-center mb-3'>
                  <div className='p-2 bg-green-500/20 rounded-lg'>
                    <TrendingUp className='w-6 h-6 text-green-400' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-1'>
                  {sortedBets.length > 0
                    ? (
                        sortedBets.reduce((sum, bet) => sum + bet.ensemble_confidence, 0) /
                        sortedBets.length
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className='text-sm text-gray-400'>Avg Confidence</div>
              </div>

              <div className='bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 text-center'>
                <div className='flex items-center justify-center mb-3'>
                  <div className='p-2 bg-yellow-500/20 rounded-lg'>
                    <Zap className='w-6 h-6 text-yellow-400' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-1'>
                  {sortedBets.filter(bet => bet.ensemble_confidence >= 90).length}
                </div>
                <div className='text-sm text-gray-400'>Elite Tier</div>
              </div>

              <div className='bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-6 text-center'>
                <div className='flex items-center justify-center mb-3'>
                  <div className='p-2 bg-purple-500/20 rounded-lg'>
                    <DollarSign className='w-6 h-6 text-purple-400' />
                  </div>
                </div>
                <div className='text-3xl font-bold text-white mb-1'>
                  +
                  {sortedBets.length > 0
                    ? (
                        sortedBets.reduce((sum, bet) => sum + bet.expected_value, 0) /
                        sortedBets.length
                      ).toFixed(2)
                    : 0}
                </div>
                <div className='text-sm text-gray-400'>Avg EV</div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8'>
              <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className='flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors'
                  >
                    <Filter className='w-4 h-4' />
                    <span>Filters</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showFilters && (
                    <div className='flex items-center space-x-4'>
                      <select
                        value={selectedSport}
                        onChange={e => setSelectedSport(e.target.value)}
                        className='bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2'
                      >
                        {uniqueSports.map(sport => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>

                      <select
                        value={minConfidence}
                        onChange={e => setMinConfidence(Number(e.target.value))}
                        className='bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2'
                      >
                        <option value={50}>50%+ Confidence</option>
                        <option value={70}>70%+ Confidence</option>
                        <option value={80}>80%+ Confidence</option>
                        <option value={85}>85%+ Confidence</option>
                        <option value={90}>90%+ Elite</option>
                      </select>

                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as 'confidence' | 'value' | 'risk')}
                        className='bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2'
                      >
                        <option value='confidence'>Sort by Confidence</option>
                        <option value='value'>Sort by Expected Value</option>
                        <option value='risk'>Sort by Risk (Low to High)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='autoRefresh'
                      checked={autoRefresh}
                      onChange={e => setAutoRefresh(e.target.checked)}
                      className='rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500'
                    />
                    <label htmlFor='autoRefresh' className='text-sm text-gray-400'>
                      Auto-refresh
                    </label>
                  </div>

                  <button
                    onClick={fetchLockedBets}
                    disabled={isLoading}
                    className='flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25'
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <div className='text-sm text-gray-400'>
                    <Clock className='w-4 h-4 inline mr-1' />
                    {lastUpdate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className='flex items-center justify-center py-20'>
              <div className='text-center'>
                <div className='relative'>
                  <div className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4'></div>
                  <div
                    className='absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto'
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                  ></div>
                </div>
                <div className='text-xl font-semibold text-white mb-2'>Loading Elite Bets</div>
                <div className='text-gray-400'>Analyzing ML predictions and market data...</div>
              </div>
            </div>
          )}

          {/* Enhanced Bets Grid */}
          {!isLoading && sortedBets.length > 0 && (
            <div className='grid gap-6 lg:grid-cols-2 xl:grid-cols-3'>
              {sortedBets.map((bet, index) => getBetCard(bet, index))}
            </div>
          )}

          {/* Enhanced No Results */}
          {!isLoading && sortedBets.length === 0 && (
            <div className='text-center py-20'>
              <div className='relative mb-8'>
                <Target className='w-24 h-24 text-gray-400 mx-auto' />
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl'></div>
              </div>
              <h3 className='text-2xl font-bold text-gray-300 mb-4'>No Elite Bets Found</h3>
              <p className='text-gray-400 mb-8 max-w-md mx-auto'>
                Adjust your filters or check back later for new ML-powered predictions and
                opportunities.
              </p>
              <div className='flex items-center justify-center space-x-4'>
                <button
                  onClick={fetchLockedBets}
                  className='px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25'
                >
                  Refresh Data
                </button>
                <button
                  onClick={() => setMinConfidence(50)}
                  className='px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors'
                >
                  Lower Confidence Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced PropOllama AI Chat Box */}
        {isChatMinimized ? (
          <div className='fixed bottom-6 right-6 z-50'>
            <button
              onClick={() => setIsChatMinimized(false)}
              className='group relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/25'
            >
              <MessageCircle className='w-6 h-6' />
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse'></div>

              {/* Tooltip */}
              <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                Ask PropOllama AI
                <div className='absolute top-full right-4 w-2 h-2 bg-gray-800 rotate-45'></div>
              </div>
            </button>
          </div>
        ) : (
          <div className='fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50'>
            <div className='bg-gray-800/95 backdrop-blur-sm border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10'>
              <PropOllamaChatBox
                isMinimized={false}
                onToggleMinimize={() => setIsChatMinimized(true)}
                className='bg-transparent border-0 shadow-none'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockedBetsPageEnhanced;
