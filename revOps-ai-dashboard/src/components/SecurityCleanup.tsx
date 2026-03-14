'use client';

import { useEffect } from 'react';
import { initializeSecurityCleanup } from '@/utils/localStorageCleanup';

export function SecurityCleanup() {
  useEffect(() => {
    // Initialize security cleanup on app load
    initializeSecurityCleanup();
  }, []);

  // This component doesn't render anything
  return null;
}
