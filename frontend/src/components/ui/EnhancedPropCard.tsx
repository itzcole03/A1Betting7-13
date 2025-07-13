import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Zap,
  Clock,
  User,
  Trophy,
  Activity,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';

export interface PlayerProp {
  id: string;
  player: {
    name: string;
    team: string;
    position: string;
    headshot?: string;
  };
  game: {
    opponent: string;
    date: string;
    time: string;
    venue: string;
  };
  prop: {
    type: string;
    line: number;
    overOdds: number;
    underOdds: number;
    recommendation: 'over' | 'under' | 'none';
  };
  analysis: {
    confidence: number;
    aiPrediction: number;
    trend: 'up' | 'down' | 'neutral';
    reasoning: string;
    factors: Array<{
      name: string;
      impact: number;
      description: string;
    }>;
  };
  stats: {
    season: {
      average: number;
      games: number;
      hitRate: number;
    };
    recent: {
      last5: number[];
      average: number;
      hitRate: number;
    };
    vsOpponent: {
      average: number;
      games: number;
      hitRate: number;
    };
  };
  value: {
    expectedValue: number;
    kellyBet: number;
    roi: number;
  };
  tags?: string[];
  isLive?: boolean;
  isPopular?: boolean;
}

export interface EnhancedPropCardProps {
  prop: PlayerProp;
  variant?: 'default' | 'cyber' | 'compact' | 'detailed';
  onSelect?: (prop: PlayerProp, selection: 'over' | 'under') => void;
  className?: string;
  showAnalysis?: boolean;
  showStats?: boolean;
}

