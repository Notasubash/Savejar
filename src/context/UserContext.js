// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { onIdTokenChanged } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "../lib/firebase";

// const CACHE_KEY = "jamjars_userdata";

// /* =========================
//    Local cache helpers
// ========================= */
// function readCache() {
//   if (typeof window === "undefined") return null;
//   try {
//     const raw = localStorage.getItem(CACHE_KEY);
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// function writeCache(data) {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(CACHE_KEY, JSON.stringify(data));
//   } catch {}
// }

// function clearCache() {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.removeItem(CACHE_KEY);
//   } catch {}
// }

// /* =========================
//    Register email index
// ========================= */
// async function registerUserEmail(firebaseUser) {
//   if (!firebaseUser?.email) return;

//   try {
//     await setDoc(
//       doc(db, "userEmails", firebaseUser.email),
//       {
//         uid: firebaseUser.uid,
//         registeredAt: serverTimestamp(),
//       },
//       { merge: true },
//     );
//   } catch (e) {
//     console.warn("registerUserEmail:", e?.code);
//   }
// }

// const UserContext = createContext(null);

// /* =========================
//    Provider
// ========================= */
// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [userData, setUserData] = useState(() => readCache());
//   const [loading, setLoading] = useState(true);

//   const applyUserData = useCallback((data) => {
//     setUserData(data);
//     writeCache(data);
//   }, []);

//   useEffect(() => {
//     // 🔥 IMPORTANT: waits for token to be ready
//     const unsub = onIdTokenChanged(auth, async (firebaseUser) => {
//       if (!firebaseUser) {
//         setUser(null);
//         setUserData(null);
//         clearCache();
//         setLoading(false);
//         return;
//       }

//       setUser(firebaseUser);

//       // Show cached data immediately (fast UI)
//       const cached = readCache();
//       if (cached) setLoading(false);

//       try {
//         // Ensure Firestore has a valid auth token
//         await firebaseUser.getIdToken();

//         const userRef = doc(db, "users", firebaseUser.uid);
//         console.log(userRef);
//         let snap = await getDoc(userRef);

//         // Auto-create user doc if missing
//         if (!snap.exists()) {
//           await setDoc(userRef, {
//             email: firebaseUser.email,
//             theme: "orange",
//             currency: "INR",
//             dateFormat: "DD-MM-YYYY",
//             createdAt: serverTimestamp(),
//           });

//           snap = await getDoc(userRef);
//         }

//         applyUserData(snap.data() || {});
//       } catch (e) {
//         console.error("UserContext Firestore error:", e?.code, e?.message);
//       }

//       // Register email for sharing index
//       await registerUserEmail(firebaseUser);

//       setLoading(false);
//     });

//     return unsub;
//   }, [applyUserData]);

//   /* =========================
//      Helpers
//   ========================= */

//   const updateUserData = useCallback((patch) => {
//     setUserData((prev) => {
//       const next = { ...prev, ...patch };
//       writeCache(next);
//       return next;
//     });
//   }, []);

//   const refreshUserData = useCallback(async () => {
//     if (!auth.currentUser) return;

//     try {
//       await auth.currentUser.getIdToken();

//       const snap = await getDoc(doc(db, "users", auth.currentUser.uid));

//       applyUserData(snap.data() || {});
//     } catch (e) {
//       console.error("refreshUserData:", e?.code, e?.message);
//     }
//   }, [applyUserData]);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         userData,
//         loading,
//         updateUserData,
//         refreshUserData,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useUser = () => useContext(UserContext);
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const CACHE_KEY = "jamjars_userdata";

function readCache() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

function clearCache() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {}
}

// Writes a minimal public record to userEmails/{email} so other users
// can verify this account exists when sharing a jar.
// Uses the user's own auth token so it passes Firestore rules.
async function registerUserEmail(firebaseUser) {
  if (!firebaseUser?.email) return;
  try {
    await setDoc(
      doc(db, "userEmails", firebaseUser.email),
      { uid: firebaseUser.uid },
      { merge: true },
    );
  } catch (e) {
    // Non-critical — silently ignore
    console.warn("registerUserEmail:", e?.code);
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => readCache());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyUserData = useCallback((data) => {
    setUserData(data);
    writeCache(data);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Unblock UI immediately if we have a cache hit
        const cached = readCache();
        if (cached) setLoading(false);

        // Fetch own user doc — this is allowed by rules since uid matches
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          applyUserData(snap.data() || {});
        } catch (e) {
          console.error(
            "UserContext — could not read user doc:",
            e?.code,
            e?.message,
          );
        }

        // Register email in the public index (safe — owner writing their own entry)
        await registerUserEmail(firebaseUser);

        setLoading(false);
      } else {
        setUser(null);
        setUserData(null);
        clearCache();
        setLoading(false);
      }
    });

    return unsub;
  }, [applyUserData]);

  const updateUserData = useCallback((patch) => {
    setUserData((prev) => {
      const next = { ...prev, ...patch };
      writeCache(next);
      return next;
    });
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      applyUserData(snap.data() || {});
    } catch (e) {
      console.error("refreshUserData:", e?.code, e?.message);
    }
  }, [applyUserData]);

  return (
    <UserContext.Provider
      value={{ user, userData, loading, updateUserData, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
