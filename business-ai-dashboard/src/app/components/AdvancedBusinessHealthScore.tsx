'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Users,
  Zap,
  BarChart3,
  Trophy,
  Star,
  Calendar,
  Clock,
  ArrowRight,
  Play,
  Settings,
  Link,
  ChevronRight,
  Info,
  Award,
  Flame,
  Rocket,
  Eye,
  MousePointer,
  Gauge,
  PieChart
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface HealthMetric {
  category: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  previousScore: number;
  industryAverage: number;
  description: string;
  details: {
    atRiskItems?: string[];
    opportunities?: string[];
    toolContributions?: { tool: string; value: string; syncStatus: 'synced' | 'pending' | 'error' }[];
  };
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'enable' | 'connect' | 'configure' | 'optimize';
  targetTool?: string;
  estimatedValue: string;
  timeToImplement: string;
  status: 'pending' | 'in_progress' | 'completed';
  scheduled?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}

interface AdvancedBusinessHealthScoreProps {
  score: number;
  previousScore?: number;
  metrics: HealthMetric[];
  recommendations: AIRecommendation[];
  achievements: Achievement[];
  onActionClick: (action: string, params?: any) => void;
}

const mockMetrics: HealthMetric[] = [
  {
    category: 'Revenue Growth',
    score: 85,
    trend: 'up',
    previousScore: 78,
    industryAverage: 72,
    description: 'Strong revenue performance driven by SaaS subscriptions and enterprise expansion',
    details: {
      opportunities: ['Enterprise upsell potential', 'Seasonal demand increase', 'New market expansion'],
      toolContributions: [
        { tool: 'Stripe', value: '$12,300', syncStatus: 'synced' },
        { tool: 'QuickBooks', value: '$8,700', syncStatus: 'synced' },
        { tool: 'Custom CRM', value: '$5,200', syncStatus: 'pending' }
      ]
    },
    priority: 'medium',
    estimatedImpact: '+15% growth with optimization'
  },
  {
    category: 'Cost Efficiency',
    score: 72,
    trend: 'down',
    previousScore: 78,
    industryAverage: 68,
    description: 'Increasing operational costs due to new tool subscriptions and infrastructure scaling',
    details: {
      atRiskItems: ['Unused software licenses', 'Cloud storage overage', 'Marketing spend inefficiency'],
      toolContributions: [
        { tool: 'AWS', value: '$3,200/month', syncStatus: 'synced' },
        { tool: 'Adobe Creative', value: '$600/month', syncStatus: 'error' }
      ]
    },
    priority: 'high',
    estimatedImpact: '$2,400/month savings possible'
  },
  {
    category: 'Automation Level',
    score: 68,
    trend: 'up',
    previousScore: 45,
    industryAverage: 52,
    description: 'Good automation adoption with room for improvement in customer service workflows',
    details: {
      opportunities: ['Customer service automation', 'Invoice processing', 'Lead qualification'],
      toolContributions: [
        { tool: 'Zapier', value: '23 workflows', syncStatus: 'synced' },
        { tool: 'Custom API', value: '15 endpoints', syncStatus: 'synced' }
      ]
    },
    priority: 'medium',
    estimatedImpact: '+25 hours/week saved'
  },
  {
    category: 'Customer Retention',
    score: 75,
    trend: 'stable',
    previousScore: 74,
    industryAverage: 78,
    description: 'Stable retention with opportunities to improve through better engagement strategies',
    details: {
      atRiskItems: ['12 at-risk enterprise accounts', 'Declining product usage in segment B'],
      opportunities: ['Proactive success management', 'Personalized onboarding', 'Community building'],
      toolContributions: [
        { tool: 'Intercom', value: '89% satisfaction', syncStatus: 'synced' },
        { tool: 'Custom Analytics', value: 'Retention: 87%', syncStatus: 'synced' }
      ]
    },
    priority: 'high',
    estimatedImpact: '+8% retention improvement'
  }
];

