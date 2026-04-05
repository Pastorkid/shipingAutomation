'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, Building, Globe, 
  DollarSign, Check, AlertCircle
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// V1 Simplified - Only essential constants needed

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
  // V1 Essential info only
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  timezone: string;
  currency: string;
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
    businessName: '',
    timezone: 'UTC',
    currency: 'USD',
  });

  const totalSteps = 1; // V1 Simplified - single step form
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    // V1 Simplified validation - single step
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';

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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // V1 Simplified - No communication channels toggle needed

  const renderStep = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
            Create Your Account
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Start automating your payment recovery today
          </p>
        </div>
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2`}
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
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2`}
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2`}
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
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2`}
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

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Business Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2`}
              style={{ 
                backgroundColor: 'var(--background-card)', 
                borderColor: errors.businessName ? '#ef4444' : 'var(--input-border)',
                color: 'var(--text-primary)'
              }}
              placeholder="Acme Inc."
            />
          </div>
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessName}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Timezone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors appearance-none focus:outline-none focus:ring-2`}
              style={{ 
                backgroundColor: 'var(--background-card)', 
                borderColor: 'var(--input-border)',
                color: 'var(--text-primary)'
              }}
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Currency <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors appearance-none focus:outline-none focus:ring-2`}
              style={{ 
                backgroundColor: 'var(--background-card)', 
                borderColor: 'var(--input-border)',
                color: 'var(--text-primary)'
              }}
            >
              {CURRENCIES.map(currency => (
                <option key={currency.value} value={currency.value}>{currency.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    );
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

        {/* Submit Button - V1 Simplified */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors shadow-sm w-full max-w-xs"
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
        </div>
      </form>
    </div>
  );
}
