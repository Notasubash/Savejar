"use client";

import { useState } from "react";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { buildCss, getTheme } from "../../lib/themes";

const css = buildCss(getTheme("pink"));

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setShow(true);
      setTimeout(() => setShow(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <div
          className="blob"
          style={{
            width: 220,
            height: 220,
            top: -70,
            right: -70,
            background: "#ff4d8d",
            animationDelay: "0s",
          }}
        />
        <div
          className="blob"
          style={{
            width: 130,
            height: 130,
            bottom: -40,
            left: -40,
            background: "#ffd000",
            animationDelay: "-4s",
          }}
        />

        <div
          className="card"
          style={{ textAlign: "center" }}
        >
          <div
            className="icon-wrap"
            style={{ background: "#ffe0ec" }}
          >
            <svg
              viewBox="0 0 24 24"
              style={{ stroke: "#ff4d8d" }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line
                x1="12"
                y1="17"
                x2="12.01"
                y2="17"
              />
            </svg>
          </div>

          <h2>Forgot Password?</h2>
          <p className="subtitle">No worries! We'll send you a reset link</p>

          <div
            className="field"
            style={{ textAlign: "left" }}
          >
            <label>Your Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReset()}
            />
          </div>

          <button
            className="btn"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link!"}
          </button>

          <div className="link-row">
            <a href="/login">← Back to Login</a>
          </div>
        </div>

        <div className={`toast ${show ? "show" : ""}`}>Check your inbox!</div>
      </div>
    </>
  );
}
