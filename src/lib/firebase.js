import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxS077Cy3hTRZeJM8TqpUnlDCECmB6eUo",
  authDomain: "savejar-beed9.firebaseapp.com",
  projectId: "savejar-beed9",
  storageBucket: "savejar-beed9.firebasestorage.app",
  messagingSenderId: "508003062053",
  appId: "1:508003062053:web:a5b73c5a9cd140f1dacacc",
  measurementId: "G-VYF7VHXP6J",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
