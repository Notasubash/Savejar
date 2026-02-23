"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { buildCss, getTheme } from "../../lib/themes";

const css = buildCss(getTheme("teal"));

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
      />
    </svg>
  );

// Small inline checkmark / cross for password strength hints
const Check = ({ ok }) => (
  <span
    style={{
      color: ok ? "#22c55e" : "#ff4d8d",
      fontSize: ".65rem",
      fontWeight: 700,
    }}
  >
    {ok ? "✓" : "✗"}
  </span>
);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Live validations
  const pwLong = password.length >= 8;
  const pwMatch = password === confirm && confirm.length > 0;
  const showHints = password.length > 0;
  const showMatchHint = confirm.length > 0;

  const handleSignup = async () => {
    setError("");
    if (!pwLong) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!pwMatch) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        email,
        firstLogin: true,
        theme: "orange",
        currency: null,
        dateFormat: null,
        createdAt: new Date(),
      });
      router.push("/welcome");
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        setError("That email is already registered. Try logging in!");
      } else if (e.code === "auth/weak-password") {
        setError("Password too weak — try adding numbers or symbols.");
      } else {
        setError("Couldn't create account. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <style>{`
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 2.75rem !important; }
        .pw-toggle {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--muted); display: flex; align-items: center;
          padding: 2px; border-radius: 4px;
          transition: color .15s;
        }
        .pw-toggle:hover { color: var(--primary); }
        .pw-hints {
          display: flex; flex-direction: column; gap: .2rem;
          margin-top: .35rem;
          font-size: .68rem; font-weight: 700;
          color: var(--muted);
        }
        .pw-hints span { display: flex; align-items: center; gap: .3rem; }
      `}</style>

      <div className="page">
        <div
          className="blob"
          style={{
            width: 180,
            height: 180,
            top: -50,
            right: -50,
            background: "#ffd000",
            animationDelay: "0s",
          }}
        />
        <div
          className="blob"
          style={{
            width: 120,
            height: 120,
            bottom: -30,
            left: -30,
            background: "#9b5de5",
            animationDelay: "-2s",
          }}
        />

        <div className="card">
          <div
            className="badge"
            style={{ background: "#00c9a7", color: "#fff" }}
          >
            ✦ New here?
          </div>
          <h2>Join JamJars!</h2>
          <p className="subtitle">Start saving smarter today</p>

          {/* Email */}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <button
                className="pw-toggle"
                onClick={() => setShowPw((p) => !p)}
                type="button"
                tabIndex={-1}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {showHints && (
              <div className="pw-hints">
                <span>
                  <Check ok={pwLong} /> At least 8 characters
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="field">
            <label>Confirm Password</label>
            <div className="pw-wrap">
              <input
                type={showCf ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                style={{
                  borderColor: showMatchHint
                    ? pwMatch
                      ? "#22c55e"
                      : "#ff4d8d"
                    : undefined,
                }}
              />
              <button
                className="pw-toggle"
                onClick={() => setShowCf((p) => !p)}
                type="button"
                tabIndex={-1}
              >
                <EyeIcon open={showCf} />
              </button>
            </div>
            {showMatchHint && (
              <div className="pw-hints">
                <span>
                  <Check ok={pwMatch} />{" "}
                  {pwMatch ? "Passwords match!" : "Passwords don't match"}
                </span>
              </div>
            )}
          </div>

          {error && <p className="err">{error}</p>}

          <button
            className="btn"
            onClick={handleSignup}
            disabled={loading || !pwLong || !pwMatch}
          >
            {loading ? "Creating..." : "Create My Account!"}
          </button>

          <div className="link-row">
            Already have an account?&nbsp;<a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}
