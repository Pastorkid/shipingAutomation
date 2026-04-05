'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CreditCard, FileSpreadsheet, Upload, CheckCircle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOnBoardingStore } from '../store/auth/onBoarding/onBoardingStore';
import { useConnectedToolsStore } from '../store/connectedTools/connectedToolsStore';

// V1 Components - Focus on payment tracking only
import StripeConnection from '../components/v1/StripeConnection';
import GoogleSheetsConnection from '../components/v1/GoogleSheetsConnection';
import ManualDataUpload from '../components/v1/ManualDataUpload';
import V1SetupComplete from '../components/v1/V1SetupComplete';

// V1 Onboarding State - Simple and focused
interface V1OnboardingState {
  selectedMethod: 'stripe' | 'google-sheets' | 'manual' | null;
  stripeConnected: boolean;
  googleSheetsConnected: boolean;
  manualDataUploaded: boolean;
  setupComplete: boolean;
}

export default function V1OnboardingPage() {
  const { completeOnboarding } = useOnBoardingStore();
  const { tools, refreshTools } = useConnectedToolsStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingState, setOnboardingState] = useState<V1OnboardingState>({
    selectedMethod: null,
    stripeConnected: false,
    googleSheetsConnected: false,
    manualDataUploaded: false,
    setupComplete: false,
  });

  // V1 Steps - Simple and focused
  const steps = [
    {
      id: 'welcome',
      title: 'Choose Your Payment Tracking Method',
      description: 'Select how you want to track unpaid payments and invoices',
    },
    {
      id: 'setup',
      title: 'Connect Your Payment Source',
      description: 'Set up your chosen payment tracking method',
    },
    {
      id: 'complete',
      title: 'Setup Complete!',
      description: 'You\'re ready to start recovering payments',
    },
  ];

  const handleMethodSelect = (method: 'stripe' | 'google-sheets' | 'manual') => {
    setOnboardingState(prev => ({ ...prev, selectedMethod: method }));
    setCurrentStep(1);
  };

  const handleStripeConnected = () => {
    setOnboardingState(prev => ({ ...prev, stripeConnected: true }));
    setCurrentStep(2);
  };

  const handleGoogleSheetsConnected = () => {
    setOnboardingState(prev => ({ ...prev, googleSheetsConnected: true }));
    setCurrentStep(2);
  };

  const handleManualDataUploaded = () => {
    setOnboardingState(prev => ({ ...prev, manualDataUploaded: true }));
    setCurrentStep(2);
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Mark onboarding as completed in backend
      await completeOnboarding();
      setOnboardingState(prev => ({ ...prev, setupComplete: true }));
      
      toast.success('🎉 Setup complete! You can now start tracking unpaid payments.');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete setup. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                How do you want to track unpaid payments?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose one method to start tracking and recovering your unpaid invoices
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Stripe Connection */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMethodSelect('stripe')}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Connect Stripe</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Automatically detect failed payments and unpaid invoices from your Stripe account
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Automatic</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Real-time</span>
                  </div>
                </div>
              </motion.div>

              {/* Google Sheets Connection */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMethodSelect('google-sheets')}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Google Sheets</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Connect your existing Google Sheets with invoice data to track overdue payments
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Easy Setup</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Flexible</span>
                  </div>
                </div>
              </motion.div>

              {/* Manual Upload */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMethodSelect('manual')}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Upload Files</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Upload CSV, Excel, or PDF files with your invoice data to get started quickly
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">No Integration</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Quick Start</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">What happens next?</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Once connected, RevOps AI will automatically detect overdue payments and send follow-up reminders to help you recover lost revenue.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {onboardingState.selectedMethod === 'stripe' && 'Connect Your Stripe Account'}
                {onboardingState.selectedMethod === 'google-sheets' && 'Connect Google Sheets'}
                {onboardingState.selectedMethod === 'manual' && 'Upload Your Invoice Data'}
              </h2>
              <p className="text-lg text-gray-600">
                Follow the steps below to set up your payment tracking
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {onboardingState.selectedMethod === 'stripe' && (
                <StripeConnection onConnected={handleStripeConnected} />
              )}
              {onboardingState.selectedMethod === 'google-sheets' && (
                <GoogleSheetsConnection onConnected={handleGoogleSheetsConnected} />
              )}
              {onboardingState.selectedMethod === 'manual' && (
                <ManualDataUpload onUploaded={handleManualDataUploaded} />
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <V1SetupComplete
              selectedMethod={onboardingState.selectedMethod}
              onComplete={handleCompleteOnboarding}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-sm ${
                  index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {currentStep > 0 && currentStep < 2 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
