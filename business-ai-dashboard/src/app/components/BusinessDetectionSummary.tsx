'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, AlertTriangle, CheckCircle, Brain, Target } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface BusinessDetectionSummaryProps {
  detectedData: {
    businessModel: string;
    revenueStreams: string[];
    expenses: {
      category: string;
      amount: number;
      trend: 'up' | 'down' | 'stable';
    }[];
    customers: {
      total: number;
      growth: number;
      segments: string[];
    };
    growthTrend: {
      percentage: number;
      period: string;
      projection: string;
    };
    risks: {
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }[];
  };
}

export default function BusinessDetectionSummary({ detectedData }: BusinessDetectionSummaryProps) {
  const { t } = useTranslation();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t.aiBusinessAnalysisComplete}
        </h2>
        <p className="text-gray-600" style={{ color: 'var(--text-secondary)' }}>
          {t.aiAnalysisCompleteDesc}
        </p>
      </div>

      {/* Business Model */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
      >
        <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>{t.businessModel}</span>
        </h3>
        <p className="text-2xl font-bold text-blue-900 mb-2">{detectedData.businessModel}</p>
        <div className="flex flex-wrap gap-2">
          {detectedData.revenueStreams.map((stream, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {stream}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-blue-900">{t.aiRecommendations}</h3>
          </div>
          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
            detectedData.customers.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-start space-x-4">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="flex-1">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                  {detectedData.customers.total.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{t.totalCustomers}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {detectedData.customers.segments.map((segment, index) => (
              <div key={index} className="text-xs text-gray-500">
                • {segment}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Growth Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              detectedData.growthTrend.percentage > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {detectedData.growthTrend.percentage > 0 ? '+' : ''}{detectedData.growthTrend.percentage}%
            </span>
          </div>
          <div className="flex items-start space-x-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="flex-1">
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
                {detectedData.growthTrend.period}
              </p>
              <p className="text-sm text-gray-600">{t.growthPeriod}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">{detectedData.growthTrend.projection}</p>
        </motion.div>

        {/* Revenue Streams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart className="w-8 h-8 text-orange-500" />
            <span className="text-sm font-semibold px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
              {detectedData.revenueStreams.length}
            </span>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
            Revenue
          </p>
          <p className="text-sm text-gray-600">Active Streams</p>
          <div className="mt-3 space-y-1">
            {detectedData.revenueStreams.slice(0, 2).map((stream, index) => (
              <div key={index} className="text-xs text-gray-500">
                • {stream}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Expense Analysis */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-red-500" />
          <span>{t.expenseAnalysis}</span>
        </h3>
        <div className="space-y-3">
          {detectedData.expenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-4">
                {getTrendIcon(expense.trend)}
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                    {expense.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {expense.trend === 'up' ? 'Increasing' : expense.trend === 'down' ? 'Decreasing' : 'Stable'}
                  </p>
                </div>
              </div>
              <p className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>
                ${expense.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span>{t.riskAssessment}</span>
        </h3>
        <div className="space-y-3">
          {detectedData.risks.map((risk, index) => (
            <div key={index} className={`p-4 rounded-xl border ${getSeverityColor(risk.severity)}`}>
              <div className="flex items-start space-x-3">
                {risk.severity === 'high' ? (
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{risk.type}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      risk.severity === 'high' ? 'bg-red-200 text-red-800' :
                      risk.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {risk.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs">{risk.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
