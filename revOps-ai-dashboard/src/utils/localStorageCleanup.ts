/**
 * localStorage Security Cleanup Utility
 * Removes sensitive data from localStorage to maintain security
 */

export const cleanupSensitiveLocalStorage = () => {
  const sensitiveKeys = [
    'userEmail',           // User email - sensitive PII
    '_grecaptcha',         // Google reCAPTCHA tokens
    'activeSessions',      // Session count - potential security info
    'otp_timer__device_verification', // Timer with empty email
  ];

  const keysToRemove: string[] = [];

  // Check for sensitive keys and their variations
  sensitiveKeys.forEach(key => {
    // Exact match
    if (localStorage.getItem(key)) {
      keysToRemove.push(key);
    }

    // Partial matches (for dynamic keys like otp_timer_*)
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i);
      if (storageKey && storageKey.includes(key)) {
        keysToRemove.push(storageKey);
      }
    }
  });

  // Remove sensitive data
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`🧹 Cleaned sensitive data: ${key}`);
    } catch (error) {
      console.warn(`⚠️ Failed to remove ${key}:`, error);
    }
  });

  // Clean up empty or invalid OTP timers
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('otp_timer_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          // Remove if email is empty or invalid
          if (!parsed.email || parsed.email === '') {
            localStorage.removeItem(key);
            console.log(`🧹 Cleaned empty OTP timer: ${key}`);
          }
        }
      } catch (error) {
        // Remove invalid JSON
        localStorage.removeItem(key);
        console.log(`🧹 Cleaned invalid OTP timer: ${key}`);
      }
    }
  }

  return keysToRemove.length;
};

/**
 * Check what sensitive data exists in localStorage
 */
export const auditLocalStorage = () => {
  const sensitiveData: { key: string; value: string; isSensitive: boolean }[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      const isSensitive = 
        key.includes('email') || 
        key.includes('token') || 
        key.includes('password') ||
        key.includes('secret') ||
        key.includes('key') ||
        key.includes('session') ||
        key.includes('_grecaptcha') ||
        key.includes('activeSessions');

      sensitiveData.push({ key, value: isSensitive ? '[REDACTED]' : value, isSensitive });
    }
  }

  console.group('🔍 localStorage Security Audit');
  sensitiveData.forEach(item => {
    if (item.isSensitive) {
      console.warn(`⚠️ Sensitive data found: ${item.key}`);
    } else {
      console.log(`✅ Safe data: ${item.key}`);
    }
  });
  console.groupEnd();

  return sensitiveData;
};

/**
 * Run cleanup on app initialization
 */
export const initializeSecurityCleanup = () => {
  // Clean up sensitive data
  const cleanedCount = cleanupSensitiveLocalStorage();
  
  if (cleanedCount > 0) {
    console.log(`🧹 Security cleanup completed: removed ${cleanedCount} sensitive items`);
  }

  // Run audit for development
  if (process.env.NODE_ENV === 'development') {
    auditLocalStorage();
  }
};
