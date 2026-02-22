"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getTheme, buildCss } from "../lib/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialThemeId = "orange" }) {
  const [themeId, setThemeId] = useState(initialThemeId);
  const theme = getTheme(themeId);
  const css = buildCss(theme);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, theme, css }}>
      <style>{css}</style>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
