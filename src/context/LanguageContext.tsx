"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Language } from "@/types";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: (ar) => ar,
  isRTL: true,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const stored = localStorage.getItem("injaz-lang") as Language;
    if (stored) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    if (lang === "ar") {
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
    }
  }, [lang]);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("injaz-lang", l);
  };

  const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
