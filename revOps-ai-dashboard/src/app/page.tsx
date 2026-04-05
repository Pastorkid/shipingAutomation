'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, FileSpreadsheet, TrendingUp, Settings, Bell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';
import { useTranslation } from './hooks/useTranslation';


export default function Home() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [animationKey, setAnimationKey] = useState(0);

  // Force re-animation when language changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [language]);

  const features = [
    {
      icon: CreditCard,
      title: 'Stripe Integration',
      description: 'Connect your Stripe account to automatically track invoices, payments, and customer billing information',
      color: 'var(--primary)',
      stats: 'Automated Payment Tracking'
    },
    {
      icon: FileSpreadsheet,
      title: 'Google Sheets Sync',
      description: 'Sync payment data directly to Google Sheets for easy reporting, analysis, and financial management',
      color: 'var(--accent-green)',
      stats: 'Real-time Data Sync'
    },
    {
      icon: Bell,
      title: 'Payment Recovery',
      description: 'Automated reminders and follow-ups for overdue payments to improve cash flow and reduce bad debt',
      color: 'var(--accent-orange)',
      stats: 'Reduce Overdue Payments by 60%'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Analytics',
      description: 'Simple dashboard to track payment trends, revenue growth, and customer payment behavior',
      color: 'var(--primary)',
      stats: 'Clear Financial Insights'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for small businesses getting started with payment recovery',
      features: [
        'Up to 500 customers',
        'Stripe integration',
        'Google Sheets sync',
        'Automated payment reminders',
        'Basic analytics'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing businesses needing advanced payment recovery',
      features: [
        'Up to 5,000 customers',
        'Advanced payment analytics',
        'Custom reminder templates',
        'Priority support',
        'CSV upload support',
        'Payment trend analysis'
      ],
      cta: 'Start Free Trial',
      popular: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-page)' }}>
      {/* Header with Language Selector */}
      <header className="flex justify-between items-center p-4 sm:p-6 border-b" style={{ borderColor: 'var(--input-border)' }}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image
              src="/myLogo.png"
              alt="RevOps AI Logo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 32px, 40px"
            />
          </div>
          <div>
            <span className="font-bold text-lg sm:text-xl" style={{ color: 'var(--text-heading)' }}>RevOps AI</span>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>{t.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button
            onClick={() => router.push('/settings')}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
          <LanguageSelector variant="header" />
          <motion.button
            onClick={() => router.push('/login')}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
            style={{ color: 'var(--text-link)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.login}
          </motion.button>
          <motion.button
            onClick={() => router.push('/signup')}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium text-white transition-colors text-sm sm:text-base"
            style={{ backgroundColor: 'var(--primary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.signup}
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 text-center"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 max-w-4xl"
          style={{ color: 'var(--text-heading)' }}
        >
          Automated Payment Recovery for Small Business
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          Connect Stripe and Google Sheets to automatically track payments, send reminders for overdue invoices, and improve your cash flow.
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <motion.button
            onClick={() => router.push('/signup')}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-white flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
            style={{ backgroundColor: 'var(--primary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t.getStarted}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            onClick={() => router.push('/login')}
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold border-2 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            style={{ 
              borderColor: 'var(--primary)', 
              color: 'var(--primary)',
              backgroundColor: 'transparent'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{t.login}</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-12 sm:py-20"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
            V1 Payment Recovery Features
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Essential tools to automate payment tracking and recovery for your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto" key={animationKey}>
          {features.map((feature, index) => (
            <motion.div
              key={`${feature.title}-${animationKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1 
              }}
              className="bg-white rounded-xl p-4 sm:p-6 border text-center hover:shadow-lg transition-shadow"
              style={{ 
                backgroundColor: 'var(--background-card)', 
                borderColor: 'var(--input-border)'
              }}
              whileHover={{ y: -5 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Professional Footer */}
      <Footer showNewsletter={true} showHelpButton={true} />
    </div>
  );
}
