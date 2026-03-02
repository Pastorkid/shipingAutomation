import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

import {LanguageTimeZoneState} from './languageTimeZoneInterface';

const LanguageTimeZoneStore = create<LanguageTimeZoneState>()(
  persist(
    (set, get) => ({
      language: 'en',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      setLanguage: (language: string) => {
        set({ language });
      },
      
      setTimeZone: (timeZone: string) => {
        set({ timeZone });
      },
      
      setLanguageAndTimeZone: (language: string, timeZone: string) => {
        set({ language, timeZone });
      },
      
      reset: () => {
        set({
          language: 'en',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
    }),
    {
      name: 'language-timezone',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default LanguageTimeZoneStore;
