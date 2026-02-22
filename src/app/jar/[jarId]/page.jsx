// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useUser } from "@/context/UserContext";
// import { buildCss, getTheme } from "@/lib/themes";
// import { db } from "@/lib/firebase";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   addDoc,
//   serverTimestamp,
//   increment,
//   deleteDoc,
// } from "firebase/firestore";
// import { getCurrency, CURRENCY_SYMBOLS } from "@/app/dashboard/page";

// // ─── Icons ────────────────────────────────────────────────────────────────────
// const Icon = ({
//   children,
//   size = 24,
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
// const BackIcon = (p) => (
//   <Icon {...p}>
//     <path d="M19 12H5M12 19l-7-7 7-7" />
//   </Icon>
// );
// const ArrowUpIcon = (p) => (
//   <Icon {...p}>
//     <path d="M12 19V5M5 12l7-7 7 7" />
//   </Icon>
// );
// const ArrowDownIcon = (p) => (
//   <Icon {...p}>
//     <path d="M12 5v14M19 12l-7 7-7-7" />
//   </Icon>
// );
// const TrashIcon = (p) => (
//   <Icon {...p}>
//     <polyline points="3 6 5 6 21 6" />
//     <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
//     <path d="M10 11v6M14 11v6" />
//     <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
//   </Icon>
// );
// const XIcon = (p) => (
//   <Icon {...p}>
//     <path d="M18 6L6 18M6 6l12 12" />
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
// const TrendIcon = (p) => (
//   <Icon {...p}>
//     <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
//     <polyline points="16 7 22 7 22 13" />
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
// const UsersIcon = (p) => (
//   <Icon {...p}>
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//     <circle
//       cx="9"
//       cy="7"
//       r="4"
//     />
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
//   </Icon>
// );
// const ArchiveIcon = (p) => (
//   <Icon {...p}>
//     <rect
//       width="20"
//       height="5"
//       x="2"
//       y="3"
//       rx="1"
//     />
//     <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
//     <path d="M10 12h4" />
//   </Icon>
// );
// const InfoIcon = (p) => (
//   <Icon {...p}>
//     <circle
//       cx="12"
//       cy="12"
//       r="10"
//     />
//     <path d="M12 16v-4M12 8h.01" />
//   </Icon>
// );

// // ─── Tiny line chart ──────────────────────────────────────────────────────────
// function SavingsChart({ transactions, color, currency }) {
//   const data = useMemo(() => {
//     if (!transactions.length) return [];
//     // Build cumulative balance over time grouped by month
//     const sorted = [...transactions].sort(
//       (a, b) => a.createdAt?.toMillis?.() - b.createdAt?.toMillis?.(),
//     );
//     const monthly = {};
//     let running = 0;
//     sorted.forEach((tx) => {
//       const d = tx.createdAt?.toDate?.() || new Date();
//       const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
//       running += tx.type === "deposit" ? tx.amount : -tx.amount;
//       monthly[key] = running;
//     });
//     return Object.entries(monthly).map(([k, v]) => ({
//       label: k,
//       value: Math.max(0, v),
//     }));
//   }, [transactions]);

//   if (data.length < 2)
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: 180,
//           color: "#8a8a9a",
//           fontFamily: "'Fredoka One',cursive",
//           fontSize: ".88rem",
//           flexDirection: "column",
//           gap: ".5rem",
//         }}
//       >
//         <InfoIcon
//           size={28}
//           color="#8a8a9a"
//           strokeWidth={1.5}
//         />
//         Not enough data for chart yet
//       </div>
//     );

//   const W = 600,
//     H = 180,
//     PAD = { top: 16, right: 16, bottom: 32, left: 56 };
//   const innerW = W - PAD.left - PAD.right;
//   const innerH = H - PAD.top - PAD.bottom;
//   const maxVal = Math.max(...data.map((d) => d.value), 1);

//   const xs = data.map((_, i) => PAD.left + (i / (data.length - 1)) * innerW);
//   const ys = data.map((d) => PAD.top + innerH - (d.value / maxVal) * innerH);

//   const pathD = data
//     .map(
//       (_, i) => `${i === 0 ? "M" : "L"}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`,
//     )
//     .join(" ");
//   const areaD =
//     pathD +
//     ` L${xs[xs.length - 1].toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

//   // Y axis ticks
//   const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
//     val: maxVal * t,
//     y: PAD.top + innerH - t * innerH,
//   }));

//   return (
//     <svg
//       viewBox={`0 0 ${W} ${H}`}
//       style={{ width: "100%", height: "auto", overflow: "visible" }}
//     >
//       <defs>
//         <linearGradient
//           id="areaGrad"
//           x1="0"
//           y1="0"
//           x2="0"
//           y2="1"
//         >
//           <stop
//             offset="0%"
//             stopColor={color}
//             stopOpacity="0.3"
//           />
//           <stop
//             offset="100%"
//             stopColor={color}
//             stopOpacity="0.02"
//           />
//         </linearGradient>
//       </defs>
//       {/* Grid lines */}
//       {ticks.map((t, i) => (
//         <g key={i}>
//           <line
//             x1={PAD.left}
//             y1={t.y}
//             x2={PAD.left + innerW}
//             y2={t.y}
//             stroke="#1a1a2e"
//             strokeWidth={0.5}
//             strokeDasharray="4 4"
//             opacity={0.2}
//           />
//           <text
//             x={PAD.left - 8}
//             y={t.y + 4}
//             textAnchor="end"
//             fill="#8a8a9a"
//             fontSize={10}
//             fontFamily="'Fredoka One',cursive"
//           >
//             {t.val >= 1000 ? `${(t.val / 1000).toFixed(1)}k` : t.val.toFixed(0)}
//           </text>
//         </g>
//       ))}
//       {/* Area */}
//       <path
//         d={areaD}
//         fill="url(#areaGrad)"
//       />
//       {/* Line */}
//       <path
//         d={pathD}
//         fill="none"
//         stroke={color}
//         strokeWidth={2.5}
//         strokeLinejoin="round"
//         strokeLinecap="round"
//       />
//       {/* Dots + labels */}
//       {data.map((d, i) => (
//         <g key={i}>
//           <circle
//             cx={xs[i]}
//             cy={ys[i]}
//             r={4}
//             fill={color}
//             stroke="#fff"
//             strokeWidth={2}
//           />
//           {(i === 0 || i === data.length - 1 || data.length <= 6) && (
//             <text
//               x={xs[i]}
//               y={H - 8}
//               textAnchor="middle"
//               fill="#8a8a9a"
//               fontSize={9}
//               fontFamily="'Fredoka One',cursive"
//             >
//               {d.label.slice(5)}/{d.label.slice(2, 4)}
//             </text>
//           )}
//         </g>
//       ))}
//     </svg>
//   );
// }

// // ─── Transaction row ──────────────────────────────────────────────────────────
// function TxRow({ tx, currency, onDelete, isOwner }) {
//   const isDeposit = tx.type === "deposit";
//   const date = tx.createdAt?.toDate?.();
//   const dateStr = date
//     ? date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";
//   const timeStr = date
//     ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
//     : "";
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: ".85rem",
//         padding: ".85rem 1rem",
//         borderBottom: "2px solid #1a1a2e22",
//         transition: "background .12s",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2e06")}
//       onMouseLeave={(e) => (e.currentTarget.style.background = "")}
//     >
//       {/* Icon */}
//       <div
//         style={{
//           width: 36,
//           height: 36,
//           borderRadius: "10px",
//           background: isDeposit ? "#22c55e22" : "#ff4d8d22",
//           border: `2px solid ${isDeposit ? "#22c55e" : "#ff4d8d"}`,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           flexShrink: 0,
//         }}
//       >
//         {isDeposit ? (
//           <ArrowUpIcon
//             size={16}
//             color="#22c55e"
//             strokeWidth={2.5}
//           />
//         ) : (
//           <ArrowDownIcon
//             size={16}
//             color="#ff4d8d"
//             strokeWidth={2.5}
//           />
//         )}
//       </div>
//       {/* Info */}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p
//           style={{
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: ".88rem",
//             color: "#1a1a2e",
//             margin: 0,
//             textOverflow: "ellipsis",
//             overflow: "hidden",
//             whiteSpace: "nowrap",
//           }}
//         >
//           {tx.note || (isDeposit ? "Deposit" : "Withdrawal")}
//         </p>
//         <p
//           style={{
//             fontSize: ".66rem",
//             color: "#8a8a9a",
//             fontWeight: 600,
//             margin: ".1rem 0 0",
//             display: "flex",
//             alignItems: "center",
//             gap: ".3rem",
//           }}
//         >
//           <CalendarIcon
//             size={9}
//             color="#8a8a9a"
//           />{" "}
//           {dateStr}
//           {timeStr && (
//             <>
//               <ClockIcon
//                 size={9}
//                 color="#8a8a9a"
//               />{" "}
//               {timeStr}
//             </>
//           )}
//           {tx.createdByEmail && (
//             <>
//               <UsersIcon
//                 size={9}
//                 color="#8a8a9a"
//               />{" "}
//               {tx.createdByEmail.split("@")[0]}
//             </>
//           )}
//         </p>
//       </div>
//       {/* Amount */}
//       <div style={{ textAlign: "right", flexShrink: 0 }}>
//         <p
//           style={{
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: "1rem",
//             color: isDeposit ? "#22c55e" : "#ff4d8d",
//             margin: 0,
//           }}
//         >
//           {isDeposit ? "+" : "−"}
//           {currency}
//           {tx.amount.toLocaleString()}
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─── Analytics card ───────────────────────────────────────────────────────────
// function AnalyticCard({ label, value, sub, color, icon }) {
//   return (
//     <div
//       style={{
//         background: "#fff",
//         border: "2.5px solid #1a1a2e",
//         borderRadius: "14px",
//         padding: "1rem",
//         boxShadow: "3px 3px 0 #1a1a2e",
//         display: "flex",
//         flexDirection: "column",
//         gap: ".4rem",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//         <span
//           style={{
//             background: color + "22",
//             border: `2px solid ${color}`,
//             borderRadius: "8px",
//             width: 28,
//             height: 28,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {icon}
//         </span>
//         <span
//           style={{
//             fontSize: ".65rem",
//             fontWeight: 700,
//             color: "#8a8a9a",
//             textTransform: "uppercase",
//             letterSpacing: ".06em",
//           }}
//         >
//           {label}
//         </span>
//       </div>
//       <p
//         style={{
//           fontFamily: "'Fredoka One',cursive",
//           fontSize: "1.25rem",
//           color,
//           margin: 0,
//         }}
//       >
//         {value}
//       </p>
//       {sub && (
//         <p
//           style={{
//             fontSize: ".66rem",
//             color: "#8a8a9a",
//             fontWeight: 600,
//             margin: 0,
//           }}
//         >
//           {sub}
//         </p>
//       )}
//     </div>
//   );
// }

