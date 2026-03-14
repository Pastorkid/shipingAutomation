'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import OAuthButton from '../components/OAuthButton';
import LanguageSelector from '../components/LanguageSelector';
import DeviceVerificationModal from '../components/DeviceVerificationModal';
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
      console.log('Comprehensive signup data:', formData);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessSize: formData.businessSize,
          website: formData.website,
          timezone: formData.timezone,
          currency: formData.currency,
          preferredLanguage: formData.preferredLanguage,
          revenueGoal: formData.revenueGoal,
          communicationChannels: formData.communicationChannels,
          targetMonthlyRevenue: formData.targetMonthlyRevenue && !isNaN(parseInt(formData.targetMonthlyRevenue)) ? parseInt(formData.targetMonthlyRevenue) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Account created successfully! Please check your email for verification.');
        // Redirect to OTP verification for signup
        const timestamp = Date.now();
        router.push(`/verifyOtp?email=${encodeURIComponent(formData.email)}&purpose=signup&timestamp=${timestamp}`);
      } else {
        const errorMessage = data.message || 'Signup failed. Please try again.';
        toast.error(errorMessage, {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
        // Error handled by toast - no console.error needed
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
      // Simulate OAuth signup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${provider} account connected successfully!`);
      // Show device verification modal for demo
      setShowDeviceModal(true);
    } catch (error) {
      console.error('OAuth signup error:', error);
      toast.error(`${provider} signup failed. Please try again.`);
    } finally {
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
              {t.createAccount}
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-md">
              {t.joinCommunity}
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
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Professional Network</h3>
                <p className="text-xs sm:text-sm opacity-75">Connect with professionals worldwide</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Smart Analytics</h3>
                <p className="text-xs sm:text-sm opacity-75">AI-powered insights for your business</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base">Growth Tools</h3>
                <p className="text-xs sm:text-sm opacity-75">Scale your business with our platform</p>
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
                {t.createAccount}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.joinCommunity}
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
      <DeviceVerificationModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
}
