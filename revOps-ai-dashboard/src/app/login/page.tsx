'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoginFormWithRecaptcha from '../components/LoginFormWithRecaptcha';
import OAuthButton from '../components/OAuthButton';
import { OAuthLoginButtons } from '../components/auth/OAuthLoginButtons';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import { useSearchParams } from 'next/navigation';
import { useOAuthStore } from '@/app/store/auth/login/oauth/oauthStore';

function LoginContent() {
  const [emailLoading, setEmailLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useOAuthStore();
  
  // Use global translations
  const { t } = useTranslation();

  // Handle OAuth callbacks
  React.useEffect(() => {
    const oauth = searchParams.get('oauth');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (oauth || error) {
      const url = searchParams.toString();
      if (url) {
        handleOAuthCallback(url);
      }
    }
  }, [searchParams, handleOAuthCallback]);

  const handleLogin = async (loginData: { email: string; password: string; rememberMe: boolean; recaptchaToken: string }) => {
    setEmailLoading(true);
    
    try {
      console.log('Login data:', { ...loginData, password: '[HIDDEN]' });
      
      // Call backend API with error boundary
      let response;
      try {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
            rememberMe: loginData.rememberMe,
            recaptchaToken: loginData.recaptchaToken,
          }),
        });
      } catch (fetchError) {
        console.log('🔍 Fetch error:', fetchError);
        throw new Error('Network error: Unable to connect to server');
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.log('🔍 JSON parse error:', jsonError);
        throw new Error('Server response error: Invalid response format');
      }

      if (data.success) {
        // Success path
        try {
          toast.success('Login successful! Welcome back.');
        } catch (toastError) {
          console.log('🔍 Success toast error:', toastError);
        }
        
        // Store remember me preference
        if (loginData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          // ✅ SECURITY: Don't store email in localStorage - use Zustand only
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail'); // Clean up any existing email
        }

        // Check redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/dashboard';
        
        // Check if device verification is required
        if (data.data?.requiresVerification) {
          console.log('🔐 LOGIN PAGE: Device verification required, redirecting to verifyOtp');
          toast.success('Login successful! Please complete device verification.');
          
          // Redirect to verifyOtp page with device verification purpose and email
          const verifyOtpUrl = `/verifyOtp?purpose=device_verification&email=${encodeURIComponent(loginData.email)}`;
          window.location.href = verifyOtpUrl;
        } else {
          console.log('🔐 LOGIN PAGE: No device verification required, redirecting');
          try {
            router.push(redirectTo);
          } catch (routerError) {
            console.log('🔍 Router push error:', routerError);
          }
        }
      } else {
        // Error path
        const errorMessage = data.message || 'Login failed. Please check your credentials.';
        try {
          toast.error(errorMessage, {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: 'white',
            },
          });
        } catch (toastError) {
          console.log('🔍 Error toast error:', toastError);
        }
        // Error handled by toast - no console.error needed
      }
    } catch (error: any) {
      // Debug the exact error structure
      console.log('🔍 CATCH BLOCK - Error type:', typeof error);
      console.log('🔍 CATCH BLOCK - Error constructor:', error?.constructor?.name);
      console.log('🔍 CATCH BLOCK - Error keys:', Object.keys(error || {}));
      console.log('🔍 CATCH BLOCK - Error message:', error?.message);
      console.log('🔍 CATCH BLOCK - Full error:', error);
      
      // Only handle real errors
      if (error && error.message && typeof error.message === 'string' && error.message.trim() !== '') {
        toast.error(error.message, {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
      } else {
        // Silently ignore all other errors (empty objects, null, undefined, etc.)
        console.log('🔍 CATCH BLOCK - Silently ignoring error:', error);
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // ✅ SECURITY: Don't load email or rememberMe from localStorage for security
  // Users will set their preferences each session for better security

  const handleOAuthLogin = async (provider: string) => {
    setOauthLoading(provider);
    
    try {
      // Simulate OAuth login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`${provider} login successful!`);
      // OAuth login doesn't require device verification, redirect directly
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('OAuth login error:', error);
      toast.error(`${provider} login failed. Please try again.`);
    } finally {
      setOauthLoading(null);
    }
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
              {t.welcomeBack}
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-md">
              {t.signInToAccount}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Secure authentication with reCAPTCHA</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Remember me for convenient access</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-sm">Device verification for enhanced security</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Language Selector */}
          <div className="flex justify-end mb-6">
            <LanguageSelector variant="header" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Login Form Container */}
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
                {t.welcomeBack}
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.signInToAccount}
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div variants={itemVariants}>
              <LoginFormWithRecaptcha onSubmit={handleLogin} loading={emailLoading} />
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
                  {t.orContinueWith || 'Or continue with'}
                </span>
              </div>
            </motion.div>

            {/* OAuth Buttons */}
            <motion.div
              variants={itemVariants}
              className="space-y-3"
            >
              <OAuthLoginButtons />
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              variants={itemVariants}
              className="text-center mt-8"
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t.dontHaveAccount || "Don't have an account?"}{' '}
                <a
                  href="/signup"
                  className="font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  {t.signUpHere || 'Sign up here'}
                </a>
              </p>
            </motion.div>
          </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Main component
export default function LoginPage() {
  return <LoginContent />;
}