// // ─── Quick Action Modal ───────────────────────────────────────────────────────
// function QuickActionModal({ jar, action, currency, user, onClose, theme }) {
//   const [amount, setAmount] = useState("");
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const isAdd = action === "add";
//   const accentColor = isAdd ? "#22c55e" : "#ff4d8d";

//   const handleSubmit = async () => {
//     const val = parseFloat(amount);
//     if (!val || val <= 0) {
//       setError("Enter a valid amount");
//       return;
//     }
//     if (!isAdd && val > (jar.savedAmount || 0)) {
//       setError("Can't withdraw more than saved");
//       return;
//     }
//     setLoading(true);
//     try {
//       await addDoc(collection(db, "jars", jar.id, "transactions"), {
//         type: isAdd ? "deposit" : "withdrawal",
//         amount: val,
//         note: note.trim() || (isAdd ? "Deposit" : "Withdrawal"),
//         createdAt: serverTimestamp(),
//         createdBy: user.uid,
//         createdByEmail: user.email,
//       });
//       await updateDoc(doc(db, "jars", jar.id), {
//         savedAmount: increment(isAdd ? val : -val),
//       });
//       onClose();
//     } catch {
//       setError("Something went wrong.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(26,26,46,0.55)",
//         backdropFilter: "blur(4px)",
//         zIndex: 200,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "1rem",
//       }}
//     >
//       <div
//         style={{
//           background: theme?.surface || "#fff",
//           border: "3px solid #1a1a2e",
//           borderRadius: "20px",
//           boxShadow: "8px 8px 0 #1a1a2e",
//           padding: "2rem",
//           width: "100%",
//           maxWidth: 380,
//           position: "relative",
//         }}
//       >
//         <button
//           onClick={onClose}
//           style={{
//             position: "absolute",
//             top: 12,
//             right: 12,
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           <XIcon
//             size={20}
//             color="#1a1a2e"
//           />
//         </button>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: ".75rem",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <span
//             style={{
//               background: accentColor + "22",
//               border: `2px solid ${accentColor}`,
//               borderRadius: "10px",
//               width: 38,
//               height: 38,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             {isAdd ? (
//               <ArrowUpIcon
//                 size={18}
//                 color={accentColor}
//                 strokeWidth={2.5}
//               />
//             ) : (
//               <ArrowDownIcon
//                 size={18}
//                 color={accentColor}
//                 strokeWidth={2.5}
//               />
//             )}
//           </span>
//           <div>
//             <p
//               style={{
//                 fontFamily: "'Fredoka One',cursive",
//                 fontSize: "1.2rem",
//                 color: "#1a1a2e",
//                 margin: 0,
//               }}
//             >
//               {isAdd ? "Add Money" : "Withdraw"}
//             </p>
//             <p
//               style={{
//                 fontSize: ".72rem",
//                 color: "#8a8a9a",
//                 fontWeight: 600,
//                 margin: 0,
//               }}
//             >
//               {jar.name}
//             </p>
//           </div>
//         </div>
//         <div
//           style={{
//             background: accentColor + "11",
//             border: `2px solid ${accentColor}33`,
//             borderRadius: "10px",
//             padding: ".75rem 1rem",
//             marginBottom: "1.25rem",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <span
//             style={{
//               fontSize: ".72rem",
//               fontWeight: 700,
//               color: "#8a8a9a",
//               textTransform: "uppercase",
//             }}
//           >
//             Current Balance
//           </span>
//           <span
//             style={{ fontFamily: "'Fredoka One',cursive", color: accentColor }}
//           >
//             {currency}
//             {(jar.savedAmount || 0).toLocaleString()}
//           </span>
//         </div>
//         <label
//           style={{
//             display: "block",
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: ".8rem",
//             color: "#1a1a2e",
//             marginBottom: ".4rem",
//           }}
//         >
//           Amount
//         </label>
//         <div style={{ position: "relative", marginBottom: "1rem" }}>
//           <span
//             style={{
//               position: "absolute",
//               left: 12,
//               top: "50%",
//               transform: "translateY(-50%)",
//               fontFamily: "'Fredoka One',cursive",
//               fontSize: "1rem",
//               color: "#1a1a2e",
//             }}
//           >
//             {currency}
//           </span>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => {
//               setAmount(e.target.value);
//               setError("");
//             }}
//             placeholder="0.00"
//             style={{
//               width: "100%",
//               paddingLeft: "2rem",
//               paddingRight: "1rem",
//               paddingTop: ".65rem",
//               paddingBottom: ".65rem",
//               border: `2.5px solid ${error ? "#ff4d8d" : "#1a1a2e"}`,
//               borderRadius: "10px",
//               fontFamily: "'Fredoka One',cursive",
//               fontSize: "1.1rem",
//               color: "#1a1a2e",
//               outline: "none",
//               boxSizing: "border-box",
//               background: "#fff",
//             }}
//           />
//         </div>
//         <label
//           style={{
//             display: "block",
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: ".8rem",
//             color: "#1a1a2e",
//             marginBottom: ".4rem",
//           }}
//         >
//           Note{" "}
//           <span style={{ color: "#8a8a9a", fontSize: ".7rem" }}>
//             (optional)
//           </span>
//         </label>
//         <input
//           type="text"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           placeholder={isAdd ? "e.g. Monthly savings" : "e.g. Emergency use"}
//           style={{
//             width: "100%",
//             padding: ".65rem 1rem",
//             border: "2.5px solid #1a1a2e",
//             borderRadius: "10px",
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: ".88rem",
//             color: "#1a1a2e",
//             outline: "none",
//             boxSizing: "border-box",
//             background: "#fff",
//             marginBottom: ".5rem",
//           }}
//         />
//         {error && (
//           <p
//             style={{
//               fontSize: ".72rem",
//               color: "#ff4d8d",
//               fontWeight: 700,
//               marginBottom: ".75rem",
//             }}
//           >
//             {error}
//           </p>
//         )}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           style={{
//             width: "100%",
//             background: accentColor,
//             border: "2.5px solid #1a1a2e",
//             borderRadius: "12px",
//             color: "#fff",
//             fontFamily: "'Fredoka One',cursive",
//             fontSize: "1rem",
//             padding: ".85rem",
//             cursor: loading ? "not-allowed" : "pointer",
//             boxShadow: "4px 4px 0 #1a1a2e",
//             marginTop: ".5rem",
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           {loading
//             ? "Processing..."
//             : isAdd
//               ? `Add ${currency}${amount || "0"}`
//               : `Withdraw ${currency}${amount || "0"}`}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Main detail page ─────────────────────────────────────────────────────────
// export default function JarDetailPage() {
//   const { user, userData, loading: authLoading } = useUser();
//   const router = useRouter();
//   const params = useParams();
//   const jarId = params?.jarId;

//   const [jar, setJar] = useState(null);
//   const [jarLoading, setJarLoading] = useState(true);
//   const [transactions, setTransactions] = useState([]);
//   const [txLoading, setTxLoading] = useState(true);
//   const [quickAction, setQuickAction] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(false);
//   const [txFilter, setTxFilter] = useState("all"); // "all" | "deposit" | "withdrawal"

//   useEffect(() => {
//     if (!authLoading && !user) router.push("/login");
//   }, [user, authLoading]);

//   // Live jar listener
//   useEffect(() => {
//     if (!jarId || !user) return;
//     const unsub = onSnapshot(doc(db, "jars", jarId), (snap) => {
//       if (!snap.exists()) {
//         router.push("/dashboard");
//         return;
//       }
//       setJar({ id: snap.id, ...snap.data() });
//       setJarLoading(false);
//     });
//     return () => unsub();
//   }, [jarId, user]);

//   // Live transactions listener
//   useEffect(() => {
//     if (!jarId || !user) return;
//     const q = query(
//       collection(db, "jars", jarId, "transactions"),
//       orderBy("createdAt", "desc"),
//     );
//     const unsub = onSnapshot(q, (snap) => {
//       setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setTxLoading(false);
//     });
//     return () => unsub();
//   }, [jarId, user]);

//   const theme = getTheme(userData?.theme || "orange");
//   const currency = getCurrency(userData);
//   const isDark = theme.id === "dark";
//   const textColor = isDark ? "#e0e0ff" : "#1a1a2e";
//   const mutedColor = isDark ? "#7a7a9a" : "#8a8a9a";

//   // ── Analytics ──
//   const analytics = useMemo(() => {
//     if (!jar || !transactions.length) return null;
//     const deposits = transactions.filter((t) => t.type === "deposit");
//     const withdrawals = transactions.filter((t) => t.type === "withdrawal");
//     const totalDeposited = deposits.reduce((s, t) => s + t.amount, 0);
//     const totalWithdrawn = withdrawals.reduce((s, t) => s + t.amount, 0);

//     // Days since first transaction
//     const sorted = [...transactions].sort(
//       (a, b) => a.createdAt?.toMillis?.() - b.createdAt?.toMillis?.(),
//     );
//     const firstDate = sorted[0]?.createdAt?.toDate?.() || new Date();
//     const daysSinceStart = Math.max(
//       1,
//       Math.ceil((new Date() - firstDate) / 86400000),
//     );
//     const netDeposited = totalDeposited - totalWithdrawn;
//     const avgPerDay = netDeposited / daysSinceStart;

//     const remaining = Math.max(0, (jar.goal || 0) - (jar.savedAmount || 0));
//     const daysToGoal = avgPerDay > 0 ? Math.ceil(remaining / avgPerDay) : null;
//     const goalDate =
//       daysToGoal !== null ? new Date(Date.now() + daysToGoal * 86400000) : null;

//     return {
//       totalDeposited,
//       totalWithdrawn,
//       avgPerDay,
//       daysToGoal,
//       goalDate,
//       daysSinceStart,
//       txCount: transactions.length,
//       depositsCount: deposits.length,
//       withdrawalsCount: withdrawals.length,
//     };
//   }, [jar, transactions]);

//   const handleDelete = async () => {
//     await deleteDoc(doc(db, "jars", jarId));
//     router.push("/dashboard");
//   };

//   const filteredTx =
//     txFilter === "all"
//       ? transactions
//       : transactions.filter((t) => t.type === txFilter);

//   if (authLoading || jarLoading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#fff9f0",
//           fontFamily: "'Fredoka One',cursive",
//           color: "#ff6b2b",
//           fontSize: "1.1rem",
//         }}
//       >
//         Loading jar...
//       </div>
//     );
//   }

//   if (!jar) return null;

//   const isOwner = jar.createdBy === user?.uid;
//   const jarColor = jar.color || theme.primary;
//   const progress =
//     jar.goal > 0 ? Math.min((jar.savedAmount / jar.goal) * 100, 100) : 0;
//   const daysLeft = jar.deadline
//     ? Math.ceil((new Date(jar.deadline) - new Date()) / 86400000)
//     : null;

//   return (
//     <>
//       <style>{`@import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");`}</style>
//       <div
//         style={{
//           minHeight: "100vh",
//           background: `radial-gradient(circle at 10% 15%, ${jarColor}18 0%, transparent 40%), radial-gradient(circle at 90% 85%, ${jarColor}08 0%, transparent 40%), ${theme.bg}`,
//           fontFamily: "'Fredoka One',cursive",
//         }}
//       >
//         {/* ── Top nav ── */}
//         <nav
//           style={{
//             background: theme.surface,
//             borderBottom: "3px solid #1a1a2e",
//             padding: ".85rem 1.5rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             boxShadow: "0 3px 0 #1a1a2e",
//             position: "sticky",
//             top: 0,
//             zIndex: 50,
//           }}
//         >
//           <button
//             onClick={() => router.back()}
//             style={{
//               background: "transparent",
//               border: "2px solid #1a1a2e",
//               borderRadius: "999px",
//               padding: ".3rem .85rem",
//               cursor: "pointer",
//               fontFamily: "'Fredoka One',cursive",
//               fontSize: ".78rem",
//               color: textColor,
//               boxShadow: "2px 2px 0 #1a1a2e",
//               display: "flex",
//               alignItems: "center",
//               gap: ".4rem",
//               transition: "transform .1s",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "translate(-1px,-1px)")
//             }
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
//           >
//             <BackIcon
//               size={14}
//               color={textColor}
//               strokeWidth={2.5}
//             />{" "}
//             Back
//           </button>
//           <div
//             style={{
//               fontFamily: "'Fredoka One',cursive",
//               fontSize: "1.1rem",
//               color: textColor,
//               display: "flex",
//               alignItems: "center",
//               gap: ".5rem",
//             }}
//           >
//             <span
//               style={{
//                 width: 12,
//                 height: 12,
//                 borderRadius: "50%",
//                 background: jarColor,
//                 border: "2px solid #1a1a2e",
//                 display: "inline-block",
//               }}
//             />
//             {jar.name}
//           </div>
//           {/* Delete (owner only) */}
//           {isOwner && (
//             <button
//               onClick={() => setDeleteConfirm(true)}
//               style={{
//                 background: "#ff4d8d11",
//                 border: "2px solid #ff4d8d66",
//                 borderRadius: "999px",
//                 padding: ".3rem .85rem",
//                 cursor: "pointer",
//                 fontFamily: "'Fredoka One',cursive",
//                 fontSize: ".78rem",
//                 color: "#ff4d8d",
//                 boxShadow: "2px 2px 0 #ff4d8d44",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: ".4rem",
//               }}
//             >
//               <TrashIcon
//                 size={14}
//                 color="#ff4d8d"
//                 strokeWidth={2.5}
//               />{" "}
//               Delete
//             </button>
//           )}
//         </nav>

//         {/* ── Body ── */}
//         <div
//           style={{
//             maxWidth: "900px",
//             margin: "0 auto",
//             padding: "2rem 1.25rem",
//           }}
//         >
//           {/* ── Hero card ── */}
//           <div
//             style={{
//               background: theme.surface,
//               border: "3px solid #1a1a2e",
//               borderRadius: "20px",
//               boxShadow: `6px 6px 0 ${jarColor}`,
//               overflow: "hidden",
//               marginBottom: "1.5rem",
//             }}
//           >
//             <div style={{ height: 8, background: jarColor }} />
//             <div style={{ padding: "1.5rem" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                   flexWrap: "wrap",
//                   gap: "1rem",
//                   marginBottom: "1.25rem",
//                 }}
//               >
//                 <div>
//                   <p
//                     style={{
//                       fontSize: ".68rem",
//                       color: mutedColor,
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: ".1em",
//                       margin: "0 0 .25rem",
//                     }}
//                   >
//                     {isOwner ? "Your jar" : `Shared by ${jar.createdByEmail}`}
//                   </p>
//                   <h1
//                     style={{
//                       fontFamily: "'Fredoka One',cursive",
//                       fontSize: "2rem",
//                       color: textColor,
//                       margin: 0,
//                     }}
//                   >
//                     {jar.name}
//                   </h1>
//                   {jar.description && (
//                     <p
//                       style={{
//                         fontSize: ".8rem",
//                         color: mutedColor,
//                         fontWeight: 600,
//                         margin: ".4rem 0 0",
//                       }}
//                     >
//                       {jar.description}
//                     </p>
//                   )}
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <p
//                     style={{
//                       fontFamily: "'Fredoka One',cursive",
//                       fontSize: "2.5rem",
//                       color: jarColor,
//                       margin: 0,
//                       lineHeight: 1,
//                     }}
//                   >
//                     {currency}
//                     {(jar.savedAmount || 0).toLocaleString()}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: ".72rem",
//                       color: mutedColor,
//                       fontWeight: 600,
//                       margin: ".3rem 0 0",
//                     }}
//                   >
//                     of {currency}
//                     {jar.goal.toLocaleString()} goal
//                   </p>
//                 </div>
//               </div>

//               {/* Progress bar */}
//               <div style={{ marginBottom: "1.25rem" }}>
//                 <div
//                   style={{
//                     height: 16,
//                     background: isDark ? "#2a2a3e" : "#f0f0f0",
//                     borderRadius: "999px",
//                     border: "2.5px solid #1a1a2e",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: "100%",
//                       background: jarColor,
//                       width: `${progress}%`,
//                       borderRadius: "999px",
//                       transition: "width .5s ease",
//                       minWidth: progress > 0 ? 12 : 0,
//                     }}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginTop: ".4rem",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: ".7rem",
//                       color: mutedColor,
//                       fontWeight: 700,
//                     }}
//                   >
//                     {progress.toFixed(1)}% complete
//                   </span>
//                   <span
//                     style={{
//                       fontSize: ".7rem",
//                       color: mutedColor,
//                       fontWeight: 700,
//                     }}
//                   >
//                     {currency}
//                     {Math.max(
//                       0,
//                       jar.goal - (jar.savedAmount || 0),
//                     ).toLocaleString()}{" "}
//                     remaining
//                   </span>
//                 </div>
//               </div>

//               {/* Add / Withdraw buttons */}
//               <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
//                 <button
//                   onClick={() => setQuickAction("add")}
//                   style={{
//                     flex: 1,
//                     minWidth: 120,
//                     background: "#22c55e",
//                     border: "2.5px solid #1a1a2e",
//                     borderRadius: "12px",
//                     color: "#fff",
//                     fontFamily: "'Fredoka One',cursive",
//                     fontSize: ".95rem",
//                     padding: ".75rem 1rem",
//                     cursor: "pointer",
//                     boxShadow: "3px 3px 0 #1a1a2e",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: ".4rem",
//                     transition: "transform .1s, box-shadow .1s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translate(-2px,-2px)";
//                     e.currentTarget.style.boxShadow = "5px 5px 0 #1a1a2e";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "";
//                     e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
//                   }}
//                 >
//                   <ArrowUpIcon
//                     size={16}
//                     color="#fff"
//                     strokeWidth={2.5}
//                   />{" "}
//                   Add Money
//                 </button>
//                 <button
//                   onClick={() => setQuickAction("withdraw")}
//                   style={{
//                     flex: 1,
//                     minWidth: 120,
//                     background: "transparent",
//                     border: "2.5px solid #ff4d8d",
//                     borderRadius: "12px",
//                     color: "#ff4d8d",
//                     fontFamily: "'Fredoka One',cursive",
//                     fontSize: ".95rem",
//                     padding: ".75rem 1rem",
//                     cursor: "pointer",
//                     boxShadow: "3px 3px 0 #1a1a2e",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: ".4rem",
//                     transition: "transform .1s, box-shadow .1s",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translate(-2px,-2px)";
//                     e.currentTarget.style.boxShadow = "5px 5px 0 #1a1a2e";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "";
//                     e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
//                   }}
//                 >
//                   <ArrowDownIcon
//                     size={16}
//                     color="#ff4d8d"
//                     strokeWidth={2.5}
//                   />{" "}
//                   Withdraw
//                 </button>
//                 {/* Meta */}
//                 {daysLeft !== null && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: ".4rem",
//                       fontSize: ".75rem",
//                       color: daysLeft < 7 ? "#ff4d8d" : mutedColor,
//                       fontWeight: 700,
//                       padding: ".75rem .75rem",
//                       background: daysLeft < 7 ? "#ff4d8d11" : "#1a1a2e08",
//                       border: "2px solid",
//                       borderColor: daysLeft < 7 ? "#ff4d8d44" : "#1a1a2e22",
//                       borderRadius: "12px",
//                     }}
//                   >
//                     <CalendarIcon
//                       size={14}
//                       color={daysLeft < 7 ? "#ff4d8d" : mutedColor}
//                     />
//                     {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ── Analytics ── */}
//           {analytics && (
//             <div style={{ marginBottom: "1.5rem" }}>
//               <h2
//                 style={{
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: "1.1rem",
//                   color: textColor,
//                   marginBottom: "1rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".5rem",
//                 }}
//               >
//                 <TrendIcon
//                   size={18}
//                   color={jarColor}
//                   strokeWidth={2}
//                 />{" "}
//                 Analytics
//               </h2>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
//                   gap: ".75rem",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 <AnalyticCard
//                   label="Avg / Day"
//                   value={`${currency}${analytics.avgPerDay.toFixed(0)}`}
//                   sub={`Over ${analytics.daysSinceStart} days`}
//                   color={jarColor}
//                   icon={
//                     <TrendIcon
//                       size={14}
//                       color={jarColor}
//                       strokeWidth={2.5}
//                     />
//                   }
//                 />
//                 <AnalyticCard
//                   label="Goal ETA"
//                   value={
//                     analytics.daysToGoal !== null
//                       ? analytics.daysToGoal === 0
//                         ? "Achieved!"
//                         : `${analytics.daysToGoal}d`
//                       : "N/A"
//                   }
//                   sub={
//                     analytics.goalDate
//                       ? analytics.goalDate.toLocaleDateString("en-IN", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })
//                       : "Keep saving to estimate"
//                   }
//                   color={analytics.daysToGoal === 0 ? "#22c55e" : "#9b5de5"}
//                   icon={
//                     <TargetIcon
//                       size={14}
//                       color={analytics.daysToGoal === 0 ? "#22c55e" : "#9b5de5"}
//                       strokeWidth={2.5}
//                     />
//                   }
//                 />
//                 <AnalyticCard
//                   label="Total Added"
//                   value={`${currency}${analytics.totalDeposited.toLocaleString()}`}
//                   sub={`${analytics.depositsCount} deposits`}
//                   color="#22c55e"
//                   icon={
//                     <ArrowUpIcon
//                       size={14}
//                       color="#22c55e"
//                       strokeWidth={2.5}
//                     />
//                   }
//                 />
//                 <AnalyticCard
//                   label="Total Withdrawn"
//                   value={`${currency}${analytics.totalWithdrawn.toLocaleString()}`}
//                   sub={`${analytics.withdrawalsCount} withdrawals`}
//                   color="#ff4d8d"
//                   icon={
//                     <ArrowDownIcon
//                       size={14}
//                       color="#ff4d8d"
//                       strokeWidth={2.5}
//                     />
//                   }
//                 />
//               </div>

//               {/* Chart */}
//               <div
//                 style={{
//                   background: theme.surface,
//                   border: "3px solid #1a1a2e",
//                   borderRadius: "16px",
//                   boxShadow: "4px 4px 0 #1a1a2e",
//                   padding: "1.25rem",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontFamily: "'Fredoka One',cursive",
//                     fontSize: ".88rem",
//                     color: textColor,
//                     marginBottom: ".75rem",
//                   }}
//                 >
//                   Savings Over Time
//                 </p>
//                 <SavingsChart
//                   transactions={transactions}
//                   color={jarColor}
//                   currency={currency}
//                 />
//               </div>
//             </div>
//           )}

//           {/* ── Transaction history ── */}
//           <div
//             style={{
//               background: theme.surface,
//               border: "3px solid #1a1a2e",
//               borderRadius: "16px",
//               boxShadow: "4px 4px 0 #1a1a2e",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "1rem 1.25rem",
//                 borderBottom: "2px solid #1a1a2e",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 flexWrap: "wrap",
//                 gap: ".5rem",
//               }}
//             >
//               <h2
//                 style={{
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: "1rem",
//                   color: textColor,
//                   margin: 0,
//                 }}
//               >
//                 Transaction History
//               </h2>
//               {/* Filter pills */}
//               <div style={{ display: "flex", gap: ".4rem" }}>
//                 {[
//                   ["all", "All"],
//                   ["deposit", "Deposits"],
//                   ["withdrawal", "Withdrawals"],
//                 ].map(([val, label]) => (
//                   <button
//                     key={val}
//                     onClick={() => setTxFilter(val)}
//                     style={{
//                       background: txFilter === val ? jarColor : "transparent",
//                       border: `2px solid ${txFilter === val ? "#1a1a2e" : "#1a1a2e33"}`,
//                       borderRadius: "999px",
//                       padding: ".2rem .65rem",
//                       fontFamily: "'Fredoka One',cursive",
//                       fontSize: ".68rem",
//                       color: txFilter === val ? "#fff" : mutedColor,
//                       cursor: "pointer",
//                       transition: "all .12s",
//                       boxShadow:
//                         txFilter === val ? "2px 2px 0 #1a1a2e" : "none",
//                     }}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {txLoading && (
//               <div
//                 style={{
//                   padding: "2rem",
//                   textAlign: "center",
//                   color: mutedColor,
//                   fontSize: ".85rem",
//                 }}
//               >
//                 Loading transactions...
//               </div>
//             )}

//             {!txLoading && filteredTx.length === 0 && (
//               <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
//                 <JarIcon
//                   size={36}
//                   color={mutedColor}
//                   strokeWidth={1.5}
//                 />
//                 <p
//                   style={{
//                     fontFamily: "'Fredoka One',cursive",
//                     color: textColor,
//                     marginTop: ".75rem",
//                   }}
//                 >
//                   {txFilter === "all"
//                     ? "No transactions yet"
//                     : `No ${txFilter}s yet`}
//                 </p>
//                 <p
//                   style={{
//                     fontSize: ".75rem",
//                     color: mutedColor,
//                     fontWeight: 600,
//                   }}
//                 >
//                   Tap "Add Money" to start saving!
//                 </p>
//               </div>
//             )}

//             {!txLoading && filteredTx.length > 0 && (
//               <div>
//                 {filteredTx.map((tx) => (
//                   <TxRow
//                     key={tx.id}
//                     tx={tx}
//                     currency={currency}
//                     isOwner={isOwner}
//                   />
//                 ))}
//               </div>
//             )}

//             {transactions.length > 0 && (
//               <div
//                 style={{
//                   padding: ".65rem 1.25rem",
//                   borderTop: "2px solid #1a1a2e22",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   fontSize: ".68rem",
//                   color: mutedColor,
//                   fontWeight: 700,
//                 }}
//               >
//                 <span>{transactions.length} total transactions</span>
//                 <span>
//                   Balance: {currency}
//                   {(jar.savedAmount || 0).toLocaleString()}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {quickAction && (
//         <QuickActionModal
//           jar={jar}
//           action={quickAction}
//           currency={currency}
//           user={user}
//           theme={theme}
//           onClose={() => setQuickAction(null)}
//         />
//       )}

//       {deleteConfirm && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(26,26,46,0.55)",
//             backdropFilter: "blur(4px)",
//             zIndex: 200,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "1rem",
//           }}
//         >
//           <div
//             style={{
//               background: theme.surface,
//               border: "3px solid #1a1a2e",
//               borderRadius: "20px",
//               boxShadow: "8px 8px 0 #1a1a2e",
//               padding: "2rem",
//               width: "100%",
//               maxWidth: 360,
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 width: 56,
//                 height: 56,
//                 background: "#ff4d8d22",
//                 border: "2px solid #ff4d8d",
//                 borderRadius: "14px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 margin: "0 auto 1.25rem",
//               }}
//             >
//               <TrashIcon
//                 size={24}
//                 color="#ff4d8d"
//                 strokeWidth={2}
//               />
//             </div>
//             <p
//               style={{
//                 fontFamily: "'Fredoka One',cursive",
//                 fontSize: "1.25rem",
//                 color: textColor,
//                 marginBottom: ".5rem",
//               }}
//             >
//               Delete "{jar.name}"?
//             </p>
//             <p
//               style={{
//                 fontSize: ".78rem",
//                 color: mutedColor,
//                 fontWeight: 600,
//                 marginBottom: "1.5rem",
//                 lineHeight: 1.5,
//               }}
//             >
//               This will permanently delete this jar and all its transaction
//               history. This cannot be undone.
//             </p>
//             <div style={{ display: "flex", gap: ".75rem" }}>
//               <button
//                 onClick={() => setDeleteConfirm(false)}
//                 style={{
//                   flex: 1,
//                   background: "transparent",
//                   border: "2px solid #1a1a2e",
//                   borderRadius: "10px",
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: ".88rem",
//                   color: textColor,
//                   padding: ".7rem",
//                   cursor: "pointer",
//                   boxShadow: "2px 2px 0 #1a1a2e",
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 style={{
//                   flex: 1,
//                   background: "#ff4d8d",
//                   border: "2px solid #1a1a2e",
//                   borderRadius: "10px",
//                   fontFamily: "'Fredoka One',cursive",
//                   fontSize: ".88rem",
//                   color: "#fff",
//                   padding: ".7rem",
//                   cursor: "pointer",
//                   boxShadow: "3px 3px 0 #1a1a2e",
//                 }}
//               >
//                 Delete Jar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { buildCss, getTheme } from "@/lib/themes";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  Timestamp,
  serverTimestamp,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { getCurrency, CURRENCY_SYMBOLS } from "@/app/dashboard/page";

// ─── Icons ────────────────────────────────────────────────────────────────────
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
const BackIcon = (p) => (
  <Icon {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
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
const TrashIcon = (p) => (
  <Icon {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </Icon>
);
const XIcon = (p) => (
  <Icon {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
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
const TrendIcon = (p) => (
  <Icon {...p}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
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
const InfoIcon = (p) => (
  <Icon {...p}>
    <circle
      cx="12"
      cy="12"
      r="10"
    />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toMs = (tx) => {
  if (!tx.createdAt) return 0;
  if (typeof tx.createdAt.toMillis === "function")
    return tx.createdAt.toMillis();
  if (tx.createdAt instanceof Date) return tx.createdAt.getTime();
  return 0;
};
const toDate = (tx) => new Date(toMs(tx));
const todayStr = () => new Date().toISOString().slice(0, 10);

// ─── Chart range config ───────────────────────────────────────────────────────
const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "All", days: null },
];

// ─── Google-Finance-style chart ───────────────────────────────────────────────
function SavingsChart({ transactions, color, currency }) {
  const [range, setRange] = useState("All");
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const rangeObj = RANGES.find((r) => r.label === range);

  // Build a full-range timeline carrying balance forward across the whole window
  const { data, prevClose } = useMemo(() => {
    if (!transactions.length) return { data: [], prevClose: null };

    const sorted = [...transactions].sort((a, b) => toMs(a) - toMs(b));
    const nowMs = Date.now();
    const cutoffMs = rangeObj?.days ? nowMs - rangeObj.days * 86400000 : null;

    // Day-keyed cumulative balance map from every real transaction
    let running = 0;
    const txDayMap = {};
    sorted.forEach((tx) => {
      running += tx.type === "deposit" ? tx.amount : -tx.amount;
      const day = new Date(toMs(tx)).toISOString().slice(0, 10);
      txDayMap[day] = Math.max(0, running);
    });
    const txDaysSorted = Object.keys(txDayMap).sort();

    // prevClose = last balance strictly before the window start
    let prevCloseVal = null;
    if (cutoffMs !== null) {
      const cutoffDay = new Date(cutoffMs).toISOString().slice(0, 10);
      const before = txDaysSorted.filter((d) => d < cutoffDay);
      if (before.length) prevCloseVal = txDayMap[before[before.length - 1]];
    }

    // Window start & end in ms
    const windowStartMs = cutoffMs ?? toMs(sorted[0]);
    const windowEndMs = nowMs;
    const totalDays = Math.max(1, (windowEndMs - windowStartMs) / 86400000);

    // How many spine points to generate (more = smoother x-axis spread)
    const spineN = rangeObj?.days
      ? Math.min(
          Math.max(Math.round(totalDays / Math.max(1, rangeObj.days / 40)), 8),
          80,
        )
      : Math.min(txDaysSorted.length * 4, 80);

    // Generate evenly-spaced spine dates across the full window
    const spineDays = new Set();
    for (let i = 0; i <= spineN; i++) {
      const ms = windowStartMs + (i / spineN) * (windowEndMs - windowStartMs);
      spineDays.add(new Date(ms).toISOString().slice(0, 10));
    }
    // Always include real transaction days that fall inside the window
    txDaysSorted.forEach((d) => {
      const dMs = new Date(d + "T12:00:00Z").getTime();
      if (!cutoffMs || dMs >= cutoffMs) spineDays.add(d);
    });

    const allDays = Array.from(spineDays).sort();

    // For each day, carry the most recent known balance forward
    const points = allDays.map((day) => {
      const applicable = txDaysSorted.filter((td) => td <= day);
      const bal = applicable.length
        ? txDayMap[applicable[applicable.length - 1]]
        : (prevCloseVal ?? 0);
      return { label: day, value: bal };
    });

    return { data: points, prevClose: prevCloseVal };
  }, [transactions, range]);

  const hasData = data.length >= 2;

  // Layout constants
  const W = 600,
    H = 210;
  const PAD = { top: 24, right: 24, bottom: 38, left: 60 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  // Derived geometry
  const { xs, ys, minVal, maxVal, pathD, areaD, prevCloseY } = useMemo(() => {
    if (!hasData) return {};

    const vals = data.map((d) => d.value);
    let minV = Math.min(...vals, prevClose ?? Infinity);
    let maxV = Math.max(...vals, prevClose ?? -Infinity);
    if (!isFinite(minV)) minV = 0;
    if (!isFinite(maxV)) maxV = 1;

    const spread = maxV - minV || 1;
    minV = Math.max(0, minV - spread * 0.1);
    maxV = maxV + spread * 0.1;

    const toX = (i) => PAD.left + (i / Math.max(data.length - 1, 1)) * iW;
    const toY = (v) => PAD.top + iH - ((v - minV) / (maxV - minV)) * iH;

    const xs = data.map((_, i) => toX(i));
    const ys = data.map((d) => toY(d.value));

    // Smooth cubic bezier — control points at 40% of the horizontal distance
    const smooth = (pts) =>
      pts.reduce((d, [x, y], i) => {
        if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
        const [px, py] = pts[i - 1];
        const cpx = ((px + x) / 2).toFixed(1);
        return (
          d +
          ` C${cpx},${py.toFixed(1)} ${cpx},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
        );
      }, "");

    const pts = xs.map((x, i) => [x, ys[i]]);
    const pathD = smooth(pts);
    const areaD =
      pathD +
      ` L${xs[xs.length - 1].toFixed(1)},${(PAD.top + iH).toFixed(1)}` +
      ` L${PAD.left.toFixed(1)},${(PAD.top + iH).toFixed(1)} Z`;

    const prevCloseY = prevClose !== null ? toY(prevClose) : null;

    return { xs, ys, minVal: minV, maxVal: maxV, pathD, areaD, prevCloseY };
  }, [data, prevClose, hasData]);

  // Y-axis ticks
  const yTicks = hasData
    ? [0, 0.25, 0.5, 0.75, 1].map((t) => ({
        val: minVal + t * (maxVal - minVal),
        y: PAD.top + iH - t * iH,
      }))
    : [];

  // X-axis ticks: pick ~5 indices that show DISTINCT labels so "Feb Feb Feb" never happens
  const xTickIdxs = useMemo(() => {
    if (!hasData) return [];

    // Label format based on range
    const fmt = (label) => {
      const d = new Date(label + "T12:00:00Z");
      if (range === "7D")
        return d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
      if (range === "30D")
        return d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });
      if (range === "3M")
        return d.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        });
      if (range === "6M")
        return d.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        });
      if (range === "1Y")
        return d.toLocaleDateString("en-GB", {
          month: "short",
          year: "2-digit",
        });
      // "All": show month+year
      return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    };

    // Shoot for ~6 ticks, deduplicated by label text
    const TARGET = 6;
    const step = Math.max(1, Math.floor(data.length / TARGET));
    const candidates = [];
    for (let i = 0; i < data.length; i += step) candidates.push(i);
    if (candidates[candidates.length - 1] !== data.length - 1)
      candidates.push(data.length - 1);

    // Remove candidates whose label is identical to the previous kept one
    const kept = [];
    let lastLabel = null;
    candidates.forEach((idx) => {
      const lbl = fmt(data[idx].label);
      if (lbl !== lastLabel) {
        kept.push(idx);
        lastLabel = lbl;
      }
    });

    return kept;
  }, [hasData, data, range]);

  // Label formatter (same logic, used for rendering)
  const fmtXLabel = (label) => {
    const d = new Date(label + "T12:00:00Z");
    if (range === "7D")
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    if (range === "30D")
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    if (range === "3M")
      return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    if (range === "6M")
      return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    if (range === "1Y")
      return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    return d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
  };

  // Mouse → nearest data point
  const handleMouseMove = (e) => {
    if (!svgRef.current || !hasData) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX - PAD.left;
    const idx = Math.max(
      0,
      Math.min(data.length - 1, Math.round((mx / iW) * (data.length - 1))),
    );
    setTooltip({
      idx,
      x: xs[idx],
      y: ys[idx],
      value: data[idx].value,
      label: data[idx].label,
    });
  };

  // Color: green if current ≥ prevClose (or ≥ first point), else red
  const last = data[data.length - 1]?.value ?? 0;
  const base = prevClose ?? data[0]?.value ?? 0;
  const isUp = last >= base;
  const lineColor = isUp ? color : "#ff4d8d";

  // Change summary
  const changeSummary =
    hasData && prevClose !== null
      ? (() => {
          const diff = last - prevClose;
          const pct = prevClose > 0 ? (diff / prevClose) * 100 : 0;
          return { diff, pct, up: diff >= 0 };
        })()
      : null;

  return (
    <div>
      {/* ── Range tab bar ── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          marginBottom: "1rem",
          borderBottom: "2px solid #1a1a2e12",
          paddingBottom: ".75rem",
        }}
      >
        {RANGES.map((r) => {
          const active = range === r.label;
          return (
            <button
              key={r.label}
              onClick={() => {
                setRange(r.label);
                setTooltip(null);
              }}
              style={{
                background: active ? "#1a1a2e" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: ".3rem .75rem",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".8rem",
                color: active ? "#fff" : "#8a8a9a",
                cursor: "pointer",
                transition: "background .15s, color .15s",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = "#1a1a2e";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.color = "#8a8a9a";
              }}
            >
              {r.label}
            </button>
          );
        })}

        {/* Spacer + change badge */}
        <div
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          {changeSummary && (
            <span
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".75rem",
                color: changeSummary.up ? "#22c55e" : "#ff4d8d",
                background: changeSummary.up ? "#22c55e11" : "#ff4d8d11",
                border: `1.5px solid ${changeSummary.up ? "#22c55e44" : "#ff4d8d44"}`,
                borderRadius: "6px",
                padding: ".2rem .55rem",
              }}
            >
              {changeSummary.up ? "▲" : "▼"} {currency}
              {Math.abs(changeSummary.diff).toLocaleString()} (
              {Math.abs(changeSummary.pct).toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* ── Chart or empty state ── */}
      {!hasData ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 160,
            color: "#8a8a9a",
            gap: ".5rem",
          }}
        >
          <InfoIcon
            size={28}
            color="#8a8a9a"
            strokeWidth={1.5}
          />
          <span
            style={{ fontFamily: "'Fredoka One',cursive", fontSize: ".88rem" }}
          >
            {transactions.length < 2
              ? "Add more transactions to see a chart"
              : `No data in the last ${range} window`}
          </span>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          {/* Floating tooltip */}
          {tooltip && (
            <div
              style={{
                position: "absolute",
                left: `${(tooltip.x / W) * 100}%`,
                top: 0,
                transform: "translateX(-50%)",
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "8px",
                padding: ".32rem .7rem",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".72rem",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: 10,
                boxShadow: "2px 3px 0 rgba(0,0,0,.25)",
              }}
            >
              {currency}
              {tooltip.value.toLocaleString()} ·{" "}
              {new Date(tooltip.label).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}

          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            style={{
              width: "100%",
              height: "auto",
              overflow: "visible",
              cursor: "crosshair",
              display: "block",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
          >
            <defs>
              <linearGradient
                id="chartArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={lineColor}
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor={lineColor}
                  stopOpacity="0.01"
                />
              </linearGradient>
              <clipPath id="chartClip">
                <rect
                  x={PAD.left}
                  y={PAD.top}
                  width={iW}
                  height={iH}
                />
              </clipPath>
            </defs>

            {/* Y grid + labels */}
            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={t.y}
                  x2={PAD.left + iW}
                  y2={t.y}
                  stroke="#1a1a2e"
                  strokeWidth={0.5}
                  strokeDasharray="4 4"
                  opacity={0.14}
                />
                <text
                  x={PAD.left - 8}
                  y={t.y + 4}
                  textAnchor="end"
                  fill="#9a9aaa"
                  fontSize={9.5}
                  fontFamily="'Fredoka One',cursive"
                >
                  {t.val >= 1000
                    ? `${(t.val / 1000).toFixed(1)}k`
                    : t.val.toFixed(0)}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {xTickIdxs.map((i) => (
              <text
                key={i}
                x={xs[i]}
                y={H - 6}
                textAnchor="middle"
                fill="#9a9aaa"
                fontSize={9}
                fontFamily="'Fredoka One',cursive"
              >
                {fmtXLabel(data[i].label)}
              </text>
            ))}

            {/* Previous-close dotted baseline */}
            {prevCloseY !== null && (
              <>
                <line
                  x1={PAD.left}
                  y1={prevCloseY}
                  x2={PAD.left + iW}
                  y2={prevCloseY}
                  stroke="#9a9aaa"
                  strokeWidth={1}
                  strokeDasharray="5 4"
                  opacity={0.65}
                />
                <text
                  x={PAD.left + iW + 5}
                  y={prevCloseY + 4}
                  fill="#9a9aaa"
                  fontSize={8.5}
                  fontFamily="'Fredoka One',cursive"
                >
                  Prev
                </text>
                <text
                  x={PAD.left + iW + 5}
                  y={prevCloseY + 15}
                  fill="#9a9aaa"
                  fontSize={7.5}
                  fontFamily="'Fredoka One',cursive"
                >
                  {currency}
                  {prevClose?.toLocaleString()}
                </text>
              </>
            )}

            {/* Area fill */}
            <path
              d={areaD}
              fill="url(#chartArea)"
              clipPath="url(#chartClip)"
            />

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke={lineColor}
              strokeWidth={2.2}
              strokeLinejoin="round"
              strokeLinecap="round"
              clipPath="url(#chartClip)"
            />

            {/* Crosshair + dot (tooltip active) */}
            {tooltip && (
              <g>
                <line
                  x1={tooltip.x}
                  y1={PAD.top}
                  x2={tooltip.x}
                  y2={PAD.top + iH}
                  stroke="#1a1a2e"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.35}
                />
                <circle
                  cx={tooltip.x}
                  cy={tooltip.y}
                  r={5}
                  fill={lineColor}
                  stroke="#fff"
                  strokeWidth={2.5}
                />
              </g>
            )}

            {/* Always-visible end dot */}
            {!tooltip && (
              <circle
                cx={xs[xs.length - 1]}
                cy={ys[ys.length - 1]}
                r={4.5}
                fill={lineColor}
                stroke="#fff"
                strokeWidth={2.5}
              />
            )}
          </svg>

          {/* Date range caption */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: ".5rem",
              fontSize: ".68rem",
              color: "#9a9aaa",
              fontFamily: "'Fredoka One',cursive",
            }}
          >
            <span>
              {new Date(data[0].label).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>
              {new Date(data[data.length - 1].label).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "short", year: "numeric" },
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Transaction row ──────────────────────────────────────────────────────────
function TxRow({ tx, currency }) {
  const isDeposit = tx.type === "deposit";
  const d = toDate(tx);
  const dateStr = d
    ? d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const timeStr = d
    ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: ".85rem",
        padding: ".85rem 1rem",
        borderBottom: "2px solid #1a1a2e11",
        transition: "background .12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a2e05")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: isDeposit ? "#22c55e22" : "#ff4d8d22",
          border: `2px solid ${isDeposit ? "#22c55e" : "#ff4d8d"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isDeposit ? (
          <ArrowUpIcon
            size={16}
            color="#22c55e"
            strokeWidth={2.5}
          />
        ) : (
          <ArrowDownIcon
            size={16}
            color="#ff4d8d"
            strokeWidth={2.5}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".88rem",
            color: "#1a1a2e",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {tx.note || (isDeposit ? "Deposit" : "Withdrawal")}
        </p>
        <p
          style={{
            fontSize: ".66rem",
            color: "#8a8a9a",
            fontWeight: 600,
            margin: ".1rem 0 0",
            display: "flex",
            alignItems: "center",
            gap: ".35rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: ".2rem",
            }}
          >
            <CalendarIcon
              size={9}
              color="#8a8a9a"
            />{" "}
            {dateStr}
          </span>
          {timeStr && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".2rem",
              }}
            >
              <ClockIcon
                size={9}
                color="#8a8a9a"
              />{" "}
              {timeStr}
            </span>
          )}
          {tx.createdByEmail && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".2rem",
              }}
            >
              <UsersIcon
                size={9}
                color="#8a8a9a"
              />{" "}
              {tx.createdByEmail.split("@")[0]}
            </span>
          )}
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "'Fredoka One',cursive",
            fontSize: "1rem",
            color: isDeposit ? "#22c55e" : "#ff4d8d",
            margin: 0,
          }}
        >
          {isDeposit ? "+" : "−"}
          {currency}
          {tx.amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ─── Analytic tile ────────────────────────────────────────────────────────────
function AnalyticCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2.5px solid #1a1a2e",
        borderRadius: "14px",
        padding: "1rem",
        boxShadow: "3px 3px 0 #1a1a2e",
        display: "flex",
        flexDirection: "column",
        gap: ".4rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <span
          style={{
            background: color + "22",
            border: `2px solid ${color}`,
            borderRadius: "8px",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: ".65rem",
            fontWeight: 700,
            color: "#8a8a9a",
            textTransform: "uppercase",
            letterSpacing: ".06em",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'Fredoka One',cursive",
          fontSize: "1.25rem",
          color,
          margin: 0,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontSize: ".66rem",
            color: "#8a8a9a",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Quick-action modal (Add / Withdraw) with DATE PICKER ─────────────────────
function QuickActionModal({ jar, action, currency, user, onClose, theme }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr()); // ← new date field
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAdd = action === "add";
  const accentColor = isAdd ? "#22c55e" : "#ff4d8d";
  const border = "#1a1a2e";

  const fieldStyle = (err = false) => ({
    width: "100%",
    padding: ".65rem 1rem",
    border: `2.5px solid ${err ? "#ff4d8d" : border}`,
    borderRadius: "10px",
    fontFamily: "'Fredoka One',cursive",
    fontSize: ".9rem",
    color: "#1a1a2e",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  });

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
      // Convert local date string to Firestore Timestamp (noon to avoid TZ drift)
      const ts = Timestamp.fromDate(new Date(date + "T12:00:00"));

      await addDoc(collection(db, "jars", jar.id, "transactions"), {
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
      console.error(e);
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
          background: theme?.surface || "#fff",
          border: `3px solid ${border}`,
          borderRadius: "20px",
          boxShadow: `8px 8px 0 ${border}`,
          padding: "2rem",
          width: "100%",
          maxWidth: 410,
          position: "relative",
        }}
      >
        {/* Close */}
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
            marginBottom: "1.4rem",
          }}
        >
          <span
            style={{
              background: accentColor + "22",
              border: `2px solid ${accentColor}`,
              borderRadius: "10px",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isAdd ? (
              <ArrowUpIcon
                size={19}
                color={accentColor}
                strokeWidth={2.5}
              />
            ) : (
              <ArrowDownIcon
                size={19}
                color={accentColor}
                strokeWidth={2.5}
              />
            )}
          </span>
          <div>
            <p
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: "1.25rem",
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

        {/* Balance chip */}
        <div
          style={{
            background: accentColor + "11",
            border: `2px solid ${accentColor}33`,
            borderRadius: "10px",
            padding: ".65rem 1rem",
            marginBottom: "1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: ".7rem",
              fontWeight: 700,
              color: "#8a8a9a",
              textTransform: "uppercase",
              letterSpacing: ".06em",
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

        {/* ── Amount ── */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".35rem",
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
              color: "#8a8a9a",
            }}
          >
            {currency}
          </span>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="0.00"
            style={{ ...fieldStyle(!!error && !amount), paddingLeft: "2.1rem" }}
          />
        </div>

        {/* ── Date picker (NEW) ── */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".35rem",
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
              ...fieldStyle(),
              paddingLeft: "2.3rem",
              colorScheme: "light",
            }}
          />
        </div>

        {/* ── Note ── */}
        <label
          style={{
            display: "block",
            fontFamily: "'Fredoka One',cursive",
            fontSize: ".8rem",
            color: "#1a1a2e",
            marginBottom: ".35rem",
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
          style={{ ...fieldStyle(), marginBottom: error ? ".5rem" : "1.25rem" }}
        />

        {error && (
          <p
            style={{
              fontSize: ".72rem",
              color: "#ff4d8d",
              fontWeight: 700,
              margin: ".4rem 0 .9rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
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
            ? "Processing…"
            : isAdd
              ? `Add ${currency}${amount || "0"}`
              : `Withdraw ${currency}${amount || "0"}`}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JarDetailPage() {
  const { user, userData, loading: authLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const jarId = params?.jarId;

  const [jar, setJar] = useState(null);
  const [jarLoading, setJarLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [quickAction, setQuickAction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [txFilter, setTxFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading]);

  // Live jar document
  useEffect(() => {
    if (!jarId || !user) return;
    return onSnapshot(doc(db, "jars", jarId), (snap) => {
      if (!snap.exists()) {
        router.push("/dashboard");
        return;
      }
      setJar({ id: snap.id, ...snap.data() });
      setJarLoading(false);
    });
  }, [jarId, user]);

  // Live transaction sub-collection
  useEffect(() => {
    if (!jarId || !user) return;
    const q = query(
      collection(db, "jars", jarId, "transactions"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTxLoading(false);
    });
  }, [jarId, user]);

  const theme = getTheme(userData?.theme || "orange");
  const currency = getCurrency(userData);
  const isDark = theme.id === "dark";
  const textColor = isDark ? "#e0e0ff" : "#1a1a2e";
  const mutedColor = isDark ? "#7a7a9a" : "#8a8a9a";

  // Analytics
  const analytics = useMemo(() => {
    if (!jar || !transactions.length) return null;
    const deposits = transactions.filter((t) => t.type === "deposit");
    const withdrawals = transactions.filter((t) => t.type === "withdrawal");
    const totalDeposited = deposits.reduce((s, t) => s + t.amount, 0);
    const totalWithdrawn = withdrawals.reduce((s, t) => s + t.amount, 0);

    const sorted = [...transactions].sort((a, b) => toMs(a) - toMs(b));
    const firstDate = toDate(sorted[0]);
    const daysSinceStart = Math.max(
      1,
      Math.ceil((Date.now() - firstDate.getTime()) / 86400000),
    );
    const avgPerDay = (totalDeposited - totalWithdrawn) / daysSinceStart;
    const remaining = Math.max(0, (jar.goal || 0) - (jar.savedAmount || 0));
    const daysToGoal = avgPerDay > 0 ? Math.ceil(remaining / avgPerDay) : null;
    const goalDate =
      daysToGoal !== null ? new Date(Date.now() + daysToGoal * 86400000) : null;

    return {
      totalDeposited,
      totalWithdrawn,
      avgPerDay,
      daysToGoal,
      goalDate,
      daysSinceStart,
      depositsCount: deposits.length,
      withdrawalsCount: withdrawals.length,
    };
  }, [jar, transactions]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "jars", jarId));
    router.push("/dashboard");
  };

  const filteredTx =
    txFilter === "all"
      ? transactions
      : transactions.filter((t) => t.type === txFilter);

  // ── Loading ──
  if (authLoading || jarLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff9f0",
          fontFamily: "'Fredoka One',cursive",
          color: "#ff6b2b",
          fontSize: "1.1rem",
        }}
      >
        Loading jar…
      </div>
    );
  }
  if (!jar) return null;

  const isOwner = jar.createdBy === user?.uid;
  const jarColor = jar.color || theme.primary;
  const progress =
    jar.goal > 0 ? Math.min((jar.savedAmount / jar.goal) * 100, 100) : 0;
  const daysLeft = jar.deadline
    ? Math.ceil((new Date(jar.deadline) - new Date()) / 86400000)
    : null;

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");
        input[type="date"]::-webkit-calendar-picker-indicator { opacity:.55; cursor:pointer; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: `radial-gradient(circle at 10% 15%, ${jarColor}18 0%, transparent 40%), radial-gradient(circle at 90% 85%, ${jarColor}08 0%, transparent 40%), ${theme.bg}`,
          fontFamily: "'Fredoka One',cursive",
        }}
      >
        {/* Navbar */}
        <nav
          style={{
            background: theme.surface,
            borderBottom: "3px solid #1a1a2e",
            padding: ".85rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 3px 0 #1a1a2e",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "transparent",
              border: "2px solid #1a1a2e",
              borderRadius: "999px",
              padding: ".3rem .85rem",
              cursor: "pointer",
              fontFamily: "'Fredoka One',cursive",
              fontSize: ".78rem",
              color: textColor,
              boxShadow: "2px 2px 0 #1a1a2e",
              display: "flex",
              alignItems: "center",
              gap: ".4rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translate(-1px,-1px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            <BackIcon
              size={14}
              color={textColor}
              strokeWidth={2.5}
            />{" "}
            Back
          </button>

          <div
            style={{
              fontFamily: "'Fredoka One',cursive",
              fontSize: "1.1rem",
              color: textColor,
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: jarColor,
                border: "2px solid #1a1a2e",
                display: "inline-block",
              }}
            />
            {jar.name}
          </div>

          {isOwner ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                background: "#ff4d8d11",
                border: "2px solid #ff4d8d55",
                borderRadius: "999px",
                padding: ".3rem .85rem",
                cursor: "pointer",
                fontFamily: "'Fredoka One',cursive",
                fontSize: ".78rem",
                color: "#ff4d8d",
                display: "flex",
                alignItems: "center",
                gap: ".4rem",
              }}
            >
              <TrashIcon
                size={14}
                color="#ff4d8d"
                strokeWidth={2.5}
              />{" "}
              Delete
            </button>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </nav>

        {/* Body */}
        <div
          style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.25rem" }}
        >
          {/* Hero */}
          <div
            style={{
              background: theme.surface,
              border: "3px solid #1a1a2e",
              borderRadius: "20px",
              boxShadow: `6px 6px 0 ${jarColor}`,
              overflow: "hidden",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ height: 8, background: jarColor }} />
            <div style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: ".68rem",
                      color: mutedColor,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      margin: "0 0 .25rem",
                    }}
                  >
                    {isOwner ? "Your jar" : `Shared by ${jar.createdByEmail}`}
                  </p>
                  <h1
                    style={{
                      fontFamily: "'Fredoka One',cursive",
                      fontSize: "2rem",
                      color: textColor,
                      margin: 0,
                    }}
                  >
                    {jar.name}
                  </h1>
                  {jar.description && (
                    <p
                      style={{
                        fontSize: ".8rem",
                        color: mutedColor,
                        fontWeight: 600,
                        margin: ".4rem 0 0",
                      }}
                    >
                      {jar.description}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Fredoka One',cursive",
                      fontSize: "2.5rem",
                      color: jarColor,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {currency}
                    {(jar.savedAmount || 0).toLocaleString()}
                  </p>
                  <p
                    style={{
                      fontSize: ".72rem",
                      color: mutedColor,
                      fontWeight: 600,
                      margin: ".3rem 0 0",
                    }}
                  >
                    of {currency}
                    {jar.goal.toLocaleString()} goal
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div
                  style={{
                    height: 16,
                    background: isDark ? "#2a2a3e" : "#f0f0f0",
                    borderRadius: "999px",
                    border: "2.5px solid #1a1a2e",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: jarColor,
                      width: `${progress}%`,
                      borderRadius: "999px",
                      transition: "width .5s ease",
                      minWidth: progress > 0 ? 12 : 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: ".4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: ".7rem",
                      color: mutedColor,
                      fontWeight: 700,
                    }}
                  >
                    {progress.toFixed(1)}% complete
                  </span>
                  <span
                    style={{
                      fontSize: ".7rem",
                      color: mutedColor,
                      fontWeight: 700,
                    }}
                  >
                    {currency}
                    {Math.max(
                      0,
                      jar.goal - (jar.savedAmount || 0),
                    ).toLocaleString()}{" "}
                    remaining
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => setQuickAction("add")}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    background: "#22c55e",
                    border: "2.5px solid #1a1a2e",
                    borderRadius: "12px",
                    color: "#fff",
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: ".95rem",
                    padding: ".75rem 1rem",
                    cursor: "pointer",
                    boxShadow: "3px 3px 0 #1a1a2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: ".4rem",
                    transition: "transform .1s, box-shadow .1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "5px 5px 0 #1a1a2e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
                  }}
                >
                  <ArrowUpIcon
                    size={16}
                    color="#fff"
                    strokeWidth={2.5}
                  />{" "}
                  Add Money
                </button>
                <button
                  onClick={() => setQuickAction("withdraw")}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    background: "transparent",
                    border: "2.5px solid #ff4d8d",
                    borderRadius: "12px",
                    color: "#ff4d8d",
                    fontFamily: "'Fredoka One',cursive",
                    fontSize: ".95rem",
                    padding: ".75rem 1rem",
                    cursor: "pointer",
                    boxShadow: "3px 3px 0 #1a1a2e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: ".4rem",
                    transition: "transform .1s, box-shadow .1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "5px 5px 0 #1a1a2e";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "3px 3px 0 #1a1a2e";
                  }}
                >
                  <ArrowDownIcon
                    size={16}
                    color="#ff4d8d"
                    strokeWidth={2.5}
                  />{" "}
                  Withdraw
                </button>
                {daysLeft !== null && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".4rem",
                      fontSize: ".75rem",
                      color: daysLeft < 7 ? "#ff4d8d" : mutedColor,
                      fontWeight: 700,
                      padding: ".75rem",
                      background: daysLeft < 7 ? "#ff4d8d11" : "#1a1a2e08",
                      border: "2px solid",
                      borderColor: daysLeft < 7 ? "#ff4d8d44" : "#1a1a2e22",
                      borderRadius: "12px",
                    }}
                  >
                    <CalendarIcon
                      size={14}
                      color={daysLeft < 7 ? "#ff4d8d" : mutedColor}
                    />
                    {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analytics */}
          {analytics && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1.1rem",
                  color: textColor,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".5rem",
                }}
              >
                <TrendIcon
                  size={18}
                  color={jarColor}
                  strokeWidth={2}
                />{" "}
                Analytics
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                  gap: ".75rem",
                  marginBottom: "1rem",
                }}
              >
                <AnalyticCard
                  label="Avg / Day"
                  value={`${currency}${analytics.avgPerDay.toFixed(0)}`}
                  sub={`Over ${analytics.daysSinceStart} days`}
                  color={jarColor}
                  icon={
                    <TrendIcon
                      size={14}
                      color={jarColor}
                      strokeWidth={2.5}
                    />
                  }
                />
                <AnalyticCard
                  label="Goal ETA"
                  value={
                    analytics.daysToGoal !== null
                      ? analytics.daysToGoal === 0
                        ? "Achieved! 🎉"
                        : `${analytics.daysToGoal}d`
                      : "N/A"
                  }
                  sub={
                    analytics.goalDate
                      ? analytics.goalDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Keep saving to estimate"
                  }
                  color={analytics.daysToGoal === 0 ? "#22c55e" : "#9b5de5"}
                  icon={
                    <TargetIcon
                      size={14}
                      color={analytics.daysToGoal === 0 ? "#22c55e" : "#9b5de5"}
                      strokeWidth={2.5}
                    />
                  }
                />
                <AnalyticCard
                  label="Total Added"
                  value={`${currency}${analytics.totalDeposited.toLocaleString()}`}
                  sub={`${analytics.depositsCount} deposit${analytics.depositsCount !== 1 ? "s" : ""}`}
                  color="#22c55e"
                  icon={
                    <ArrowUpIcon
                      size={14}
                      color="#22c55e"
                      strokeWidth={2.5}
                    />
                  }
                />
                <AnalyticCard
                  label="Total Withdrawn"
                  value={`${currency}${analytics.totalWithdrawn.toLocaleString()}`}
                  sub={`${analytics.withdrawalsCount} withdrawal${analytics.withdrawalsCount !== 1 ? "s" : ""}`}
                  color="#ff4d8d"
                  icon={
                    <ArrowDownIcon
                      size={14}
                      color="#ff4d8d"
                      strokeWidth={2.5}
                    />
                  }
                />
              </div>

              {/* Chart card */}
              <div
                style={{
                  background: theme.surface,
                  border: "3px solid #1a1a2e",
                  borderRadius: "16px",
                  boxShadow: "4px 4px 0 #1a1a2e",
                  padding: "1.25rem 1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: ".5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Fredoka One',cursive",
                      fontSize: ".95rem",
                      color: textColor,
                      margin: 0,
                    }}
                  >
                    Savings Over Time
                  </p>
                  <p
                    style={{
                      fontSize: ".68rem",
                      color: mutedColor,
                      fontWeight: 700,
                      margin: 0,
                    }}
                  >
                    {transactions.length} transactions
                  </p>
                </div>
                <SavingsChart
                  transactions={transactions}
                  color={jarColor}
                  currency={currency}
                />
              </div>
            </div>
          )}

          {/* Transaction history */}
          <div
            style={{
              background: theme.surface,
              border: "3px solid #1a1a2e",
              borderRadius: "16px",
              boxShadow: "4px 4px 0 #1a1a2e",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "2px solid #1a1a2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: ".5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: "1rem",
                  color: textColor,
                  margin: 0,
                }}
              >
                Transaction History
              </h2>
              <div style={{ display: "flex", gap: ".4rem" }}>
                {[
                  ["all", "All"],
                  ["deposit", "Deposits"],
                  ["withdrawal", "Withdrawals"],
                ].map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setTxFilter(val)}
                    style={{
                      background: txFilter === val ? jarColor : "transparent",
                      border: `2px solid ${txFilter === val ? "#1a1a2e" : "#1a1a2e33"}`,
                      borderRadius: "999px",
                      padding: ".2rem .65rem",
                      fontFamily: "'Fredoka One',cursive",
                      fontSize: ".68rem",
                      color: txFilter === val ? "#fff" : mutedColor,
                      cursor: "pointer",
                      transition: "all .12s",
                      boxShadow:
                        txFilter === val ? "2px 2px 0 #1a1a2e" : "none",
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {txLoading && (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: mutedColor,
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".85rem",
                }}
              >
                Loading transactions…
              </div>
            )}

            {!txLoading && filteredTx.length === 0 && (
              <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
                <JarIcon
                  size={36}
                  color={mutedColor}
                  strokeWidth={1.5}
                />
                <p
                  style={{
                    fontFamily: "'Fredoka One',cursive",
                    color: textColor,
                    marginTop: ".75rem",
                  }}
                >
                  {txFilter === "all"
                    ? "No transactions yet"
                    : `No ${txFilter}s yet`}
                </p>
                <p
                  style={{
                    fontSize: ".75rem",
                    color: mutedColor,
                    fontWeight: 600,
                  }}
                >
                  Tap "Add Money" to start saving!
                </p>
              </div>
            )}

            {!txLoading && filteredTx.length > 0 && (
              <div>
                {filteredTx.map((tx) => (
                  <TxRow
                    key={tx.id}
                    tx={tx}
                    currency={currency}
                  />
                ))}
              </div>
            )}

            {transactions.length > 0 && (
              <div
                style={{
                  padding: ".65rem 1.25rem",
                  borderTop: "2px solid #1a1a2e11",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: ".68rem",
                  color: mutedColor,
                  fontWeight: 700,
                }}
              >
                <span>{transactions.length} total transactions</span>
                <span>
                  Balance: {currency}
                  {(jar.savedAmount || 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {quickAction && (
        <QuickActionModal
          jar={jar}
          action={quickAction}
          currency={currency}
          user={user}
          theme={theme}
          onClose={() => setQuickAction(null)}
        />
      )}

      {deleteConfirm && (
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
              border: "3px solid #1a1a2e",
              borderRadius: "20px",
              boxShadow: "8px 8px 0 #1a1a2e",
              padding: "2rem",
              width: "100%",
              maxWidth: 360,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "#ff4d8d22",
                border: "2px solid #ff4d8d",
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
                color: textColor,
                marginBottom: ".5rem",
              }}
            >
              Delete "{jar.name}"?
            </p>
            <p
              style={{
                fontSize: ".78rem",
                color: mutedColor,
                fontWeight: 600,
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              This will permanently delete this jar and all transaction history.
              This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: ".75rem" }}>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "2px solid #1a1a2e",
                  borderRadius: "10px",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".88rem",
                  color: textColor,
                  padding: ".7rem",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0 #1a1a2e",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  background: "#ff4d8d",
                  border: "2px solid #1a1a2e",
                  borderRadius: "10px",
                  fontFamily: "'Fredoka One',cursive",
                  fontSize: ".88rem",
                  color: "#fff",
                  padding: ".7rem",
                  cursor: "pointer",
                  boxShadow: "3px 3px 0 #1a1a2e",
                }}
              >
                Delete Jar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
