"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { buildCss, getTheme, THEMES } from "../../lib/themes";
import { db, auth } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  addDoc,
  Timestamp,
  increment,
} from "firebase/firestore";
import JarModal from "@/components/JarModal";

// ── Supported currencies ──────────────────────────────────────────────────────
export const CURRENCY_SYMBOLS = {
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
export const getCurrency = (userData) =>
  CURRENCY_SYMBOLS[userData?.currency] || userData?.currencySymbol || "₹";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({
  children,
  size = 24,
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
const WalletIcon = (p) => (
  <Icon {...p}>
    <rect
      width="20"
      height="14"
      x="2"
      y="5"
      rx="2"
    />
    <path d="M2 10h20" />
    <circle
      cx="16"
      cy="14"
      r="1.5"
      fill={p.color}
      stroke="none"
    />
  </Icon>
);
const JarIcon = (p) => (
  <Icon {...p}>
    <path d="M8 3h8" />
    <path d="M7 6h10l1 13H6L7 6z" />
    <path d="M6 9h12" />
  </Icon>
);
const CreditCard = (p) => (
  <Icon {...p}>
    <rect
      width="20"
      height="14"
      x="2"
      y="5"
      rx="2"
    />
    <path d="M2 10h20M6 15h2M10 15h4" />
  </Icon>
);
const SettingsIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="12"
      r="3"
    />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Icon>
);
const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const MinusIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 2a3 3 0 0 1 3 3v1l2 2v2H7V8l2-2V5a3 3 0 0 1 3-3z" />
    <path d="M12 17v5" />
    <path d="M9 8v1" />
  </Icon>
);
const ArchiveIcon = (p) => (
  <Icon {...p}>
    <rect
      width="20"
      height="5"
      x="2"
      y="3"
      rx="1"
    />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </Icon>
);
const UnarchiveIcon = (p) => (
  <Icon {...p}>
    <rect
      width="20"
      height="5"
      x="2"
      y="3"
      rx="1"
    />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4M12 10v4" />
  </Icon>
);
const UsersIcon = (p) => (
  <Icon {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle
      cx="9"
      cy="7"
      r="4"
    />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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
const TrashIcon = (p) => (
  <Icon {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </Icon>
);
const ArrowUpIcon = (p) => (
  <Icon {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Icon>
);
const ArrowDownIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Icon>
);
const ChevronRightIcon = (p) => (
  <Icon {...p}>
    <path d="M9 18l6-6-6-6" />
  </Icon>
);
const XIcon = (p) => (
  <Icon {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Icon>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);

// ── Quick Action Modal (Add / Withdraw) ───────────────────────────────────────
function QuickActionModal({ jar, action, currency, theme, user, onClose }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdd = action === "add";
  const border = "#1a1a2e";
  const accentColor = isAdd ? "#22c55e" : "#ff4d8d";

  const handleSubmit = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!isAdd && val > (jar.savedAmount || 0)) {
      setError("Can't withdraw more than saved");
      return;
    }
    if (!date) {
      setError("Please pick a date");
      return;
    }
    setLoading(true);
    try {
      const ts = Timestamp.fromDate(new Date(date + "T12:00:00"));
      const txRef = collection(db, "jars", jar.id, "transactions");
      await addDoc(txRef, {
        type: isAdd ? "deposit" : "withdrawal",
        amount: val,
        note: note.trim() || (isAdd ? "Deposit" : "Withdrawal"),
        createdAt: ts,
        createdBy: user.uid,
        createdByEmail: user.email,
      });
      await updateDoc(doc(db, "jars", jar.id), {
        savedAmount: increment(isAdd ? val : -val),
      });
      onClose();
    } catch (e) {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,46,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: theme.surface,
          border: `3px solid ${border}`,
          borderRadius: "20px",
          boxShadow: `8px 8px 0 ${border}`,
          padding: "2rem",
          width: "100%",
          maxWidth: 380,
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <XIcon
            size={20}
            color="#1a1a2e"
          />
        </button>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              background: accentColor + "22",
              border: `2px solid ${accentColor}`,
              borderRadius: "10px",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isAdd ? (
              <ArrowUpIcon
                size={18}
                color={accentColor}
                strokeWidth={2.5}
              />
            ) : (
              <ArrowDownIcon
                size={18}
                color={accentColor}
                strokeWidth={2.5}
              />
            )}
          </span>
          <div>
            <p
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: "1.2rem",
                color: "#1a1a2e",
                margin: 0,
              }}
            >
              {isAdd ? "Add Money" : "Withdraw"}
            </p>
            <p
              style={{
                fontSize: ".72rem",
                color: "#8a8a9a",
                fontWeight: 600,
                margin: 0,
              }}
            >
              {jar.name}
            </p>
          </div>
        </div>

        {/* Current */}
        <div
          style={{
            background: accentColor + "11",
            border: `2px solid ${accentColor}33`,
            borderRadius: "10px",
            padding: ".75rem 1rem",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: ".72rem",
              fontWeight: 700,
              color: "#8a8a9a",
              textTransform: "uppercase",
              letterSpacing: ".05em",
            }}
          >
            Current Balance
          </span>
          <span
            style={{
              fontFamily: "'Fredoka One',cursive",
              color: accentColor,
              fontSize: "1rem",
            }}
          >
            {currency}
            {(jar.savedAmount || 0).toLocaleString()}
          </span>
        </div>

        {/* Amount input */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".4rem",
          }}
        >
          Amount
        </label>
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "'Fredoka One',cursive",
              fontSize: "1rem",
              color: "#1a1a2e",
            }}
          >
            {currency}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="0.00"
            style={{
              width: "100%",
              paddingLeft: "2rem",
              paddingRight: "1rem",
              paddingTop: ".65rem",
              paddingBottom: ".65rem",
              border: `2.5px solid ${error ? "#ff4d8d" : border}`,
              borderRadius: "10px",
              fontFamily: "'Fredoka One',cursive",
              fontSize: "1.1rem",
              color: "#1a1a2e",
              outline: "none",
              boxSizing: "border-box",
              background: "#fff",
            }}
          />
        </div>

        {/* Date picker */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".4rem",
          }}
        >
          Date
        </label>
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <CalendarIcon
              size={15}
              color="#8a8a9a"
              strokeWidth={2}
            />
          </span>
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => {
              setDate(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              paddingLeft: "2.3rem",
              paddingRight: "1rem",
              paddingTop: ".65rem",
              paddingBottom: ".65rem",
              border: `2.5px solid ${border}`,
              borderRadius: "10px",
              fontFamily: "'Fredoka One',cursive",
              fontSize: ".9rem",
              color: "#1a1a2e",
              outline: "none",
              boxSizing: "border-box",
              background: "#fff",
              colorScheme: "light",
            }}
          />
        </div>

        {/* Note input */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".4rem",
          }}
        >
          Note{" "}
          <span style={{ color: "#8a8a9a", fontSize: ".7rem" }}>
            (optional)
          </span>
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isAdd ? "e.g. Monthly savings" : "e.g. Emergency use"}
          style={{
            width: "100%",
            padding: ".65rem 1rem",
            border: `2.5px solid ${border}`,
            borderRadius: "10px",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".88rem",
            color: "#1a1a2e",
            outline: "none",
            boxSizing: "border-box",
            background: "#fff",
            marginBottom: ".5rem",
          }}
        />

        {error && (
          <p
            style={{
              fontSize: ".72rem",
              color: "#ff4d8d",
              fontWeight: 700,
              marginBottom: ".75rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            background: accentColor,
            border: `2.5px solid ${border}`,
            borderRadius: "12px",
            color: "#fff",
            fontFamily: "'Fredoka One',cursive",
            fontSize: "1rem",
            padding: ".85rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: `4px 4px 0 ${border}`,
            marginTop: ".5rem",
            opacity: loading ? 0.7 : 1,
            transition: "transform .1s, box-shadow .1s",
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
          {loading
            ? "Processing..."
            : isAdd
              ? `Add ${currency}${amount || "0"}`
              : `Withdraw ${currency}${amount || "0"}`}
        </button>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteConfirmModal({ jar, theme, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const border = "#1a1a2e";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,46,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: theme.surface,
          border: `3px solid ${border}`,
          borderRadius: "20px",
          boxShadow: `8px 8px 0 ${border}`,
          padding: "2rem",
          width: "100%",
          maxWidth: 360,
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: "#ff4d8d22",
            border: `2px solid #ff4d8d`,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <TrashIcon
            size={24}
            color="#ff4d8d"
            strokeWidth={2}
          />
        </div>
        <p
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: "1.25rem",
            color: "#1a1a2e",
            marginBottom: ".5rem",
          }}
        >
          Delete Jar?
        </p>
        <p
          style={{
            fontSize: ".78rem",
            color: "#8a8a9a",
            fontWeight: 600,
            marginBottom: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          This will permanently delete{" "}
          <strong style={{ color: "#1a1a2e" }}>{jar.name}</strong> and all its
          transactions. This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "transparent",
              border: `2px solid ${border}`,
              borderRadius: "10px",
              fontFamily: "'Fredoka One',cursive",
              fontSize: ".88rem",
              color: "#1a1a2e",
              padding: ".7rem",
              cursor: "pointer",
              boxShadow: `2px 2px 0 ${border}`,
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
              onClose();
            }}
            disabled={loading}
            style={{
              flex: 1,
              background: "#ff4d8d",
              border: `2px solid ${border}`,
              borderRadius: "10px",
              fontFamily: "'Fredoka One',cursive",
              fontSize: ".88rem",
              color: "#fff",
              padding: ".7rem",
              cursor: "pointer",
              boxShadow: `3px 3px 0 ${border}`,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Jar card ──────────────────────────────────────────────────────────────────
function JarCard({
  jar,
  currentUserEmail,
  theme,
  currency,
  user,
  onPin,
  onArchive,
  onDelete,
  onOpenDetail,
}) {
  const [quickAction, setQuickAction] = useState(null); // "add" | "withdraw"
  const [showDelete, setShowDelete] = useState(false);
  const isDark = theme?.id === "dark";
  const textColor = isDark ? "#e0e0ff" : "#1a1a2e";
  const mutedColor = isDark ? "#7a7a9a" : "#8a8a9a";
  const surface = theme?.surface || "#ffffff";
  const border = "#1a1a2e";

  const isOwner = jar.createdByEmail === currentUserEmail;
  const canEdit = isOwner || jar.sharedWith?.includes(user?.uid);
  const progress =
    jar.goal > 0 ? Math.min((jar.savedAmount / jar.goal) * 100, 100) : 0;
  const daysLeft = jar.deadline
    ? Math.ceil((new Date(jar.deadline) - new Date()) / 86400000)
    : null;

  return (
    <>
      <div
        style={{
          background: surface,
          border: `3px solid ${border}`,
          borderRadius: "16px",
          boxShadow: jar.pinned
            ? `5px 5px 0 ${jar.color || "#ffd000"}`
            : `4px 4px 0 ${border}`,
          overflow: "hidden",
          transition: "transform .12s, box-shadow .12s",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => onOpenDetail(jar)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow = jar.pinned
            ? `7px 7px 0 ${jar.color}`
            : `6px 6px 0 ${border}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = jar.pinned
            ? `5px 5px 0 ${jar.color}`
            : `4px 4px 0 ${border}`;
        }}
      >
        {/* Color bar */}
        <div style={{ height: 6, background: jar.color || "#ffd000" }} />

        {/* Pin badge */}
        {jar.pinned && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: jar.color,
              border: `2px solid ${border}`,
              borderRadius: "999px",
              padding: ".15rem .45rem",
              fontSize: ".6rem",
              fontWeight: 700,
              color: "#1a1a2e",
              fontFamily: "'Fredoka One',cursive",
              display: "flex",
              alignItems: "center",
              gap: ".25rem",
            }}
          >
            <PinIcon
              size={9}
              color="#1a1a2e"
              strokeWidth={2.5}
            />{" "}
            Pinned
          </div>
        )}

        <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
          {/* Name + badge */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: ".6rem",
              paddingRight: jar.pinned ? "4rem" : 0,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1.1rem",
                  color: textColor,
                  margin: 0,
                }}
              >
                {jar.name}
              </p>
              <p
                style={{
                  fontSize: ".68rem",
                  color: mutedColor,
                  fontWeight: 600,
                  margin: ".1rem 0 0",
                }}
              >
                {isOwner ? "Created by you" : `by ${jar.createdByEmail}`}
              </p>
            </div>
            {!isOwner && (
              <span
                style={{
                  background: "#9b5de522",
                  border: "1.5px solid #9b5de5",
                  color: "#9b5de5",
                  borderRadius: "999px",
                  padding: ".15rem .5rem",
                  fontSize: ".62rem",
                  fontWeight: 700,
                  fontFamily: "'Fredoka One',cursive",
                  display: "flex",
                  alignItems: "center",
                  gap: ".25rem",
                  whiteSpace: "nowrap",
                }}
              >
                <UsersIcon
                  size={9}
                  color="#9b5de5"
                />{" "}
                Shared
              </span>
            )}
          </div>

          {/* Progress */}
          <div style={{ marginBottom: ".6rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".68rem",
                color: mutedColor,
                fontWeight: 600,
                marginBottom: ".25rem",
              }}
            >
              <span>
                {currency}
                {(jar.savedAmount || 0).toLocaleString()} saved
              </span>
              <span>
                {currency}
                {jar.goal.toLocaleString()} goal
              </span>
            </div>
            <div
              style={{
                height: 10,
                background: isDark ? "#2a2a3e" : "#f0f0f0",
                borderRadius: "999px",
                border: `2px solid ${border}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  background: jar.color || "#ffd000",
                  width: `${progress}%`,
                  transition: "width .4s ease",
                  minWidth: progress > 0 ? 8 : 0,
                }}
              />
            </div>
            <p
              style={{
                fontSize: ".65rem",
                color: jar.color || mutedColor,
                fontWeight: 700,
                margin: ".2rem 0 0",
                textAlign: "right",
              }}
            >
              {progress.toFixed(0)}% complete
            </p>
          </div>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              gap: ".6rem",
              flexWrap: "wrap",
              marginBottom: ".8rem",
            }}
          >
            {daysLeft !== null && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".25rem",
                  fontSize: ".66rem",
                  color: daysLeft < 7 ? "#ff4d8d" : mutedColor,
                  fontWeight: 600,
                }}
              >
                <CalendarIcon
                  size={10}
                  color={daysLeft < 7 ? "#ff4d8d" : mutedColor}
                />
                {daysLeft > 0 ? `${daysLeft}d left` : "Deadline passed"}
              </span>
            )}
            {jar.sharedWith?.length > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".25rem",
                  fontSize: ".66rem",
                  color: mutedColor,
                  fontWeight: 600,
                }}
              >
                <UsersIcon
                  size={10}
                  color={mutedColor}
                />{" "}
                {jar.sharedWith.length} member
                {jar.sharedWith.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ── Action Buttons Row ── */}
          <div
            style={{ display: "flex", gap: ".4rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Add */}
            <button
              onClick={() => setQuickAction("add")}
              style={{
                flex: 1,
                background: "#22c55e22",
                border: `2px solid #22c55e`,
                borderRadius: "8px",
                color: "#22c55e",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".7rem",
                padding: ".35rem .3rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".2rem",
                boxShadow: "2px 2px 0 #1a1a2e",
                transition: "transform .1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <ArrowUpIcon
                size={11}
                color="#22c55e"
                strokeWidth={2.5}
              />{" "}
              Add
            </button>
            {/* Withdraw */}
            <button
              onClick={() => setQuickAction("withdraw")}
              style={{
                flex: 1,
                background: "#ff4d8d22",
                border: `2px solid #ff4d8d`,
                borderRadius: "8px",
                color: "#ff4d8d",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".7rem",
                padding: ".35rem .3rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: ".2rem",
                boxShadow: "2px 2px 0 #1a1a2e",
                transition: "transform .1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
              }}
            >
              <ArrowDownIcon
                size={11}
                color="#ff4d8d"
                strokeWidth={2.5}
              />{" "}
              Withdraw
            </button>
            {/* Pin (owner only) */}
            {isOwner && (
              <button
                onClick={() => onPin(jar)}
                title={jar.pinned ? "Unpin" : "Pin"}
                style={{
                  background: jar.pinned ? jar.color + "22" : "transparent",
                  border: `2px solid ${border}`,
                  borderRadius: "8px",
                  color: textColor,
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".7rem",
                  padding: ".35rem .45rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "2px 2px 0 #1a1a2e",
                  transition: "transform .1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                <PinIcon
                  size={12}
                  color={jar.pinned ? jar.color : textColor}
                  strokeWidth={2.5}
                />
              </button>
            )}
            {/* Archive (owner only) */}
            {isOwner && (
              <button
                onClick={() => onArchive(jar)}
                title={jar.archived ? "Unarchive" : "Archive"}
                style={{
                  background: "transparent",
                  border: `2px solid ${border}`,
                  borderRadius: "8px",
                  color: textColor,
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".7rem",
                  padding: ".35rem .45rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "2px 2px 0 #1a1a2e",
                  transition: "transform .1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                {jar.archived ? (
                  <UnarchiveIcon
                    size={12}
                    color={textColor}
                    strokeWidth={2.5}
                  />
                ) : (
                  <ArchiveIcon
                    size={12}
                    color={textColor}
                    strokeWidth={2.5}
                  />
                )}
              </button>
            )}
            {/* Delete (owner only) */}
            {isOwner && (
              <button
                onClick={() => setShowDelete(true)}
                title="Delete jar"
                style={{
                  background: "#ff4d8d11",
                  border: `2px solid #ff4d8d66`,
                  borderRadius: "8px",
                  color: "#ff4d8d",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".7rem",
                  padding: ".35rem .45rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "2px 2px 0 #1a1a2e",
                  transition: "transform .1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                <TrashIcon
                  size={12}
                  color="#ff4d8d"
                  strokeWidth={2.5}
                />
              </button>
            )}
          </div>

          {/* View Details hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".3rem",
              marginTop: ".65rem",
              fontSize: ".62rem",
              color: mutedColor,
              fontWeight: 600,
            }}
          >
            <ChevronRightIcon
              size={10}
              color={mutedColor}
            />{" "}
            Click card to view details & history
          </div>
        </div>
      </div>

      {/* Modals */}
      {quickAction && (
        <QuickActionModal
          jar={jar}
          action={quickAction}
          currency={currency}
          theme={theme}
          user={user}
          onClose={() => setQuickAction(null)}
        />
      )}
      {showDelete && (
        <DeleteConfirmModal
          jar={jar}
          theme={theme}
          onClose={() => setShowDelete(false)}
          onConfirm={() => onDelete(jar)}
        />
      )}
    </>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, label, count, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".6rem",
        marginBottom: "1rem",
      }}
    >
      <span
        style={{
          background: color + "22",
          border: `2px solid ${color}`,
          borderRadius: "8px",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: "1rem",
          color: "#1a1a2e",
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          style={{
            background: color,
            border: "2px solid #1a1a2e",
            borderRadius: "999px",
            padding: ".05rem .5rem",
            fontSize: ".68rem",
            fontWeight: 700,
            color: "#fff",
            fontFamily: "'Fredoka One',cursive",
            boxShadow: "1px 1px 0 #1a1a2e",
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, userData, loading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [jars, setJars] = useState([]);
  const [jarsLoading, setJarsLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const jarsRef = collection(db, "jars");
    const qOwner = query(jarsRef, where("createdBy", "==", user.uid));
    const qShared = query(
      jarsRef,
      where("sharedWith", "array-contains", user.uid),
    );
    let ownerData = [],
      sharedData = [];
    const merge = () => {
      const map = new Map();
      [...ownerData, ...sharedData].forEach((j) => map.set(j.id, j));
      setJars(Array.from(map.values()));
      setJarsLoading(false);
    };
    const unsub1 = onSnapshot(qOwner, (snap) => {
      ownerData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      merge();
    });
    const unsub2 = onSnapshot(qShared, (snap) => {
      sharedData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      merge();
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  if (!mounted) return null;

  const theme = getTheme(userData?.theme || "orange");
  const css = buildCss(theme);
  const currency = getCurrency(userData);
  const isDark = theme.id === "dark";
  const textColor = isDark ? "#e0e0ff" : "#1a1a2e";
  const mutedColor = isDark ? "#7a7a9a" : "#8a8a9a";

  if (loading || !userData) {
    return (
      <>
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");
          @keyframes bounce { 0%,100% { transform: translateY(0); opacity:.4; } 50% { transform: translateY(-8px); opacity:1; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fill-rise { 0% { transform: translateY(0%); } 100% { transform: translateY(-78%); } }
        `}</style>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            background: "#fff9f0",
            fontFamily: "'Fredoka One', cursive",
          }}
        >
          <div
            style={{
              fontSize: "1.15rem",
              color: "#ff6b2b",
              letterSpacing: ".03em",
              animation: "fadeIn .5s ease both",
            }}
          >
            Loading your jars...
          </div>
          <div style={{ display: "flex", gap: ".5rem" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#ff6b2b",
                  animation: `bounce .8s ease-in-out ${i * 0.16}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  const currentEmail = user?.email || "";
  const activeJars = jars.filter((j) => !j.archived);
  const archivedJars = jars.filter((j) => j.archived);
  const pinnedJars = activeJars.filter((j) => j.pinned);
  const myJars = activeJars.filter(
    (j) => !j.pinned && j.createdByEmail === currentEmail,
  );
  const sharedJars = activeJars.filter(
    (j) => !j.pinned && j.createdByEmail !== currentEmail,
  );

  const totalSaved = jars.reduce((s, j) => s + (j.savedAmount || 0), 0);
  const totalDebts = jars.reduce(
    (s, j) => s + Math.max(0, j.goal - (j.savedAmount || 0)),
    0,
  );

  const togglePin = async (jar) =>
    updateDoc(doc(db, "jars", jar.id), { pinned: !jar.pinned });
  const toggleArchive = async (jar) =>
    updateDoc(doc(db, "jars", jar.id), {
      archived: !jar.archived,
      pinned: false,
    });
  const deleteJar = async (jar) => {
    // Note: subcollection transactions would need to be deleted via Cloud Functions in production
    await deleteDoc(doc(db, "jars", jar.id));
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  };

  const JarCardProps = {
    currentUserEmail: currentEmail,
    theme,
    currency,
    user,
    onPin: togglePin,
    onArchive: toggleArchive,
    onDelete: deleteJar,
    onOpenDetail: (jar) => router.push(`/jar/${jar.id}`),
  };

  return (
    <>
      <style>{css}</style>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: `radial-gradient(circle at 10% 15%, ${theme.primary}18 0%, transparent 40%), radial-gradient(circle at 90% 85%, ${theme.accent}18 0%, transparent 40%), ${theme.bg}`,
        }}
      >
        {/* Navbar */}
        <nav
          style={{
            background: theme.surface,
            borderBottom: "3px solid #1a1a2e",
            padding: ".85rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 3px 0 #1a1a2e",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: "1.4rem",
              color: theme.primary,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <span
              style={{
                border: "2.5px solid #1a1a2e",
                borderRadius: "10px",
                width: 32,
                height: 32,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 2px 0 #1a1a2e",
                background: theme.accent,
              }}
            >
              <JarIcon
                size={18}
                color="#1a1a2e"
                strokeWidth={2.5}
              />
            </span>
            JamJars
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem" }}>
            <button
              onClick={() => setOpenModal(true)}
              style={{
                background: theme.primary,
                border: "2px solid #1a1a2e",
                borderRadius: "999px",
                color: "#fff",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".78rem",
                padding: ".3rem .85rem",
                cursor: "pointer",
                boxShadow: "2px 2px 0 #1a1a2e",
                display: "inline-flex",
                alignItems: "center",
                gap: ".35rem",
                transition: "transform .12s, box-shadow .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a2e";
              }}
            >
              <PlusIcon
                size={14}
                color="#fff"
                strokeWidth={2.5}
              />{" "}
              New Jar
            </button>
            <a
              href="/settings"
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".78rem",
                background: "transparent",
                border: "2px solid #1a1a2e",
                borderRadius: "999px",
                padding: ".3rem .85rem",
                color: textColor,
                textDecoration: "none",
                boxShadow: "2px 2px 0 #1a1a2e",
                display: "inline-flex",
                alignItems: "center",
                gap: ".4rem",
                transition: "transform .12s, box-shadow .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "2px 2px 0 #1a1a2e";
              }}
            >
              <SettingsIcon
                size={18}
                color={textColor}
                strokeWidth={2}
              />{" "}
              Settings
            </a>
          </div>
        </nav>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: "2.5rem 2rem",
            maxWidth: "1000px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Greeting */}
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".7rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: theme.primary,
                marginBottom: ".2rem",
              }}
            >
              Welcome back
            </p>
            <p
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: "1.6rem",
                color: textColor,
                margin: 0,
              }}
            >
              {userData?.displayName || user?.email?.split("@")[0] || "Friend"}{" "}
              👋
            </p>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {[
              {
                label: "Total Savings",
                value: `${currency}${totalSaved.toLocaleString()}`,
                color: theme.primary,
                icon: (
                  <WalletIcon
                    size={24}
                    color={theme.primary}
                    strokeWidth={2}
                  />
                ),
              },
              {
                label: "Active Jars",
                value: activeJars.length,
                color: "#9b5de5",
                icon: (
                  <JarIcon
                    size={24}
                    color="#9b5de5"
                    strokeWidth={2}
                  />
                ),
              },
              {
                label: "Still Needed",
                value: `${currency}${totalDebts.toLocaleString()}`,
                color: "#ff4d8d",
                icon: (
                  <CreditCard
                    size={24}
                    color="#ff4d8d"
                    strokeWidth={2}
                  />
                ),
              },
              {
                label: "Shared With Me",
                value: sharedJars.length,
                color: "#22c55e",
                icon: (
                  <UsersIcon
                    size={24}
                    color="#22c55e"
                    strokeWidth={2}
                  />
                ),
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: theme.surface,
                  border: "3px solid #1a1a2e",
                  borderRadius: "14px",
                  padding: "1.25rem 1rem",
                  boxShadow: "4px 4px 0 #1a1a2e",
                  transition: "transform .12s, box-shadow .12s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-2px,-2px)";
                  e.currentTarget.style.boxShadow = "6px 6px 0 #1a1a2e";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "4px 4px 0 #1a1a2e";
                }}
              >
                <div style={{ marginBottom: ".4rem" }}>{s.icon}</div>
                <div
                  style={{
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: "1.5rem",
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: mutedColor,
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Loading */}
          {jarsLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: theme.surface,
                    border: "3px solid #1a1a2e",
                    borderRadius: "16px",
                    height: 200,
                    boxShadow: "4px 4px 0 #1a1a2e",
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!jarsLoading && jars.length === 0 && (
            <div
              style={{
                background: theme.surface,
                border: "3px dashed #1a1a2e",
                borderRadius: "14px",
                padding: "3rem 2rem",
                textAlign: "center",
                boxShadow: "4px 4px 0 #1a1a2e",
              }}
            >
              <JarIcon
                size={48}
                color={mutedColor}
                strokeWidth={1.5}
              />
              <p
                style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1.3rem",
                  color: textColor,
                  marginBottom: ".5rem",
                  marginTop: "1rem",
                }}
              >
                No jars yet!
              </p>
              <p
                style={{
                  fontSize: ".78rem",
                  color: mutedColor,
                  fontWeight: 600,
                  marginBottom: "1.5rem",
                }}
              >
                Create your first jar and start saving towards your goals
              </p>
              <button
                onClick={() => setOpenModal(true)}
                style={{
                  background: theme.primary,
                  border: "2.5px solid #1a1a2e",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1rem",
                  padding: ".75rem 2rem",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 #1a1a2e",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".4rem",
                }}
              >
                <PlusIcon
                  size={18}
                  color="#fff"
                  strokeWidth={2.5}
                />{" "}
                Create My First Jar!
              </button>
            </div>
          )}

          {/* Pinned */}
          {!jarsLoading && pinnedJars.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <SectionHeader
                icon={
                  <PinIcon
                    size={15}
                    color={theme.primary}
                    strokeWidth={2.5}
                  />
                }
                label="Pinned"
                count={pinnedJars.length}
                color={theme.primary}
              />
              <div style={gridStyle}>
                {pinnedJars.map((jar) => (
                  <JarCard
                    key={jar.id}
                    jar={jar}
                    {...JarCardProps}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Jars */}
          {!jarsLoading && myJars.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <SectionHeader
                icon={
                  <JarIcon
                    size={15}
                    color="#9b5de5"
                    strokeWidth={2.5}
                  />
                }
                label="My Jars"
                count={myJars.length}
                color="#9b5de5"
              />
              <div style={gridStyle}>
                {myJars.map((jar) => (
                  <JarCard
                    key={jar.id}
                    jar={jar}
                    {...JarCardProps}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Shared */}
          {!jarsLoading && sharedJars.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <SectionHeader
                icon={
                  <UsersIcon
                    size={15}
                    color="#22c55e"
                    strokeWidth={2.5}
                  />
                }
                label="Shared With Me"
                count={sharedJars.length}
                color="#22c55e"
              />
              <div style={gridStyle}>
                {sharedJars.map((jar) => (
                  <JarCard
                    key={jar.id}
                    jar={jar}
                    {...JarCardProps}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Archived */}
          {!jarsLoading && archivedJars.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <button
                onClick={() => setShowArchived((p) => !p)}
                style={{
                  background: "transparent",
                  border: "2px dashed #1a1a2e",
                  borderRadius: "10px",
                  padding: ".5rem 1rem",
                  cursor: "pointer",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".8rem",
                  color: mutedColor,
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  boxShadow: "2px 2px 0 #1a1a2e",
                  transition: "transform .12s",
                  marginBottom: showArchived ? "1rem" : 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                }}
              >
                <ArchiveIcon
                  size={14}
                  color={mutedColor}
                  strokeWidth={2}
                />
                {showArchived ? "Hide" : "Show"} Archived ({archivedJars.length}
                )
              </button>
              {showArchived && (
                <div style={gridStyle}>
                  {archivedJars.map((jar) => (
                    <div
                      key={jar.id}
                      style={{ opacity: 0.65 }}
                    >
                      <JarCard
                        jar={jar}
                        {...JarCardProps}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <JarModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        theme={theme}
        currency={currency}
      />
    </>
  );
}
