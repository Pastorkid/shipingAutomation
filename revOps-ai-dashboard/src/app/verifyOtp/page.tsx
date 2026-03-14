'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import { useVerifyOtpStore } from '../store/auth/verifyOtp/verifyOtpStore';
import { useRequestOtpStore } from '../store/auth/requestOtp/requestOtpStore';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { 
    verifyOtp, 
    isLoading: verifyLoading, 
    error: verifyError,
    timeLeft,
    canResend,
    setTimeLeft,
    setCanResend,
    initializeTimer,
    resetTimer,
    clearTimer
  } = useVerifyOtpStore();
  const { requestOtp, isLoading: requestLoading } = useRequestOtpStore();
  
  const email = searchParams.get('email') || '';
  const reference = searchParams.get('reference') || '';
  const purpose = searchParams.get('purpose') as 'signup' | 'login' | 'device_verification' | 'password_reset' || 'signup';
  
  console.log('VERIFY OTP PAGE: Email from URL:', email);
  console.log('VERIFY OTP PAGE: Purpose:', purpose);
  if (typeof window !== 'undefined') {
    console.log('VERIFY OTP PAGE: Full URL:', window.location.href);
  }

  const otpSentTime = useMemo(() => {
    return searchParams.get('timestamp') ? parseInt(searchParams.get('timestamp')!) : Date.now();
  }, [searchParams]);

  // OTP timeout configurations based on purpose (matches backend OtpHelperService.OTP_TTL)
  const getTimeout = (purpose: string) => {
    switch (purpose) {
      case 'signup': return 240;        // 4 minutes for signup
      case 'login': return 300;         // 5 minutes for login
      case 'device_verification': return 600; // 10 minutes for device verification
      case 'password_reset': return 900; // 15 minutes for password reset
      default: return 240; // 4 minutes default
    }
  };

  const timeout = getTimeout(purpose);

  // Get purpose-specific content
  const getPurposeContent = () => {
    switch (purpose) {
      case 'signup':
        return {
          title: t.signupVerification,
          description: t.signupVerificationDesc,
          icon: <Mail className="w-8 h-8" />
        };
      case 'login':
        return {
          title: t.loginVerification,
          description: t.loginVerificationDesc,
          icon: <Shield className="w-8 h-8" />
        };
      case 'device_verification':
        return {
          title: t.deviceVerification,
          description: t.deviceVerificationDesc,
          icon: <Shield className="w-8 h-8" />
        };
      case 'password_reset':
        return {
          title: t.passwordResetVerification,
          description: t.passwordResetVerificationDesc,
          icon: <Mail className="w-8 h-8" />
        };
      default:
        return {
          title: t.verifyOtp,
          description: t.enterOtpCode,
          icon: <Shield className="w-8 h-8" />
        };
    }
  };

  const purposeContent = getPurposeContent();

  // Initialize timer from store or create new one
  useEffect(() => {
    // ✅ SECURITY: Only initialize timer if email exists (avoid empty email storage)
    if (email) {
      initializeTimer(email, purpose, timeout);
    }
  }, [email, purpose, timeout]);

  // Handle countdown timer
  useEffect(() => {
    // Only start timer if we have valid timer state (not initial state)
    if (timeLeft === 0 && !canResend) {
      // Don't start timer yet, wait for initialization
      return;
    }
    
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    
    const timer = setInterval(() => {
      const newTimeLeft = timeLeft - 1;
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft <= 0) {
        setCanResend(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, setTimeLeft, setCanResend]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-submit when all 5 digits are entered
    if (value && index === 4) {
      const otpCode = [...newOtp].join('');
      if (otpCode.length === 5) {
        setTimeout(() => handleVerify(), 100);
      }
    }
    
    setLocalError('');
  };

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 5);
    const newOtp = pastedData.split('').concat(Array(5 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus the last filled input
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0) {
      document.getElementById(`otp-${lastFilledIndex}`)?.focus();
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 5) {
      setLocalError(t.invalidOtp);
      return;
    }

    const success = await verifyOtp(otpCode, email, purpose);

    if (success) {
      // Clear timer data after successful verification
      clearTimer(email, purpose);
      setSuccess(true);
      setTimeout(() => {
        // Redirect based on purpose
        switch (purpose) {
          case 'signup':
            router.push('/dashboard');
            break;
          case 'login':
            router.push('/dashboard');
            break;
          case 'device_verification':
            router.push('/dashboard');
            break;
          case 'password_reset':
            router.push('/reset-password?token=' + reference || '');
            break;
          default:
            router.push('/dashboard');
        }
      }, 1500);
    } else {
      setLocalError(verifyError || t.verificationFailed);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    const success = await requestOtp(email, purpose);

    if (success) {
      // Reset timer using store function
      resetTimer(email, purpose, timeout);
      setOtp(['', '', '', '', '']);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            {t.verificationSuccessful}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Redirecting you...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8" style={{ backgroundColor: 'var(--surface)' }}>
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {purposeContent.icon}
          </div>

          {/* Title and Description */}
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--text-heading)' }}>
            {purposeContent.title}
          </h1>
          <p className="text-center mb-6" style={{ color: 'var(--text-secondary)' }}>
            {purposeContent.description}
          </p>

          {/* Email Display */}
          {email && (
            <div className="text-center mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t.otpSentTo}: <span className="font-medium" style={{ color: 'var(--text-heading)' }}>{email}</span>
              </p>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{ 
                    borderColor: 'var(--border)',
                    color: 'var(--text-heading)',
                    backgroundColor: 'var(--background)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifyLoading || otp.join('').length !== 5}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'var(--primary)',
              opacity: (verifyLoading || otp.join('').length !== 5) ? 0.5 : 1
            }}
          >
            {verifyLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>

          {/* Error Message */}
          {(localError || verifyError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{localError || verifyError}</p>
            </motion.div>
          )}

          {/* Resend Button */}
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={verifyLoading || requestLoading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
            >
              {t.resendCode}
            </button>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t.resendCodeIn} {formatTime(timeLeft)} {t.seconds}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}