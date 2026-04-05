'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ToggleLeft, 
  ToggleRight, 
  Zap, 
  DollarSign, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  Target,
  Brain,
  Calculator,
  Activity,
  ArrowUp,
  ArrowDown,
  Info,
  Play,
  Pause
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface AutomationInsight {
  key: string;
  predictedImpact: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedGain: string;
  confidence: number;
  recommended: boolean;
  riskReduction: number;
  priority: number;
  simulation?: {
    monthlyValue: string;
    description: string;
  };
  dependencies?: {
    requires: string[];
    improves: string[];
    warning: string;
  };
}

interface IntelligentAutomationRecommenderProps {
  configurations: {
    revenueTracking: boolean;
    leadFollowUp: boolean;
    costMonitoring: boolean;
    marketingAutomation: boolean;
  };
  onConfigurationChange: (key: string, value: boolean) => void;
}

const automationInsights: Record<string, AutomationInsight> = {
  revenueTracking: {
    key: 'revenueTracking',
    predictedImpact: 'HIGH',
    expectedGain: '+12% recovered revenue',
    confidence: 91,
    recommended: true,
    riskReduction: 45,
    priority: 1,
    simulation: {
      monthlyValue: '$4,200',
      description: 'Based on your payment patterns and failed transactions'
    },
    dependencies: {
      requires: [],
      improves: ['leadFollowUp'],
      warning: 'Revenue engine improves lead scoring accuracy by 34%'
    }
  },
  leadFollowUp: {
    key: 'leadFollowUp',
    predictedImpact: 'HIGH',
    expectedGain: '+23% conversion rate',
    confidence: 87,
    recommended: true,
    riskReduction: 32,
    priority: 2,
    simulation: {
      monthlyValue: '$2,800',
      description: 'From improved lead nurturing and timely follow-ups'
    },
    dependencies: {
      requires: [],
      improves: ['marketingAutomation'],
      warning: 'Lead follow-up enhances campaign targeting by 28%'
    }
  },
  costMonitoring: {
    key: 'costMonitoring',
    predictedImpact: 'MEDIUM',
    expectedGain: '+8% cost savings',
    confidence: 79,
    recommended: true,
    riskReduction: 67,
    priority: 3,
    simulation: {
      monthlyValue: '$1,200',
      description: 'From unused service detection and budget optimization'
    },
    dependencies: {
      requires: [],
      improves: [],
      warning: ''
    }
  },
  marketingAutomation: {
    key: 'marketingAutomation',
    predictedImpact: 'MEDIUM',
    expectedGain: '+15% marketing ROI',
    confidence: 73,
    recommended: false,
    riskReduction: 25,
    priority: 4,
    simulation: {
      monthlyValue: '$1,800',
      description: 'From automated campaigns and customer segmentation'
    },
    dependencies: {
      requires: ['leadFollowUp'],
      improves: [],
      warning: 'Requires lead follow-up for optimal performance (+45% effectiveness)'
    }
  }
};

