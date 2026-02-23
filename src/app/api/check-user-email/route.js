// app/api/check-user-email/route.js

import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const rateLimitMap = new Map();

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  // Hard fail with a clear message if env vars are missing
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      `Missing Firebase Admin env vars. ` +
        `projectId=${!!projectId} clientEmail=${!!clientEmail} privateKey=${!!privateKey}`,
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export async function POST(req) {
  try {
    // 1. Verify caller is authenticated
    const authHeader = req.headers.get("Authorization") || "";
    const idToken = authHeader.replace("Bearer ", "").trim();

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let adminApp;
    try {
      adminApp = getAdminApp();
    } catch (initErr) {
      // This will appear in your Vercel function logs
      console.error("Admin SDK init failed:", initErr.message);
      return NextResponse.json(
        { error: "Server config error", detail: initErr.message },
        { status: 500 },
      );
    }

    const adminAuth = getAuth(adminApp);

    let caller;
    try {
      caller = await adminAuth.verifyIdToken(idToken);
    } catch (tokenErr) {
      console.error("Token verification failed:", tokenErr.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Validate email
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 3. Self-lookup guard
    if (email.toLowerCase() === caller.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "Cannot add yourself" },
        { status: 400 },
      );
    }

    // 4. Rate limit — 10 lookups per minute per caller
    const now = Date.now();
    const calls = (rateLimitMap.get(caller.uid) || []).filter(
      (t) => now - t < 60_000,
    );
    if (calls.length >= 10) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    calls.push(now);
    rateLimitMap.set(caller.uid, calls);

    // 5. Check userEmails collection
    const adminDb = getFirestore(adminApp);
    const emailDoc = await adminDb
      .collection("userEmails")
      .doc(email.toLowerCase())
      .get();

    if (!emailDoc.exists) {
      return NextResponse.json({ exists: false });
    }

    const { uid } = emailDoc.data();
    return NextResponse.json({ exists: true, uid });
  } catch (err) {
    // Log the FULL error — visible in Vercel → Functions → Logs
    console.error("check-user-email unhandled error:", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 },
    );
  }
}
