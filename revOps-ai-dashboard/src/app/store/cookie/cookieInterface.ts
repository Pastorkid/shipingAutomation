export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'functional';

export interface CookiePreferences {
  necessary: boolean;    // Always true - required for app functionality
  analytics: boolean;   // Google Analytics, performance tracking
  marketing: boolean;   // Advertising cookies
  functional: boolean;  // Personalization, preferences
}

export interface CookieConsentState {
  // Consent state
  hasConsented: boolean;
  preferences: CookiePreferences;
  consentDate: string | null;
  lastUpdated: string | null;
  
  // UI state
  showBanner: boolean;
  showSettings: boolean;
  isHydrated: boolean; // Add hydration state
  
  // Actions
  acceptAll: () => void;
  acceptNecessary: () => void;
  acceptSelected: (preferences: CookiePreferences) => void;
  updatePreferences: (preferences: CookiePreferences) => void;
  hideBanner: () => void;
  showSettingsPanel: () => void;
  hideSettingsPanel: () => void;
  resetConsent: () => void;
  setHydrated: () => void;
  
  // Analytics and cookie management
  initializeAnalytics: (preferences: CookiePreferences) => void;
  removeAnalyticsCookies: () => void;
  clearAllCookies: () => void;
}

export const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};