export default function IntelligentAutomationRecommender({ 
  configurations, 
  onConfigurationChange 
}: IntelligentAutomationRecommenderProps) {
  const { t } = useTranslation();
  const [showSimulation, setShowSimulation] = useState<string | null>(null);
  const [dependencyWarnings, setDependencyWarnings] = useState<string[]>([]);

  const configOptions = [
    {
      key: 'revenueTracking',
      icon: DollarSign,
      title: t.revenueTracking,
      description: t.revenueTrackingDesc,
      benefits: [
        t.realTimeRevenueDashboard,
        t.paymentFailureAlerts,
        t.revenueForecasting,
        t.customerLifetimeValueTracking
      ],
      color: 'from-green-500 to-emerald-600',
      insight: automationInsights.revenueTracking
    },
    {
      key: 'leadFollowUp',
      icon: Users,
      title: t.leadFollowUp,
      description: t.leadFollowUpDesc,
      benefits: [
        t.automatedEmailSequences,
        t.leadScoringSystem,
        t.followUpReminders,
        t.conversionTracking
      ],
      color: 'from-blue-500 to-indigo-600',
      insight: automationInsights.leadFollowUp
    },
    {
      key: 'costMonitoring',
      icon: BarChart3,
      title: t.costMonitoring,
      description: t.costMonitoringDesc,
      benefits: [
        t.subscriptionCostTracking,
        t.unusedServiceDetection,
        t.budgetAlerts,
        t.costOptimizationSuggestions
      ],
      color: 'from-orange-500 to-red-600',
      insight: automationInsights.costMonitoring
    },
    {
      key: 'marketingAutomation',
      icon: MessageSquare,
      title: t.marketingAutomation,
      description: t.marketingAutomationDesc,
      benefits: [
        t.campaignAutomation,
        t.customerSegmentation,
        t.abTesting,
        t.roiTracking
      ],
      color: 'from-purple-500 to-pink-600',
      insight: automationInsights.marketingAutomation
    }
  ];

  useEffect(() => {
    // Check for dependency warnings
    const warnings: string[] = [];
    
    if (!configurations.revenueTracking && configurations.leadFollowUp) {
      warnings.push('Revenue tracking improves lead follow-up accuracy by 34%');
    }
    
    if (configurations.marketingAutomation && !configurations.leadFollowUp) {
      warnings.push('Marketing automation requires lead follow-up for optimal performance (+45% effectiveness)');
    }
    
    setDependencyWarnings(warnings);
  }, [configurations]);

  const handleToggle = (key: string) => {
    onConfigurationChange(key, !configurations[key as keyof typeof configurations]);
  };

  const enabledCount = Object.values(configurations).filter(Boolean).length;
  const totalExpectedGain = configOptions
    .filter(option => configurations[option.key as keyof typeof configurations])
    .reduce((sum, option) => {
      const gain = option.insight.expectedGain;
      const value = parseInt(gain.match(/\d+/)?.[0] || '0');
      return sum + value;
    }, 0);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t.configureAutomation}
        </h2>
        <p className="text-gray-600" style={{ color: 'var(--text-secondary)' }}>
          AI-powered automation recommendations based on your business data
        </p>
        
        {/* AI Summary */}
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{enabledCount}</div>
              <div className="text-xs text-indigo-800">Automations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{totalExpectedGain}%</div>
              <div className="text-xs text-green-800">Expected Gain</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(configOptions.filter(option => configurations[option.key as keyof typeof configurations])
                  .reduce((sum, option) => sum + option.insight.confidence, 0) / Math.max(enabledCount, 1))}%
              </div>
              <div className="text-xs text-purple-800">Avg Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dependency Warnings */}
      <AnimatePresence>
        {dependencyWarnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">AI Recommendations:</h4>
                {dependencyWarnings.map((warning, index) => (
                  <p key={index} className="text-sm text-amber-700 mb-1">• {warning}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configOptions.map((option, index) => {
          const Icon = option.icon;
          const isEnabled = configurations[option.key as keyof typeof configurations];
          const insight = option.insight;
          
          return (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isEnabled 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Priority Badge */}
              <div className="absolute -top-3 right-4">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Priority #{insight.priority}
                </span>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggle(option.key)}
                  className="focus:outline-none"
                >
                  {isEnabled ? (
                    <ToggleRight className="w-8 h-8 text-blue-500" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400" />
                  )}
                </motion.button>
              </div>

              {/* AI Insights */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">AI Analysis:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.predictedImpact)}`}>
                      {insight.predictedImpact} IMPACT
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {insight.confidence}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">{insight.expectedGain}</span>
                  <span className="text-sm text-gray-600">Risk reduction: {insight.riskReduction}%</span>
                </div>

                {insight.recommended && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Recommended</span>
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Benefits:</p>
                {option.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    {isEnabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full shrink-0" />
                    )}
                    <span className={`text-sm ${isEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Simulation Section */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setShowSimulation(showSimulation === option.key ? null : option.key)}
                  className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{showSimulation === option.key ? 'Hide' : 'Show'} AI Simulation</span>
                </button>

                <AnimatePresence>
                  {showSimulation === option.key && insight.simulation && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-indigo-800">Predicted Monthly Value:</span>
                        <span className="text-lg font-bold text-green-600">{insight.simulation.monthlyValue}</span>
                      </div>
                      <p className="text-xs text-indigo-700">{insight.simulation.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-900">AI Automation Impact Summary</h3>
        </div>
        
        {enabledCount > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                <ArrowUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">+{totalExpectedGain}%</div>
                <div className="text-sm text-gray-600">Expected Revenue Gain</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(configOptions.filter(option => configurations[option.key as keyof typeof configurations])
                    .reduce((sum, option) => sum + option.insight.riskReduction, 0) / Math.max(enabledCount, 1))}%
                </div>
                <div className="text-sm text-gray-600">Avg Risk Reduction</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-purple-200">
                <Brain className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(configOptions.filter(option => configurations[option.key as keyof typeof configurations])
                    .reduce((sum, option) => sum + option.insight.confidence, 0) / Math.max(enabledCount, 1))}%
                </div>
                <div className="text-sm text-gray-600">AI Confidence</div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-xl border border-purple-200">
              <p className="text-sm text-purple-800 font-medium mb-2">
                With {enabledCount} AI-powered automation{enabledCount !== 1 ? 's' : ''} enabled:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-purple-800">Save 15+ hours per week on manual tasks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-purple-800">Recover {configOptions.filter(option => configurations[option.key as keyof typeof configurations] && option.insight.simulation)
                    .reduce((sum, option) => sum + parseInt(option.insight.simulation!.monthlyValue.replace('$', '').replace(',', '')), 0).toLocaleString()}/month in lost revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-purple-800">Improve decision making with real-time insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-purple-800">Reduce operational risks by {Math.round(configOptions.filter(option => configurations[option.key as keyof typeof configurations])
                    .reduce((sum, option) => sum + option.insight.riskReduction, 0) / Math.max(enabledCount, 1))}%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-purple-600">
              Enable AI-recommended automations to see predicted financial impact and risk reduction
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
