export interface RequestOtpState {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  requestOtp: (email: string, purpose?: string) => Promise<boolean>;
}