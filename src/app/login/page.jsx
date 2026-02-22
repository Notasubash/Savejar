"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { buildCss, getTheme } from "../../lib/themes";

// Login has no user yet so we use a neutral default theme.
// Once they log in, their saved theme loads everywhere else.
const css = buildCss(getTheme("orange"));

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (data?.firstLogin) {
        router.push("/welcome");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Oops! Wrong email or password.");
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
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
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
