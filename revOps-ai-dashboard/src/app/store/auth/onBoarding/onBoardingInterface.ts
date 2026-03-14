export interface OnBoardingState {
  // State
  isLoading: boolean;
  error: string | null;
  onboardingStep: number;
  onboardingCompleted: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
}