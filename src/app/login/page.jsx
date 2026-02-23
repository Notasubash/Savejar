"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { buildCss, getTheme } from "../../lib/themes";

const css = buildCss(getTheme("orange"));

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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      const data = userDoc.data();
      router.push(data?.firstLogin ? "/welcome" : "/dashboard");
    } catch {
      setError("Oops! Wrong email or password.");
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
      `}</style>

      <div className="page">
        <div
          className="blob"
          style={{
            width: 200,
            height: 200,
            top: -60,
            right: -60,
            background: "#ffd000",
            animationDelay: "0s",
          }}
        />
        <div
          className="blob"
          style={{
            width: 140,
            height: 140,
            bottom: -40,
            left: -40,
            background: "#ff4d8d",
            animationDelay: "-3.5s",
          }}
        />

        <div className="card">
          <div className="jar-icon">
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

          <h2>Welcome Back!</h2>
          <p className="subtitle">Your jars are waiting for you ✦</p>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
            {error && <p className="err">{error}</p>}
          </div>

          <button
            className="btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Let's Go! →"}
          </button>

          <div className="link-row">
            <a href="/forgot">Forgot password?</a>&nbsp;·&nbsp;
            <a href="/signup">Create account</a>
          </div>
        </div>
      </div>
    </>
  );
}
