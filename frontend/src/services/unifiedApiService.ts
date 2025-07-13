/**
 * Unified API Service
 *
 * Service for interacting with the unified backend API that combines
 * PrizePicks, MoneyMaker, and Lineup Builder functionality
 */

import {
  EnhancedBetsResponse,
  PortfolioMetrics,
  AIInsights,
  LiveGameContext,
  MultiPlatformOpportunity,
  PortfolioAnalysis,
  StackSuggestion,
  CorrelationMatrix,
} from '../types/enhancedBetting';

class UnifiedApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = 'http://localhost:8000/api/unified';
    this.timeout = 10000; // 10 seconds
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get enhanced betting predictions with AI insights and portfolio optimization
   */
  async getEnhancedBets(
    params: {
      sport?: string;
      min_confidence?: number;
      include_ai_insights?: boolean;
      include_portfolio_optimization?: boolean;
      max_results?: number;
    } = {}
  ): Promise<EnhancedBetsResponse> {
    const searchParams = new URLSearchParams();

    if (params.sport) searchParams.append('sport', params.sport);
    if (params.min_confidence)
      searchParams.append('min_confidence', params.min_confidence.toString());
    if (params.include_ai_insights !== undefined)
      searchParams.append('include_ai_insights', params.include_ai_insights.toString());
    if (params.include_portfolio_optimization !== undefined)
      searchParams.append(
        'include_portfolio_optimization',
        params.include_portfolio_optimization.toString()
      );
    if (params.max_results) searchParams.append('max_results', params.max_results.toString());

    const response = await this.fetchWithTimeout(`${this.baseUrl}/enhanced-bets?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch enhanced bets: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get portfolio optimization recommendations
   */
  async getPortfolioOptimization(
    params: {
      sport?: string;
      min_confidence?: number;
      max_positions?: number;
    } = {}
  ): Promise<{
    portfolio_metrics: PortfolioMetrics;
    optimization_recommendations: any[];
    risk_assessment: any;
    status: string;
  }> {
    const searchParams = new URLSearchParams();

    if (params.sport) searchParams.append('sport', params.sport);
    if (params.min_confidence)
      searchParams.append('min_confidence', params.min_confidence.toString());
    if (params.max_positions) searchParams.append('max_positions', params.max_positions.toString());

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/portfolio-optimization?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch portfolio optimization: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Analyze a custom portfolio of bets
   */
  async analyzeCustomPortfolio(
    betIds: string[],
    investmentAmount: number = 1000
  ): Promise<PortfolioAnalysis> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/portfolio/analyze?investment_amount=${investmentAmount}`,
      {
        method: 'POST',
        body: JSON.stringify(betIds),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to analyze portfolio: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get AI-powered insights and explanations
   */
  async getAIInsights(
    params: {
      sport?: string;
      min_confidence?: number;
    } = {}
  ): Promise<{
    ai_insights: Array<{
      bet_id: string;
      player_name: string;
      sport: string;
      confidence: number;
      quantum_analysis: string;
      neural_patterns: string[];
      shap_explanation: any;
      risk_factors: string[];
      opportunity_score: number;
      market_edge: number;
      confidence_reasoning: string;
      key_factors: Array<[string, number]>;
    }>;
    summary: {
      total_opportunities: number;
      average_opportunity_score: number;
      total_market_edge: number;
      quantum_analysis_available: boolean;
      neural_patterns_detected: number;
      high_confidence_bets: number;
    };
    market_intelligence: {
      inefficiencies_detected: number;
      pattern_strength: string;
      recommendation: string;
    };
  }> {
    const searchParams = new URLSearchParams();

    if (params.sport) searchParams.append('sport', params.sport);
    if (params.min_confidence)
      searchParams.append('min_confidence', params.min_confidence.toString());

    const response = await this.fetchWithTimeout(`${this.baseUrl}/ai-insights?${searchParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch AI insights: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get live game context for streaming integration
   */
  async getLiveGameContext(
    gameId: string,
    includeBettingOpportunities: boolean = true
  ): Promise<{
    live_context: LiveGameContext;
    relevant_bets: any[];
    live_opportunities: any[];
    alerts: any[];
    next_update: string;
  }> {
    const searchParams = new URLSearchParams();
    searchParams.append('include_betting_opportunities', includeBettingOpportunities.toString());

    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/live-context/${gameId}?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch live game context: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get multi-platform betting opportunities
   */
  async getMultiPlatformOpportunities(
    params: {
      sport?: string;
      min_confidence?: number;
      include_arbitrage?: boolean;
    } = {}
  ): Promise<{
    multi_platform_opportunities: MultiPlatformOpportunity[];
    arbitrage_opportunities: any[];
    platform_summary: {
      total_platforms: number;
      opportunities_found: number;
      arbitrage_count: number;
      recommended_primary: string;
    };
    recommendations: string[];
  }> {
    const searchParams = new URLSearchParams();

    if (params.sport) searchParams.append('sport', params.sport);
    if (params.min_confidence)
      searchParams.append('min_confidence', params.min_confidence.toString());
    if (params.include_arbitrage !== undefined)
      searchParams.append('include_arbitrage', params.include_arbitrage.toString());

    const response = await this.fetchWithTimeout(`${this.baseUrl}/multi-platform?${searchParams}`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch multi-platform opportunities: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get service health status
   */
  async getHealth(): Promise<{
    status: string;
    last_update?: string;
    predictions_count: number;
    portfolio_optimized: boolean;
    services: Record<string, string>;
    api_health: {
      api_status: string;
      endpoints_active: number;
      last_request: string;
      response_time_avg: string;
      error_rate: string;
    };
    overall_status: string;
    capabilities: string[];
  }> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Failed to fetch health status: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate stacking suggestions based on current predictions
   */
  async generateStackingSuggestions(predictions: any[]): Promise<{
    suggestions: StackSuggestion[];
    correlationMatrix: CorrelationMatrix;
  }> {
    // For now, generate mock stacking suggestions based on the predictions
    // In a real implementation, this would call a backend endpoint

    const suggestions: StackSuggestion[] = [];
    const correlationMatrix: CorrelationMatrix = {
      players: [],
      matrix: [],
      insights: [],
    };

    if (predictions.length === 0) {
      return { suggestions, correlationMatrix };
    }

    // Group by team for team stacks
    const teamGroups = predictions.reduce((groups: Record<string, any[]>, pred) => {
      if (!groups[pred.team]) groups[pred.team] = [];
      groups[pred.team].push(pred);
      return groups;
    }, {});

    // Generate team stack suggestions
    Object.entries(teamGroups).forEach(([team, teamPreds]) => {
      if (teamPreds.length >= 2) {
        const avgCorrelation = 0.6 + Math.random() * 0.3; // Mock correlation
        const avgSynergy = 0.7 + Math.random() * 0.2;
        const expectedBoost = 5 + Math.random() * 10;

        suggestions.push({
          type: 'team',
          players: teamPreds.map(p => p.player_name),
          correlation_score: avgCorrelation,
          synergy_rating: avgSynergy,
          expected_boost: expectedBoost,
          risk_level: avgCorrelation > 0.8 ? 'high' : avgCorrelation > 0.6 ? 'medium' : 'low',
          explanation: `Strong ${team} team correlation with ${teamPreds.length} players showing positive synergy. Expected ${expectedBoost.toFixed(1)}% performance boost when stacked together.`,
        });
      }
    });

    // Group by sport for game stacks
    const sportGroups = predictions.reduce((groups: Record<string, any[]>, pred) => {
      if (!groups[pred.sport]) groups[pred.sport] = [];
      groups[pred.sport].push(pred);
      return groups;
    }, {});

    Object.entries(sportGroups).forEach(([sport, sportPreds]) => {
      if (sportPreds.length >= 3) {
        const avgCorrelation = 0.4 + Math.random() * 0.3;
        const avgSynergy = 0.5 + Math.random() * 0.3;
        const expectedBoost = 3 + Math.random() * 7;

        suggestions.push({
          type: 'game',
          players: sportPreds.slice(0, 3).map(p => p.player_name),
          correlation_score: avgCorrelation,
          synergy_rating: avgSynergy,
          expected_boost: expectedBoost,
          risk_level: avgCorrelation > 0.7 ? 'high' : avgCorrelation > 0.5 ? 'medium' : 'low',
          explanation: `Multi-game ${sport} stack with diverse player types. Lower correlation risk with moderate upside potential.`,
        });
      }
    });

    // Generate correlation matrix
    const playerNames = predictions.slice(0, 5).map(p => p.player_name); // Limit to first 5 for demo
    correlationMatrix.players = playerNames;

    // Generate mock correlation matrix
    correlationMatrix.matrix = playerNames.map((playerA, i) =>
      playerNames.map((playerB, j) => {
        if (i === j) return 1.0;

        const predA = predictions.find(p => p.player_name === playerA);
        const predB = predictions.find(p => p.player_name === playerB);

        let correlation = 0.1 + Math.random() * 0.3; // Base correlation

        // Higher correlation for same team
        if (predA?.team === predB?.team) {
          correlation += 0.4;
        }

        // Higher correlation for same sport
        if (predA?.sport === predB?.sport) {
          correlation += 0.2;
        }

        return Math.min(0.95, correlation);
      })
    );

    // Generate insights
    correlationMatrix.insights = [];
    for (let i = 0; i < playerNames.length; i++) {
      for (let j = i + 1; j < playerNames.length; j++) {
        const correlation = correlationMatrix.matrix[i][j];
        let recommendation: 'STACK' | 'AVOID' | 'NEUTRAL';

        if (correlation > 0.7) recommendation = 'AVOID';
        else if (correlation > 0.4 && correlation < 0.7) recommendation = 'STACK';
        else recommendation = 'NEUTRAL';

        correlationMatrix.insights.push({
          player_a: playerNames[i],
          player_b: playerNames[j],
          correlation,
          recommendation,
        });
      }
    }

    return { suggestions, correlationMatrix };
  }
}

export const unifiedApiService = new UnifiedApiService();
export default unifiedApiService;