const mockRecommendations: AIRecommendation[] = [
  {
    id: '1',
    title: 'Enable Lead Follow-up Automation',
    description: 'Automated lead nurturing will increase conversion rates by 23%',
    impact: '+$2,800/month revenue',
    priority: 'high',
    actionType: 'enable',
    targetTool: 'Lead Follow-up',
    estimatedValue: '$2,800/month',
    timeToImplement: '5 minutes',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Connect QuickBooks for Better Cost Tracking',
    description: 'Real-time financial data will improve cost efficiency insights',
    impact: '$1,200/month savings',
    priority: 'medium',
    actionType: 'connect',
    targetTool: 'QuickBooks',
    estimatedValue: '$1,200/month',
    timeToImplement: '10 minutes',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Activate Cost Monitoring Alerts',
    description: 'Prevent budget overruns with real-time spending alerts',
    impact: '$600/month savings',
    priority: 'medium',
    actionType: 'configure',
    estimatedValue: '$600/month',
    timeToImplement: '3 minutes',
    status: 'pending'
  },
  {
    id: '4',
    title: 'Optimize Customer Success Workflows',
    description: 'Proactive customer success will improve retention by 8%',
    impact: '+8% retention',
    priority: 'high',
    actionType: 'optimize',
    estimatedValue: '$4,500/month',
    timeToImplement: '15 minutes',
    status: 'pending'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Automation Beginner',
    description: 'Activate your first automation workflow',
    icon: '🚀',
    unlocked: true,
    progress: 1,
    target: 1
  },
  {
    id: '2',
    title: 'Revenue Hero',
    description: 'Optimize 3 revenue streams',
    icon: '💰',
    unlocked: true,
    progress: 2,
    target: 3
  },
  {
    id: '3',
    title: 'Cost Master',
    description: 'Save $5,000 through optimizations',
    icon: '📊',
    unlocked: false,
    progress: 2_400,
    target: 5_000
  },
  {
    id: '4',
    title: 'Customer Champion',
    description: 'Achieve 90% customer retention',
    icon: '⭐',
    unlocked: false,
    progress: 87,
    target: 90
  }
];

