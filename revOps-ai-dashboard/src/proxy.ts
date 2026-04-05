import { NextRequest, NextResponse } from 'next/server';

console.log('🔥 PROXY FILE LOADED! (Next.js 16)');

export default async function proxy(request: NextRequest) {
  console.log('🚀 PROXY CALLED FOR:', request.nextUrl.pathname);
  
  const pathname = request.nextUrl.pathname;
  
  // Define protected routes with their requirements
  const protectedRoutes = {
    '/dashboard': {
      requiresAuth: true,
      requiresEmailVerified: true,
      requiresOnboardingCompleted: true,
    },
    '/onboarding/business-config': {
      requiresAuth: true,
      requiresEmailVerified: true,
      requiresBusinessConfigNotCompleted: true,
    },
    '/onboarding': {
      requiresAuth: true,
      requiresEmailVerified: true,
      requiresOnboardingNotCompleted: true,
    },
  };
  
  // Define auth routes that should redirect authenticated users
  const authRoutes = ['/login', '/signup'];
  
  // Define routes that should be allowed during device verification
  const deviceVerificationRoutes = ['/verifyOtp'];
  
  // Check if current path is an auth route
  if (authRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔐 AUTH ROUTE:', pathname);
    
    // Check if user already has a valid session
    const sessionCookie = request.cookies.get('session');
    if (sessionCookie?.value) {
      console.log('👤 USER ALREADY AUTHENTICATED - CHECKING SESSION...');
      
      try {
        // Validate session with backend
        const authResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
          method: 'GET',
          headers: {
            'Cookie': `session=${sessionCookie.value}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (authResponse.ok) {
          const authData = await authResponse.json();
          if (authData.success && authData.data?.user) {
            const user = authData.data.user;
            console.log('✅ VALID SESSION FOUND - REDIRECTING BASED ON ONBOARDING STATUS');
            
            // Redirect based on onboarding completion
            if (user.onboardingCompleted) {
              console.log('📊 ONBOARDING COMPLETE - REDIRECT TO DASHBOARD');
              return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
              console.log('📋 ONBOARDING INCOMPLETE - REDIRECT TO ONBOARDING');
              return NextResponse.redirect(new URL('/onboarding', request.url));
            }
          }
        }
      } catch (error) {
        console.log('❌ ERROR CHECKING SESSION - ALLOW ACCESS TO AUTH ROUTE');
      }
    }
    
    console.log('✅ NO VALID SESSION - ALLOW ACCESS TO AUTH ROUTE');
    return NextResponse.next();
  }
  
  // Check if current path is a device verification route
  if (deviceVerificationRoutes.some(route => pathname.startsWith(route))) {
    console.log('🔍 DEVICE VERIFICATION ROUTE:', pathname);
    console.log('✅ ALLOW ACCESS TO DEVICE VERIFICATION ROUTE');
    return NextResponse.next();
  }
  
  // Check if current path is protected
  const routeConfig = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  );
  
  if (routeConfig) {
    const [route, config] = routeConfig;
    console.log('🚫 PROTECTED ROUTE:', pathname);
    
    // Check for session cookies
    const sessionCookie = request.cookies.get('session') || request.cookies.get('auth-session');
    console.log('🍪 Session cookie exists:', !!sessionCookie?.value);
    console.log('🍪 Session cookie value:', sessionCookie?.value);
    console.log('🍪 All cookies:', request.cookies.getAll());
    
    if (!sessionCookie?.value) {
      console.log('🔄 NO SESSION - REDIRECT TO LOGIN');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Validate session with backend
    try {
      console.log('🔍 CALLING BACKEND API...');
      
      // Get session cookie and format it explicitly
      const sessionCookie = request.cookies.get('session')?.value;
      const cookieHeader = sessionCookie ? `session=${sessionCookie}` : '';
      
      console.log('🍪 Proxy sending cookie header:', cookieHeader);
      
      const authResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('� BACKEND RESPONSE STATUS:', authResponse.status);

      if (!authResponse.ok) {
        console.log('❌ AUTH FAILED:', authResponse.status);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const authData = await authResponse.json();
      console.log('✅ AUTH SUCCESS:', authData.success);
      
      if (!authData.success || !authData.data?.user) {
        console.log('❌ INVALID SESSION DATA');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const user = authData.data.user;
      console.log('👤 USER DATA:', { email: user.email, emailVerified: user.isEmailVerified, onboarding: user.onboardingCompleted });
      
      // Check email verification
      if (config.requiresEmailVerified && !user.isEmailVerified) {
        console.log('📧 EMAIL NOT VERIFIED - REDIRECT TO VERIFY OTP');
        const verifyUrl = new URL('/verifyOtp', request.url);
        verifyUrl.searchParams.set('email', user.email);
        verifyUrl.searchParams.set('purpose', 'email_verification');
        verifyUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(verifyUrl);
      }

      // Check business configuration completion (NEW STEP - Step 0)
      if (route === '/dashboard' && 'requiresOnboardingCompleted' in config && config.requiresOnboardingCompleted && !user.businessConfigCompleted) {
        console.log('🏢 BUSINESS CONFIG INCOMPLETE - REDIRECT TO BUSINESS CONFIG');
        return NextResponse.redirect(new URL('/onboarding/business-config', request.url));
      }

      // Handle business config route specifically
      if (route === '/onboarding/business-config') {
        console.log('🔍 BUSINESS CONFIG ROUTE ACCESS:', { 
          businessConfigCompleted: user.businessConfigCompleted,
          hasConfig: 'requiresBusinessConfigNotCompleted' in config,
          requiresNotCompleted: 'requiresBusinessConfigNotCompleted' in config ? config.requiresBusinessConfigNotCompleted : 'N/A'
        });
        
        if ('requiresBusinessConfigNotCompleted' in config && config.requiresBusinessConfigNotCompleted && user.businessConfigCompleted) {
          console.log('✅ BUSINESS CONFIG COMPLETE - REDIRECT TO ONBOARDING');
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }

      // If user is trying to access onboarding but hasn't completed business config, redirect to business config first
      if (route === '/onboarding' && !user.businessConfigCompleted) {
        console.log('🏢 USER TRYING ONBOARDING WITHOUT BUSINESS CONFIG - REDIRECT TO BUSINESS CONFIG');
        return NextResponse.redirect(new URL('/onboarding/business-config', request.url));
      }

      // Check onboarding completion (AFTER business config)
      if (route === '/dashboard' && 'requiresOnboardingCompleted' in config && config.requiresOnboardingCompleted && !user.onboardingCompleted) {
        console.log('📋 ONBOARDING INCOMPLETE - REDIRECT TO ONBOARDING');
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }

      if (route === '/onboarding' && 'requiresOnboardingNotCompleted' in config && config.requiresOnboardingNotCompleted && user.onboardingCompleted) {
        console.log('✅ ONBOARDING COMPLETE - REDIRECT TO DASHBOARD');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      console.log('🎉 ALL CHECKS PASSED - ALLOW ACCESS');
    } catch (error) {
      console.error('🚨 PROXY ERROR:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  console.log('✅ PUBLIC ROUTE - ALLOW ACCESS');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/login', '/signup', '/verifyOtp/:path*']
};

console.log('🔧 PROXY CONFIG SET! (Next.js 16)');
