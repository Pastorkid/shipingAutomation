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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-xl p-8 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            Trial Expired
          </h1>
          
          <p className="text-gray-600 mb-8" style={{ color: 'var(--text-secondary)' }}>
            Your free trial has ended. Upgrade to a paid plan to continue accessing RevOps AI and unlock powerful features to grow your business.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-left p-3 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                  Unlimited Automation
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Automate unlimited workflows and integrations
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <h4 className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                  Advanced Analytics
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Get detailed insights and revenue forecasting
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left p-3 bg-purple-50 rounded-lg">
              <Headphones className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <h4 className="font-medium text-sm" style={{ color: 'var(--text-heading)' }}>
                  Priority Support
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Get help from our team whenever you need it
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/subscription'}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Now</span>
            </motion.button>
            
            <button
              onClick={() => window.location.href = '/subscription'}
              className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
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
