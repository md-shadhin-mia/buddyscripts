"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggleDark: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const wrapper = document.querySelector("._layout_main_wrapper");
    if (wrapper) {
      if (isDark) {
        wrapper.classList.add("_dark_wrapper");
      } else {
        wrapper.classList.remove("_dark_wrapper");
      }
    }
  }, [isDark]);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", String(next));
      return next;
    });
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error("useDarkMode must be used within DarkModeProvider");
  return ctx;
}
