'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { Clock, AlertTriangle, Crown } from 'lucide-react';

interface TrialBannerProps {
  trialStartDate?: string;
  trialDurationDays?: number;
  className?: string;
}

export default function TrialBanner({ 
  trialStartDate, 
  trialDurationDays = 2, 
  className = '' 
}: TrialBannerProps) {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // Use provided start date or default to now
    const start = trialStartDate ? new Date(trialStartDate) : new Date();
    const expiration = new Date(start.getTime() + trialDurationDays * 24 * 60 * 60 * 1000);

    const updateCountdown = () => {
      const now = new Date();
      const difference = expiration.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [trialStartDate, trialDurationDays]);

  if (timeRemaining.isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Trial Expired
              </h3>
              <p className="text-sm text-red-700">
                Your free trial has ended. Upgrade to continue using RevOps AI.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/subscription'}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Upgrade Now
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const totalHours = timeRemaining.days * 24 + timeRemaining.hours;
  const isUrgent = totalHours < 24;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isUrgent 
          ? 'bg-orange-50 border-orange-200' 
          : 'bg-blue-50 border-blue-200'
      } border rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`shrink-0 ${isUrgent ? 'animate-pulse' : ''}`}>
            {isUrgent ? (
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            ) : (
              <Clock className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-medium ${
              isUrgent ? 'text-orange-800' : 'text-blue-800'
            }`}>
              {isUrgent ? 'Trial Ending Soon!' : 'Free Trial Active'}
            </h3>
            <p className={`text-sm ${
              isUrgent ? 'text-orange-700' : 'text-blue-700'
            }`}>
              {timeRemaining.days > 0 && `${timeRemaining.days} days, `}
              {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s remaining
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <Crown className="h-4 w-4" />
            <span>Free Trial</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/subscription'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isUrgent
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Upgrade Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
