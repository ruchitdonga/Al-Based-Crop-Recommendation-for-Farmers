import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANG, translate } from "./translations";

const STORAGE_KEY = "cropAdvisor.lang";

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || DEFAULT_LANG;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    // Helps screen readers and browsers pick correct shaping.
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key) => translate(lang, key),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
