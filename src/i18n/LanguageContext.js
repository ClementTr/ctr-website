import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { messages } from './messages';

const STORAGE_KEY = 'ctr-site-locale';

/** @typedef {'en' | 'fr'} Locale */

function getByPath (obj, path) {
  return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

/**
 * @param {string} template
 * @param {Record<string, string | number>} [vars]
 */
function applyVars (template, vars) {
  if (!vars) return template;
  let s = template;
  Object.entries(vars).forEach(([k, v]) => {
    s = s.split(`{{${k}}}`).join(String(v));
  });
  return s;
}

const LanguageContext = createContext(
  /** @type {{ locale: Locale, setLocale: (l: Locale) => void, t: (key: string, vars?: Record<string, string | number>) => string }} */ ({
    locale: 'en',
    setLocale: () => {},
    t: (key) => key,
  }),
);

export function LanguageProvider ({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try {
      const s = window.localStorage.getItem(STORAGE_KEY);
      if (s === 'fr' || s === 'en') return s;
    } catch (_) {}
    return 'en';
  });

  const setLocale = useCallback((l) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch (_) {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'fr' ? 'fr' : 'en';
  }, [locale]);

  const t = useCallback(
    (key, vars) => {
      const raw = getByPath(messages[locale], key);
      if (raw == null) {
        const fallback = getByPath(messages.en, key);
        if (fallback == null) return key;
        return typeof fallback === 'string' ? applyVars(fallback, vars) : String(fallback);
      }
      return typeof raw === 'string' ? applyVars(raw, vars) : String(raw);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage () {
  return useContext(LanguageContext);
}

export { LanguageContext };
