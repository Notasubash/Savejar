"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { buildCss, getTheme, THEMES } from "../../lib/themes";
import { useUser } from "../../context/UserContext";

const features = [
  {
    label: "Savings Jars",
    desc: "Set goals and track your progress visually.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M8 3h8l1 3H7L8 3z" />
        <rect
          x="5"
          y="6"
          width="14"
          height="14"
          rx="3"
        />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    label: "Debt Tracking",
    desc: "Pay off debts faster with dedicated jars.",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2"
        />
        <line
          x1="2"
          y1="10"
          x2="22"
          y2="10"
        />
        <line
          x1="6"
          y1="15"
          x2="10"
          y2="15"
        />
      </svg>
    ),
  },
  {
    label: "Share & Save",
    desc: "Save together with family or your partner.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle
          cx="9"
          cy="7"
          r="4"
        />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "All Transactions",
    desc: "Add notes so you always know where money goes.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2l-3 2-2-2-2 2-2-2-2 2-3-2z" />
        <line
          x1="8"
          y1="10"
          x2="16"
          y2="10"
        />
        <line
          x1="8"
          y1="14"
          x2="14"
          y2="14"
        />
      </svg>
    ),
  },
  {
    label: "Live Progress",
    desc: "Stay motivated with real-time visual updates.",
    icon: (
      <svg viewBox="0 0 24 24">
        <line
          x1="18"
          y1="20"
          x2="18"
          y2="10"
        />
        <line
          x1="12"
          y1="20"
          x2="12"
          y2="4"
        />
        <line
          x1="6"
          y1="20"
          x2="6"
          y2="14"
        />
        <line
          x1="2"
          y1="20"
          x2="22"
          y2="20"
        />
      </svg>
    ),
  },
];

const whyPoints = [
  "Simple & visual",
  "Great for couples",
  "Builds saving habits",
  "No complexity",
];

export default function Welcome() {
  const { updateUserData } = useUser();
  const [step, setStep] = useState(1);
  const [themeId, setThemeId] = useState("orange");
  const [currency, setCurrency] = useState("INR");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const theme = getTheme(themeId);
  const css = buildCss(theme);

  const handleFinish = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser.uid;
      const patch = { currency, dateFormat, theme: themeId, firstLogin: false };

      // 1. Write to Firestore
      await updateDoc(doc(db, "users", uid), patch);

      // 2. Update context + localStorage IMMEDIATELY so dashboard gets it with zero delay
      updateUserData(patch);

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const patch = { firstLogin: false, theme: themeId };
      await updateDoc(doc(db, "users", auth.currentUser.uid), patch);
      updateUserData(patch);
    } finally {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <style>{css}</style>

      {/* ── Step 1: About ─────────────────────── */}
      {step === 1 && (
        <div className="page-wide">
          <div
            style={{
              width: "100%",
              animation: "stepIn .5s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div className="about-wrap">
              <div className="progress">
                <div className="dot active" />
                <div className="dot" />
                <div className="dot" />
              </div>

              <div className="hero-row">
                <div className="jar-hero">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 3h8l1 3H7L8 3z" />
                    <rect
                      x="5"
                      y="6"
                      width="14"
                      height="14"
                      rx="3"
                    />
                    <path d="M9 12h6M12 9v6" />
                  </svg>
                </div>
                <div className="hero-text">
                  <p className="eyebrow">Welcome aboard!</p>
                  <h1>
                    Take Control
                    <br />
                    of Your Money!
                  </h1>
                  <p>Your savings adventure starts here</p>
                </div>
              </div>

              <div className="tagline">
                Ever wonder where your money goes each month? With JamJars, you
                can finally <strong>see it, manage it, and grow it</strong> —
                all in one simple app. Whether saving for a holiday, paying off
                debts, or budgeting with your partner — JamJars keeps you in
                control!
              </div>

              <div className="features-grid">
                {features.map((f) => (
                  <div
                    className="feat-card"
                    key={f.label}
                  >
                    <div className="feat-icon-wrap">{f.icon}</div>
                    <div className="feat-text">
                      <strong>{f.label}</strong>
                      <span>{f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="why-row">
                {whyPoints.map((w) => (
                  <div
                    className="chip"
                    key={w}
                  >
                    <span className="chip-dot" />
                    {w}
                  </div>
                ))}
              </div>

              <button
                className="btn"
                onClick={() => setStep(2)}
              >
                Next — Pick Your Theme! →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Theme picker ──────────────── */}
      {step === 2 && (
        <div className="page-wide">
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              margin: "0 auto",
              animation: "stepIn .5s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div className="progress">
              <div className="dot done" />
              <div className="dot active" />
              <div className="dot" />
            </div>

            <div className="card-wide">
              <div className="card-stripe" />
              <div style={{ paddingTop: ".75rem" }}>
                <div className="brand-pill">JamJars</div>
                <h2>Pick Your Vibe!</h2>
                <p className="subtitle">
                  Choose a theme that feels like you — change it anytime in
                  Settings
                </p>

                <div className="theme-preview-bar" />
                <div className="theme-grid">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      className={`theme-swatch ${themeId === t.id ? "selected" : ""}`}
                      onClick={() => setThemeId(t.id)}
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

                {/* live label */}
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: ".5rem",
                      background: theme.primary,
                      color: "#fff",
                      border: "2.5px solid #1a1a2e",
                      borderRadius: "999px",
                      padding: ".3rem 1.1rem",
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: ".82rem",
                      boxShadow: "3px 3px 0 #1a1a2e",
                      transition: "background .3s",
                    }}
                  >
                    ✦ {theme.label} — looking good!
                  </span>
                </div>

                <button
                  className="btn"
                  onClick={() => setStep(3)}
                >
                  Next — Set Preferences →
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Preferences ──────────────── */}
      {step === 3 && (
        <div className="page-wide">
          <div
            style={{ animation: "stepIn .5s cubic-bezier(.22,1,.36,1) both" }}
          >
            <div className="prefs-wrap">
              <div className="progress">
                <div className="dot done" />
                <div className="dot done" />
                <div className="dot active" />
              </div>

              <div className="card-wide">
                <div className="card-stripe" />
                <div style={{ paddingTop: ".75rem" }}>
                  <div className="brand-pill">JamJars</div>
                  <h2>Almost Done!</h2>
                  <p className="subtitle">
                    Last step — set your currency and date format. You can
                    change these anytime in Settings.
                  </p>

                  <div className="field">
                    <label>Currency</label>
                    <div className="select-wrap">
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      >
                        <option value="INR">INR — (₹)</option>
                        <option value="USD">USD — ($)</option>
                        <option value="EUR">EUR — (€)</option>
                        <option value="GBP">GBP — (£)</option>
                        <option value="AUD">AUD — (AU$)</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Date Format</label>
                    <div className="select-wrap">
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                      >
                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="btn"
                    onClick={handleFinish}
                    disabled={loading}
                  >
                    {loading
                      ? "Almost there..."
                      : "Let's Go to My Dashboard! →"}
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => setStep(2)}
                  >
                    ← Back
                  </button>
                  <button
                    className="skip-link"
                    onClick={handleSkip}
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
