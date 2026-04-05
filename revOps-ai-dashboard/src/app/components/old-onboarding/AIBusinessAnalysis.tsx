'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Info, 
  BarChart3, 
  Target, 
  Zap, 
  Shield,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Star,
  Activity,
  PieChart,
  Lightbulb
} from 'lucide-react';

interface BusinessInsight {
  id: string;
  category: 'revenue' | 'customers' | 'costs' | 'risks' | 'opportunities';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  explainability: string;
  benchmark?: {
    value: number;
    industry: string;
    comparison: 'above' | 'below' | 'average';
  };
  accepted?: boolean;
}

interface AnalysisResult {
  businessModel: string;
  readinessScore: number;
  insights: BusinessInsight[];
  summary: {
    totalInsights: number;
    highImpact: number;
    opportunities: number;
    risks: number;
  };
  lastAnalyzed: string;
}

const mockAnalysisResult: AnalysisResult = {
  businessModel: 'SaaS B2B',
  readinessScore: 78,
  insights: [
    {
      id: '1',
      category: 'revenue',
      title: 'SaaS Revenue Pattern Detected',
      description: 'Your business shows strong recurring revenue characteristics with 87% monthly retention',
      confidence: 92,
      impact: 'high',
      recommendation: 'Focus on expansion revenue within existing customer base',
      explainability: 'AI detected recurring payment patterns, customer subscription lifecycle, and low churn indicators from your payment data',
      benchmark: {
        value: 87,
        industry: 'SaaS',
        comparison: 'above'
      }
    },
    {
      id: '2',
      category: 'customers',
      title: 'High-Value Customer Segment Identified',
      description: 'Enterprise customers represent 35% of revenue but only 15% of customer base',
      confidence: 88,
      impact: 'high',
      recommendation: 'Develop enterprise-focused features and pricing tiers',
      explainability: 'Customer segmentation analysis identified spending patterns and company size data from CRM integration'
    },
    {
      id: '3',
      category: 'costs',
      title: 'Customer Acquisition Cost Optimization Opportunity',
      description: 'CAC is 35% above industry average for your segment',
      confidence: 79,
      impact: 'medium',
      recommendation: 'Optimize marketing channels and improve conversion funnel',
      explainability: 'Cost analysis compared your marketing spend against revenue data and industry benchmarks',
      benchmark: {
        value: 35,
        industry: 'SaaS B2B',
        comparison: 'above'
      }
    },
    {
      id: '4',
      category: 'risks',
      title: 'Revenue Concentration Risk',
      description: 'Top 3 customers represent 45% of total revenue',
      confidence: 85,
      impact: 'high',
      recommendation: 'Diversify customer base and implement retention strategies for key accounts',
      explainability: 'Revenue analysis identified concentration patterns in customer payment data'
    },
    {
      id: '5',
      category: 'opportunities',
      title: 'Expansion Revenue Potential',
      description: '60% of current customers have unused features they could benefit from',
      confidence: 76,
      impact: 'medium',
      recommendation: 'Implement feature adoption campaigns and customer success initiatives',
      explainability: 'Usage pattern analysis compared feature utilization against available features in your system'
    }
  ],
  summary: {
    totalInsights: 5,
    highImpact: 3,
    opportunities: 1,
    risks: 1
  },
  lastAnalyzed: '2 minutes ago'
};

export default function AIBusinessAnalysis() {
  const { t } = useTranslation();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(mockAnalysisResult);
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExplainability, setShowExplainability] = useState(false);

  const handleReAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate re-analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // In real implementation, this would call the API
    }, 3000);
  };

  const handleInsightAction = (insightId: string, accepted: boolean) => {
    setAnalysisResult(prev => ({
      ...prev,
      insights: prev.insights.map(insight =>
        insight.id === insightId ? { ...insight, accepted } : insight
      )
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-5 h-5" />;
      case 'customers': return <Users className="w-5 h-5" />;
      case 'costs': return <BarChart3 className="w-5 h-5" />;
      case 'risks': return <AlertTriangle className="w-5 h-5" />;
      case 'opportunities': return <Lightbulb className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-600 bg-green-50 border-green-200';
      case 'customers': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'costs': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'risks': return 'text-red-600 bg-red-50 border-red-200';
      case 'opportunities': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Readiness Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {t.aiBusinessAnalysisComplete}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t.businessModelDetected}: <span className="font-semibold">{analysisResult.businessModel}</span>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <div className="absolute">
                <span className="text-xl sm:text-2xl font-bold text-indigo-600">{analysisResult.readinessScore}%</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">{t.readinessScore}</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">{t.totalInsights}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{analysisResult.summary.totalInsights}</p>
            </div>
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">{t.highImpact}</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{analysisResult.summary.highImpact}</p>
            </div>
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">{t.opportunities}</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{analysisResult.summary.opportunities}</p>
            </div>
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">{t.risks}</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{analysisResult.summary.risks}</p>
            </div>
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Activity className="w-4 h-4" />
          <span>{t.lastAnalyzed}: {analysisResult.lastAnalyzed}</span>
        </div>
        <button
          onClick={handleReAnalysis}
          disabled={isAnalyzing}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{t.reRunAnalysis}</span>
        </button>
      </motion.div>

      {/* Insights List */}
      <div className="space-y-4">
        {analysisResult.insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`bg-white rounded-lg border ${getCategoryColor(insight.category)} overflow-hidden`}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getCategoryColor(insight.category)}`}>
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                          {insight.impact}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% {t.confidence}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mb-3">{insight.description}</p>
                    
                    {insight.benchmark && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">
                            {t.industryBenchmark}: {insight.benchmark.value}% {t.aboveIndustryAverage}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">{t.recommendation}:</p>
                      <p className="text-sm text-blue-800">{insight.recommendation}</p>
                    </div>

                    <button
                      onClick={() => setShowExplainability(!showExplainability)}
                      className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span>{t.howAIDetectedThis}</span>
                      <ChevronRight className={`w-4 h-4 transform transition-transform ${showExplainability ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showExplainability && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3"
                        >
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{insight.explainability}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 sm:text-nowrap">{t.acceptAIConclusions}:</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleInsightAction(insight.id, true)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors flex-1 sm:flex-none justify-center ${
                      insight.accepted === true 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{t.accept}</span>
                  </button>
                  <button
                    onClick={() => handleInsightAction(insight.id, false)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors flex-1 sm:flex-none justify-center ${
                      insight.accepted === false 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{t.reject}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
