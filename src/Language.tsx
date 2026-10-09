import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ru } from './translations';

type Language = 'en' | 'ru';
interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
}
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('portfolio-language') === 'ru' ? 'ru' : 'en'; }
    catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'ru' ? ru['Islam Dubaev — Video Editor & Motion Designer'] : 'Islam Dubaev — Video Editor & Motion Designer';
    try { localStorage.setItem('portfolio-language', language); } catch { /* Storage can be unavailable in private browser contexts. */ }
  }, [language]);
  const t = (text: string) => language === 'ru' ? ru[text] ?? text : text;
  return <LanguageContext value={{ language, setLanguage, t }}>{children}</LanguageContext>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage requires LanguageProvider');
  return context;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-toggle" role="group" aria-label={language === 'en' ? 'Language' : 'Язык'} data-language={language}>
    <span className="language-indicator" aria-hidden="true" />
    <button type="button" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
    <button type="button" aria-label="Русский" aria-pressed={language === 'ru'} onClick={() => setLanguage('ru')}>RU</button>
  </div>;
}