export const EnhancedPropCard: React.FC<EnhancedPropCardProps> = ({
  prop,
  variant = 'default',
  onSelect,
  className = '',
  showAnalysis = true,
  showStats = true,
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400 bg-green-500/20';
    if (confidence >= 65) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-orange-400 bg-orange-500/20';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className='w-4 h-4 text-green-400' />;
      case 'down':
        return <TrendingDown className='w-4 h-4 text-red-400' />;
      default:
        return <Minus className='w-4 h-4 text-gray-400' />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'over':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'under':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const variantClasses = {
    default: 'bg-slate-800/50 border-slate-700/50 p-6',
    cyber: 'bg-slate-900/50 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] p-6',
    compact: 'bg-slate-800/50 border-slate-700/50 p-4',
    detailed: 'bg-slate-800/50 border-slate-700/50 p-6',
  };

  return (
    <motion.div
      className={`
        relative rounded-xl border backdrop-blur-sm overflow-hidden
        ${variantClasses[variant]}
        hover:border-cyan-500/50 transition-colors duration-200
        ${className}
      `}
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      whileHover='hover'
    >
      {/* Cyber grid overlay */}
      {variant === 'cyber' && (
        <div
          className='absolute inset-0 opacity-10 pointer-events-none'
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(34,211,238,0.1) 20px, rgba(34,211,238,0.1) 21px)',
          }}
        />
      )}

      {/* Live indicator */}
      {prop.isLive && (
        <div className='absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium'>
          <div className='w-2 h-2 bg-red-400 rounded-full animate-pulse' />
          <span>LIVE</span>
        </div>
      )}

      {/* Popular indicator */}
      {prop.isPopular && (
        <div className='absolute top-4 left-4'>
          <Star className='w-4 h-4 text-yellow-400' />
        </div>
      )}

      <div className='relative'>
        {/* Header */}
        <div className='flex items-start space-x-4 mb-4'>
          {/* Player Avatar */}
          <div className='flex-shrink-0'>
            {prop.player.headshot ? (
              <img
                src={prop.player.headshot}
                alt={prop.player.name}
                className='w-12 h-12 rounded-full bg-slate-700'
              />
            ) : (
              <div className='w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center'>
                <User className='w-6 h-6 text-gray-400' />
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className='flex-1'>
            <h3 className='text-lg font-semibold text-white mb-1'>{prop.player.name}</h3>
            <div className='flex items-center space-x-2 text-sm text-gray-300 mb-1'>
              <span>{prop.player.team}</span>
              <span>•</span>
              <span>{prop.player.position}</span>
            </div>
            <div className='text-xs text-gray-400'>
              vs {prop.game.opponent} • {prop.game.date}
            </div>
          </div>

          {/* Confidence Badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(prop.analysis.confidence)}`}
          >
            <Target className='w-4 h-4 mr-1' />
            {prop.analysis.confidence}%
          </div>
        </div>

        {/* Prop Details */}
        <div className='bg-slate-700/30 rounded-lg p-4 mb-4'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className='text-sm font-medium text-gray-300'>{prop.prop.type}</h4>
            {getTrendIcon(prop.analysis.trend)}
          </div>

          <div className='flex items-center justify-between mb-3'>
            <div className='text-2xl font-bold text-white'>{prop.prop.line}</div>
            <div className='text-right'>
              <div className='text-sm text-cyan-400 font-medium'>
                AI: {prop.analysis.aiPrediction}
              </div>
              <div className='text-xs text-gray-400'>Prediction</div>
            </div>
          </div>

          {/* Betting Options */}
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => onSelect?.(prop, 'over')}
              className={`
                p-3 rounded-lg border transition-all text-center
                ${
                  prop.prop.recommendation === 'over'
                    ? getRecommendationColor('over') + ' ring-2 ring-current'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }
              `}
            >
              <div className='text-lg font-bold'>O {prop.prop.line}</div>
              <div className='text-sm'>
                {prop.prop.overOdds > 0 ? '+' : ''}
                {prop.prop.overOdds}
              </div>
            </button>

            <button
              onClick={() => onSelect?.(prop, 'under')}
              className={`
                p-3 rounded-lg border transition-all text-center
                ${
                  prop.prop.recommendation === 'under'
                    ? getRecommendationColor('under') + ' ring-2 ring-current'
                    : 'border-slate-600 text-gray-300 hover:border-slate-500'
                }
              `}
            >
              <div className='text-lg font-bold'>U {prop.prop.line}</div>
              <div className='text-sm'>
                {prop.prop.underOdds > 0 ? '+' : ''}
                {prop.prop.underOdds}
              </div>
            </button>
          </div>
        </div>

        {/* Value Metrics */}
        <div className='grid grid-cols-3 gap-4 mb-4'>
          <div className='text-center'>
            <div className='text-sm font-bold text-purple-400'>
              {prop.value.expectedValue > 0 ? '+' : ''}
              {prop.value.expectedValue.toFixed(2)}
            </div>
            <div className='text-xs text-gray-400'>EV</div>
          </div>

          <div className='text-center'>
            <div className='text-sm font-bold text-green-400'>
              {prop.value.roi > 0 ? '+' : ''}
              {prop.value.roi.toFixed(1)}%
            </div>
            <div className='text-xs text-gray-400'>ROI</div>
          </div>

          <div className='text-center'>
            <div className='text-sm font-bold text-yellow-400'>${prop.value.kellyBet}</div>
            <div className='text-xs text-gray-400'>Kelly</div>
          </div>
        </div>

        {/* Statistics */}
        {showStats && variant !== 'compact' && (
          <div className='border-t border-slate-700/50 pt-4 mb-4'>
            <h4 className='text-sm font-medium text-gray-300 mb-3 flex items-center'>
              <Activity className='w-4 h-4 mr-2 text-cyan-400' />
              Performance Stats
            </h4>

            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-sm font-bold text-white'>
                  {prop.stats.season.average.toFixed(1)}
                </div>
                <div className='text-xs text-gray-400'>Season Avg</div>
                <div className='text-xs text-green-400'>
                  {prop.stats.season.hitRate.toFixed(0)}% Hit Rate
                </div>
              </div>

              <div>
                <div className='text-sm font-bold text-white'>
                  {prop.stats.recent.average.toFixed(1)}
                </div>
                <div className='text-xs text-gray-400'>L5 Avg</div>
                <div className='text-xs text-green-400'>
                  {prop.stats.recent.hitRate.toFixed(0)}% Hit Rate
                </div>
              </div>

              <div>
                <div className='text-sm font-bold text-white'>
                  {prop.stats.vsOpponent.average.toFixed(1)}
                </div>
                <div className='text-xs text-gray-400'>vs {prop.game.opponent}</div>
                <div className='text-xs text-green-400'>
                  {prop.stats.vsOpponent.hitRate.toFixed(0)}% Hit Rate
                </div>
              </div>
            </div>

            {/* Recent Games Trend */}
            <div className='mt-3'>
              <div className='text-xs text-gray-400 mb-2'>Last 5 Games</div>
              <div className='flex space-x-1'>
                {prop.stats.recent.last5.map((value, index) => {
                  const isOver = value > prop.prop.line;
                  return (
                    <div
                      key={index}
                      className={`flex-1 h-6 rounded flex items-center justify-center text-xs font-medium ${
                        isOver ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analysis */}
        {showAnalysis && variant === 'detailed' && (
          <div className='border-t border-slate-700/50 pt-4 mb-4'>
            <div className='flex items-start space-x-2 mb-3'>
              <Brain className='w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0' />
              <div>
                <h4 className='text-sm font-medium text-gray-300 mb-2'>AI Analysis</h4>
                <p className='text-sm text-gray-300 leading-relaxed mb-3'>
                  {prop.analysis.reasoning}
                </p>
              </div>
            </div>

            {/* Key Factors */}
            <div className='space-y-2'>
              <h5 className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
                Key Factors
              </h5>
              {prop.analysis.factors.slice(0, 3).map((factor, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span className='text-sm text-gray-300'>{factor.name}</span>
                  <div className='flex items-center space-x-2'>
                    <div className='w-16 h-1 bg-slate-700 rounded-full overflow-hidden'>
                      <div
                        className={`h-full rounded-full ${
                          factor.impact > 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${Math.abs(factor.impact)}%` }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        factor.impact > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {factor.impact > 0 ? '+' : ''}
                      {factor.impact}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {prop.tags && prop.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {prop.tags.slice(0, 3).map(tag => (
              <span key={tag} className='px-2 py-1 bg-slate-700/50 text-gray-300 rounded text-xs'>
                {tag}
              </span>
            ))}
            {prop.tags.length > 3 && (
              <span className='px-2 py-1 bg-slate-700/50 text-gray-400 rounded text-xs'>
                +{prop.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
          prop.prop.recommendation === 'over'
            ? 'bg-green-400'
            : prop.prop.recommendation === 'under'
              ? 'bg-red-400'
              : 'bg-gray-400'
        } opacity-60`}
      />
    </motion.div>
  );
};

export default EnhancedPropCard;
