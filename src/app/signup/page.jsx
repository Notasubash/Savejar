"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { buildCss, getTheme } from "../../lib/themes";

const css = buildCss(getTheme("teal"));

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
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
    } catch {
      setError("Couldn't create account. Try a stronger password!");
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
              placeholder="Make it strong!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
            {error && <p className="err">{error}</p>}
          </div>

          <button
            className="btn"
            onClick={handleSignup}
            disabled={loading}
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
