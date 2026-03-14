export interface LanguageTimeZoneState {
  language: string;
  timeZone: string;
  setLanguage: (language: string) => void;
  setTimeZone: (timeZone: string) => void;
  setLanguageAndTimeZone: (language: string, timeZone: string) => void;
  reset: () => void;
}
