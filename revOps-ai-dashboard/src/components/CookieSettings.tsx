'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Shield, BarChart, Megaphone, Settings2, RotateCcw } from 'lucide-react';
import { CookiePreferences } from '@/app/store/cookie/cookieInterface';
import { useCookieStore } from '@/app/store/cookie/cookieStore';

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
    description: 'Required for the website to function properly, including authentication, security, and core functionality.',
    icon: Shield,
    required: true,
  },
  {
    key: 'analytics',
    label: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website by collecting and reporting information anonymously.',
    icon: BarChart,
  },
  {
    key: 'functional',
    label: 'Functional Cookies',
    description: 'Enable enhanced functionality and personalization, such as videos, live chats, and preferred language settings.',
    icon: Settings2,
  },
  {
    key: 'marketing',
    label: 'Marketing Cookies',
    description: 'Used to deliver advertisements that are relevant to you and your interests, both on and off our website.',
    icon: Megaphone,
  },
];

export function CookieSettings() {
  const {
    preferences,
    consentDate,
    lastUpdated,
    updatePreferences,
    resetConsent,
  } = useCookieStore();

  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  }, [preferences]);

  useEffect(() => {
    const changed = JSON.stringify(localPreferences) !== JSON.stringify(preferences);
    setHasChanges(changed);
  }, [localPreferences, preferences]);

  const handleCategoryToggle = (category: keyof CookiePreferences) => {
    if (category === 'necessary') return; // Can't toggle necessary cookies
    
    setLocalPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSaveChanges = () => {
    updatePreferences(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all cookie preferences? This will remove all cookies and show the consent banner again.')) {
      resetConsent();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cookie className="w-6 h-6 text-blue-600" />
            </div>
            Cookie Preferences
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your cookie preferences and privacy settings for RevOps AI.
          </p>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>
      </div>

      {/* Consent Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Consent Status</h3>
            <p className="text-blue-700 text-sm mt-1">
              {preferences.necessary && Object.values(preferences).some(Boolean) 
                ? 'You have provided consent for cookies'
                : 'No consent provided yet'
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-700">
              <span className="font-medium">First Consent:</span> {formatDate(consentDate)}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Last Updated:</span> {formatDate(lastUpdated)}
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cookie Categories</h3>
        
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
                      <h4 className="font-semibold text-gray-900">
                        {category.label}
                        {category.required && (
                          <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Always Required
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {!category.required && (
                      <button
                        onClick={() => handleCategoryToggle(category.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
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

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">About Cookies</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.
          </p>
          <p>
            <strong>Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
          </p>
          <p>
            <strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.
          </p>
          <p>
            <strong>Marketing Cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For more information, please read our{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium underline">
              Terms of Service
            </a>.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setLocalPreferences(preferences)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
