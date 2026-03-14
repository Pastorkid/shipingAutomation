'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, Globe, Target, DollarSign, Calendar, MessageSquare,
  Check, AlertCircle, ChevronRight
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

// Reuse the same constants from ComprehensiveSignupForm
const BUSINESS_TYPES = [
  { value: 'ECOMMERCE', label: 'E-commerce' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'OTHER', label: 'Other' },
];

const BUSINESS_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

const REVENUE_GOALS = [
  { value: 'INCREASE_SALES', label: 'Increase Sales' },
  { value: 'REDUCE_COSTS', label: 'Reduce Costs' },
  { value: 'IMPROVE_MARKETING', label: 'Improve Marketing' },
  { value: 'AUTOMATE_WORKFLOWS', label: 'Automate Workflows' },
];

const COMMUNICATION_CHANNELS = [
  { value: 'EMAIL', label: 'Email', icon: MessageSquare },
  { value: 'SMS', label: 'SMS', icon: MessageSquare },
  { value: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
  { value: 'SLACK', label: 'Slack', icon: MessageSquare },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
];

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

interface ProfileData {
  businessName: string;
  businessType: string;
  businessSize: string;
  website: string;
  timezone: string;
  currency: string;
  revenueGoal: string;
  communicationChannels: string[];
  targetMonthlyRevenue: string;
}

interface ProfileCompletionFormProps {
  onSubmit: (data: ProfileData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<ProfileData>;
}

export default function ProfileCompletionForm({ 
  onSubmit, 
  loading = false, 
  initialData = {} 
}: ProfileCompletionFormProps) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<ProfileData>({
    businessName: initialData.businessName || '',
    businessType: initialData.businessType || '',
    businessSize: initialData.businessSize || '',
    website: initialData.website || '',
    timezone: initialData.timezone || 'UTC',
    currency: initialData.currency || 'USD',
    revenueGoal: initialData.revenueGoal || '',
    communicationChannels: initialData.communicationChannels || ['EMAIL'],
    targetMonthlyRevenue: initialData.targetMonthlyRevenue || '',
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) newErrors.businessName = t.required;
    if (!formData.businessType) newErrors.businessType = t.required;
    if (!formData.businessSize) newErrors.businessSize = t.required;
    if (!formData.revenueGoal) newErrors.revenueGoal = t.required;
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    if (formData.targetMonthlyRevenue && isNaN(Number(formData.targetMonthlyRevenue))) {
      newErrors.targetMonthlyRevenue = 'Please enter a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>
          Complete your profile
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Help us personalize your RevOps AI experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Your company name"
            />
          </div>
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.businessName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="">Select type</option>
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
              <option value="">Select size</option>
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
              <option value="">Select your goal</option>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            style={{ 
              backgroundColor: loading ? 'var(--text-muted)' : 'var(--primary)', 
              color: 'white'
            }}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Complete Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
