import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CookieConsentState, CookiePreferences, defaultPreferences } from './cookieInterface';


export const useCookieStore = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      // Initial state
      hasConsented: false,
      preferences: defaultPreferences,
      consentDate: null,
      lastUpdated: null,
      showBanner: true,
      showSettings: false,
      isHydrated: false,

      // Accept all cookies
      acceptAll: () => {
        const allPreferences: CookiePreferences = {
          necessary: true,
          analytics: true,
          marketing: true,
          functional: true,
        };

        set({
          hasConsented: true,
          preferences: allPreferences,
          consentDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          showBanner: false,
          showSettings: false,
        });

        // Trigger analytics initialization if analytics is accepted
        get().initializeAnalytics(allPreferences);
      },

      // Accept only necessary cookies
      acceptNecessary: () => {
        const necessaryOnly: CookiePreferences = {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false,
        };

        set({
          hasConsented: true,
          preferences: necessaryOnly,
          consentDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          showBanner: false,
          showSettings: false,
        });

        // Remove analytics cookies if they exist
        get().removeAnalyticsCookies();
      },

      // Accept selected preferences
      acceptSelected: (preferences: CookiePreferences) => {
        set({
          hasConsented: true,
          preferences: {
            ...preferences,
            necessary: true, // Always necessary
          },
          consentDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          showBanner: false,
          showSettings: false,
        });

        // Initialize analytics based on preferences
        get().initializeAnalytics(preferences);
      },

      // Update preferences (for settings panel)
      updatePreferences: (preferences: CookiePreferences) => {
        set({
          preferences: {
            ...preferences,
            necessary: true, // Always necessary
          },
          lastUpdated: new Date().toISOString(),
        });

        // Re-initialize analytics based on new preferences
        get().initializeAnalytics(preferences);
      },

      // Hide banner
      hideBanner: () => {
        set({ showBanner: false });
      },

      // Show settings panel
      showSettingsPanel: () => {
        set({ showSettings: true });
      },

      // Hide settings panel
      hideSettingsPanel: () => {
        set({ showSettings: false });
      },

      // Reset consent (for testing or user request)
      resetConsent: () => {
        set({
          hasConsented: false,
          preferences: defaultPreferences,
          consentDate: null,
          lastUpdated: null,
          showBanner: true,
          showSettings: false,
        });

        // Clear all cookies
        get().clearAllCookies();
      },

      // Initialize analytics based on preferences
      initializeAnalytics: (preferences: CookiePreferences) => {
        if (preferences.analytics) {
          // Load Google Analytics or other analytics
          if (typeof window !== 'undefined' && !window.gtag) {
            // Initialize Google Analytics
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() {
              window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', 'GA_MEASUREMENT_ID', {
              cookie_flags: 'sameSite=none;secure',
            });
          }
        } else {
          // Remove analytics
          get().removeAnalyticsCookies();
        }
      },

      // Remove analytics cookies
      removeAnalyticsCookies: () => {
        if (typeof window !== 'undefined') {
          const analyticsCookies = [
            '_ga',
            '_gid',
            '_gat',
            'GA_MEASUREMENT_ID',
            // Add other analytics cookies as needed
          ];

          analyticsCookies.forEach(cookie => {
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          });
        }
      },

      // Clear all cookies
      clearAllCookies: () => {
        if (typeof window !== 'undefined') {
          document.cookie.split(';').forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          });
        }
      },

      // Set hydrated state
      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'cookie-consent',
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        preferences: state.preferences,
        consentDate: state.consentDate,
        lastUpdated: state.lastUpdated,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when persistence is loaded
        state?.setHydrated();
      },
    }
  )
);

// Type declarations for global window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
