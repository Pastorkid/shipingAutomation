import { create } from 'zustand';
import toast from 'react-hot-toast';
import { VerifyOtpState } from './verifyOtpInterface';

export const useVerifyOtpStore = create<VerifyOtpState>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,
  
  // Timer state
  timeLeft: 0,
  canResend: false,
  otpSentTime: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Timer actions
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  setCanResend: (canResend) => set({ canResend }),
  setOtpSentTime: (otpSentTime) => set({ otpSentTime }),
  
  // Initialize timer from localStorage or URL parameters
  initializeTimer: (email: string, purpose: string, timeout: number) => {
    const storageKey = `otp_timer_${email}_${purpose}`;
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
      try {
        const { otpSentTime: savedOtpSentTime } = JSON.parse(savedData);
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - savedOtpSentTime) / 1000);
        const remainingTime = Math.max(0, timeout - elapsedSeconds);
        
        set({
          timeLeft: remainingTime,
          canResend: remainingTime === 0,
          otpSentTime: savedOtpSentTime
        });
        
        return;
      } catch (error) {
        console.error('Error parsing saved timer data:', error);
        localStorage.removeItem(storageKey);
      }
    }
    
    // If no saved data or error, start fresh timer
    const now = Date.now();
    const timerData = {
      otpSentTime: now,
      email,
      purpose
    };
    
    localStorage.setItem(storageKey, JSON.stringify(timerData));
    
    set({
      timeLeft: timeout,
      canResend: false,
      otpSentTime: now
    });
  },
  
  // Reset timer (for resend OTP)
  resetTimer: (email: string, purpose: string, timeout: number) => {
    const storageKey = `otp_timer_${email}_${purpose}`;
    const now = Date.now();
    const timerData = {
      otpSentTime: now,
      email,
      purpose
    };
    
    localStorage.setItem(storageKey, JSON.stringify(timerData));
    
    set({
      timeLeft: timeout,
      canResend: false,
      otpSentTime: now
    });
  },
  
  // Clear timer data (after successful verification)
  clearTimer: (email: string, purpose: string) => {
    const storageKey = `otp_timer_${email}_${purpose}`;
    localStorage.removeItem(storageKey);
    
    set({
      timeLeft: 0,
      canResend: false,
      otpSentTime: null
    });
  },

  verifyOtp: async (verificationCode: string, email: string, purpose?: string) => {
    console.log('🔍 VERIFY OTP STORE: Called with email:', email, 'purpose:', purpose);
    set({ isLoading: true, error: null });
    
    try {
      console.log('🔍 VERIFY OTP STORE: Sending request with body:', { verificationCode, email, purpose });
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          verificationCode, 
          email, 
          purpose 
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'Email verified successfully!', {
          duration: 5000,
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
        set({ isLoading: false, error: null });
        return true;
      } else {
        toast.error(data.message || 'Invalid OTP. Please check your code and try again.', {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
        set({ isLoading: false, error: data.message || 'OTP verification failed' });
        return false;
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.', {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
      set({ isLoading: false, error: 'OTP verification failed. Please try again.' });
      return false;
    }
  },
}));