'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Building2, Globe, DollarSign } from 'lucide-react';
import { BusinessConfigDto } from '@/types/business-config';
import { useOnBoardingStore } from '@/app/store/auth/onBoarding/onBoardingStore';
import toast from 'react-hot-toast';

export default function BusinessConfigPage() {
  const router = useRouter();
  const { completeBusinessConfig } = useOnBoardingStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  const [formData, setFormData] = useState<BusinessConfigDto>({
    businessName: '',
    timezone: 'UTC',
    currency: 'USD',
  });

  // Check if business config is already completed and redirect
  useEffect(() => {
    const checkAndRedirect = async () => {
      console.log('🔍 Starting business config page check...');
      
      try {
        // First check: Auth endpoint
        console.log('📞 Checking auth status...');
        const authResponse = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (authResponse.ok) {
          const authResult = await authResponse.json();
          console.log('✅ Auth check result:', authResult);
          
          if (authResult.success && authResult.data?.user?.onboardingCompleted) {
            console.log('🚫 Onboarding completed - redirecting to /onboarding');
            setLoading(false);
            setShouldRedirect(true);
            
            // Force immediate redirect with multiple methods
            setTimeout(() => {
              window.location.href = '/onboarding';
              window.location.replace('/onboarding');
              router.push('/onboarding');
            }, 100);
            return;
          }
        }

        // Second check: Business config endpoint  
        console.log('📞 Checking business config status...');
        const businessResponse = await fetch('/api/auth/business-config', {
          method: 'GET',
          credentials: 'include',
        });

        if (businessResponse.ok) {
          const businessResult = await businessResponse.json();
          console.log('✅ Business config result:', businessResult);
          
          if (businessResult.success && businessResult.data?.onboardingCompleted) {
            console.log('🚫 Business config completed - redirecting to /onboarding');
            setLoading(false);
            setShouldRedirect(true);
            
            // Force immediate redirect with multiple methods
            setTimeout(() => {
              window.location.href = '/onboarding';
              window.location.replace('/onboarding');
              router.push('/onboarding');
            }, 100);
            return;
          }
          
          // Load form data if onboarding not completed
          if (businessResult.success && businessResult.data?.user) {
            console.log('📝 Loading form data...');
            setFormData({
              businessName: businessResult.data.user.businessName || '',
              timezone: businessResult.data.user.timezone || 'UTC',
              currency: businessResult.data.user.currency || 'USD',
            });
          }
        } else {
          console.log('❌ Business config check failed:', businessResponse.status);
          setError('Failed to load business configuration');
        }
      } catch (error) {
        console.error('❌ Error in checkAndRedirect:', error);
        setError('Failed to check business configuration status');
      } finally {
        console.log('✅ Finished checking - setting loading to false');
        setLoading(false);
      }
    };

    checkAndRedirect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/business-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save business configuration');
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        console.log('✅ Business config saved successfully, updating store and redirecting...');
        
        // Show success toast
        toast.success('Business configuration saved successfully!', {
          duration: 3000,
          style: {
            background: '#10b981',
            color: 'white',
          },
        });
        
        // Update onboarding store to mark business config as completed
        completeBusinessConfig();
        
        // Force session refresh and redirect to main onboarding
        console.log('🔄 Forcing session refresh and redirect to /onboarding...');
        
        // Force a session refresh by hitting the auth check endpoint multiple times
        try {
          await fetch('/api/auth/check', { method: 'GET', credentials: 'include' });
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait for session to update
          await fetch('/api/auth/check', { method: 'GET', credentials: 'include' });
        } catch (error) {
          console.log('Session refresh failed, proceeding with redirect anyway');
        }
        
        // More aggressive redirect with full page reload
        console.log('🔄 Performing hard redirect to /onboarding...');
        window.location.replace('/onboarding');
      } else {
        throw new Error(result.message || 'Failed to save business configuration');
      }
    } catch (error) {
      console.error('Error saving business config:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save business configuration';
      setError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setSaving(false);
    }
  };

  // V1 Simplified - No communication channels needed

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Redirect immediately if should redirect
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-page)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Redirecting to onboarding...</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-page)' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center w-full"
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading business configuration...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background-page)' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full flex items-center justify-center p-8 lg:p-12"
      >
        <div className="w-full max-w-4xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
              </motion.div>
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--primary)' }}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-family-heading)' }}>
                Configure Your Business
              </h1>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Help us understand your business so we can provide personalized AI insights and automation recommendations.
              </p>
            </motion.div>

            {/* Success Message */}
            {success && (
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--alert-success-bg)', borderColor: 'var(--accent-green)', color: 'var(--alert-success-text)' }}
              >
                <p>
                  Business configuration saved successfully! Redirecting to onboarding...
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-lg border border-red-200 bg-red-50"
                style={{ color: '#dc2626' }}
              >
                <p>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8" style={{ backgroundColor: 'var(--background-card)' }}>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-heading)', fontFamily: 'var(--font-family-heading)' }}>
                    Business Details
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Complete your business profile to continue with payment recovery setup.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Name */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label htmlFor="businessName" className="block text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                      Business Name *
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="Enter your business name"
                      required
                      className="w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--input-bg)', 
                        borderColor: 'var(--input-border)', 
                        color: 'var(--input-text)',
                        fontFamily: 'var(--font-family-sans)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--input-border-focus)';
                        e.target.style.boxShadow = '0 0 0 2px var(--input-border-focus)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--input-border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </motion.div>

                  {/* Timezone and Currency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="timezone" className="block text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                        Timezone *
                      </label>
                      <select
                        id="timezone"
                        value={formData.timezone}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'var(--input-bg)', 
                          borderColor: 'var(--input-border)', 
                          color: 'var(--input-text)'
                        }}
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="currency" className="block text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
                        Currency *
                      </label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          backgroundColor: 'var(--input-bg)', 
                          borderColor: 'var(--input-border)', 
                          color: 'var(--input-text)'
                        }}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        backgroundColor: saving ? 'var(--text-muted)' : 'var(--primary)',
                        opacity: saving ? 0.5 : 1
                      }}
                      whileHover={{ scale: saving ? 1 : 1.02 }}
                      whileTap={{ scale: saving ? 1 : 0.98 }}
                    >
                      {saving ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Saving...
                        </div>
                      ) : (
                        'Continue to Onboarding'
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
