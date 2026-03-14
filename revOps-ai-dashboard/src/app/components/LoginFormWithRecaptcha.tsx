'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { getCaptchaToken, renderRecaptcha, resetRecaptcha } from '../../../lib/captcha';
import { useTranslation } from '../hooks/useTranslation';
import { useLoginStore } from '../store/auth/login/loginStore';

interface LoginFormWithRecaptchaProps {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean; recaptchaToken: string }) => Promise<void>;
  loading: boolean;
}

export default function LoginFormWithRecaptcha({ onSubmit, loading }: LoginFormWithRecaptchaProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const { t } = useTranslation();
  
  // Use login store for remember me functionality
  const { rememberMe, setRememberMe } = useLoginStore();

  // Check for remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
    }
  }, []);

  // Render visible reCAPTCHA checkbox after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔐 Attempting to render visible reCAPTCHA checkbox...');
      const success = renderRecaptcha(
        'recaptcha-container', 
        () => {
          console.log('✅ reCAPTCHA verified - enabling login button');
          setRecaptchaVerified(true);
        },
        () => {
          console.log('⚠️ reCAPTCHA expired - disabling login button');
          setRecaptchaVerified(false);
          setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA expired. Please verify again.' }));
        },
        () => {
          console.log('❌ reCAPTCHA error - disabling login button');
          setRecaptchaVerified(false);
          setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA error. Please try again.' }));
        }
      );
      if (success) {
        console.log('✅ reCAPTCHA checkbox render initiated');
      } else {
        console.log('❌ Failed to render reCAPTCHA checkbox');
      }
    }, 1000); // Delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Clear reCAPTCHA error when user starts typing again
    if (errors.recaptcha) {
      setErrors(prev => ({ ...prev, recaptcha: '' }));
    }
    
    if (name === 'rememberMe') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRecaptchaReset = () => {
    resetRecaptcha();
    setRecaptchaVerified(false);
    setErrors(prev => ({ ...prev, recaptcha: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Get response from visible reCAPTCHA v2 checkbox
      console.log('🔐 Checking visible reCAPTCHA verification...');
      const recaptchaToken = await getCaptchaToken() || '';
      
      if (!recaptchaToken) {
        setErrors(prev => ({ ...prev, recaptcha: 'Please verify you are not a robot' }));
        return;
      }
      
      console.log('✅ reCAPTCHA verified successfully');
      
      await onSubmit({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe, // Use store value
        recaptchaToken,
      });
    } catch (error) {
      console.error('❌ reCAPTCHA error:', error);
      setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA verification failed' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {t.email || 'Email Address'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-primary transition-colors ${
              errors.email ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor: 'var(--background-input)',
              borderColor: errors.email ? 'var(--error-color)' : 'var(--input-border)',
              color: 'var(--text-primary)'
            }}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {t.password || 'Password'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-primary transition-colors ${
              errors.password ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor: 'var(--background-input)',
              borderColor: errors.password ? 'var(--error-color)' : 'var(--input-border)',
              color: 'var(--text-primary)'
            }}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            style={{ accentColor: 'var(--primary)' }}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm" style={{ color: 'var(--text-primary)' }}>
            Remember me
          </label>
        </div>
        <a href="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
          {t.forgotPassword || 'Forgot password?'}
        </a>
      </div>

      {/* Visible reCAPTCHA v2 Checkbox */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div id="recaptcha-container"></div>
            <button
              type="button"
              onClick={handleRecaptchaReset}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
              title="Reset reCAPTCHA"
            >
              Reset
            </button>
          </div>
          {errors.recaptcha && (
            <p className="text-red-500 text-sm text-center">{errors.recaptcha}</p>
          )}
        </div>
      </div>

      
      {/* reCAPTCHA Status */}
      <div className="flex justify-center">
        <div className="text-xs text-gray-500 text-center">
          <div>
            This site is protected by reCAPTCHA and the Google
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">Privacy Policy</a>
            and
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">Terms of Service</a>
            apply.
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading || !recaptchaVerified}
        whileHover={{ scale: (loading || !recaptchaVerified) ? 1 : 1.02 }}
        whileTap={{ scale: (loading || !recaptchaVerified) ? 1 : 0.98 }}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Signing in...
          </div>
        ) : !recaptchaVerified ? (
          'Please verify reCAPTCHA first'
        ) : (
          t.login || 'Sign In'
        )}
      </motion.button>
    </form>
  );
}
