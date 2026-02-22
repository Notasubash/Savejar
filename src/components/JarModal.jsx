"use client";

import { useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
// ── Currency helper (keep in sync with Dashboard) ─────────────────────────────
const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  AED: "د.إ",
  CNY: "¥",
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({
  children,
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);
const XIcon = (p) => (
  <Icon {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);
const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const JarIcon = (p) => (
  <Icon {...p}>
    <path d="M8 3h8" />
    <path d="M7 6h10l1 13H6L7 6z" />
    <path d="M6 9h12" />
  </Icon>
);
const TargetIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <circle
      cx="12"
      cy="12"
      r="6"
    />
    <circle
      cx="12"
      cy="12"
      r="2"
    />
  </Icon>
);
const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
    />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);
const PaletteIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="13.5"
      cy="6.5"
      r="1.5"
    />
    <circle
      cx="17.5"
      cy="10.5"
      r="1.5"
    />
    <circle
      cx="8.5"
      cy="7.5"
      r="1.5"
    />
    <circle
      cx="6.5"
      cy="12.5"
      r="1.5"
    />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </Icon>
);
const MailIcon = (p) => (
  <Icon {...p}>
    <rect
      width="20"
      height="16"
      x="2"
      y="4"
      rx="2"
    />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);
const UserIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="8"
      r="4"
    />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <path d="M12 6v6l4 2" />
  </Icon>
);
const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);
const SendIcon = (p) => (
  <Icon {...p}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </Icon>
);
const AlertIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <path d="M12 8v4M12 16h.01" />
  </Icon>
);

const JAR_COLORS = [
  { hex: "#ff6b2b", label: "Tangerine" },
  { hex: "#ffd000", label: "Sunbeam" },
  { hex: "#22c55e", label: "Mint" },
  { hex: "#9b5de5", label: "Grape" },
  { hex: "#ff4d8d", label: "Rose" },
  { hex: "#00b4d8", label: "Sky" },
  { hex: "#f97316", label: "Amber" },
  { hex: "#1a1a2e", label: "Midnight" },
];

