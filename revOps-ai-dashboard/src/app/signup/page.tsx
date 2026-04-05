'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import OAuthButton from '../components/OAuthButton';
import LanguageSelector from '../components/LanguageSelector';

import ComprehensiveSignupForm from '../components/ComprehensiveSignupForm';
import { useTranslation } from '../hooks/useTranslation';

export default function SignupPage() {
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const router = useRouter();
  
  // Use global translations
  const { t } = useTranslation();

  const handleSignup = async (formData: any) => {
    setEmailLoading(true);
    
    try {
      console.log('V1 signup data:', formData);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          timezone: formData.timezone || 'UTC',
          currency: formData.currency || 'USD',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Account created successfully! Please check your email for verification.');
        // Redirect to OTP verification for signup
        const timestamp = Date.now();
        router.push(`/verifyOtp?email=${encodeURIComponent(formData.email)}&purpose=signup&timestamp=${timestamp}`);
      } else {
        const errorMessage = data.message || 'Signup failed. Please try again.';
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: string) => {
    setOauthLoading(provider);
    
    try {
      // Redirect to backend OAuth endpoint
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/connect-tools/oauth/${provider}`;
    } catch (error) {
      console.error('OAuth signup error:', error);
      toast.error(`${provider} signup failed. Please try again.`);
      setOauthLoading(null);
    }
  };

  const handleVerificationSuccess = () => {
    // Navigate to onboarding after successful verification
    router.push('/onboarding');
  };

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
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-page)' }}>
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary to-primary-hover p-12 text-white"
        style={{ backgroundColor: 'var(--background-header)' }}
      >
        <div className="flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Start Your Payment Recovery Journey
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-md">
              Automate payment tracking and recovery with Stripe and Google Sheets integration
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Stripe Integration</h3>
                <p className="text-xs sm:text-sm opacity-75">Automatic payment tracking and invoicing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Google Sheets Sync</h3>
                <p className="text-xs sm:text-sm opacity-75">Real-time data synchronization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Payment Reminders</h3>
                <p className="text-xs sm:text-sm opacity-75">Automated overdue payment notifications</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8"
      >
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end mb-8"
          >
            <LanguageSelector variant="header" />
          </motion.div>

          {/* Signup Form Container */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8"
            style={{ backgroundColor: 'var(--background-card)' }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                variants={itemVariants}
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: 'var(--text-heading)' }}
              >
                Create Your Account
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Start automating your payment recovery today
              </motion.p>
            </div>

            {/* Comprehensive Signup Form */}
            <motion.div variants={itemVariants}>
              <ComprehensiveSignupForm
                onSubmit={handleSignup}
                loading={emailLoading}
              />
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={itemVariants}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--input-border)' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-medium" style={{ backgroundColor: 'var(--background-card)', color: 'var(--text-secondary)' }}>
                  {t.orContinueWith}
                </span>
              </div>
            </motion.div>

            {/* OAuth Buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-3"
            >
              <OAuthButton
                provider="google"
                onClick={() => handleOAuthSignup('google')}
                loading={oauthLoading === 'google'}
              />
              <OAuthButton
                provider="linkedin"
                onClick={() => handleOAuthSignup('linkedin')}
                loading={oauthLoading === 'linkedin'}
              />
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              variants={itemVariants}
              className="text-xs text-center mt-6"
              style={{ color: 'var(--text-secondary)' }}
            >
              <p>
                {t.agreeToTerms}{' '}
                <button className="hover:underline" style={{ color: 'var(--text-link)' }}>
                  {t.termsOfService}
                </button>{' '}
                {t.and}{' '}
                <button className="hover:underline" style={{ color: 'var(--text-link)' }}>
                  {t.privacyPolicy}
                </button>
              </p>
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-8"
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t.alreadyHaveAccount}{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="font-medium hover:underline transition-colors"
                  style={{ color: 'var(--text-link)' }}
                >
                  {t.signIn}
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Device Verification Modal */}
    </div>
  );
}
