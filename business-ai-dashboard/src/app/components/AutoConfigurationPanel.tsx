'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight, Zap, DollarSign, Users, MessageSquare, BarChart3, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface AutoConfigurationPanelProps {
  configurations: {
    revenueTracking: boolean;
    leadFollowUp: boolean;
    costMonitoring: boolean;
    marketingAutomation: boolean;
  };
  onConfigurationChange: (key: string, value: boolean) => void;
}

export default function AutoConfigurationPanel({ 
  configurations, 
  onConfigurationChange 
}: AutoConfigurationPanelProps) {
  const { t } = useTranslation();

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
      popular: true
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
      color: 'from-blue-500 to-indigo-600'
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
      color: 'from-orange-500 to-red-600'
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
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handleToggle = (key: string) => {
    onConfigurationChange(key, !configurations[key as keyof typeof configurations]);
  };

  const enabledCount = Object.values(configurations).filter(Boolean).length;

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
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          {t.configureAutomation}
        </h2>
        <p className="text-gray-600" style={{ color: 'var(--text-secondary)' }}>
          {t.configureAutomationDesc}
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">
            {enabledCount} of {configOptions.length} {t.featuresEnabled}
          </span>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configOptions.map((option, index) => {
          const Icon = option.icon;
          const isEnabled = configurations[option.key as keyof typeof configurations];
          
          return (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isEnabled 
                  ? 'border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {t.recommended}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-linear-to-r ${option.color} flex items-center justify-center`}>
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

              {/* Benefits */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">{t.benefits}:</p>
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

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{t.status}:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isEnabled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isEnabled ? t.active : t.disabled}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
      >
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-purple-900">{t.aiAutomationSummary}</h3>
        </div>
        <p className="text-sm text-purple-700 mb-4">
          With {enabledCount} automation{enabledCount !== 1 ? 's' : ''} enabled, RevOps AI will:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {enabledCount > 0 ? (
            <>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-purple-800">{t.saveHoursPerWeek}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-purple-800">{t.increaseRevenueBy}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-purple-800">{t.reduceCostsBy}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-purple-800">{t.improveCustomerRetention}</span>
              </div>
            </>
          ) : (
            <div className="col-span-2 text-center py-4">
              <p className="text-sm text-purple-600">
                {t.enableAutomationToSeeBenefits}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
