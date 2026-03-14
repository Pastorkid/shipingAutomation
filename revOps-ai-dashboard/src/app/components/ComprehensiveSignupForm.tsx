'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, Building, Phone, Globe, 
  DollarSign, Target, MessageSquare, TrendingUp, Calendar,
  ChevronRight, ChevronLeft, Check, AlertCircle
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// Business types from Prisma schema
const BUSINESS_TYPES = [
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'OTHER', label: 'Other' },
];

// Business sizes
const BUSINESS_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

// Revenue goals from Prisma schema
const REVENUE_GOALS = [
  { value: 'INCREASE_SALES', label: 'Increase Sales' },
  { value: 'REDUCE_COSTS', label: 'Reduce Costs' },
  { value: 'IMPROVE_MARKETING', label: 'Improve Marketing' },
  { value: 'AUTOMATE_WORKFLOWS', label: 'Automate Workflows' },
];

// Communication channels
const COMMUNICATION_CHANNELS = [
  { value: 'EMAIL', label: 'Email', icon: Mail },
  { value: 'SMS', label: 'SMS', icon: MessageSquare },
  { value: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
  { value: 'SLACK', label: 'Slack', icon: MessageSquare },
];

// Common currencies
const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
];

// Common timezones
const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST (Eastern Time)' },
  { value: 'America/Chicago', label: 'CST (Central Time)' },
  { value: 'America/Denver', label: 'MST (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'PST (Pacific Time)' },
  { value: 'Europe/London', label: 'GMT (Greenwich Mean Time)' },
  { value: 'Europe/Paris', label: 'CET (Central European Time)' },
  { value: 'Asia/Tokyo', label: 'JST (Japan Standard Time)' },
];

interface FormData {
  // Basic info
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  
  // Business info
  businessName: string;
  businessType: string;
  businessSize: string;
  website: string;
  
  // Preferences
  timezone: string;
  currency: string;
  preferredLanguage: string;
  revenueGoal: string;
  communicationChannels: string[];
  targetMonthlyRevenue: string;
}

interface ComprehensiveSignupFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading?: boolean;
}

export default function ComprehensiveSignupForm({ onSubmit, loading = false }: ComprehensiveSignupFormProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    businessName: '',
    businessType: '',
    businessSize: '',
    website: '',
    timezone: 'UTC',
    currency: 'USD',
    preferredLanguage: 'en',
    revenueGoal: '',
    communicationChannels: ['EMAIL'],
    targetMonthlyRevenue: '',
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Basic info validation
      if (!formData.fullName.trim()) newErrors.fullName = t.required;
      if (!formData.email.trim()) newErrors.email = t.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.validEmail;
      if (!formData.password) newErrors.password = t.required;
      else if (formData.password.length < 8) newErrors.password = t.passwordMinLength;
      if (!formData.confirmPassword) newErrors.confirmPassword = t.required;
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t.passwordsNotMatch;
      if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = t.validPhone;
      }
    }

    if (step === 2) {
      // Business info validation
      if (!formData.businessName.trim()) newErrors.businessName = t.required;
      if (!formData.businessType) newErrors.businessType = t.required;
      if (!formData.businessSize) newErrors.businessSize = t.required;
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }

    if (step === 3) {
      // Preferences validation
      if (!formData.revenueGoal) newErrors.revenueGoal = t.required;
      if (formData.targetMonthlyRevenue && isNaN(Number(formData.targetMonthlyRevenue))) {
        newErrors.targetMonthlyRevenue = 'Please enter a valid number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleCommunicationChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      communicationChannels: prev.communicationChannels.includes(channel)
        ? prev.communicationChannels.filter(c => c !== channel)
        : [...prev.communicationChannels, channel]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                Let's get started
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                First, tell us about yourself
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.fullName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.fullName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.fullName ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.email} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.email ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.phoneNumber} <span className="text-xs text-gray-500">({t.optional})</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.phoneNumber 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.phoneNumber ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.password} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.password ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.confirmPassword} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.confirmPassword ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                Tell us about your business
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                This helps us personalize your experience
              </p>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.businessName} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.businessName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.businessName ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Acme Corporation"
                />
              </div>
              {errors.businessName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.businessType} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  errors.businessType 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                style={{ 
                  backgroundColor: 'var(--background-card)', 
                  borderColor: errors.businessType ? '#ef4444' : 'var(--input-border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessType}
                </p>
              )}
            </div>

            {/* Business Size */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.businessSize} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessSize}
                onChange={(e) => handleInputChange('businessSize', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  errors.businessSize 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                style={{ 
                  backgroundColor: 'var(--background-card)', 
                  borderColor: errors.businessSize ? '#ef4444' : 'var(--input-border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="">Select company size</option>
                {BUSINESS_SIZES.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
              {errors.businessSize && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessSize}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.website} <span className="text-xs text-gray-500">({t.optional})</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.website 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.website ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="https://www.example.com"
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.website}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
                Almost there!
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Set your preferences to personalize RevOps AI
              </p>
            </div>

            {/* Revenue Goal */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.revenueGoal} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={formData.revenueGoal}
                  onChange={(e) => handleInputChange('revenueGoal', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.revenueGoal 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 appearance-none`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.revenueGoal ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select your primary goal</option>
                  {REVENUE_GOALS.map(goal => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.revenueGoal && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.revenueGoal}
                </p>
              )}
            </div>

            {/* Target Monthly Revenue */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.targetMonthlyRevenue} <span className="text-xs text-gray-500">({t.optional})</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={formData.targetMonthlyRevenue}
                  onChange={(e) => handleInputChange('targetMonthlyRevenue', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                    errors.targetMonthlyRevenue 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2`}
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: errors.targetMonthlyRevenue ? '#ef4444' : 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="50000"
                />
              </div>
              {errors.targetMonthlyRevenue && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetMonthlyRevenue}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.currency}
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'var(--background-card)', 
                  borderColor: 'var(--input-border)',
                  color: 'var(--text-primary)'
                }}
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
                {t.timezone}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 appearance-none"
                  style={{ 
                    backgroundColor: 'var(--background-card)', 
                    borderColor: 'var(--input-border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Communication Channels */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-heading)' }}>
                {t.communicationChannels}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {COMMUNICATION_CHANNELS.map(channel => {
                  const Icon = channel.icon;
                  const isSelected = formData.communicationChannels.includes(channel.value);
                  
                  return (
                    <button
                      key={channel.value}
                      type="button"
                      onClick={() => toggleCommunicationChannel(channel.value)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--background-card)',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--input-border)'
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {channel.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 ml-auto" style={{ color: 'var(--primary)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: 'var(--background-secondary)' }}>
          <motion.div
            className="h-2 rounded-full transition-all duration-300"
            style={{ backgroundColor: 'var(--primary)', width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="min-h-100">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--input-border)' }}>
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
            style={{ 
              color: 'var(--text-secondary)',
              backgroundColor: currentStep === 1 ? 'transparent' : 'var(--background-secondary)'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white'
              }}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              style={{ 
                backgroundColor: loading ? 'var(--text-muted)' : 'var(--primary)', 
                color: 'white'
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
