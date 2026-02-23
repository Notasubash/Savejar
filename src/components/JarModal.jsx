// "use client";

// import { useState } from "react";
// import { auth, db } from "../lib/firebase";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// // ── Currency helper (keep in sync with Dashboard) ─────────────────────────────
// const CURRENCY_SYMBOLS = {
//   INR: "₹",
//   USD: "$",
//   EUR: "€",
//   GBP: "£",
//   JPY: "¥",
//   AUD: "A$",
//   CAD: "C$",
//   SGD: "S$",
//   AED: "د.إ",
//   CNY: "¥",
// };

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const Icon = ({
//   children,
//   size = 16,
//   color = "currentColor",
//   strokeWidth = 2,
// }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={color}
//     strokeWidth={strokeWidth}
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     {children}
//   </svg>
// );
// const XIcon = (p) => (
//   <Icon {...p}>
//     <path d="M18 6 6 18M6 6l12 12" />
//   </Icon>
// );
// const PlusIcon = (p) => (
//   <Icon {...p}>
//     <path d="M12 5v14M5 12h14" />
//   </Icon>
// );
// const JarIcon = (p) => (
//   <Icon {...p}>
//     <path d="M8 3h8" />
//     <path d="M7 6h10l1 13H6L7 6z" />
//     <path d="M6 9h12" />
//   </Icon>
// );
// const TargetIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//     />
//     <circle
//       cx="12"
//       cy="12"
//       r="6"
//     />
//     <circle
//       cx="12"
//       cy="12"
//       r="2"
//     />
//   </Icon>
// );
// const CalendarIcon = (p) => (
//   <Icon {...p}>
//     <rect
//       x="3"
//       y="4"
//       width="18"
//       height="18"
//       rx="2"
//     />
//     <path d="M16 2v4M8 2v4M3 10h18" />
//   </Icon>
// );
// const PaletteIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="13.5"
//       cy="6.5"
//       r="1.5"
//     />
//     <circle
//       cx="17.5"
//       cy="10.5"
//       r="1.5"
//     />
//     <circle
//       cx="8.5"
//       cy="7.5"
//       r="1.5"
//     />
//     <circle
//       cx="6.5"
//       cy="12.5"
//       r="1.5"
//     />
//     <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
//   </Icon>
// );
// const MailIcon = (p) => (
//   <Icon {...p}>
//     <rect
//       width="20"
//       height="16"
//       x="2"
//       y="4"
//       rx="2"
//     />
//     <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
//   </Icon>
// );
// const UserIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="12"
//       cy="8"
//       r="4"
//     />
//     <path d="M20 21a8 8 0 1 0-16 0" />
//   </Icon>
// );
// const ClockIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//     />
//     <path d="M12 6v6l4 2" />
//   </Icon>
// );
// const CheckIcon = (p) => (
//   <Icon {...p}>
//     <path d="M20 6 9 17l-5-5" />
//   </Icon>
// );
// const SendIcon = (p) => (
//   <Icon {...p}>
//     <path d="m22 2-7 20-4-9-9-4Z" />
//     <path d="M22 2 11 13" />
//   </Icon>
// );
// const AlertIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//     />
//     <path d="M12 8v4M12 16h.01" />
//   </Icon>
// );

// const JAR_COLORS = [
//   { hex: "#ff6b2b", label: "Tangerine" },
//   { hex: "#ffd000", label: "Sunbeam" },
//   { hex: "#22c55e", label: "Mint" },
//   { hex: "#9b5de5", label: "Grape" },
//   { hex: "#ff4d8d", label: "Rose" },
//   { hex: "#00b4d8", label: "Sky" },
//   { hex: "#f97316", label: "Amber" },
//   { hex: "#1a1a2e", label: "Midnight" },
// ];

// export default function JarModal({
//   open,
//   onClose,
//   theme,
//   currency: currencyProp,
// }) {
//   const [name, setName] = useState("");
//   const [goal, setGoal] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [color, setColor] = useState("#ffd000");
//   const [emailInput, setEmailInput] = useState("");
//   const [emailChecking, setEmailChecking] = useState(false);
//   const [emailError, setEmailError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [sharedUsers, setSharedUsers] = useState([]);

//   if (!open) return null;

//   // Use passed currency prop, fall back to ₹ if not provided
//   const currency = currencyProp || "₹";

//   const currentUserEmail = auth.currentUser?.email || "";

//   // ── Theme ─────────────────────────────────────────────────────────────────
//   const primary = theme?.primary || "#ff6b2b";
//   const surface = theme?.surface || "#ffffff";
//   const bg = theme?.bg || "#fff9f0";
//   const accent = theme?.accent || "#ffd000";
//   const isDark = theme?.id === "dark";
//   const textColor = isDark ? "#e8e8ff" : "#1a1a2e";
//   const mutedColor = isDark ? "#8888aa" : "#8a8a9a";
//   const inputBg = isDark ? "#252540" : "#fafafa";
//   const border = isDark ? "#4a4a6a" : "#1a1a2e";
//   const shadowCol = isDark ? "#000000" : "#1a1a2e";

//   const inputStyle = (hasError) => ({
//     width: "100%",
//     padding: ".55rem .75rem",
//     fontFamily: "inherit",
//     fontSize: ".85rem",
//     color: textColor,
//     background: inputBg,
//     border: `2.5px solid ${hasError ? "#ff4d8d" : border}`,
//     borderRadius: "10px",
//     outline: "none",
//     boxSizing: "border-box",
//     boxShadow: hasError ? "2px 2px 0 #ff4d8d" : `2px 2px 0 ${shadowCol}`,
//     transition: "box-shadow .12s, border-color .12s",
//   });

//   const labelStyle = {
//     fontFamily: "'Fredoka One', cursive",
//     fontSize: ".78rem",
//     letterSpacing: ".06em",
//     textTransform: "uppercase",
//     color: mutedColor,
//     marginBottom: ".3rem",
//     display: "flex",
//     alignItems: "center",
//     gap: ".35rem",
//   };

//   const fieldStyle = { marginBottom: "1.1rem" };

//   // ── Validate ──────────────────────────────────────────────────────────────
//   const validate = () => {
//     const e = {};
//     if (!name.trim()) e.name = "Jar name is required";
//     if (!goal || isNaN(Number(goal)) || Number(goal) <= 0)
//       e.goal = "Enter a valid goal amount";
//     return e;
//   };

//   // ── Add email with Firebase user check ────────────────────────────────────
//   const addEmail = async () => {
//     const email = emailInput.trim().toLowerCase();
//     setEmailError("");

//     if (!email) return;
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setEmailError("Enter a valid email address");
//       return;
//     }
//     if (email === currentUserEmail.toLowerCase()) {
//       setEmailError("You can't add yourself to a shared jar");
//       return;
//     }
//     if (sharedUsers.find((e) => e.email === email)) {
//       setEmailError("This email is already added");
//       return;
//     }

//     setEmailChecking(true);
//     try {
//       // Call a Cloud Function that checks the email server-side.
//       // The client never touches the users/userEmails collection directly.
//       const idToken = await auth.currentUser.getIdToken();
//       const res = await fetch("/api/check-user-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({ email }),
//       });
//       const { exists, uid } = await res.json();

//       if (!exists) {
//         setEmailError(
//           "No JamJars account found for this email. Ask them to sign up first!",
//         );
//         return;
//       }

//       // Prevent duplicates
//       if (sharedUsers.find((u) => u.uid === uid)) {
//         setEmailError("This user is already added");
//         return;
//       }

//       setSharedUsers((prev) => [...prev, { email, uid }]);
//       setEmailInput("");
//     } catch (e) {
//       console.error(e);
//       setEmailError("Couldn't verify this email. Please try again.");
//     } finally {
//       setEmailChecking(false);
//     }
//   };

//   const handleEmailKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       addEmail();
//     }
//   };

//   const removeEmail = (email) =>
//     setSharedUsers((prev) => prev.filter((e) => e.email !== email));

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleCreate = async () => {
//     const errs = validate();
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       return;
//     }
//     setErrors({});

//     const user = auth.currentUser;
//     if (!user) return;

//     setLoading(true);
//     try {
//       const sharedUIDs = sharedUsers.map((u) => u.uid);
//       const sharedEmailsList = sharedUsers.map((u) => u.email);

//       await addDoc(collection(db, "jars"), {
//         name: name.trim(),
//         goal: Number(goal),
//         deadline: deadline || null,
//         color,

//         createdBy: user.uid,
//         createdByEmail: user.email,

//         sharedWith: sharedUIDs, // UID list (for rules)
//         sharedWithEmails: sharedEmailsList, // optional (for UI)

//         createdAt: serverTimestamp(),
//         pinned: false,
//         archived: false,
//         savedAmount: 0,
//       });
//       // Reset
//       setName("");
//       setGoal("");
//       setDeadline("");
//       setColor("#ffd000");
//       setSharedUsers([]);
//       setEmailInput("");
//       onClose();
//     } catch (e) {
//       console.error(e);
//       alert("Failed to create jar. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <>
//       <style>{`
//         @keyframes overlayIn { from { opacity:0 } to { opacity:1 } }
//         @keyframes modalIn   { from { opacity:0; transform:translateY(24px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
//         .jar-input:focus { border-color: ${primary} !important; box-shadow: 3px 3px 0 ${primary} !important; }
//         .jar-swatch:hover { transform: translate(-2px,-2px) !important; }
//         ::-webkit-calendar-picker-indicator { filter: ${isDark ? "invert(1)" : "none"} }
//       `}</style>

//       {/* Overlay */}
//       <div
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//         style={{
//           position: "fixed",
//           inset: 0,
//           background: "rgba(26,26,46,.55)",
//           backdropFilter: "blur(3px)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000,
//           animation: "overlayIn .2s ease both",
//           padding: ".75rem",
//         }}
//       >
//         {/* Card */}
//         <div
//           style={{
//             background: surface,
//             border: `3px solid ${border}`,
//             borderRadius: "18px",
//             boxShadow: `6px 6px 0 ${shadowCol}`,
//             width: "100%",
//             maxWidth: "500px",
//             maxHeight: "92vh",
//             overflowY: "auto",
//             overflowX: "hidden",
//             animation: "modalIn .25s cubic-bezier(.34,1.56,.64,1) both",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "1rem 1.25rem .85rem",
//               borderBottom: `2px solid ${border}`,
//               background: accent + "22",
//               borderRadius: "15px 15px 0 0",
//             }}
//           >
//             <div
//               style={{ display: "flex", alignItems: "center", gap: ".6rem" }}
//             >
//               <span
//                 style={{
//                   background: accent,
//                   border: `2.5px solid ${border}`,
//                   borderRadius: "10px",
//                   width: 34,
//                   height: 34,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   boxShadow: `2px 2px 0 ${shadowCol}`,
//                 }}
//               >
//                 <JarIcon
//                   size={18}
//                   color={border}
//                   strokeWidth={2.5}
//                 />
//               </span>
//               <span
//                 style={{
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: "1.2rem",
//                   color: textColor,
//                 }}
//               >
//                 New Jar
//               </span>
//             </div>
//             <button
//               onClick={onClose}
//               style={{
//                 background: "transparent",
//                 border: `2px solid ${border}`,
//                 borderRadius: "8px",
//                 width: 32,
//                 height: 32,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 boxShadow: `2px 2px 0 ${shadowCol}`,
//                 transition: "transform .12s, box-shadow .12s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "translate(-1px,-1px)";
//                 e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "";
//                 e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowCol}`;
//               }}
//             >
//               <XIcon
//                 size={15}
//                 color={textColor}
//                 strokeWidth={2.5}
//               />
//             </button>
//           </div>

//           {/* Body */}
//           <div style={{ padding: "1.25rem 1.25rem" }}>
//             {/* Jar Name */}
//             <div style={fieldStyle}>
//               <label style={labelStyle}>
//                 <JarIcon
//                   size={13}
//                   color={mutedColor}
//                 />
//                 Jar Name <span style={{ color: primary }}>*</span>
//               </label>
//               <input
//                 className="jar-input"
//                 style={inputStyle(errors.name)}
//                 value={name}
//                 placeholder="e.g. Vacation Fund"
//                 onChange={(e) => {
//                   setName(e.target.value);
//                   setErrors((p) => ({ ...p, name: undefined }));
//                 }}
//               />
//               {errors.name && (
//                 <p
//                   style={{
//                     fontSize: ".7rem",
//                     color: "#ff4d8d",
//                     fontWeight: 700,
//                     marginTop: ".25rem",
//                   }}
//                 >
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Goal */}
//             <div style={fieldStyle}>
//               <label style={labelStyle}>
//                 <TargetIcon
//                   size={13}
//                   color={mutedColor}
//                 />
//                 Savings Goal ({currency}){" "}
//                 <span style={{ color: primary }}>*</span>
//               </label>
//               <input
//                 className="jar-input"
//                 style={inputStyle(errors.goal)}
//                 type="number"
//                 min="1"
//                 value={goal}
//                 placeholder="e.g. 50000"
//                 onChange={(e) => {
//                   setGoal(e.target.value);
//                   setErrors((p) => ({ ...p, goal: undefined }));
//                 }}
//               />
//               {errors.goal && (
//                 <p
//                   style={{
//                     fontSize: ".7rem",
//                     color: "#ff4d8d",
//                     fontWeight: 700,
//                     marginTop: ".25rem",
//                   }}
//                 >
//                   {errors.goal}
//                 </p>
//               )}
//             </div>

//             {/* Deadline */}
//             <div style={fieldStyle}>
//               <label style={labelStyle}>
//                 <CalendarIcon
//                   size={13}
//                   color={mutedColor}
//                 />
//                 Deadline
//                 <span
//                   style={{
//                     color: mutedColor,
//                     fontWeight: 400,
//                     textTransform: "none",
//                     letterSpacing: 0,
//                     fontSize: ".7rem",
//                   }}
//                 >
//                   (optional)
//                 </span>
//               </label>
//               <input
//                 className="jar-input"
//                 style={{
//                   ...inputStyle(false),
//                   colorScheme: isDark ? "dark" : "light",
//                 }}
//                 type="date"
//                 value={deadline}
//                 min={new Date().toISOString().split("T")[0]}
//                 onChange={(e) => setDeadline(e.target.value)}
//               />
//             </div>

//             {/* Color */}
//             <div style={fieldStyle}>
//               <label style={labelStyle}>
//                 <PaletteIcon
//                   size={13}
//                   color={mutedColor}
//                 />{" "}
//                 Jar Color
//               </label>
//               <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
//                 {JAR_COLORS.map((c) => (
//                   <button
//                     key={c.hex}
//                     className="jar-swatch"
//                     title={c.label}
//                     onClick={() => setColor(c.hex)}
//                     style={{
//                       width: 32,
//                       height: 32,
//                       borderRadius: "8px",
//                       background: c.hex,
//                       border:
//                         color === c.hex
//                           ? `3px solid ${border}`
//                           : `2px solid ${border}`,
//                       boxShadow:
//                         color === c.hex
//                           ? `3px 3px 0 ${border}`
//                           : `2px 2px 0 ${border}`,
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       transform: color === c.hex ? "translate(-1px,-1px)" : "",
//                       transition: "transform .12s, box-shadow .12s",
//                     }}
//                   >
//                     {color === c.hex && (
//                       <CheckIcon
//                         size={14}
//                         color={c.hex === "#1a1a2e" ? "#fff" : border}
//                         strokeWidth={3}
//                       />
//                     )}
//                   </button>
//                 ))}
//                 <label
//                   title="Custom"
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: "8px",
//                     border: `2px dashed ${border}`,
//                     boxShadow: `2px 2px 0 ${shadowCol}`,
//                     cursor: "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     overflow: "hidden",
//                     position: "relative",
//                     background: !JAR_COLORS.find((c) => c.hex === color)
//                       ? color
//                       : "transparent",
//                   }}
//                 >
//                   <PaletteIcon
//                     size={14}
//                     color={
//                       !JAR_COLORS.find((c) => c.hex === color)
//                         ? "#fff"
//                         : mutedColor
//                     }
//                   />
//                   <input
//                     type="color"
//                     value={color}
//                     onChange={(e) => setColor(e.target.value)}
//                     style={{
//                       position: "absolute",
//                       opacity: 0,
//                       width: "100%",
//                       height: "100%",
//                       cursor: "pointer",
//                     }}
//                   />
//                 </label>
//               </div>
//               <div
//                 style={{
//                   marginTop: ".5rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".4rem",
//                   fontSize: ".72rem",
//                   color: mutedColor,
//                   fontWeight: 600,
//                 }}
//               >
//                 <span
//                   style={{
//                     width: 14,
//                     height: 14,
//                     borderRadius: "4px",
//                     background: color,
//                     border: `1.5px solid ${border}`,
//                     display: "inline-block",
//                   }}
//                 />
//                 {JAR_COLORS.find((c) => c.hex === color)?.label || "Custom"} —{" "}
//                 {color}
//               </div>
//             </div>

//             {/* Share with */}
//             <div style={fieldStyle}>
//               <label style={labelStyle}>
//                 <MailIcon
//                   size={13}
//                   color={mutedColor}
//                 />
//                 Share with
//                 <span
//                   style={{
//                     color: mutedColor,
//                     fontWeight: 400,
//                     textTransform: "none",
//                     letterSpacing: 0,
//                     fontSize: ".7rem",
//                   }}
//                 >
//                   (optional)
//                 </span>
//               </label>
//               <div style={{ display: "flex", gap: ".5rem" }}>
//                 <input
//                   className="jar-input"
//                   style={{ ...inputStyle(!!emailError), flex: 1 }}
//                   type="email"
//                   value={emailInput}
//                   placeholder="friend@example.com"
//                   onChange={(e) => {
//                     setEmailInput(e.target.value);
//                     setEmailError("");
//                   }}
//                   onKeyDown={handleEmailKeyDown}
//                 />
//                 <button
//                   onClick={addEmail}
//                   disabled={emailChecking}
//                   style={{
//                     background: emailChecking ? mutedColor : primary,
//                     border: `2px solid ${border}`,
//                     borderRadius: "10px",
//                     color: "#fff",
//                     fontFamily: "'Fredoka One',cursive",
//                     fontSize: ".8rem",
//                     padding: ".55rem .8rem",
//                     cursor: emailChecking ? "wait" : "pointer",
//                     boxShadow: `2px 2px 0 ${shadowCol}`,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: ".3rem",
//                     whiteSpace: "nowrap",
//                     transition: "transform .12s, box-shadow .12s",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!emailChecking) {
//                       e.currentTarget.style.transform = "translate(-1px,-1px)";
//                       e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "";
//                     e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowCol}`;
//                   }}
//                 >
//                   {emailChecking ? (
//                     <span style={{ fontSize: ".7rem" }}>Checking...</span>
//                   ) : (
//                     <>
//                       <PlusIcon
//                         size={13}
//                         color="#fff"
//                         strokeWidth={2.5}
//                       />{" "}
//                       Add
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* Email error */}
//               {emailError && (
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: ".35rem",
//                     marginTop: ".35rem",
//                     fontSize: ".72rem",
//                     color: "#ff4d8d",
//                     fontWeight: 700,
//                   }}
//                 >
//                   <AlertIcon
//                     size={12}
//                     color="#ff4d8d"
//                   />
//                   {emailError}
//                 </div>
//               )}

//               {/* Email chips — only verified JamJars users reach here */}
//               {sharedUsers.length > 0 && (
//                 <div
//                   style={{
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: ".4rem",
//                     marginTop: ".65rem",
//                   }}
//                 >
//                   {sharedUsers.map(({ email }) => (
//                     <span
//                       key={email}
//                       title="Verified JamJars user"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: ".35rem",
//                         background: primary + "18",
//                         border: `2px solid ${primary}`,
//                         borderRadius: "999px",
//                         padding: ".2rem .65rem",
//                         fontSize: ".72rem",
//                         fontWeight: 700,
//                         color: primary,
//                       }}
//                     >
//                       <CheckIcon
//                         size={10}
//                         color={primary}
//                         strokeWidth={3}
//                       />
//                       {email}
//                       <button
//                         onClick={() => removeEmail(email)}
//                         style={{
//                           background: "transparent",
//                           border: "none",
//                           cursor: "pointer",
//                           padding: 0,
//                           display: "flex",
//                           alignItems: "center",
//                           color: primary,
//                           borderRadius: "50%",
//                         }}
//                       >
//                         <XIcon
//                           size={10}
//                           color="currentColor"
//                           strokeWidth={3}
//                         />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Creator meta */}
//             <div
//               style={{
//                 background: isDark ? "#16162a" : bg,
//                 border: `2px dashed ${isDark ? "#4a4a6a" : "#c0c0d0"}`,
//                 borderRadius: "12px",
//                 padding: ".85rem 1rem",
//                 marginBottom: "1.25rem",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: ".5rem",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".5rem",
//                   fontSize: ".72rem",
//                   color: mutedColor,
//                   fontWeight: 600,
//                 }}
//               >
//                 <UserIcon
//                   size={12}
//                   color={mutedColor}
//                 />
//                 <span style={{ color: textColor }}>
//                   {currentUserEmail || "—"}
//                 </span>
//                 <span
//                   style={{
//                     marginLeft: "auto",
//                     background: primary + "22",
//                     color: primary,
//                     borderRadius: "999px",
//                     padding: ".1rem .5rem",
//                     fontSize: ".65rem",
//                     fontWeight: 700,
//                     border: `1.5px solid ${primary}`,
//                   }}
//                 >
//                   Creator
//                 </span>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".5rem",
//                   fontSize: ".72rem",
//                   color: mutedColor,
//                   fontWeight: 600,
//                 }}
//               >
//                 <ClockIcon
//                   size={12}
//                   color={mutedColor}
//                 />
//                 <span style={{ color: textColor }}>
//                   {new Date().toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             {/* Actions */}
//             <div style={{ display: "flex", gap: ".75rem" }}>
//               <button
//                 onClick={handleCreate}
//                 disabled={loading}
//                 style={{
//                   flex: 1,
//                   background: loading ? mutedColor : primary,
//                   border: `2.5px solid ${border}`,
//                   borderRadius: "12px",
//                   color: "#fff",
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: "1rem",
//                   padding: ".75rem",
//                   cursor: loading ? "not-allowed" : "pointer",
//                   boxShadow: `4px 4px 0 ${shadowCol}`,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: ".4rem",
//                   transition: "transform .12s, box-shadow .12s",
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!loading) {
//                     e.currentTarget.style.transform = "translate(-2px,-2px)";
//                     e.currentTarget.style.boxShadow = `6px 6px 0 ${shadowCol}`;
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "";
//                   e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
//                 }}
//               >
//                 {loading ? (
//                   "Creating..."
//                 ) : (
//                   <>
//                     <JarIcon
//                       size={16}
//                       color="#fff"
//                       strokeWidth={2.5}
//                     />{" "}
//                     Create Jar
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={onClose}
//                 style={{
//                   background: "transparent",
//                   border: `2.5px solid ${border}`,
//                   borderRadius: "12px",
//                   color: textColor,
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: "1rem",
//                   padding: ".75rem 1.25rem",
//                   cursor: "pointer",
//                   boxShadow: `4px 4px 0 ${shadowCol}`,
//                   transition: "transform .12s, box-shadow .12s",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = "translate(-2px,-2px)";
//                   e.currentTarget.style.boxShadow = `6px 6px 0 ${shadowCol}`;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = "";
//                   e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ── Jar shape definitions (shared with dashboard) ─────────────────────────────
export const JAR_SHAPES = [
  {
    id: "classic",
    label: "Classic Mason",
    jarPath:
      "M 23 18 L 23 28 C 23 36 8 34 8 42 L 8 98 Q 8 108 18 108 L 62 108 Q 72 108 72 98 L 72 42 C 72 34 57 36 57 28 L 57 18 Z",
    liquidClip:
      "M 8 42 L 8 98 Q 8 108 18 108 L 62 108 Q 72 108 72 98 L 72 42 C 72 34 57 36 57 28 L 23 28 C 23 36 8 34 8 42 Z",
    lid: { x: 21, y: 5, w: 38, h: 9, rx: 3 },
    band: { x: 22, y: 13, w: 36, h: 5, rx: 1.5 },
    fillOffset: 5,
    fillBottom: 112,
    liquidTop: 28,
    liquidBottom: 108,
  },
  {
    id: "round",
    label: "Round Belly",
    jarPath:
      "M 26 18 L 26 26 C 20 28 5 36 5 52 C 5 72 10 100 12 106 Q 14 112 22 112 L 58 112 Q 66 112 68 106 C 70 100 75 72 75 52 C 75 36 60 28 54 26 L 54 18 Z",
    liquidClip:
      "M 5 52 C 5 72 10 100 12 106 Q 14 112 22 112 L 58 112 Q 66 112 68 106 C 70 100 75 72 75 52 C 75 36 60 28 54 26 L 26 26 C 20 28 5 36 5 52 Z",
    lid: { x: 24, y: 5, w: 32, h: 9, rx: 3 },
    band: { x: 25, y: 13, w: 30, h: 5, rx: 1.5 },
    fillOffset: 5,
    fillBottom: 116,
    liquidTop: 26,
    liquidBottom: 112,
  },
  {
    id: "tall",
    label: "Tall Slim",
    jarPath:
      "M 29 16 L 29 24 C 29 30 18 30 18 36 L 18 104 Q 18 112 26 112 L 54 112 Q 62 112 62 104 L 62 36 C 62 30 51 30 51 24 L 51 16 Z",
    liquidClip:
      "M 18 36 L 18 104 Q 18 112 26 112 L 54 112 Q 62 112 62 104 L 62 36 C 62 30 51 30 51 24 L 29 24 C 29 30 18 30 18 36 Z",
    lid: { x: 27, y: 5, w: 26, h: 9, rx: 3 },
    band: { x: 28, y: 13, w: 24, h: 5, rx: 1.5 },
    fillOffset: 4,
    fillBottom: 116,
    liquidTop: 24,
    liquidBottom: 112,
  },
  {
    id: "squat",
    label: "Wide & Squat",
    jarPath:
      "M 18 18 L 18 26 C 18 32 6 32 6 38 L 6 90 Q 6 100 16 100 L 64 100 Q 74 100 74 90 L 74 38 C 74 32 62 32 62 26 L 62 18 Z",
    liquidClip:
      "M 6 38 L 6 90 Q 6 100 16 100 L 64 100 Q 74 100 74 90 L 74 38 C 74 32 62 32 62 26 L 18 26 C 18 32 6 32 6 38 Z",
    lid: { x: 16, y: 5, w: 48, h: 9, rx: 3 },
    band: { x: 17, y: 13, w: 46, h: 5, rx: 1.5 },
    fillOffset: 4,
    fillBottom: 104,
    liquidTop: 26,
    liquidBottom: 100,
  },
  {
    id: "hex",
    label: "Hexagonal",
    jarPath:
      "M 26 18 L 26 26 L 8 36 L 8 96 Q 8 108 20 108 L 60 108 Q 72 108 72 96 L 72 36 L 54 26 L 54 18 Z",
    liquidClip:
      "M 8 36 L 8 96 Q 8 108 20 108 L 60 108 Q 72 108 72 96 L 72 36 L 54 26 L 26 26 L 8 36 Z",
    lid: { x: 23, y: 5, w: 34, h: 9, rx: 2 },
    band: { x: 24, y: 13, w: 32, h: 5, rx: 1 },
    fillOffset: 4,
    fillBottom: 112,
    liquidTop: 26,
    liquidBottom: 108,
  },
  {
    id: "amphora",
    label: "Amphora",
    jarPath:
      "M 30 16 L 30 22 C 24 24 16 30 14 40 C 10 52 10 64 12 80 C 14 96 18 108 22 112 L 58 112 C 62 108 66 96 68 80 C 70 64 70 52 66 40 C 64 30 56 24 50 22 L 50 16 Z",
    liquidClip:
      "M 14 40 C 10 52 10 64 12 80 C 14 96 18 108 22 112 L 58 112 C 62 108 66 96 68 80 C 70 64 70 52 66 40 C 64 30 56 24 50 22 L 30 22 C 24 24 16 30 14 40 Z",
    lid: { x: 27, y: 4, w: 26, h: 9, rx: 4 },
    band: { x: 28, y: 12, w: 24, h: 5, rx: 2 },
    fillOffset: 5,
    fillBottom: 116,
    liquidTop: 22,
    liquidBottom: 112,
  },
  {
    id: "modern",
    label: "Modern Flat",
    jarPath:
      "M 24 18 L 24 26 L 16 28 L 16 100 Q 16 110 26 110 L 54 110 Q 64 110 64 100 L 64 28 L 56 26 L 56 18 Z",
    liquidClip:
      "M 16 28 L 16 100 Q 16 110 26 110 L 54 110 Q 64 110 64 100 L 64 28 L 56 26 L 24 26 L 16 28 Z",
    lid: { x: 21, y: 5, w: 38, h: 10, rx: 1 },
    band: { x: 22, y: 13, w: 36, h: 5, rx: 0.5 },
    fillOffset: 4,
    fillBottom: 114,
    liquidTop: 26,
    liquidBottom: 110,
  },
  {
    id: "potion",
    label: "Potion Bottle",
    jarPath:
      "M 32 14 L 32 30 C 22 36 8 48 8 66 C 8 90 18 110 28 114 L 52 114 C 62 110 72 90 72 66 C 72 48 58 36 48 30 L 48 14 Z",
    liquidClip:
      "M 8 66 C 8 90 18 110 28 114 L 52 114 C 62 110 72 90 72 66 C 72 48 58 36 48 30 L 32 30 C 22 36 8 48 8 66 Z",
    lid: { x: 29, y: 4, w: 22, h: 8, rx: 4 },
    band: { x: 30, y: 11, w: 20, h: 5, rx: 2 },
    fillOffset: 5,
    fillBottom: 118,
    liquidTop: 30,
    liquidBottom: 114,
  },
];

// ── Jar SVG renderer (used in picker + dashboard) ─────────────────────────────
export function JarShapeSVG({
  shape,
  progress = 60,
  color = "#ffd000",
  isDark = false,
  size = 80,
}) {
  const [animPct, setAnimPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(progress), 80);
    return () => clearTimeout(t);
  }, [progress]);

  const pct = Math.min(100, Math.max(0, animPct));
  const liquidHeight = shape.liquidBottom - shape.liquidTop;
  const fillH = (pct / 100) * liquidHeight;
  const fillY = shape.liquidBottom - fillH;

  const bord = isDark ? "#6a6a9a" : "#1a1a2e";
  const glassMid = isDark ? "#1e1e3a" : "#eef4fb";
  const cid = `${color.replace("#", "")}-${shape.id}`;

  return (
    <svg
      viewBox="0 0 80 120"
      width={size}
      height={size * 1.5}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id={`jc-${cid}`}>
          <path d={shape.liquidClip} />
        </clipPath>
        <linearGradient
          id={`glass-${cid}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor={bord}
            stopOpacity="0.18"
          />
          <stop
            offset="12%"
            stopColor="white"
            stopOpacity="0.38"
          />
          <stop
            offset="35%"
            stopColor="white"
            stopOpacity="0"
          />
          <stop
            offset="65%"
            stopColor="white"
            stopOpacity="0"
          />
          <stop
            offset="88%"
            stopColor="white"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor={bord}
            stopOpacity="0.22"
          />
        </linearGradient>
        <radialGradient
          id={`dome-${cid}`}
          cx="34%"
          cy="25%"
          r="65%"
        >
          <stop
            offset="0%"
            stopColor="rgba(255,255,255,0.65)"
          />
          <stop
            offset="45%"
            stopColor="rgba(255,255,255,0.05)"
          />
          <stop
            offset="100%"
            stopColor="rgba(0,0,0,0.18)"
          />
        </radialGradient>
        <linearGradient
          id={`band-${cid}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stopColor="rgba(0,0,0,0.28)"
          />
          <stop
            offset="14%"
            stopColor="rgba(255,255,255,0.25)"
          />
          <stop
            offset="50%"
            stopColor="rgba(0,0,0,0.02)"
          />
          <stop
            offset="84%"
            stopColor="rgba(255,255,255,0.18)"
          />
          <stop
            offset="100%"
            stopColor="rgba(0,0,0,0.22)"
          />
        </linearGradient>
        <filter
          id={`drop-${cid}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            floodColor="rgba(0,0,0,0.22)"
          />
        </filter>
        <style>{`
          @keyframes wv1-${cid}{from{transform:translateX(0)}to{transform:translateX(-80px)}}
          @keyframes wv2-${cid}{from{transform:translateX(-80px)}to{transform:translateX(0)}}
          @keyframes bub-${cid}{0%{transform:translateY(0);opacity:.5}85%{transform:translateY(-${Math.max(fillH - 3, 2)}px);opacity:.15}100%{transform:translateY(-${Math.max(fillH - 3, 2)}px);opacity:0}}
        `}</style>
      </defs>

      {/* Glass base */}
      <path
        d={shape.jarPath}
        fill={glassMid}
        stroke="none"
      />

      {/* Liquid */}
      {pct > 0 && (
        <g clipPath={`url(#jc-${cid})`}>
          <rect
            x="0"
            y={fillY + shape.fillOffset}
            width="80"
            height={shape.fillBottom}
            fill={color}
          />
          {pct < 99 &&
            (() => {
              const wy = fillY;
              const w1 = `M 0 ${wy} C 10 ${wy - 3} 30 ${wy - 3} 40 ${wy} C 50 ${wy + 3} 70 ${wy + 3} 80 ${wy} C 90 ${wy - 3} 110 ${wy - 3} 120 ${wy} C 130 ${wy + 3} 150 ${wy + 3} 160 ${wy} L 160 ${wy + 14} L 0 ${wy + 14} Z`;
              const w2 = `M 0 ${wy + 1.5} C 10 ${wy - 1.5} 30 ${wy - 1.5} 40 ${wy + 1.5} C 50 ${wy + 4.5} 70 ${wy + 4.5} 80 ${wy + 1.5} C 90 ${wy - 1.5} 110 ${wy - 1.5} 120 ${wy + 1.5} C 130 ${wy + 4.5} 150 ${wy + 4.5} 160 ${wy + 1.5} L 160 ${wy + 14} L 0 ${wy + 14} Z`;
              return (
                <>
                  <path
                    d={w1}
                    fill={color}
                    style={{ animation: `wv1-${cid} 3s linear infinite` }}
                  />
                  <path
                    d={w2}
                    fill={color}
                    opacity="0.5"
                    style={{ animation: `wv2-${cid} 4.5s linear infinite` }}
                  />
                </>
              );
            })()}
          {pct > 10 && pct < 90 && (
            <>
              <circle
                cx="22"
                cy={shape.liquidBottom - 4}
                r="1.2"
                fill="white"
                opacity="0.4"
                style={{
                  animationName: `bub-${cid}`,
                  animationDuration: "2.4s",
                  animationTimingFunction: "ease-in",
                  animationIterationCount: "infinite",
                  animationDelay: "0.2s",
                }}
              />
              <circle
                cx="45"
                cy={shape.liquidBottom - 4}
                r="0.9"
                fill="white"
                opacity="0.3"
                style={{
                  animationName: `bub-${cid}`,
                  animationDuration: "3.1s",
                  animationTimingFunction: "ease-in",
                  animationIterationCount: "infinite",
                  animationDelay: "1.1s",
                }}
              />
              <circle
                cx="60"
                cy={shape.liquidBottom - 4}
                r="1.4"
                fill="white"
                opacity="0.25"
                style={{
                  animationName: `bub-${cid}`,
                  animationDuration: "2s",
                  animationTimingFunction: "ease-in",
                  animationIterationCount: "infinite",
                  animationDelay: "0.8s",
                }}
              />
            </>
          )}
        </g>
      )}

      {/* Sheen + outline */}
      <path
        d={shape.jarPath}
        fill={`url(#glass-${cid})`}
        stroke="none"
      />
      <path
        d={shape.jarPath}
        fill="none"
        stroke={bord}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Band */}
      <rect
        x={shape.band.x}
        y={shape.band.y}
        width={shape.band.w}
        height={shape.band.h}
        rx={shape.band.rx}
        fill={color}
        stroke={bord}
        strokeWidth="1.6"
      />
      <rect
        x={shape.band.x}
        y={shape.band.y}
        width={shape.band.w}
        height={shape.band.h}
        rx={shape.band.rx}
        fill={`url(#band-${cid})`}
        opacity="0.65"
      />
      <line
        x1={shape.band.x + 1}
        y1={shape.band.y + 0.7}
        x2={shape.band.x + shape.band.w - 1}
        y2={shape.band.y + 0.7}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* Lid */}
      <rect
        x={shape.lid.x}
        y={shape.lid.y}
        width={shape.lid.w}
        height={shape.lid.h}
        rx={shape.lid.rx}
        fill={color}
        stroke={bord}
        strokeWidth="1.8"
        filter={`url(#drop-${cid})`}
      />
      <rect
        x={shape.lid.x}
        y={shape.lid.y}
        width={shape.lid.w}
        height={shape.lid.h}
        rx={shape.lid.rx}
        fill={`url(#dome-${cid})`}
      />
      <ellipse
        cx={shape.lid.x + shape.lid.w * 0.35}
        cy={shape.lid.y + 1.5}
        rx={shape.lid.w * 0.38}
        ry="1.2"
        fill="white"
        opacity="0.5"
      />

      {/* % pill */}
      <rect
        x="20"
        y="76"
        width="40"
        height="13"
        rx="6.5"
        fill="rgba(0,0,0,0.3)"
      />
      <text
        x="40"
        y="82.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="7"
        fontFamily="'Fredoka One',cursive"
        fill="white"
      >
        {pct.toFixed(0)}%
      </text>
      {pct >= 100 && (
        <text
          x="68"
          y="38"
          fontSize="10"
          textAnchor="middle"
        >
          🎉
        </text>
      )}
    </svg>
  );
}

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
const ShapesIcon = (p) => (
  <Icon {...p}>
    <path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z" />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
    />
    <circle
      cx="17.5"
      cy="17.5"
      r="3.5"
    />
  </Icon>
);
const ChevronLeftIcon = (p) => (
  <Icon {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Icon>
);
const ChevronRightIcon = (p) => (
  <Icon {...p}>
    <path d="M9 18l6-6-6-6" />
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

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepDots({ step, total, primary, border, shadowCol }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".35rem",
        justifyContent: "center",
        margin: ".75rem 0 .25rem",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === step ? 22 : 8,
            height: 8,
            borderRadius: 99,
            background:
              i === step ? primary : i < step ? primary + "66" : border + "33",
            border: `1.5px solid ${i <= step ? primary : border + "44"}`,
            transition: "all .25s ease",
            boxShadow: i === step ? `1px 1px 0 ${shadowCol}` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function JarModal({
  open,
  onClose,
  theme,
  currency: currencyProp,
}) {
  // ── Form state
  const [step, setStep] = useState(0); // 0 = details, 1 = shape picker
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState("#ffd000");
  const [jarShape, setJarShape] = useState("classic");
  const [emailInput, setEmailInput] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sharedUsers, setSharedUsers] = useState([]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setName("");
      setGoal("");
      setDeadline("");
      setColor("#ffd000");
      setJarShape("classic");
      setSharedUsers([]);
      setEmailInput("");
      setErrors({});
      setEmailError("");
    }
  }, [open]);

  if (!open) return null;

  const currency = currencyProp || "₹";
  const currentUserEmail = auth.currentUser?.email || "";

  // ── Theme
  const primary = theme?.primary || "#ff6b2b";
  const surface = theme?.surface || "#ffffff";
  const bg = theme?.bg || "#fff9f0";
  const accent = theme?.accent || "#ffd000";
  const isDark = theme?.id === "dark";
  const textColor = isDark ? "#e8e8ff" : "#1a1a2e";
  const mutedColor = isDark ? "#8888aa" : "#8a8a9a";
  const inputBg = isDark ? "#252540" : "#fafafa";
  const border = isDark ? "#4a4a6a" : "#1a1a2e";
  const shadowCol = isDark ? "#000000" : "#1a1a2e";

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
    boxShadow: hasError ? "2px 2px 0 #ff4d8d" : `2px 2px 0 ${shadowCol}`,
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

  // ── Validation
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Jar name is required";
    if (!goal || isNaN(Number(goal)) || Number(goal) <= 0)
      e.goal = "Enter a valid goal amount";
    return e;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(1);
  };

  // ── Email
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
      if (sharedUsers.find((u) => u.uid === uid)) {
        setEmailError("This user is already added");
        return;
      }
      setSharedUsers((prev) => [...prev, { email, uid }]);
      setEmailInput("");
    } catch {
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

  // ── Submit
  const handleCreate = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "jars"), {
        name: name.trim(),
        goal: Number(goal),
        deadline: deadline || null,
        color,
        jarShape, // ← saved to Firestore
        createdBy: user.uid,
        createdByEmail: user.email,
        sharedWith: sharedUsers.map((u) => u.uid),
        sharedWithEmails: sharedUsers.map((u) => u.email),
        createdAt: serverTimestamp(),
        pinned: false,
        archived: false,
        savedAmount: 0,
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to create jar. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedShapeObj =
    JAR_SHAPES.find((s) => s.id === jarShape) || JAR_SHAPES[0];

  // ── Step 0: Details form ───────────────────────────────────────────────────
  const renderDetails = () => (
    <div style={{ padding: "1.25rem" }}>
      {/* Jar Name */}
      <div style={fieldStyle}>
        <label style={labelStyle}>
          <JarIcon
            size={13}
            color={mutedColor}
          />{" "}
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
          />{" "}
          Savings Goal ({currency}) <span style={{ color: primary }}>*</span>
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
          />{" "}
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
              boxShadow: `2px 2px 0 ${shadowCol}`,
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
                !JAR_COLORS.find((c) => c.hex === color) ? "#fff" : mutedColor
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
          {JAR_COLORS.find((c) => c.hex === color)?.label || "Custom"} — {color}
        </div>
      </div>

      {/* Share with */}
      <div style={fieldStyle}>
        <label style={labelStyle}>
          <MailIcon
            size={13}
            color={mutedColor}
          />{" "}
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
              boxShadow: `2px 2px 0 ${shadowCol}`,
              display: "flex",
              alignItems: "center",
              gap: ".3rem",
              whiteSpace: "nowrap",
              transition: "transform .12s, box-shadow .12s",
            }}
            onMouseEnter={(e) => {
              if (!emailChecking) {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowCol}`;
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
          background: isDark ? "#16162a" : bg,
          border: `2px dashed ${isDark ? "#4a4a6a" : "#c0c0d0"}`,
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
          <span style={{ color: textColor }}>{currentUserEmail || "—"}</span>
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
          onClick={handleNext}
          style={{
            flex: 1,
            background: primary,
            border: `2.5px solid ${border}`,
            borderRadius: "12px",
            color: "#fff",
            fontFamily: "'Fredoka One',cursive",
            fontSize: "1rem",
            padding: ".75rem",
            cursor: "pointer",
            boxShadow: `4px 4px 0 ${shadowCol}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".4rem",
            transition: "transform .12s, box-shadow .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px,-2px)";
            e.currentTarget.style.boxShadow = `6px 6px 0 ${shadowCol}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
          }}
        >
          <ShapesIcon
            size={16}
            color="#fff"
            strokeWidth={2.5}
          />{" "}
          Pick Jar Shape
          <ChevronRightIcon
            size={14}
            color="#fff"
            strokeWidth={2.5}
          />
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
            boxShadow: `4px 4px 0 ${shadowCol}`,
            transition: "transform .12s, box-shadow .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px,-2px)";
            e.currentTarget.style.boxShadow = `6px 6px 0 ${shadowCol}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // ── Step 1: Shape picker ────────────────────────────────────────────────────
  const renderShapePicker = () => (
    <div style={{ padding: "1.25rem" }}>
      <p
        style={{
          fontSize: ".75rem",
          color: mutedColor,
          fontWeight: 700,
          textAlign: "center",
          marginBottom: "1.1rem",
          letterSpacing: ".04em",
        }}
      >
        Choose how your jar looks on the dashboard
      </p>

      {/* Shape grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: ".6rem",
          marginBottom: "1.25rem",
        }}
      >
        {JAR_SHAPES.map((shape) => {
          const isSelected = jarShape === shape.id;
          return (
            <button
              key={shape.id}
              onClick={() => setJarShape(shape.id)}
              style={{
                background: isSelected
                  ? color + "18"
                  : isDark
                    ? "#16162a"
                    : "#fafafa",
                border: `2.5px solid ${isSelected ? color : border}`,
                borderRadius: "14px",
                padding: ".6rem .4rem .5rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: ".35rem",
                boxShadow: isSelected
                  ? `4px 4px 0 ${color}`
                  : `2px 2px 0 ${shadowCol}`,
                transform: isSelected ? "translate(-2px,-2px)" : "none",
                transition: "all .15s ease",
                position: "relative",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = "translate(-1px,-1px)";
                  e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowCol}`;
                }
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: color,
                    border: `1.5px solid ${border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    color: "#fff",
                    boxShadow: `1px 1px 0 ${shadowCol}`,
                  }}
                >
                  ✓
                </div>
              )}
              <JarShapeSVG
                shape={shape}
                progress={60}
                color={color}
                isDark={isDark}
                size={52}
              />
              <span
                style={{
                  fontSize: ".58rem",
                  fontWeight: 700,
                  textAlign: "center",
                  lineHeight: 1.2,
                  color: isSelected ? color : mutedColor,
                  fontFamily: "'Fredoka One',cursive",
                }}
              >
                {shape.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected preview strip */}
      <div
        style={{
          background: isDark ? "#16162a" : bg,
          border: `2px dashed ${isDark ? "#4a4a6a" : "#c0c0d0"}`,
          borderRadius: "12px",
          padding: ".85rem 1rem",
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <JarShapeSVG
          shape={selectedShapeObj}
          progress={65}
          color={color}
          isDark={isDark}
          size={56}
        />
        <div>
          <p
            style={{
              fontSize: ".62rem",
              color: mutedColor,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              margin: "0 0 .2rem",
            }}
          >
            Your jar will look like this
          </p>
          <p
            style={{
              fontSize: ".95rem",
              color: textColor,
              margin: "0 0 .15rem",
              fontFamily: "'Fredoka One',cursive",
            }}
          >
            {selectedShapeObj.label}
          </p>
          <p
            style={{
              fontSize: ".7rem",
              color: mutedColor,
              fontWeight: 600,
              margin: 0,
            }}
          >
            "{name || "My Jar"}" · {currency}
            {goal ? Number(goal).toLocaleString() : "—"} goal
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: ".75rem" }}>
        <button
          onClick={() => setStep(0)}
          style={{
            background: "transparent",
            border: `2.5px solid ${border}`,
            borderRadius: "12px",
            color: textColor,
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".9rem",
            padding: ".75rem 1rem",
            cursor: "pointer",
            boxShadow: `3px 3px 0 ${shadowCol}`,
            display: "flex",
            alignItems: "center",
            gap: ".35rem",
            transition: "transform .12s, box-shadow .12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-1px,-1px)";
            e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
          }}
        >
          <ChevronLeftIcon
            size={14}
            color={textColor}
            strokeWidth={2.5}
          />{" "}
          Back
        </button>
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
            boxShadow: `4px 4px 0 ${shadowCol}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".4rem",
            transition: "transform .12s, box-shadow .12s",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = "translate(-2px,-2px)";
              e.currentTarget.style.boxShadow = `6px 6px 0 ${shadowCol}`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `4px 4px 0 ${shadowCol}`;
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
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
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
          padding: ".75rem",
        }}
      >
        {/* Card */}
        <div
          style={{
            background: surface,
            border: `3px solid ${border}`,
            borderRadius: "18px",
            boxShadow: `6px 6px 0 ${shadowCol}`,
            width: "100%",
            maxWidth: "500px",
            maxHeight: "92vh",
            overflowY: "auto",
            overflowX: "hidden",
            animation: "modalIn .25s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem .85rem",
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
                  boxShadow: `2px 2px 0 ${shadowCol}`,
                }}
              >
                <JarIcon
                  size={18}
                  color={border}
                  strokeWidth={2.5}
                />
              </span>
              <div>
                <span
                  style={{
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: "1.2rem",
                    color: textColor,
                  }}
                >
                  {step === 0 ? "New Jar" : "Pick a Shape"}
                </span>
                <div
                  style={{
                    fontSize: ".65rem",
                    color: mutedColor,
                    fontWeight: 700,
                    marginTop: ".05rem",
                  }}
                >
                  Step {step + 1} of 2
                </div>
              </div>
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
                boxShadow: `2px 2px 0 ${shadowCol}`,
                transition: "transform .12s, box-shadow .12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = `3px 3px 0 ${shadowCol}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = `2px 2px 0 ${shadowCol}`;
              }}
            >
              <XIcon
                size={15}
                color={textColor}
                strokeWidth={2.5}
              />
            </button>
          </div>

          {/* Step dots */}
          <StepDots
            step={step}
            total={2}
            primary={primary}
            border={border}
            shadowCol={shadowCol}
          />

          {/* Step content */}
          <div
            key={step}
            style={{
              animation:
                step === 1
                  ? "slideLeft .22s ease both"
                  : "slideRight .22s ease both",
            }}
          >
            {step === 0 ? renderDetails() : renderShapePicker()}
          </div>
        </div>
      </div>
    </>
  );
}
