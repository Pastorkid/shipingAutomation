'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
];

interface LanguageSelectorProps {
  variant?: 'header' | 'auth';
  showTimezone?: boolean;
}

export default function LanguageSelector({ variant = 'header', showTimezone = false }: LanguageSelectorProps) {
  // ALWAYS call hooks at the top level - NO early returns before this point
  const [isOpen, setIsOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [language, setLanguageState] = useState('en');
  const [timeZone, setTimeZoneState] = useState('America/New_York');
  const { changeLanguage } = useTranslation();

  // Safe store access with useEffect to avoid hook order issues
  useEffect(() => {
    let store: any = null;
    
    try {
      // Dynamic import to avoid circular dependencies
      import('../store/languageTimeZone/languageTimeZoneStore').then((module) => {
        store = module.default;
        
        // Subscribe to store changes
        const unsubscribe = store.subscribe((state: any) => {
          setLanguageState(state.language || 'en');
          setTimeZoneState(state.timeZone || 'America/New_York');
        });
        
        // Set initial values
        setLanguageState(store.getState().language || 'en');
        setTimeZoneState(store.getState().timeZone || 'America/New_York');
        
        return unsubscribe;
      });
    } catch (error) {
      console.warn('Language store not available, using defaults:', error);
    }
    
    return () => {
      // Cleanup subscription if needed
    };
  }, []);

  // Use the context changeLanguage function for instant updates
  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    changeLanguage(newLanguage); // This will update instantly
    
    // Also update the store for persistence
    try {
      import('../store/languageTimeZone/languageTimeZoneStore').then((module) => {
        const store = module.default;
        store.getState().setLanguage(newLanguage);
      });
    } catch (error) {
      console.warn('Could not update language store:', error);
    }
  };

  const setTimeZone = (newTimeZone: string) => {
    setTimeZoneState(newTimeZone);
    try {
      import('../store/languageTimeZone/languageTimeZoneStore').then((module) => {
        const store = module.default;
        store.getState().setTimeZone(newTimeZone);
      });
    } catch (error) {
      console.warn('Could not update timezone store:', error);
    }
  };

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];
  const selectedTimezone = timezones.find(tz => tz.value === timeZone) || timezones[0];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  };

  // Auth variant content
  const renderAuthVariant = () => (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
          Language
        </label>
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors"
          style={{ 
            backgroundColor: 'var(--input-bg)', 
            borderColor: 'var(--input-border)'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{selectedLanguage.flag}</span>
            <span className="font-medium" style={{ color: 'var(--input-text)' }}>{selectedLanguage.name}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-placeholder)' }} />
        </motion.button>

        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          exit="exit"
          transition={{ duration: 0.2 }}
          className={`absolute z-50 mt-2 w-full rounded-lg shadow-lg border ${isOpen ? 'block' : 'hidden'}`}
          style={{ 
            backgroundColor: 'var(--background-card)', 
            borderColor: 'var(--input-border)'
          }}
        >
          <div className="py-2">
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-2 transition-colors"
                style={{ color: 'var(--text-heading)' }}
                whileHover={{ backgroundColor: 'var(--background-page)' }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.code === language && (
                  <span className="ml-auto" style={{ color: 'var(--primary)' }}>✓</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {showTimezone && (
        <div className="relative">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-heading)' }}>
            Timezone
          </label>
          <motion.button
            type="button"
            onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors"
            style={{ 
              backgroundColor: 'var(--input-bg)', 
              borderColor: 'var(--input-border)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium" style={{ color: 'var(--input-text)' }}>{selectedTimezone.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isTimezoneOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-placeholder)' }} />
          </motion.button>

          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate={isTimezoneOpen ? "visible" : "hidden"}
            exit="exit"
            transition={{ duration: 0.2 }}
            className={`absolute z-50 mt-2 w-full rounded-lg shadow-lg border ${isTimezoneOpen ? 'block' : 'hidden'}`}
            style={{ 
              backgroundColor: 'var(--background-card)', 
              borderColor: 'var(--input-border)'
            }}
          >
            <div className="py-2">
              {timezones.map((tz) => (
                <motion.button
                  key={tz.value}
                  type="button"
                  onClick={() => {
                    setTimeZone(tz.value);
                    setIsTimezoneOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 transition-colors"
                  style={{ color: 'var(--text-heading)' }}
                  whileHover={{ backgroundColor: 'var(--background-page)' }}
                >
                  <span>{tz.label}</span>
                  {tz.value === timeZone && (
                    <span className="ml-auto" style={{ color: 'var(--primary)' }}>✓</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );

  // Header variant content
  const renderHeaderVariant = () => (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors"
        style={{ 
          backgroundColor: 'var(--background-card)', 
          border: '1px solid var(--input-border)'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">{selectedLanguage.flag}</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-placeholder)' }} />
      </motion.button>

      <motion.div
        variants={dropdownVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        transition={{ duration: 0.2 }}
        className={`absolute right-0 z-50 mt-2 w-56 rounded-lg shadow-lg border ${isOpen ? 'block' : 'hidden'}`}
        style={{ 
          backgroundColor: 'var(--background-card)', 
          borderColor: 'var(--input-border)'
        }}
      >
        <div className="py-2">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 transition-colors"
              style={{ color: 'var(--text-heading)' }}
              whileHover={{ backgroundColor: 'var(--background-page)' }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === language && (
                <span className="ml-auto" style={{ color: 'var(--primary)' }}>✓</span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Single return statement - NO early returns
  return variant === 'auth' ? renderAuthVariant() : renderHeaderVariant();
}
