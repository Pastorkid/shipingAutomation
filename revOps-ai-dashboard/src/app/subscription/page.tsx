'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSelector from '../components/LanguageSelector';
import { 
  Check, 
  X, 
  Zap, 
  BarChart3, 
  Headphones, 
  Puzzle, 
  UserCheck, 
  Code,
  Crown,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  yearlyPrice?: string;
  description: string;
  features: Array<{
    icon: React.ReactNode;
    text: string;
    included: boolean;
  }>;
  popular?: boolean;
  current?: boolean;
  onUpgrade: () => void;
}

function PricingCard({ 
  title, 
  price, 
  yearlyPrice, 
  description, 
  features, 
  popular = false, 
  current = false,
  onUpgrade 
}: PricingCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative rounded-xl p-8 ${
        popular 
          ? 'border-2 border-blue-500 shadow-xl' 
          : current
          ? 'border-2 border-green-500 shadow-lg'
          : 'border border-gray-200 shadow-lg'
      }`}
      style={{ 
        backgroundColor: 'var(--surface)',
        borderColor: popular ? 'var(--primary)' : current ? 'var(--success)' : 'var(--border)'
      }}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      {current && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {t.currentPlan}
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          {title}
        </h3>
        <div className="mb-2">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>
            {price}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            /{t.monthly}
          </span>
        </div>
        {yearlyPrice && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="line-through">{price}</span> {yearlyPrice}/{t.yearly}
            <span className="text-green-600 font-medium ml-1">
              ({t.save} 20%)
            </span>
          </div>
        )}
        <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="shrink-0 mt-0.5">
              {feature.included ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {feature.text}
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {feature.included ? '' : 'Not available in this plan'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpgrade}
        disabled={current}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          current
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {current ? t.currentPlan : t.upgradeNow}
      </motion.button>
    </motion.div>
  );
}

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = (plan: string) => {
    // In a real app, this would handle the payment process
    console.log(`Upgrading to ${plan} plan`);
    alert(`Redirecting to payment for ${plan} plan...`);
  };

  const pricingPlans = [
    {
      title: t.freeTrial,
      price: '$0',
      description: 'Perfect for trying out RevOps AI',
      current: true,
      features: [
        {
          icon: <Zap className="w-4 h-4" />,
          text: t.unlimitedAutomation,
          included: false,
        },
        {
          icon: <BarChart3 className="w-4 h-4" />,
          text: t.advancedAnalytics,
          included: false,
        },
        {
          icon: <Headphones className="w-4 h-4" />,
          text: t.prioritySupport,
          included: false,
        },
        {
          icon: <Puzzle className="w-4 h-4" />,
          text: t.customIntegrations,
          included: false,
        },
        {
          icon: <UserCheck className="w-4 h-4" />,
          text: t.dedicatedAccountManager,
          included: false,
        },
        {
          icon: <Code className="w-4 h-4" />,
          text: t.apiAccess,
          included: false,
        },
      ],
    },
    {
      title: t.proPlan,
      price: '$99',
      yearlyPrice: '$79',
      description: 'Best for growing businesses',
      popular: true,
      features: [
        {
          icon: <Zap className="w-4 h-4" />,
          text: t.unlimitedAutomation,
          included: true,
        },
        {
          icon: <BarChart3 className="w-4 h-4" />,
          text: t.advancedAnalytics,
          included: true,
        },
        {
          icon: <Headphones className="w-4 h-4" />,
          text: t.prioritySupport,
          included: true,
        },
        {
          icon: <Puzzle className="w-4 h-4" />,
          text: t.customIntegrations,
          included: false,
        },
        {
          icon: <UserCheck className="w-4 h-4" />,
          text: t.dedicatedAccountManager,
          included: false,
        },
        {
          icon: <Code className="w-4 h-4" />,
          text: t.apiAccess,
          included: false,
        },
      ],
    },
    {
      title: t.enterprisePlan,
      price: '$299',
      yearlyPrice: '$239',
      description: 'For large-scale operations',
      features: [
        {
          icon: <Zap className="w-4 h-4" />,
          text: t.unlimitedAutomation,
          included: true,
        },
        {
          icon: <BarChart3 className="w-4 h-4" />,
          text: t.advancedAnalytics,
          included: true,
        },
        {
          icon: <Headphones className="w-4 h-4" />,
          text: t.prioritySupport,
          included: true,
        },
        {
          icon: <Puzzle className="w-4 h-4" />,
          text: t.customIntegrations,
          included: true,
        },
        {
          icon: <UserCheck className="w-4 h-4" />,
          text: t.dedicatedAccountManager,
          included: true,
        },
        {
          icon: <Code className="w-4 h-4" />,
          text: t.apiAccess,
          included: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>
                  {t.subscription}
                </h1>
              </div>
            </div>
            <LanguageSelector variant="header" />
          </div>
        </div>
      </div>

      {/* Trial Expired Warning */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-b border-red-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                {t.trialExpired}
              </h3>
              <p className="text-sm text-red-700">
                {t.trialExpiredDesc}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.yearly}
            </button>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            {t.save} 20% with {t.yearly} billing
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <PricingCard
                title={plan.title}
                price={isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                yearlyPrice={isYearly ? undefined : plan.yearlyPrice}
                description={plan.description}
                features={plan.features}
                popular={plan.popular}
                current={plan.current}
                onUpgrade={() => handleUpgrade(plan.title)}
              />
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-lg"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--text-heading)' }}>
            Compare {t.features}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                    {t.freeTrial}
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                    {t.proPlan}
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                    {t.enterprisePlan}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.unlimitedAutomation}
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.advancedAnalytics}
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.prioritySupport}
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.customIntegrations}
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {t.apiAccess}
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <X className="w-5 h-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