export default function AdvancedBusinessHealthScore({ 
  score, 
  previousScore = 70, 
  metrics = mockMetrics,
  recommendations = mockRecommendations,
  achievements = mockAchievements,
  onActionClick 
}: AdvancedBusinessHealthScoreProps) {
  const { t } = useTranslation();
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [scheduledActions, setScheduledActions] = useState<string[]>([]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    if (score >= 40) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-red-700';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    if (score >= 40) return 'NEEDS ATTENTION';
    return 'CRITICAL';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const handleScheduleAction = (recommendationId: string) => {
    setScheduledActions(prev => [...prev, recommendationId]);
  };

  const handleRecommendationClick = (recommendation: AIRecommendation) => {
    onActionClick(recommendation.actionType, { tool: recommendation.targetTool });
  };

  const scoreChange = score - previousScore;

  return (
    <div className="space-y-6">
      {/* Header with Main Score */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative inline-block"
        >
          {/* Enhanced Circular Progress */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto relative">
            <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: score / 100 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl mb-2">{score >= 80 ? '🎉' : score >= 60 ? '😊' : score >= 40 ? '😐' : '⚠️'}</div>
              <div className="text-4xl sm:text-5xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {score}
              </div>
              <div className="text-sm font-semibold text-gray-600">/ 100</div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getScoreColor(score)} text-white`}>
                {getScoreLabel(score)}
              </div>
            </div>
          </div>

          {/* Enhanced Trend Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`flex items-center justify-center space-x-2 mt-4 ${
              scoreChange > 0 ? 'text-green-600' : scoreChange < 0 ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {scoreChange > 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : scoreChange < 0 ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <Activity className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {scoreChange > 0 ? '+' : ''}{scoreChange} points from last month
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            Advanced Business Health Score
          </h2>
          <p className="text-gray-600" style={{ color: 'var(--text-secondary)' }}>
            AI-powered business intelligence with real-time insights and actionable recommendations
          </p>
        </motion.div>
      </div>

      {/* Gamification Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-900">Achievements & Progress</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              className={`p-3 sm:p-4 rounded-xl border text-center transition-all ${
                achievement.unlocked 
                  ? 'bg-white border-purple-300 shadow-md' 
                  : 'bg-purple-100 border-purple-200 opacity-75'
              }`}
            >
              <div className="text-xl sm:text-2xl mb-2">{achievement.icon}</div>
              <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${
                achievement.unlocked ? 'text-purple-900' : 'text-purple-700'
              }`}>
                {achievement.title}
              </h4>
              <p className="text-xs text-purple-600 mb-2">{achievement.description}</p>
              {achievement.unlocked ? (
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold text-purple-800">Unlocked!</span>
                </div>
              ) : (
                <div className="w-full bg-purple-200 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Health Metrics with Industry Benchmarks */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMetric(metric)}
            className="p-4 sm:p-6 bg-white rounded-2xl border border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                  metric.trend === 'up' ? 'bg-green-100' : metric.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  ) : (
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg" style={{ color: 'var(--text-heading)' }}>
                    {metric.category}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {metric.score - metric.previousScore > 0 ? '+' : ''}{metric.score - metric.previousScore} pts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                    {metric.score}
                  </span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 mt-1">
                  <span className="text-xs text-gray-500">vs</span>
                  <span className="text-xs font-semibold text-blue-600">{metric.industryAverage}</span>
                  <span className="text-xs text-gray-500">industry</span>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar with Benchmark */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${getScoreColor(metric.score)}`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-blue-500"
                  style={{ width: `${metric.industryAverage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Your Score</span>
                <span>Industry Avg</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {metric.description}
            </p>

            {/* Priority and Impact */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(metric.priority)}`}>
                {metric.priority} priority
              </span>
              <span className="text-xs font-semibold text-green-600">
                {metric.estimatedImpact}
              </span>
            </div>

            {/* Tool Contributions */}
            {metric.details.toolContributions && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Tool Contributions:</p>
                <div className="space-y-1">
                  {metric.details.toolContributions.slice(0, 2).map((tool, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(tool.syncStatus)}
                        <span className="text-xs text-gray-600">{tool.tool}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{tool.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-blue-900">AI-Powered Action Plan</h3>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-700">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Next 30 days</span>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`p-4 bg-white rounded-xl border-l-4 ${
                recommendation.priority === 'high' ? 'border-l-red-500' :
                recommendation.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    recommendation.priority === 'high' ? 'bg-red-500' :
                    recommendation.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 mb-2">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{recommendation.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                    
                    {/* Impact and Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="font-semibold text-green-600">{recommendation.estimatedValue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600">{recommendation.timeToImplement}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleRecommendationClick(recommendation)}
                  className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                    recommendation.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {recommendation.actionType === 'enable' && <Play className="w-4 h-4" />}
                  {recommendation.actionType === 'connect' && <Link className="w-4 h-4" />}
                  {recommendation.actionType === 'configure' && <Settings className="w-4 h-4" />}
                  {recommendation.actionType === 'optimize' && <Zap className="w-4 h-4" />}
                  <span>
                    {recommendation.status === 'completed' ? 'Completed' :
                     recommendation.actionType === 'enable' ? 'Enable Now' :
                     recommendation.actionType === 'connect' ? 'Connect Tool' :
                     recommendation.actionType === 'configure' ? 'Configure' : 'Optimize'}
                  </span>
                </button>
                
                {recommendation.status !== 'completed' && (
                  <button
                    onClick={() => handleScheduleAction(recommendation.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{scheduledActions.includes(recommendation.id) ? 'Scheduled' : 'Schedule'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Metric Detail Modal */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  {selectedMetric.category} - Deep Dive
                </h3>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">Current Score</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{selectedMetric.score}/100</div>
                  <div className="text-sm text-blue-700">
                    {selectedMetric.score > selectedMetric.industryAverage ? 'Above' : 'Below'} industry average
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Potential Impact</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">{selectedMetric.estimatedImpact}</div>
                </div>
              </div>

              {/* At-Risk Items */}
              {selectedMetric.details.atRiskItems && (
                <div className="mb-6">
                  <h4 className="font-bold text-red-800 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>At-Risk Items</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedMetric.details.atRiskItems.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-sm text-red-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {selectedMetric.details.opportunities && (
                <div className="mb-6">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Growth Opportunities</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedMetric.details.opportunities.map((opportunity, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-green-800">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool Contributions */}
              {selectedMetric.details.toolContributions && (
                <div>
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Tool Contributions</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedMetric.details.toolContributions.map((tool, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getSyncStatusIcon(tool.syncStatus)}
                          <span className="font-medium text-gray-800">{tool.tool}</span>
                        </div>
                        <span className="font-bold text-gray-900">{tool.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
