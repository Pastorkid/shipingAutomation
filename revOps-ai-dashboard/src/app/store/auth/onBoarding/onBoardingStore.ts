import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnBoardingState } from './onBoardingInterface';

// Helper function to get session cookie
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
};

export const useOnBoardingStore = create<OnBoardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      onboardingStep: 0,
      onboardingCompleted: false,
      businessConfigCompleted: false,

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      updateOnboardingStep: (step: number) => {
        set({ onboardingStep: step });
      },

      completeBusinessConfig: () => {
        set({ 
          businessConfigCompleted: true,
          onboardingStep: 1 // Move to next step after business config
        });
      },

      completeOnboarding: async () => {
        try {
          // Call backend API to complete onboarding
          const sessionValue = getCookie('session');
          
          const response = await fetch('/api/auth/complete-onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(sessionValue && { 'Cookie': `session=${sessionValue}` })
            }
          });

          if (!response.ok) {
            throw new Error('Failed to complete onboarding');
          }

          // Update local state after successful backend update
          set({ 
            onboardingCompleted: true, 
            onboardingStep: 0 
          });
        } catch (error) {
          console.error('Error completing onboarding:', error);
          throw error;
        }
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        onboardingStep: state.onboardingStep,
        onboardingCompleted: state.onboardingCompleted,
        businessConfigCompleted: state.businessConfigCompleted,
      }),
    }
  )
);