'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building, DollarSign, Link, CheckCircle, Globe, Users, Target, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import LanguageSelector from '../components/LanguageSelector';
import { useOnBoardingStore } from '../store/auth/onBoarding/onBoardingStore';
import { useConnectedToolsStore } from '../store/connectedTools/connectedToolsStore';
import { useTranslation } from '../hooks/useTranslation';
import SetupMethodSelector from '../components/SetupMethodSelector';
import IntegrationCard from '../components/IntegrationCard';
import DataUploadDropzone from '../components/DataUploadDropzone';
import BusinessDetectionSummary from '../components/BusinessDetectionSummary';
import IntelligentAutomationRecommender from '../components/IntelligentAutomationRecommender';
import AIBusinessAnalysis from '../components/AIBusinessAnalysis';
import AdvancedBusinessHealthScore from '../components/AdvancedBusinessHealthScore';
import EnhancedSetupComplete from '../components/EnhancedSetupComplete';
import { AutomationTemplateCard } from '../components/AutomationTemplateCard';
import { automationTemplates } from '../components/AutomationTemplateCard';
import BusinessHealthScore from '../components/BusinessHealthScore';

import OnboardingDataCollector from '../components/OnboardingDataCollector';
import ManualSetupFlow from '../components/ManualSetupFlow';
import ConnectedToolsFlow from '../components/integration/ConnectedToolsFlow';

