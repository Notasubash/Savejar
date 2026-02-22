// lib/registerUserEmail.js
//
// Call this immediately after a new user signs up (or on first login via Google/etc.)
// It writes a lightweight public record to the "userEmails" collection so other
// users can verify the email exists when sharing a jar.
//
// Usage:
//   import { registerUserEmail } from "@/lib/registerUserEmail";
//   await registerUserEmail(firebaseUser);

import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Creates/updates a document in `userEmails/{email}` with basic public info.
 * Safe to call on every login — setDoc with merge:true is idempotent.
 *
 * @param {import("firebase/auth").User} firebaseUser
 */
export async function registerUserEmail(firebaseUser) {
  if (!firebaseUser?.email) return;

  try {
    await setDoc(
      doc(db, "userEmails", firebaseUser.email),
      {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || null,
        registeredAt: serverTimestamp(),
      },
      { merge: true }, // won't overwrite existing data on re-login
    );
  } catch (e) {
    // Non-critical — log but don't break the auth flow
    console.warn("registerUserEmail failed:", e);
  }
}
