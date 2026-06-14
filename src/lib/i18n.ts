import { create } from 'zustand';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

type Language = 'en' | 'hi';
type Translations = typeof en;

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const translations = { en, hi };

export const useI18nStore = create<I18nState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get();
    return translations[language][key] || key;
  },
}));
