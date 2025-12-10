'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type Messages = Record<string, string>;

type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, fallback?: string) => string;
  messages: Messages | null;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LOCALE_KEY = 'locale';

export const I18nProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      if (stored) return stored;
    } catch (e) {
      // ignore
    }
    if (typeof navigator !== 'undefined') {
      const nav = navigator.language?.split('-')[0];
      return nav || 'en';
    }
    return 'en';
  });

  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // dynamic import of JSON files in ../locales
        const msgs = await import(`../locales/${locale}.json`);
        if (mounted) setMessages(msgs.default ?? msgs);
      } catch (e) {
        // fallback to en
        try {
          const msgs = await import(`../locales/en.json`);
          if (mounted) setMessages(msgs.default ?? msgs);
        } catch (err) {
          if (mounted) setMessages({});
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [locale]);

  const setLocale = useCallback((l: string) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch (e) {
      // ignore
    }
    // update document lang attribute
    if (typeof document !== 'undefined') document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      if (!messages) return fallback ?? key;
      return messages[key] ?? fallback ?? key;
    },
    [messages],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export default I18nContext;
