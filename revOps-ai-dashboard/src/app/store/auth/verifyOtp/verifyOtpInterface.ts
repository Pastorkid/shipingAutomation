export interface VerifyOtpState {
  // State
  isLoading: boolean;
  error: string | null;
  
  // Timer State
  timeLeft: number;
  canResend: boolean;
  otpSentTime: number | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  verifyOtp: (verificationCode: string, email: string, purpose?: string) => Promise<boolean>;
  
  // Timer Actions
  setTimeLeft: (timeLeft: number) => void;
  setCanResend: (canResend: boolean) => void;
  setOtpSentTime: (otpSentTime: number | null) => void;
  initializeTimer: (email: string, purpose: string, timeout: number) => void;
  resetTimer: (email: string, purpose: string, timeout: number) => void;
  clearTimer: (email: string, purpose: string) => void;
}