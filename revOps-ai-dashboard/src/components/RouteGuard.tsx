'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerified?: boolean;
  requireOnboardingCompleted?: boolean;
  requireOnboardingNotCompleted?: boolean;
}

export function RouteGuard({ 
  children, 
  requireAuth = false,
  requireEmailVerified = false,
  requireOnboardingCompleted = false,
  requireOnboardingNotCompleted = false
}: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check authentication status
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('RouteGuard: Auth check response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('RouteGuard: Auth check data:', data);
        
        if (data.success && data.data?.user) {
          setIsAuthenticated(true);
          setUser(data.data.user);

          // Check email verification
          if (requireEmailVerified && !data.data.user.isEmailVerified) {
            console.log('RouteGuard: Redirecting to email verification');
            router.push(`/verifyOtp?email=${data.data.user.email}&purpose=email_verification&redirect=${pathname}`);
            return;
          }

          // Check onboarding completion
          if (requireOnboardingCompleted && !data.data.user.onboardingCompleted) {
            console.log('RouteGuard: Redirecting to onboarding');
            router.push('/onboarding');
            return;
          }

          if (requireOnboardingNotCompleted && data.data.user.onboardingCompleted) {
            console.log('RouteGuard: Redirecting to dashboard (onboarding completed)');
            router.push('/dashboard');
            return;
          }

          console.log('RouteGuard: All checks passed, allowing access');
        } else {
          console.log('RouteGuard: No valid user data, treating as unauthenticated');
          setIsAuthenticated(false);
          if (requireAuth) {
            router.push(`/login?redirect=${pathname}`);
            return;
          }
        }
      } else {
        console.log('RouteGuard: Auth check failed with status:', response.status);
        setIsAuthenticated(false);
        if (requireAuth) {
          router.push(`/login?redirect=${pathname}`);
          return;
        }
      }
    } catch (error) {
      console.error('RouteGuard: Auth check error:', error);
      setIsAuthenticated(false);
      if (requireAuth) {
        router.push(`/login?redirect=${pathname}`);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--text-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