// Advanced onboarding state
interface OnboardingState {
  setupMethod: 'connect' | 'upload' | 'manual' | null;
  connectedIntegrations: string[];
  uploadedFiles: File[];
  businessData: any;
  configurations: {
    revenueTracking: boolean;
    leadFollowUp: boolean;
    costMonitoring: boolean;
    marketingAutomation: boolean;
  };
  activeAutomations: string[];
  businessHealthScore: number;
}

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { updateOnboardingStep, completeOnboarding } = useOnBoardingStore();
  const searchParams = useSearchParams();
  const { tools, refreshTools } = useConnectedToolsStore();
  
  // Local state for detailed onboarding data
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    setupMethod: null,
    connectedIntegrations: [],
    uploadedFiles: [],
    businessData: null,
    configurations: {
      revenueTracking: false,
      leadFollowUp: false,
      costMonitoring: false,
      marketingAutomation: false,
    },
    activeAutomations: [],
    businessHealthScore: 0,
  });
  
  // Handle OAuth callbacks - Enhanced for better UX
  useEffect(() => {
    const tool = searchParams.get('tool');
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (tool && success) {
      if (success === 'true') {
        // Show success toast
        toast.success(`${tool.charAt(0).toUpperCase() + tool.slice(1)} connected successfully!`);
        
        // Ensure we're in connect mode and on step 2
        if (onboardingState.setupMethod !== 'connect') {
          setOnboardingState(prev => ({ ...prev, setupMethod: 'connect' }));
        }
        
        // Refresh tools to get the updated list
        refreshTools().then(() => {
          // Update onboarding state with the connected tool
          const toolId = tool === 'googlesheets' ? 'google' : tool;
          setOnboardingState(prev => ({
            ...prev,
            connectedIntegrations: [...(prev.connectedIntegrations || []), toolId]
          }));
          
          // Ensure we're on step 2 and in connect mode
          setCurrentStep(2);
        });
        
        // Clean up URL
        window.history.replaceState({}, '', '/onboarding');
      } else {
        toast.error(`${tool.charAt(0).toUpperCase() + tool.slice(1)} connection failed: ${error || 'Unknown error'}`);
        window.history.replaceState({}, '', '/onboarding');
      }
    }
  }, [searchParams, refreshTools]);
  
  // Initialize tools on component mount
  useEffect(() => {
    // Fetch tools when component mounts to ensure connected tools are loaded
    refreshTools();
  }, [refreshTools]);
  
  // Onboarding steps data
  const steps = [
    { id: 1, title: t.step1Title, icon: Target },
    { id: 2, title: t.step2Title, icon: Link },
    { id: 3, title: t.step3Title, icon: Zap },
    { id: 4, title: t.step4Title, icon: DollarSign },
    { id: 5, title: t.step5Title, icon: CheckCircle },
    { id: 6, title: t.step6Title, icon: Globe },
  ];

  // Industry options
  const industries = [
    { value: 'technology', label: t.technology },
    { value: 'ecommerce', label: t.ecommerce },
    { value: 'consulting', label: t.consulting },
    { value: 'saas', label: t.saas },
    { value: 'manufacturing', label: t.manufacturing },
    { value: 'healthcare', label: t.healthcare },
    { value: 'financial', label: t.financialServices },
    { value: 'other', label: t.other },
  ];

  // Currency options
  const currencies = [
    { value: 'USD', label: t.usd, symbol: '$' },
    { value: 'EUR', label: t.eur, symbol: '€' },
    { value: 'GBP', label: t.gbp, symbol: '£' },
    { value: 'JPY', label: t.jpy, symbol: '¥' },
    { value: 'CNY', label: t.cny, symbol: '¥' },
  ];

  // Timezone options
  const timezones = [
    { value: 'America/New_York', label: t.easternTime },
    { value: 'America/Chicago', label: t.centralTime },
    { value: 'America/Denver', label: t.mountainTime },
    { value: 'America/Los_Angeles', label: t.pacificTime },
    { value: 'Europe/London', label: t.londonGmt },
    { value: 'Europe/Paris', label: t.parisCet },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [activeAutomations, setActiveAutomations] = useState<string[]>([]);

  // Mock integrations data
  const integrations = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💳',
      category: 'Payment Processing',
      description: 'Process payments and manage subscriptions',
      status: 'disconnected' as const
    },
    {
      id: 'shopify',
      name: 'Shopify',
      icon: '🛒',
      category: 'E-commerce',
      description: 'Manage online store and inventory',
      status: 'disconnected' as const
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      icon: '📊',
      category: 'Accounting',
      description: 'Manage finances and accounting',
      status: 'disconnected' as const
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '💰',
      category: 'Payment Processing',
      description: 'Process payments and transfers',
      status: 'disconnected' as const
    },
  ];

  // Mock business detection data
  const mockBusinessData = {
    businessModel: 'E-commerce + SaaS Hybrid',
    revenueStreams: ['Product Sales', 'Subscription Revenue', 'Service Fees'],
    expenses: [
      { category: 'Marketing', amount: 5000, trend: 'up' as const },
      { category: 'Software', amount: 1200, trend: 'stable' as const },
      { category: 'Operations', amount: 3500, trend: 'down' as const },
    ],
    customers: {
      total: 1250,
      growth: 15,
      segments: ['B2B', 'B2C', 'Enterprise'],
    },
    growthTrend: {
      percentage: 23,
      period: 'Last 30 days',
      projection: 'Projected 45% growth in next quarter',
    },
    risks: [
      {
        type: 'High Customer Acquisition Cost',
        severity: 'medium' as const,
        description: 'CAC is 35% higher than industry average',
      },
      {
        type: 'Revenue Concentration',
        severity: 'low' as const,
        description: 'Top 3 customers represent 40% of revenue',
      },
    ],
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)',
    }),
  };

  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && currentStep < steps.length) {
      setDirection(newDirection);
      setCurrentStep((prev) => Math.min(steps.length, prev + 1));
    } else if (newDirection < 0 && currentStep > 1) {
      setDirection(newDirection);
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleSelectSetupMethod = (method: 'connect' | 'upload' | 'manual') => {
    setOnboardingState(prev => ({ ...prev, setupMethod: method }));
    handleNext();
  };

  const handleConnectIntegration = (integrationId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      connectedIntegrations: [...(prev.connectedIntegrations || []), integrationId]
    }));
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    setOnboardingState(prev => ({
      ...prev,
      connectedIntegrations: (prev.connectedIntegrations || []).filter((id: string) => id !== integrationId)
    }));
  };

  const handleDataUpload = (files: File[]) => {
    setOnboardingState(prev => ({ ...prev, uploadedFiles: files }));
    // Simulate AI processing
    setTimeout(() => {
      setOnboardingState(prev => ({ ...prev, businessData: mockBusinessData }));
    }, 2000);
  };

  const handleConfigurationChange = (key: string, value: boolean) => {
    setOnboardingState(prev => ({
      ...prev,
      configurations: { ...(prev.configurations || {}), [key]: value }
    }));
  };

  const handleToggleAutomation = (templateId: string) => {
    setOnboardingState(prev => {
      const currentAutomations = prev.activeAutomations || [];
      return {
        ...prev,
        activeAutomations: currentAutomations.includes(templateId)
          ? currentAutomations.filter((id:any) => id !== templateId)
          : [...currentAutomations, templateId]
      };
    });
  };

  const calculateBusinessHealthScore = () => {
    const configScore = Object.values(onboardingState.configurations).filter(Boolean).length * 15;
    const integrationScore = Math.min(onboardingState.connectedIntegrations.length * 10, 30);
    const automationScore = Math.min(onboardingState.activeAutomations.length * 5, 25);
    const baseScore = 30;
    
    const totalScore = Math.min(baseScore + configScore + integrationScore + automationScore, 100);
    setOnboardingState(prev => ({ ...prev, businessHealthScore: totalScore }));
  };

  const handleNext = () => {
    // Validate step 2 (Connected Tools) - require at least 1 tool
    if (currentStep === 2 && onboardingState.setupMethod === 'connect') {
      if (onboardingState.connectedIntegrations.length === 0) {
        toast.error('Please connect at least one tool to proceed');
        return;
      }
    }
    
    if (currentStep < steps.length) {
      // Update onboarding step in auth store
      updateOnboardingStep(currentStep);
      paginate(1);
    }
  };

  // Check if current step can proceed
  const canProceedToNext = () => {
    // Step 2 (Connected Tools) validation
    if (currentStep === 2 && onboardingState.setupMethod === 'connect') {
      return onboardingState.connectedIntegrations.length > 0;
    }
    
    // Step 1 (Setup Method) validation
    if (currentStep === 1) {
      return onboardingState.setupMethod !== null;
    }
    
    // Other steps can proceed
    return true;
  };

  const handleBack = () => {
    if (currentStep > 1) {
      paginate(-1);
    }
  };

  const handleStepComplete = (step: number, data: any) => {
    console.log(`Step ${step} completed:`, data);
  };

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding completed:', data);
    // Save to state and redirect
    setOnboardingState(prev => ({ ...prev, businessHealthScore: data.businessHealthScore }));
  };

  const handleComplete = () => {
    // Use the data collector to save
    if (window.onboardingDataCollector) {
      window.onboardingDataCollector.saveOnboarding();
    } else {
      handleOnboardingComplete(onboardingState);
    }
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SetupMethodSelector onSelectMethod={handleSelectSetupMethod} />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {onboardingState.setupMethod === 'connect' ? (
              <ConnectedToolsFlow
                onComplete={(connectedTools) => {
                  setOnboardingState(prev => ({ ...prev, connectedIntegrations: connectedTools }));
                  handleNext();
                }}
                onBack={handleBack}
              />
            ) : onboardingState.setupMethod === 'upload' ? (
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                  Upload Your Business Data
                </h3>
                <DataUploadDropzone onUpload={handleDataUpload} />
              </div>
            ) : (
              <ManualSetupFlow
                onComplete={(manualData) => {
                  setOnboardingState(prev => ({ ...prev, businessData: manualData }));
                  handleNext();
                }}
                onBack={handleBack}
              />
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIBusinessAnalysis />
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IntelligentAutomationRecommender
              configurations={onboardingState.configurations}
              onConfigurationChange={handleConfigurationChange}
            />
            
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)' }}>
                Automation Starter Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {automationTemplates.map((template) => (
                  <AutomationTemplateCard
                    key={template.id}
                    template={{
                      ...template,
                      isActive: onboardingState.activeAutomations.includes(template.id)
                    }}
                    onToggle={handleToggleAutomation}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdvancedBusinessHealthScore
              score={onboardingState.businessHealthScore || 72}
              previousScore={65}
              metrics={[
                {
                  category: 'Revenue Growth',
                  score: 85,
                  trend: 'up',
                  previousScore: 78,
                  industryAverage: 72,
                  description: 'Strong revenue performance driven by SaaS subscriptions and enterprise expansion',
                  details: {
                    opportunities: ['Enterprise upsell potential', 'Seasonal demand increase', 'New market expansion'],
                    toolContributions: [
                      { tool: 'Stripe', value: '$12,300', syncStatus: 'synced' },
                      { tool: 'QuickBooks', value: '$8,700', syncStatus: 'synced' },
                      { tool: 'Custom CRM', value: '$5,200', syncStatus: 'pending' }
                    ]
                  },
                  priority: 'medium',
                  estimatedImpact: '+15% growth with optimization'
                },
                {
                  category: 'Cost Efficiency',
                  score: 72,
                  trend: 'down',
                  previousScore: 78,
                  industryAverage: 68,
                  description: 'Increasing operational costs due to new tool subscriptions and infrastructure scaling',
                  details: {
                    atRiskItems: ['Unused software licenses', 'Cloud storage overage', 'Marketing spend inefficiency'],
                    toolContributions: [
                      { tool: 'AWS', value: '$3,200/month', syncStatus: 'synced' },
                      { tool: 'Adobe Creative', value: '$600/month', syncStatus: 'error' }
                    ]
                  },
                  priority: 'high',
                  estimatedImpact: '$2,400/month savings possible'
                },
                {
                  category: 'Automation Level',
                  score: 68,
                  trend: 'up',
                  previousScore: 45,
                  industryAverage: 52,
                  description: 'Good automation adoption with room for improvement in customer service workflows',
                  details: {
                    opportunities: ['Customer service automation', 'Invoice processing', 'Lead qualification'],
                    toolContributions: [
                      { tool: 'Zapier', value: '23 workflows', syncStatus: 'synced' },
                      { tool: 'Custom API', value: '15 endpoints', syncStatus: 'synced' }
                    ]
                  },
                  priority: 'medium',
                  estimatedImpact: '+25 hours/week saved'
                },
                {
                  category: 'Customer Retention',
                  score: 75,
                  trend: 'stable',
                  previousScore: 74,
                  industryAverage: 78,
                  description: 'Stable retention with opportunities to improve through better engagement strategies',
                  details: {
                    atRiskItems: ['12 at-risk enterprise accounts', 'Declining product usage in segment B'],
                    opportunities: ['Proactive success management', 'Personalized onboarding', 'Community building'],
                    toolContributions: [
                      { tool: 'Intercom', value: '89% satisfaction', syncStatus: 'synced' },
                      { tool: 'Custom Analytics', value: 'Retention: 87%', syncStatus: 'synced' }
                    ]
                  },
                  priority: 'high',
                  estimatedImpact: '+8% retention improvement'
                }
              ]}
              recommendations={[
                {
                  id: '1',
                  title: 'Enable Lead Follow-up Automation',
                  description: 'Automated lead nurturing will increase conversion rates by 23%',
                  impact: '+$2,800/month revenue',
                  priority: 'high',
                  actionType: 'enable',
                  targetTool: 'Lead Follow-up',
                  estimatedValue: '$2,800/month',
                  timeToImplement: '5 minutes',
                  status: 'pending'
                },
                {
                  id: '2',
                  title: 'Connect QuickBooks for Better Cost Tracking',
                  description: 'Real-time financial data will improve cost efficiency insights',
                  impact: '$1,200/month savings',
                  priority: 'medium',
                  actionType: 'connect',
                  targetTool: 'QuickBooks',
                  estimatedValue: '$1,200/month',
                  timeToImplement: '10 minutes',
                  status: 'pending'
                },
                {
                  id: '3',
                  title: 'Activate Cost Monitoring Alerts',
                  description: 'Prevent budget overruns with real-time spending alerts',
                  impact: '$600/month savings',
                  priority: 'medium',
                  actionType: 'configure',
                  estimatedValue: '$600/month',
                  timeToImplement: '3 minutes',
                  status: 'pending'
                },
                {
                  id: '4',
                  title: 'Optimize Customer Success Workflows',
                  description: 'Proactive customer success will improve retention by 8%',
                  impact: '+8% retention',
                  priority: 'high',
                  actionType: 'optimize',
                  estimatedValue: '$4,500/month',
                  timeToImplement: '15 minutes',
                  status: 'pending'
                }
              ]}
              achievements={[
                {
                  id: '1',
                  title: 'Automation Beginner',
                  description: 'Activate your first automation workflow',
                  icon: '🚀',
                  unlocked: true,
                  progress: 1,
                  target: 1
                },
                {
                  id: '2',
                  title: 'Revenue Hero',
                  description: 'Optimize 3 revenue streams',
                  icon: '💰',
                  unlocked: true,
                  progress: 2,
                  target: 3
                },
                {
                  id: '3',
                  title: 'Cost Master',
                  description: 'Save $5,000 through optimizations',
                  icon: '📊',
                  unlocked: false,
                  progress: 2400,
                  target: 5000
                },
                {
                  id: '4',
                  title: 'Customer Champion',
                  description: 'Achieve 90% customer retention',
                  icon: '⭐',
                  unlocked: false,
                  progress: 87,
                  target: 90
                }
              ]}
              onActionClick={(action, params) => {
                console.log('Action clicked:', action, params);
                // Handle the action (enable automation, connect tool, etc.)
              }}
            />
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedSetupComplete
              connectedIntegrations={onboardingState.connectedIntegrations}
              activeAutomations={onboardingState.activeAutomations}
              businessHealthScore={onboardingState.businessHealthScore || 72}
              onGoToDashboard={() => {
                // Navigate to dashboard
                console.log('Navigate to dashboard');
                // router.push('/dashboard');
              }}
              onConnectMoreTools={() => {
                setCurrentStep(2); // Go back to integrations step
              }}
              onExploreTemplates={() => {
                setCurrentStep(4); // Go to automation templates step
              }}
              onActivateAutomation={(automationId: string) => {
                setActiveAutomations((prev: string[]) => [...prev, automationId]);
              }}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="header" />
      </div>
      
      {/* Onboarding Data Collector */}
      <OnboardingDataCollector
        currentStep={currentStep}
        onStepComplete={handleStepComplete}
        onComplete={handleOnboardingComplete}
      />
      
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            {t.setupBusiness}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t.step} {currentStep} {t.of} {steps.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index + 1;
              const isCompleted = currentStep > index + 1;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-xs">
            {steps.map((step) => (
              <span key={step.id} className="text-center" style={{ color: 'var(--text-secondary)' }}>
                {t[step.title as keyof typeof t]}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8" style={{ backgroundColor: 'var(--surface)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.03, x: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform lg:px-12 lg:w-48 w-auto ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Button Gradient Background */}
              {currentStep > 1 && (
                <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
                <span>{t.back}</span>
              </div>
            </motion.button>

            <motion.button
              whileHover={canProceedToNext() ? { scale: 1.03, x: 3, y: -2 } : {}}
              whileTap={canProceedToNext() ? { scale: 0.97 } : {}}
              onClick={currentStep === steps.length ? handleComplete : handleNext}
              disabled={!canProceedToNext()}
              className={`group relative flex items-center justify-center space-x-3 px-10 py-5 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform border border-white/20 backdrop-blur-sm lg:px-16 lg:w-56 w-auto ${
                canProceedToNext() ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{
                background: canProceedToNext() 
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 25%, #6366F1 50%, #8B5CF6 75%, #7C3AED 100%)'
                  : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 25%, #4B5563 50%, #374151 75%, #1F2937 100%)',
                boxShadow: canProceedToNext() 
                  ? '0 10px 25px -5px rgba(59, 130, 246, 0.25), 0 0 20px rgba(59, 130, 246, 0.1)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3">
                <span className="text-lg drop-shadow-lg">
                  {currentStep === steps.length ? 'Go to Dashboard' : 
                   currentStep === 1 && !onboardingState.setupMethod ? 'Select a Setup Method' :
                   currentStep === 2 && onboardingState.setupMethod === 'connect' && onboardingState.connectedIntegrations.length === 0 ? 'Connect at least 1 Tool' :
                   'Next Step'}
                </span>
                {canProceedToNext() && (
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    whileHover={{ x: 8 }}
                  >
                    <ArrowRight className="w-6 h-6 drop-shadow-lg" />
                  </motion.div>
                )}
              </div>
              
              {/* Particle Effects on Hover */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ 
                      x: i * 33 + 10, 
                      y: 100, 
                      opacity: 0 
                    }}
                    whileHover={{
                      y: -20,
                      opacity: [0, 1, 0],
                      transition: {
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2
                      }
                    }}
                  />
                ))}
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
