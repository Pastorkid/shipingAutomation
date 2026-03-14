import { create } from 'zustand';
import toast from 'react-hot-toast';
import { RequestOtpState } from './requestOtpInterface';

export const useRequestOtpStore = create<RequestOtpState>((set, get) => ({
  // Initial state
  isLoading: false,
  error: null,

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  requestOtp: async (email: string, purpose?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || 'OTP sent successfully! Please check your email.', {
          duration: 5000,
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
        set({ isLoading: false, error: null });
        return true;
      } else {
        toast.error(data.message || 'Failed to send OTP. Please try again.', {
          duration: 5000,
          style: {
            background: '#ef4444',
            color: 'white',
          },
        });
        set({ isLoading: false, error: data.message || 'OTP request failed' });
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
      set({ isLoading: false, error: 'OTP request failed. Please try again.' });
      return false;
    }
  },
}));