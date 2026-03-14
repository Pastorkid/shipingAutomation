'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOAuthStore } from '@/app/store/auth/login/oauth/oauthStore';
import { Loader2 } from 'lucide-react';

export function OAuthCallbackHandler() {
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useOAuthStore();

  useEffect(() => {
    const url = searchParams.toString();
    if (url) {
      handleOAuthCallback(url);
    }
  }, [searchParams, handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Completing authentication...
        </h2>
        <p className="text-sm text-gray-600">
          Please wait while we verify your credentials.
        </p>
      </div>
    </div>
  );
}
