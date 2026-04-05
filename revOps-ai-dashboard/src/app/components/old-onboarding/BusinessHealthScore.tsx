'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Target, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface BusinessHealthScoreProps {
  score: number;
  previousScore?: number;
  factors: {
    category: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    description: string;
  }[];
  recommendations: string[];
}

export default function BusinessHealthScore({ 
  score, 
  previousScore, 
  factors, 
  recommendations 
}: BusinessHealthScoreProps) {
  const { t } = useTranslation();

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

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎉';
    if (score >= 60) return '😊';
    if (score >= 40) return '😐';
    return '⚠️';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const scoreChange = previousScore ? score - previousScore : 0;

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative inline-block"
        >
          {/* Circular Progress */}
          <div className="w-48 h-48 mx-auto relative">
            <svg className="w-48 h-48 transform -rotate-90">
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
                  <stop offset="0%" className={`text-${score >= 60 ? 'green' : 'red'}-500`} stopColor="currentColor" />
                  <stop offset="100%" className={`text-${score >= 60 ? 'emerald' : 'orange'}-600`} stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl mb-2">{getScoreEmoji(score)}</span>
              <div className="text-4xl font-bold" style={{ color: 'var(--text-heading)' }}>
                {score}
              </div>
              <div className="text-sm font-semibold text-gray-600">/ 100</div>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r ${getScoreColor(score)} text-white`}>
                {getScoreLabel(score)}
              </div>
            </div>
          </div>

          {/* Trend Indicator */}
          {previousScore && (
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
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            Business Health Score
          </h2>
          <p className="text-gray-600" style={{ color: 'var(--text-secondary)' }}>
            Overall assessment of your business performance and automation effectiveness
          </p>
        </motion.div>
      </div>

      {/* Health Factors */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {factors.map((factor, index) => (
          <div key={index} className="p-4 bg-white rounded-xl border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getTrendIcon(factor.trend)}
                <h4 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>
                  {factor.category}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                  {factor.score}
                </span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {factor.description}
            </p>
            {/* Mini progress bar */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-linear-to-r ${getScoreColor(factor.score)}`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-blue-900">AI Recommendations</h3>
        </div>
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-xl">
                <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-green-900">What's Working</p>
          <p className="text-xs text-green-700 mt-1">
            Continue current automation strategies
          </p>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
          <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="font-semibold text-yellow-900">To Improve</p>
          <p className="text-xs text-yellow-700 mt-1">
            Focus on lead conversion rates
          </p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-semibold text-blue-900">Next Steps</p>
          <p className="text-xs text-blue-700 mt-1">
    Review automation settings
          </p>
        </div>
      </motion.div>
    </div>
  );
}
