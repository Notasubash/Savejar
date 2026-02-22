"use client";

import { buildCss, getTheme } from "../lib/themes";
import { useUser } from "../context/UserContext";

export default function ThemedPage({ children, className = "page" }) {
  const { userData } = useUser();
  const theme = getTheme(userData?.theme || "orange");
  const css = buildCss(theme);

  return (
    <>
      <style>{css}</style>
      <div className={className}>{children}</div>
    </>
  );
}
