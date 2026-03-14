'use client';

import { useState } from 'react';
import { useOAuthStore } from '@/app/store/auth/login/oauth/oauthStore';
import OAuthButton from '../OAuthButton';
import { AlertCircle } from 'lucide-react';

interface OAuthLoginButtonsProps {
  className?: string;
}

export function OAuthLoginButtons({ className }: OAuthLoginButtonsProps) {
  const { error, initiateOAuth } = useOAuthStore();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'google' | 'linkedin') => {
    try {
      setLoadingProvider(provider);
      await initiateOAuth(provider);
    } catch (error) {
      console.error('OAuth login error:', error);
      setLoadingProvider(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <OAuthButton
          provider="google"
          onClick={() => handleOAuthLogin('google')}
          loading={loadingProvider === 'google'}
        />
        <OAuthButton
          provider="linkedin"
          onClick={() => handleOAuthLogin('linkedin')}
          loading={loadingProvider === 'linkedin'}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Google Device Verification Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Google may ask you to verify your device</p>
        <p>Check your trusted devices for a verification code</p>
      </div>
    </div>
  );
}
