"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { buildCss, getTheme, THEMES } from "../../lib/themes";
import { useUser } from "../../context/UserContext";

export default function Settings() {
  const { userData, updateUserData } = useUser();
  const router = useRouter();

  const [currency, setCurrency] = useState(userData?.currency || "INR");
  const [dateFormat, setDateFormat] = useState(
    userData?.dateFormat || "DD-MM-YYYY",
  );
  const [themeId, setThemeId] = useState(userData?.theme || "orange");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (userData) {
      setCurrency(userData.currency || "INR");
      setDateFormat(userData.dateFormat || "DD-MM-YYYY");
      setThemeId(userData.theme || "orange");
    }
  }, [userData?.theme, userData?.currency, userData?.dateFormat]);

  const theme = getTheme(themeId);
  const css = buildCss(theme);
  const isDark = theme.id === "dark";

  const toast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const save = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser.uid;
      const patch = { currency, dateFormat, theme: themeId };
      await updateDoc(doc(db, "users", uid), patch);
      updateUserData(patch);
      toast("Saved! Looking great!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError("");
    setDeleteLoad(true);
    try {
      const user = auth.currentUser;
      const cred = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, cred);
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/login");
    } catch (e) {
      setDeleteError(
        e.code === "auth/wrong-password" || e.code === "auth/invalid-credential"
          ? "Wrong password! Try again."
          : "Something went wrong!",
      );
    } finally {
      setDeleteLoad(false);
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
            background: theme.accent,
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
            background: theme.primary,
            animationDelay: "-3s",
          }}
        />

        <div
          className="card"
          style={{ maxWidth: 500 }}
        >
          <div className="card-stripe" />
          <div style={{ paddingTop: ".5rem" }}>
            <div className="top-bar">
              <div className="brand-pill">JamJars</div>
              <button
                className="back-btn"
                onClick={() => router.push("/dashboard")}
              >
                ← Dashboard
              </button>
            </div>

            <h2>Settings</h2>
            <p className="subtitle">Make JamJars yours!</p>

            {/* ── Theme ── */}
            <p className="section-title">Theme Color</p>
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

            {/* ── Prefs ── */}
            <p
              className="section-title"
              style={{ marginTop: "1.75rem" }}
            >
              Preferences
            </p>
            <div className="pref-row">
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
            </div>

            <button
              className="btn"
              onClick={save}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes!"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => router.push("/dashboard")}
            >
              ← Back to Dashboard
            </button>

            {/* ── Danger ── */}
            <div className="danger-zone">
              <div className="danger-head">
                <svg viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line
                    x1="12"
                    y1="9"
                    x2="12"
                    y2="13"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12.01"
                    y2="17"
                  />
                </svg>
                Danger Zone
              </div>
              <p className="danger-desc">
                Permanently deletes your account, all jars, goals, and data. No
                going back!
              </p>
              <button
                className="btn-danger"
                onClick={() => setShowModal(true)}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>

        {/* ── Delete modal ── */}
        {showModal && (
          <div
            className="overlay"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="modal">
              <div className="modal-icon">
                <svg viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </div>
              <h3>Are You Sure?</h3>
              <p>
                This will <strong>permanently delete</strong> your account and
                all data. Enter your password to confirm.
              </p>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setDeleteError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleDelete()}
              />
              {deleteError && <p className="err">{deleteError}</p>}
              <div className="modal-actions">
                <button
                  className="btn-ghost"
                  style={{ marginTop: 0 }}
                  onClick={() => {
                    setShowModal(false);
                    setPassword("");
                    setDeleteError("");
                  }}
                  disabled={deleteLoad}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={deleteLoad || !password}
                >
                  {deleteLoad ? "Deleting..." : "Yes, Delete!"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`toast ${showToast ? "show" : ""}`}>{toastMsg}</div>
      </div>
    </>
  );
}
