import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  MessageCircle,
  Brain,
  Eye,
  Settings,
  BarChart3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import PropOllamaChatBox from '../shared/PropOllamaChatBox';
import AIInsightsPanel from '../enhanced/AIInsightsPanel';
import PortfolioOptimizer from '../enhanced/PortfolioOptimizer';
import SmartStackingPanel from '../enhanced/SmartStackingPanel';
import { unifiedApiService } from '../../services/unifiedApiService';
import {
  EnhancedPrediction,
  PortfolioMetrics,
  AIInsights,
  StackSuggestion,
  CorrelationMatrix,
} from '../../types/enhancedBetting';

const EnhancedLockedBetsPage: React.FC = () => {
  // Core state
  const [enhancedPredictions, setEnhancedPredictions] = useState<EnhancedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(70);
  const [isChatMinimized, setIsChatMinimized] = useState(true);

  // Enhanced features state
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | undefined>();
  const [aiInsights, setAiInsights] = useState<AIInsights[]>([]);
  const [selectedBet, setSelectedBet] = useState<EnhancedPrediction | undefined>();
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [stackingSuggestions, setStackingSuggestions] = useState<StackSuggestion[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<CorrelationMatrix>({
    players: [],
    matrix: [],
    insights: [],
  });
  const [selectedBets, setSelectedBets] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'bets' | 'portfolio' | 'insights' | 'stacking'>(
    'bets'
  );

  // Helper to validate and fix prediction data
  const validatePrediction = (bet: any): EnhancedPrediction => {
    return {
      ...bet,
      // Ensure all numeric properties have fallback values
      expected_value: bet.expected_value ?? 0,
      confidence: bet.confidence ?? 75,
      quantum_confidence: bet.quantum_confidence ?? 75,
      kelly_fraction: bet.kelly_fraction ?? 0.05,
      synergy_rating: bet.synergy_rating ?? 0.5,
      stack_potential: bet.stack_potential ?? 0.5,
      optimal_stake: bet.optimal_stake ?? 0.05,
      correlation_score: bet.correlation_score ?? 0.3,
      diversification_value: bet.diversification_value ?? 0.7,
      neural_score: bet.neural_score ?? 75,
      injury_risk: bet.injury_risk ?? 0.1,
      portfolio_impact: bet.portfolio_impact ?? 0.5,
      variance_contribution: bet.variance_contribution ?? 0.2,
      line_score: bet.line_score ?? 0,
      risk_score: bet.risk_score ?? 0.5,

      risk_assessment: bet.risk_assessment || {
        overall_risk: bet.risk_score || 0.5,
        confidence_risk: 0.2,
        line_risk: 0.2,
        market_risk: 0.2,
        risk_level:
          (bet.risk_score || 0.5) <= 0.3
            ? 'low'
            : (bet.risk_score || 0.5) <= 0.6
              ? 'medium'
              : 'high',
      },
      shap_explanation: bet.shap_explanation || {
        baseline: 0.5,
        features: {},
        prediction: bet.confidence || 75,
        top_factors: [],
      },
    };
  };

  const fetchEnhancedPredictions = async () => {
    try {
      setIsLoading(true);

      const response = await unifiedApiService.getEnhancedBets({
        sport: selectedSport !== 'ALL' ? selectedSport : undefined,
        min_confidence: minConfidence,
        include_ai_insights: true,
        include_portfolio_optimization: true,
        max_results: 50,
      });

      const predictions = (response.enhanced_bets || response.predictions || []).map(
        validatePrediction
      );
      setEnhancedPredictions(predictions);
      setPortfolioMetrics(response.portfolio_metrics);
      setAiInsights(response.ai_insights || []);

      // Generate stacking suggestions
      const stackingData = await unifiedApiService.generateStackingSuggestions(
        response.enhanced_bets || response.predictions || []
      );
      setStackingSuggestions(stackingData.suggestions);
      setCorrelationMatrix(stackingData.correlationMatrix);

      setLastUpdate(new Date());
      const dataSource = response.status === 'fallback_mode' ? 'fallback data' : 'live API';
      toast.success(
        `🚀 Loaded ${(response.enhanced_bets || response.predictions || []).length} enhanced predictions (${dataSource})`
      );
    } catch (error) {
      console.error('Error fetching enhanced predictions:', error);
      toast.error('🔌 Using fallback data - Enhanced predictions loaded');

      // Fallback to mock data for development
      const mockPredictions: EnhancedPrediction[] = [
        {
          id: 'enhanced-1',
          player_name: 'Luka Dončić',
          team: 'DAL',
          sport: 'NBA',
          stat_type: 'Points',
          line_score: 28.5,
          recommendation: 'OVER',
          confidence: 87.5,
          kelly_fraction: 0.08,
          expected_value: 2.34,
          quantum_confidence: 89.2,
          neural_score: 85.7,
          correlation_score: 0.3,
          synergy_rating: 0.8,
          stack_potential: 0.9,
          diversification_value: 0.7,
          shap_explanation: {
            baseline: 50.0,
            features: {
              recent_performance: 21.9,
              matchup_advantage: 17.5,
              historical_avg: 13.1,
              team_pace: 13.1,
              injury_status: 8.7,
              weather_conditions: 8.7,
              market_movement: 4.4,
            },
            prediction: 87.5,
            top_factors: [
              ['recent_performance', 21.9],
              ['matchup_advantage', 17.5],
              ['historical_avg', 13.1],
            ],
          },
          risk_assessment: {
            overall_risk: 0.24,
            confidence_risk: 0.14,
            line_risk: 0.2,
            market_risk: 0.2,
            risk_level: 'low',
          },
          injury_risk: 0.1,
          optimal_stake: 0.06,
          portfolio_impact: 0.8,
          variance_contribution: 0.2,
          source: 'PrizePicks',
        },
      ];

      setEnhancedPredictions(mockPredictions.map(validatePrediction));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBetSelect = (bet: EnhancedPrediction) => {
    setSelectedBet(bet);
  };

  const handleOptimizePortfolio = async (selectedBetIds: string[]) => {
    try {
      const analysis = await unifiedApiService.analyzeCustomPortfolio(
        selectedBetIds,
        investmentAmount
      );
      toast.success('Portfolio optimized successfully!');
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      toast.error('Failed to optimize portfolio');
    }
  };

  const handleStackSelect = (playerIds: string[]) => {
    setSelectedBets(new Set(playerIds));
    toast.success(`Applied stack with ${playerIds.length} players`);
  };

  useEffect(() => {
    fetchEnhancedPredictions();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchEnhancedPredictions, 30000);
    return () => clearInterval(interval);
  }, [selectedSport, minConfidence]);

  const getBetCard = (bet: EnhancedPrediction) => {
    const confidenceColor =
      bet.confidence >= 85
        ? 'text-green-400'
        : bet.confidence >= 75
          ? 'text-yellow-400'
          : 'text-orange-400';

    const overallRisk = bet.risk_assessment?.overall_risk || bet.risk_score || 0.5;
    const riskColor =
      overallRisk <= 0.3
        ? 'text-green-400'
        : overallRisk <= 0.6
          ? 'text-yellow-400'
          : 'text-red-400';

    const isSelected = selectedBets.has(bet.id);

    return (
      <div
        key={bet.id}
        className={`relative rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
          isSelected
            ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20'
            : 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10'
        }`}
        onClick={() => {
          const newSelected = new Set(selectedBets);
          if (isSelected) {
            newSelected.delete(bet.id);
          } else {
            newSelected.add(bet.id);
          }
          setSelectedBets(newSelected);
          handleBetSelect(bet);
        }}
      >
        {/* Header with Status Badges */}
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center space-x-2'>
            {bet.confidence >= 85 && (
              <div className='bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse'>
                🔥 HOT
              </div>
            )}
            <div className='px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-xs font-medium'>
              {bet.sport}
            </div>
            <div className='text-xs text-gray-400'>{bet.source}</div>
          </div>
          <div className='text-right'>
            <div className={`text-lg font-bold ${confidenceColor}`}>
              {(bet.confidence || 75).toFixed(0)}%
            </div>
            <div className='text-xs text-gray-400'>Confidence</div>
          </div>
        </div>

        {/* Player Info */}
        <div className='mb-4'>
          <div className='text-lg font-bold text-white'>{bet.player_name}</div>
          <div className='text-sm text-gray-400'>({bet.team})</div>
        </div>

        {/* Bet Details */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Stat Type</div>
            <div className='text-lg font-semibold text-white'>{bet.stat_type}</div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Line</div>
            <div className='text-lg font-semibold text-white'>{bet.line_score}</div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Recommendation</div>
            <div
              className={`text-lg font-bold ${bet.recommendation === 'OVER' ? 'text-green-400' : 'text-red-400'}`}
            >
              {bet.recommendation}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Expected Value</div>
            <div className='text-lg font-semibold text-cyan-400'>
              +{(bet.expected_value || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Enhanced Analytics */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg'>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Confidence</div>
            <div className={`text-lg font-bold ${confidenceColor}`}>
              {(bet.confidence || 75).toFixed(1)}%
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Quantum AI</div>
            <div className='text-lg font-semibold text-purple-400'>
              {(bet.quantum_confidence || 75).toFixed(1)}%
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Risk Level</div>
            <div className={`text-lg font-semibold ${riskColor}`}>
              {(
                bet.risk_assessment?.risk_level ||
                (overallRisk <= 0.3 ? 'low' : overallRisk <= 0.6 ? 'medium' : 'high')
              ).toUpperCase()}
            </div>
          </div>
          <div className='text-center'>
            <div className='text-sm text-gray-400'>Kelly %</div>
            <div className='text-lg font-semibold text-green-400'>
              {((bet.kelly_fraction || 0.05) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Portfolio Metrics */}
        <div className='grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-lg'>
          <div className='text-center'>
            <div className='text-xs text-gray-400'>Synergy</div>
            <div className='text-sm font-semibold text-blue-400'>
              {((bet.synergy_rating || 0.5) * 100).toFixed(0)}%
            </div>
          </div>
          <div className='text-center'>
            <div className='text-xs text-gray-400'>Stack Potential</div>
            <div className='text-sm font-semibold text-purple-400'>
              {((bet.stack_potential || 0.5) * 100).toFixed(0)}%
            </div>
          </div>
          <div className='text-center'>
            <div className='text-xs text-gray-400'>Optimal Stake</div>
            <div className='text-sm font-semibold text-green-400'>
              ${((bet.optimal_stake || 0.05) * investmentAmount).toFixed(0)}
            </div>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className='absolute inset-0 border-2 border-cyan-400 rounded-xl pointer-events-none'>
            <div className='absolute top-2 left-2 bg-cyan-400 text-gray-900 px-2 py-1 rounded text-xs font-bold'>
              SELECTED
            </div>
          </div>
        )}
      </div>
    );
  };

  const uniqueSports = ['ALL', ...Array.from(new Set(enhancedPredictions.map(bet => bet.sport)))];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black p-6'>
      <div className='max-w-[1800px] mx-auto'>
        {/* Enhanced Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2'>
                🚀 AI-Enhanced Locked Bets
              </h1>
              <p className='text-gray-400 mb-3'>
                Quantum AI predictions with portfolio optimization and smart stacking
              </p>
              <div className='flex items-center space-x-2'>
                <div className='px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm font-medium flex items-center space-x-2'>
                  <Brain className='w-4 h-4' />
                  <span>AI Enhanced Active</span>
                </div>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <button
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25'
              >
                <Brain className='w-4 h-4' />
                <span>{isChatMinimized ? 'Ask PropOllama' : 'Hide Chat'}</span>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              </button>
              <button
                onClick={fetchEnhancedPredictions}
                disabled={isLoading}
                className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25'
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Integrated Header with Navigation and Stats */}
          <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 mb-6'>
            {/* Top Row: View Toggle */}
            <div className='flex space-x-2 mb-4'>
              {[
                { key: 'bets', label: 'Enhanced Bets', icon: Target },
                { key: 'portfolio', label: 'Portfolio', icon: BarChart3 },
                { key: 'insights', label: 'AI Insights', icon: Brain },
                { key: 'stacking', label: 'Smart Stacking', icon: Zap },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeView === key
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Bottom Row: Inline Stats */}
            <div className='flex items-center justify-between border-t border-gray-700/30 pt-3'>
              <div className='flex items-center space-x-6'>
                <div className='flex items-center space-x-2'>
                  <Target className='w-4 h-4 text-cyan-400' />
                  <span className='text-sm text-gray-400'>Predictions:</span>
                  <span className='text-sm font-bold text-white'>{enhancedPredictions.length}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <TrendingUp className='w-4 h-4 text-green-400' />
                  <span className='text-sm text-gray-400'>Confidence:</span>
                  <span className='text-sm font-bold text-white'>
                    {enhancedPredictions.length > 0
                      ? (
                          enhancedPredictions.reduce(
                            (sum, bet) => sum + (bet.confidence || 75),
                            0
                          ) / enhancedPredictions.length
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Zap className='w-4 h-4 text-purple-400' />
                  <span className='text-sm text-gray-400'>AI Insights:</span>
                  <span className='text-sm font-bold text-white'>{aiInsights.length}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <DollarSign className='w-4 h-4 text-yellow-400' />
                  <span className='text-sm text-gray-400'>Expected Value:</span>
                  <span className='text-sm font-bold text-green-400'>
                    +
                    {enhancedPredictions.length > 0
                      ? enhancedPredictions
                          .reduce((sum, bet) => sum + (bet.expected_value || 0), 0)
                          .toFixed(2)
                      : 0}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                <span className='text-xs text-gray-400'>Live</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className='flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl'>
            <div className='flex items-center space-x-2'>
              <label className='text-sm text-gray-400'>Sport:</label>
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
            </div>
            <div className='flex items-center space-x-2'>
              <label className='text-sm text-gray-400'>Min Confidence:</label>
              <select
                value={minConfidence}
                onChange={e => setMinConfidence(Number(e.target.value))}
                className='bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2'
              >
                <option value={50}>50%+</option>
                <option value={60}>60%+</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={85}>85%+</option>
              </select>
            </div>
            <div className='text-sm text-gray-400'>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className='text-sm text-gray-400'>Selected: {selectedBets.size} bets</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='relative'>
                <div className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4'></div>
                <div
                  className='absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mx-auto'
                  style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                ></div>
              </div>
              <div className='text-xl font-semibold text-white mb-2'>
                Loading AI-Enhanced Predictions
              </div>
              <div className='text-gray-400'>
                Analyzing quantum models and portfolio optimization...
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {!isLoading && (
          <div className='grid grid-cols-12 gap-6'>
            {/* Left Column - Main Content */}
            <div className='col-span-12 lg:col-span-8'>
              {activeView === 'bets' && (
                <div className='space-y-6'>
                  {enhancedPredictions.length > 0 ? (
                    <div className='grid gap-6 md:grid-cols-1 xl:grid-cols-2'>
                      {enhancedPredictions.map(getBetCard)}
                    </div>
                  ) : (
                    <div className='text-center py-12'>
                      <Target className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-xl font-semibold text-gray-300 mb-2'>
                        No predictions found
                      </h3>
                      <p className='text-gray-400 mb-4'>
                        Try adjusting your filters or check back later for new AI predictions
                      </p>
                      <button
                        onClick={fetchEnhancedPredictions}
                        className='px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/25'
                      >
                        Refresh Data
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'portfolio' && (
                <PortfolioOptimizer
                  metrics={portfolioMetrics}
                  predictions={enhancedPredictions}
                  onOptimize={handleOptimizePortfolio}
                  investmentAmount={investmentAmount}
                  onInvestmentChange={setInvestmentAmount}
                  isLoading={isLoading}
                />
              )}

              {activeView === 'stacking' && (
                <SmartStackingPanel
                  suggestions={stackingSuggestions}
                  correlationMatrix={correlationMatrix}
                  predictions={enhancedPredictions}
                  onStackSelect={handleStackSelect}
                  selectedBets={selectedBets}
                />
              )}
            </div>

            {/* Right Column - AI Insights Panel */}
            <div className='col-span-12 lg:col-span-4'>
              {activeView === 'insights' ? (
                <AIInsightsPanel
                  insights={aiInsights}
                  predictions={enhancedPredictions}
                  selectedBet={selectedBet}
                  onBetSelect={handleBetSelect}
                />
              ) : (
                <div className='sticky top-6'>
                  <AIInsightsPanel
                    insights={aiInsights}
                    predictions={enhancedPredictions}
                    selectedBet={selectedBet}
                    onBetSelect={handleBetSelect}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PropOllama AI Chat Box */}
      {!isChatMinimized && (
        <div className='fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] z-50'>
          <div className='bg-gray-800/95 backdrop-blur-sm border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/10 transform transition-all duration-300'>
            <PropOllamaChatBox
              isMinimized={false}
              onToggleMinimize={() => setIsChatMinimized(true)}
              className='bg-transparent border-0 shadow-none'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLockedBetsPage;
