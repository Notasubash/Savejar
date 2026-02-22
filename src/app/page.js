"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();

        if (data?.firstLogin) {
          router.push("/welcome");
        } else {
          router.push("/dashboard");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return <p>Loading...</p>;
}
