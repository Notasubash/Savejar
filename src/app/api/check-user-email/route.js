// app/api/check-user-email/route.js
//
// Securely checks if an email has a JamJars account.
// Uses the Firebase Admin SDK — never exposes the users collection to clients.
//
// Setup:
//   npm install firebase-admin
//
// Add to .env.local:
//   FIREBASE_PROJECT_ID=your-project-id
//   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
//   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
//   (Get these from Firebase Console → Project Settings → Service Accounts → Generate new private key)

import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// ── Init Admin SDK once ───────────────────────────────────────────────────────
function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    // 1. Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization") || "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminApp = getAdminApp();
    const adminAuth = getAuth(adminApp);

    let caller;
    try {
      caller = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Parse and validate the email to check
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 3. Prevent self-lookup (belt-and-suspenders; the client already blocks this)
    if (email.toLowerCase() === caller.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Cannot add yourself" },
        { status: 400 },
      );
    }

    // 4. Rate limit: max 10 lookups per minute per caller (simple in-memory)
    //    For production, swap this with Redis or Upstash
    const now = Date.now();
    rateLimitMap.set(
      caller.uid,
      (rateLimitMap.get(caller.uid) || []).filter((t) => now - t < 60_000),
    );
    const calls = rateLimitMap.get(caller.uid);
    if (calls.length >= 10) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    calls.push(now);
    rateLimitMap.set(caller.uid, calls);

    // 5. Check userEmails collection using Admin SDK (bypasses Firestore rules)
    const adminDb = getFirestore(adminApp);
    const emailDoc = await adminDb.collection("userEmails").doc(email).get();

    if (!emailDoc.exists) {
      return NextResponse.json({ exists: false });
    }

    const { uid } = emailDoc.data();

    return NextResponse.json({
      exists: true,
      uid,
    });
  } catch (err) {
    console.error("check-user-email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Simple in-memory rate limit map (resets on cold start — fine for most cases)
const rateLimitMap = new Map();
