"use client";

import { THEMES } from "../lib/themes";

export default function ThemePicker({ value, onChange }) {
  return (
    <div className="theme-grid">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-swatch ${value === t.id ? "selected" : ""}`}
          onClick={() => onChange(t.id)}
          title={t.label}
        >
          <div
            className="swatch-circle"
            style={{
              background: `linear-gradient(135deg, ${t.primary} 50%, ${t.accent} 50%)`,
            }}
          />
          <span className="swatch-label">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
