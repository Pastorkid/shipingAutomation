'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

// Interface for onboarding data
interface OnboardingData {
  // Basic business info
  businessName: string;
  industry: string;
  companySize: string;
  website: string;
  currency: string;
  timezone: string;
  
  // Setup preferences
  setupMethod: 'connect' | 'upload' | 'manual';
  connectedIntegrations: string[];
  uploadedFiles: string[];
  
  // Automation preferences
  revenueTracking: boolean;
  leadFollowUp: boolean;
  costMonitoring: boolean;
  marketingAutomation: boolean;
  
  // Selected templates
  selectedTemplates: string[];
  
  // Business health data
  businessHealthScore: number;
  metrics: {
    revenueGrowth: number;
    costEfficiency: number;
    automationLevel: number;
    customerRetention: number;
  };
}

interface OnboardingDataCollectorProps {
  onStepComplete: (step: number, data: Partial<OnboardingData>) => void;
  onComplete: (data: OnboardingData) => void;
  currentStep: number;
}

export default function OnboardingDataCollector({ 
  onStepComplete, 
  onComplete, 
  currentStep 
}: OnboardingDataCollectorProps) {
  const { t } = useTranslation();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: '',
    industry: '',
    companySize: '',
    website: '',
    currency: 'USD',
    timezone: 'America/New_York',
    setupMethod: 'manual',
    connectedIntegrations: [],
    uploadedFiles: [],
    revenueTracking: false,
    leadFollowUp: false,
    costMonitoring: false,
    marketingAutomation: false,
    selectedTemplates: [],
    businessHealthScore: 0,
    metrics: {
      revenueGrowth: 0,
      costEfficiency: 0,
      automationLevel: 0,
      customerRetention: 0,
    },
  });

  // Update data when step changes
  useEffect(() => {
    // Save current step data
    onStepComplete(currentStep, onboardingData);
  }, [currentStep, onboardingData, onStepComplete]);

  // Update specific data fields
  const updateData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update nested metrics
  const updateMetrics = (metric: keyof OnboardingData['metrics'], value: number) => {
    setOnboardingData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  // Calculate business health score
  const calculateBusinessHealthScore = () => {
    const { metrics } = onboardingData;
    const weights = {
      revenueGrowth: 0.3,
      costEfficiency: 0.25,
      automationLevel: 0.25,
      customerRetention: 0.2,
    };

    const score = Math.round(
      metrics.revenueGrowth * weights.revenueGrowth +
      metrics.costEfficiency * weights.costEfficiency +
      metrics.automationLevel * weights.automationLevel +
      metrics.customerRetention * weights.customerRetention
    );

    updateData('businessHealthScore', score);
    return score;
  };

  // Save onboarding completion
  const saveOnboarding = async () => {
    const finalData = {
      ...onboardingData,
      businessHealthScore: calculateBusinessHealthScore(),
    };

    try {
      // Log onboarding data for now (no server connection)
      console.log('🎯 Onboarding Data Collected:', finalData);
      console.log('✅ Business Health Score:', finalData.businessHealthScore);
      console.log('📊 Setup Method:', finalData.setupMethod);
      console.log('🔗 Connected Integrations:', finalData.connectedIntegrations);
      console.log('📁 Uploaded Files:', finalData.uploadedFiles);
      console.log('⚡ Automation Preferences:', {
        revenueTracking: finalData.revenueTracking,
        leadFollowUp: finalData.leadFollowUp,
        costMonitoring: finalData.costMonitoring,
        marketingAutomation: finalData.marketingAutomation,
      });
      console.log('📋 Selected Templates:', finalData.selectedTemplates);
      console.log('📈 Metrics:', finalData.metrics);
      
      // Simulate successful save without server connection
      setTimeout(() => {
        onComplete(finalData);
      }, 500);
    } catch (error) {
      console.error('Error processing onboarding data:', error);
    }
  };

  // Expose methods to parent components
  useEffect(() => {
    // Make these methods available globally for other components to call
    (window as any).onboardingDataCollector = {
      updateData,
      updateMetrics,
      calculateBusinessHealthScore,
      saveOnboarding,
      getData: () => onboardingData,
    };
  }, [onboardingData]);

  return null; // This component doesn't render anything, it just manages data
}

// Type declaration for global window object
declare global {
  interface Window {
    onboardingDataCollector?: {
      updateData: (field: keyof OnboardingData, value: any) => void;
      updateMetrics: (metric: keyof OnboardingData['metrics'], value: number) => void;
      calculateBusinessHealthScore: () => number;
      saveOnboarding: () => Promise<void>;
      getData: () => OnboardingData;
    };
  }
}
