'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Cookie, Shield, BarChart, Megaphone, Settings2 } from 'lucide-react';
import { CookiePreferences } from '@/app/store/cookie/cookieInterface';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface CookieCategoryInfo {
  key: keyof CookiePreferences;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

const cookieCategories: CookieCategoryInfo[] = [
  {
    key: 'necessary',
    label: 'Essential Cookies',
    description: 'Required for the website to function properly, including authentication and security.',
    icon: Shield,
    required: true,
  },
  {
    key: 'analytics',
    label: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website to improve performance.',
    icon: BarChart,
  },
  {
    key: 'functional',
    label: 'Functional Cookies',
    description: 'Enable personalized features and remember your preferences for better experience.',
    icon: Settings2,
  },
  {
    key: 'marketing',
    label: 'Marketing Cookies',
    description: 'Used to deliver advertisements relevant to you and your interests.',
    icon: Megaphone,
  },
];

export function CookieConsentBanner() {
  const {
    hasConsented,
    preferences,
    shouldShowBanner,
    shouldShowSettings,
    acceptAll,
    acceptNecessary,
    acceptSelected,
    updatePreferences,
    hideBanner,
    showSettingsPanel,
    hideSettingsPanel,
  } = useCookieConsent();

  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Don't render if banner should not be shown
  if (!shouldShowBanner && !shouldShowSettings) {
    return null;
  }

  const handleCategoryToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return; // Can't toggle necessary cookies
    
    setLocalPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleAcceptSelected = () => {
    acceptSelected(localPreferences);
  };

  const handleSaveSettings = () => {
    updatePreferences(localPreferences);
    hideSettingsPanel();
    hideBanner();
  };

  // Settings Panel Modal
  if (shouldShowSettings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="mx-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Cookie className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your cookie preferences for RevOps AI
                  </p>
                </div>
              </div>
              <button
                onClick={hideSettingsPanel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Cookie Categories */}
          <div className="p-6 space-y-4">
            {cookieCategories.map((category) => {
              const Icon = category.icon;
              const isEnabled = localPreferences[category.key];
              
              return (
                <div
                  key={category.key}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    category.required
                      ? 'border-blue-200 bg-blue-50/50'
                      : isEnabled
                      ? 'border-green-200 bg-green-50/50'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      category.required
                        ? 'bg-blue-100'
                        : isEnabled
                        ? 'bg-green-100'
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        category.required
                          ? 'text-blue-600'
                          : isEnabled
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {category.label}
                            {category.required && (
                              <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                Always Required
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        </div>
                        
                        {!category.required && (
                          <button
                            onClick={() => handleCategoryToggle(category.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEnabled ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex gap-3">
                <button
                  onClick={acceptNecessary}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Accept Necessary Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Accept All
                </button>
              </div>
              
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Banner
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon and Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <Cookie className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  RevOps AI uses cookies to personalize content, analyze traffic, and improve our services. 
                  Your privacy is important to us. Learn more in our{' '}
                  <a 
                    href="/privacy" 
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={showSettingsPanel}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Customize</span>
              </button>
              
              <button
                onClick={acceptNecessary}
                className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Reject
              </button>
              
              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
