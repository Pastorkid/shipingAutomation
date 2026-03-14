'use client';

import { useEffect, useState } from 'react';
import { useCookieStore } from '@/app/store/cookie/cookieStore';

/**
 * Custom hook to handle cookie consent hydration
 * Prevents flash of cookie banner on page reload
 */
export function useCookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const {
    hasConsented,
    preferences,
    showBanner,
    showSettings,
    isHydrated,
    acceptAll,
    acceptNecessary,
    acceptSelected,
    updatePreferences,
    hideBanner,
    showSettingsPanel,
    hideSettingsPanel,
  } = useCookieStore();

  useEffect(() => {
    // Only ready when both hydrated and a small delay has passed
    // This ensures smooth loading experience
    if (isHydrated) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50); // Small delay to prevent any remaining flash

      return () => clearTimeout(timer);
    }
  }, [isHydrated]);

  return {
    // State
    hasConsented,
    preferences,
    showBanner,
    showSettings,
    isReady,
    
    // Actions
    acceptAll,
    acceptNecessary,
    acceptSelected,
    updatePreferences,
    hideBanner,
    showSettingsPanel,
    hideSettingsPanel,
    
    // Computed
    shouldShowBanner: isReady && showBanner && !hasConsented,
    shouldShowSettings: isReady && showSettings,
  };
}
