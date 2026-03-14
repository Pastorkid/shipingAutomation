'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Zap, Shield, Headphones } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  trialStartDate?: string;
  trialDurationDays?: number;
}

export default function SubscriptionGuard({ 
  children, 
  trialStartDate, 
  trialDurationDays = 2 
}: SubscriptionGuardProps) {
  const [isExpired, setIsExpired] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const checkTrialStatus = () => {
      const start = trialStartDate ? new Date(trialStartDate) : new Date();
      const expiration = new Date(start.getTime() + trialDurationDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      
      setIsExpired(now > expiration);
    };

    checkTrialStatus();
    const interval = setInterval(checkTrialStatus, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [trialStartDate, trialDurationDays]);

  useEffect(() => {
    if (isExpired) {
      setShowUpgradeModal(true);
    }
  }, [isExpired]);

  if (!isExpired) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--text-heading)' }}>
            Trial Expired
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2" style={{ color: 'var(--text-secondary)' }}>
            Your free trial has ended. Upgrade to a paid plan to continue accessing RevOps AI and unlock powerful features to grow your business.
          </p>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-start sm:items-center space-x-3 text-left p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-heading)' }}>
                  Unlimited Automation
                </h4>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Automate unlimited workflows and integrations
                </p>
              </div>
            </div>

            <div className="flex items-start sm:items-center space-x-3 text-left p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-heading)' }}>
                  Advanced Analytics
                </h4>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Get detailed insights and revenue forecasting
                </p>
              </div>
            </div>

            <div className="flex items-start sm:items-center space-x-3 text-left p-3 sm:p-4 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--text-heading)' }}>
                  Priority Support
                </h4>
                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Get help from our team whenever you need it
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/subscription'}
              className="w-full bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Upgrade Now</span>
            </motion.button>
            
            <button
              onClick={() => window.location.href = '/subscription'}
              className="w-full py-2 sm:py-3 px-4 text-sm sm:text-base font-medium hover:font-semibold transition-all duration-200 rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--text-secondary)' }}
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
