import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OnBoardingState } from './onBoardingInterface';

export const useOnBoardingStore = create<OnBoardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      onboardingStep: 0,
      onboardingCompleted: false,

      // Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      updateOnboardingStep: (step: number) => {
        set({ onboardingStep: step });
      },

      completeOnboarding: () => {
        set({ 
          onboardingCompleted: true, 
          onboardingStep: 0 
        });
      },
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        onboardingStep: state.onboardingStep,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);