export default function JarModal({
  open,
  onClose,
  theme,
  currency: currencyProp,
}) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState("#ffd000");
  const [emailInput, setEmailInput] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sharedUsers, setSharedUsers] = useState([]);

  if (!open) return null;

  // Use passed currency prop, fall back to ₹ if not provided
  const currency = currencyProp || "₹";

  const currentUserEmail = auth.currentUser?.email || "";

  // ── Theme ─────────────────────────────────────────────────────────────────
  const primary = theme?.primary || "#ff6b2b";
  const surface = theme?.surface || "#ffffff";
  const bg = theme?.bg || "#fff9f0";
  const accent = theme?.accent || "#ffd000";
  const isDark = theme?.id === "dark";
  const textColor = isDark ? "#e0e0ff" : "#1a1a2e";
  const mutedColor = isDark ? "#7a7a9a" : "#8a8a9a";
  const inputBg = isDark ? "#2a2a3e" : "#fafafa";
  const border = "#1a1a2e";

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: ".55rem .75rem",
    fontFamily: "inherit",
    fontSize: ".85rem",
    color: textColor,
    background: inputBg,
    border: `2.5px solid ${hasError ? "#ff4d8d" : border}`,
    borderRadius: "10px",
    outline: "none",
    boxSizing: "border-box",
    boxShadow: hasError ? "2px 2px 0 #ff4d8d" : `2px 2px 0 ${border}`,
    transition: "box-shadow .12s, border-color .12s",
  });

  const labelStyle = {
    fontFamily: "'Fredoka One', cursive",
    fontSize: ".78rem",
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: mutedColor,
    marginBottom: ".3rem",
    display: "flex",
    alignItems: "center",
    gap: ".35rem",
  };

  const fieldStyle = { marginBottom: "1.1rem" };

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Jar name is required";
    if (!goal || isNaN(Number(goal)) || Number(goal) <= 0)
      e.goal = "Enter a valid goal amount";
    return e;
  };

  // ── Add email with Firebase user check ────────────────────────────────────
  const addEmail = async () => {
    const email = emailInput.trim().toLowerCase();
    setEmailError("");

    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    if (email === currentUserEmail.toLowerCase()) {
      setEmailError("You can't add yourself to a shared jar");
      return;
    }
    if (sharedUsers.find((e) => e.email === email)) {
      setEmailError("This email is already added");
      return;
    }

    setEmailChecking(true);
    try {
      // Call a Cloud Function that checks the email server-side.
      // The client never touches the users/userEmails collection directly.
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/check-user-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ email }),
      });
      const { exists, uid } = await res.json();

      if (!exists) {
        setEmailError(
          "No JamJars account found for this email. Ask them to sign up first!",
        );
        return;
      }

      // Prevent duplicates
      if (sharedUsers.find((u) => u.uid === uid)) {
        setEmailError("This user is already added");
        return;
      }

      setSharedUsers((prev) => [...prev, { email, uid }]);
      setEmailInput("");
    } catch (e) {
      console.error(e);
      setEmailError("Couldn't verify this email. Please try again.");
    } finally {
      setEmailChecking(false);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (email) =>
    setSharedUsers((prev) => prev.filter((e) => e.email !== email));

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      const sharedUIDs = sharedUsers.map((u) => u.uid);
      const sharedEmailsList = sharedUsers.map((u) => u.email);

      await addDoc(collection(db, "jars"), {
        name: name.trim(),
        goal: Number(goal),
        deadline: deadline || null,
        color,

        createdBy: user.uid,
        createdByEmail: user.email,

        sharedWith: sharedUIDs, // UID list (for rules)
        sharedWithEmails: sharedEmailsList, // optional (for UI)

        createdAt: serverTimestamp(),
        pinned: false,
        archived: false,
        savedAmount: 0,
      });
      // Reset
      setName("");
      setGoal("");
      setDeadline("");
      setColor("#ffd000");
      setSharedUsers([]);
      setEmailInput("");
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to create jar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
        @keyframes modalIn   { from { opacity:0; transform:translateY(24px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        .jar-input:focus { border-color: ${primary} !important; box-shadow: 3px 3px 0 ${primary} !important; }
        .jar-swatch:hover { transform: translate(-2px,-2px) !important; }
        ::-webkit-calendar-picker-indicator { filter: ${isDark ? "invert(1)" : "none"} }
      `}</style>

      {/* Overlay */}
      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,26,46,.55)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "overlayIn .2s ease both",
          padding: "1rem",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: surface,
            border: `3px solid ${border}`,
            borderRadius: "18px",
            boxShadow: `6px 6px 0 ${border}`,
            width: "100%",
            maxWidth: "500px",
            maxHeight: "92vh",
            overflowY: "auto",
            animation: "modalIn .25s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.25rem 1.5rem 1rem",
              borderBottom: `2px solid ${border}`,
              background: accent + "22",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: ".6rem" }}
            >
              <span
                style={{
                  background: accent,
                  border: `2.5px solid ${border}`,
                  borderRadius: "10px",
                  width: 34,
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `2px 2px 0 ${border}`,
                }}
              >
                <JarIcon
                  size={18}
                  color={border}
                  strokeWidth={2.5}
                />
              </span>
              <span
                style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1.2rem",
                  color: textColor,
                }}
              >
                New Jar
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: `2px solid ${border}`,
                borderRadius: "8px",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: `2px 2px 0 ${border}`,
                transition: "transform .12s, box-shadow .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = `3px 3px 0 ${border}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `2px 2px 0 ${border}`;
              }}
            >
              <XIcon
                size={15}
                color={textColor}
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "1.4rem 1.5rem" }}>
            {/* Jar Name */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <JarIcon
                  size={13}
                  color={mutedColor}
                />
                Jar Name <span style={{ color: primary }}>*</span>
              </label>
              <input
                className="jar-input"
                style={inputStyle(errors.name)}
                value={name}
                placeholder="e.g. Vacation Fund"
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: undefined }));
                }}
              />
              {errors.name && (
                <p
                  style={{
                    fontSize: ".7rem",
                    color: "#ff4d8d",
                    fontWeight: 700,
                    marginTop: ".25rem",
                  }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Goal */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <TargetIcon
                  size={13}
                  color={mutedColor}
                />
                Savings Goal ({currency}){" "}
                <span style={{ color: primary }}>*</span>
              </label>
              <input
                className="jar-input"
                style={inputStyle(errors.goal)}
                type="number"
                min="1"
                value={goal}
                placeholder="e.g. 50000"
                onChange={(e) => {
                  setGoal(e.target.value);
                  setErrors((p) => ({ ...p, goal: undefined }));
                }}
              />
              {errors.goal && (
                <p
                  style={{
                    fontSize: ".7rem",
                    color: "#ff4d8d",
                    fontWeight: 700,
                    marginTop: ".25rem",
                  }}
                >
                  {errors.goal}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <CalendarIcon
                  size={13}
                  color={mutedColor}
                />
                Deadline
                <span
                  style={{
                    color: mutedColor,
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                    fontSize: ".7rem",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                className="jar-input"
                style={{
                  ...inputStyle(false),
                  colorScheme: isDark ? "dark" : "light",
                }}
                type="date"
                value={deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {/* Color */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <PaletteIcon
                  size={13}
                  color={mutedColor}
                />{" "}
                Jar Color
              </label>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                {JAR_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    className="jar-swatch"
                    title={c.label}
                    onClick={() => setColor(c.hex)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: c.hex,
                      border:
                        color === c.hex
                          ? `3px solid ${border}`
                          : `2px solid ${border}`,
                      boxShadow:
                        color === c.hex
                          ? `3px 3px 0 ${border}`
                          : `2px 2px 0 ${border}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: color === c.hex ? "translate(-1px,-1px)" : "",
                      transition: "transform .12s, box-shadow .12s",
                    }}
                  >
                    {color === c.hex && (
                      <CheckIcon
                        size={14}
                        color={c.hex === "#1a1a2e" ? "#fff" : border}
                        strokeWidth={3}
                      />
                    )}
                  </button>
                ))}
                <label
                  title="Custom"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    border: `2px dashed ${border}`,
                    boxShadow: `2px 2px 0 ${border}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    background: !JAR_COLORS.find((c) => c.hex === color)
                      ? color
                      : "transparent",
                  }}
                >
                  <PaletteIcon
                    size={14}
                    color={
                      !JAR_COLORS.find((c) => c.hex === color)
                        ? "#fff"
                        : mutedColor
                    }
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                  />
                </label>
              </div>
              <div
                style={{
                  marginTop: ".5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".72rem",
                  color: mutedColor,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "4px",
                    background: color,
                    border: `1.5px solid ${border}`,
                    display: "inline-block",
                  }}
                />
                {JAR_COLORS.find((c) => c.hex === color)?.label || "Custom"} —{" "}
                {color}
              </div>
            </div>

            {/* Share with */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <MailIcon
                  size={13}
                  color={mutedColor}
                />
                Share with
                <span
                  style={{
                    color: mutedColor,
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                    fontSize: ".7rem",
                  }}
                >
                  (optional)
                </span>
              </label>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <input
                  className="jar-input"
                  style={{ ...inputStyle(!!emailError), flex: 1 }}
                  type="email"
                  value={emailInput}
                  placeholder="friend@example.com"
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={handleEmailKeyDown}
                />
                <button
                  onClick={addEmail}
                  disabled={emailChecking}
                  style={{
                    background: emailChecking ? mutedColor : primary,
                    border: `2px solid ${border}`,
                    borderRadius: "10px",
                    color: "#fff",
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: ".8rem",
                    padding: ".55rem .8rem",
                    cursor: emailChecking ? "wait" : "pointer",
                    boxShadow: `2px 2px 0 ${border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: ".3rem",
                    whiteSpace: "nowrap",
                    transition: "transform .12s, box-shadow .12s",
                  }}
                  onMouseEnter={(e) => {
                    if (!emailChecking) {
                      e.currentTarget.style.transform = "translate(-1px,-1px)";
                      e.currentTarget.style.boxShadow = `3px 3px 0 ${border}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = `2px 2px 0 ${border}`;
                  }}
                >
                  {emailChecking ? (
                    <span style={{ fontSize: ".7rem" }}>Checking...</span>
                  ) : (
                    <>
                      <PlusIcon
                        size={13}
                        color="#fff"
                        strokeWidth={2.5}
                      />{" "}
                      Add
                    </>
                  )}
                </button>
              </div>

              {/* Email error */}
              {emailError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".35rem",
                    marginTop: ".35rem",
                    fontSize: ".72rem",
                    color: "#ff4d8d",
                    fontWeight: 700,
                  }}
                >
                  <AlertIcon
                    size={12}
                    color="#ff4d8d"
                  />
                  {emailError}
                </div>
              )}

              {/* Email chips — only verified JamJars users reach here */}
              {sharedUsers.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".4rem",
                    marginTop: ".65rem",
                  }}
                >
                  {sharedUsers.map(({ email }) => (
                    <span
                      key={email}
                      title="Verified JamJars user"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: ".35rem",
                        background: primary + "18",
                        border: `2px solid ${primary}`,
                        borderRadius: "999px",
                        padding: ".2rem .65rem",
                        fontSize: ".72rem",
                        fontWeight: 700,
                        color: primary,
                      }}
                    >
                      <CheckIcon
                        size={10}
                        color={primary}
                        strokeWidth={3}
                      />
                      {email}
                      <button
                        onClick={() => removeEmail(email)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          display: "flex",
                          alignItems: "center",
                          color: primary,
                          borderRadius: "50%",
                        }}
                      >
                        <XIcon
                          size={10}
                          color="currentColor"
                          strokeWidth={3}
                        />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Creator meta */}
            <div
              style={{
                background: isDark ? "#1a1a2e" : bg,
                border: `2px dashed ${border}`,
                borderRadius: "12px",
                padding: ".85rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: ".5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontSize: ".72rem",
                  color: mutedColor,
                  fontWeight: 600,
                }}
              >
                <UserIcon
                  size={12}
                  color={mutedColor}
                />
                <span style={{ color: textColor }}>
                  {currentUserEmail || "—"}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    background: primary + "22",
                    color: primary,
                    borderRadius: "999px",
                    padding: ".1rem .5rem",
                    fontSize: ".65rem",
                    fontWeight: 700,
                    border: `1.5px solid ${primary}`,
                  }}
                >
                  Creator
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                  fontSize: ".72rem",
                  color: mutedColor,
                  fontWeight: 600,
                }}
              >
                <ClockIcon
                  size={12}
                  color={mutedColor}
                />
                <span style={{ color: textColor }}>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button
                onClick={handleCreate}
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? mutedColor : primary,
                  border: `2.5px solid ${border}`,
                  borderRadius: "12px",
                  color: "#fff",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1rem",
                  padding: ".75rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: `4px 4px 0 ${border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: ".4rem",
                  transition: "transform .12s, box-shadow .12s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = `6px 6px 0 ${border}`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `4px 4px 0 ${border}`;
                }}
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <JarIcon
                      size={16}
                      color="#fff"
                      strokeWidth={2.5}
                    />{" "}
                    Create Jar
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: `2.5px solid ${border}`,
                  borderRadius: "12px",
                  color: textColor,
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1rem",
                  padding: ".75rem 1.25rem",
                  cursor: "pointer",
                  boxShadow: `4px 4px 0 ${border}`,
                  transition: "transform .12s, box-shadow .12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px,-2px)";
                  e.currentTarget.style.boxShadow = `6px 6px 0 ${border}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `4px 4px 0 ${border}`;
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
