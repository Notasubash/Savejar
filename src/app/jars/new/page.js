"use client";

import { useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewJar() {
  const router = useRouter();

  // Jar fields
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState("#ffd000");

  // Shared emails array
  const [emailInput, setEmailInput] = useState("");
  const [sharedEmails, setSharedEmails] = useState([]);

  const [loading, setLoading] = useState(false);

  // Add email to list
  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;

    if (!sharedEmails.includes(email)) {
      setSharedEmails([...sharedEmails, email]);
    }

    setEmailInput("");
  };

  // Remove email
  const removeEmail = (email) => {
    setSharedEmails(sharedEmails.filter((e) => e !== email));
  };

  // Create jar
  const handleCreate = async () => {
    if (!name || !goal) {
      alert("Jar Name and Goal are required");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "jars"), {
        name: name.trim(),
        goal: Number(goal),
        deadline: deadline || null,
        color,

        sharedWith: sharedEmails, // array of emails

        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (e) {
      console.error("Create jar error:", e);
      alert("Failed to create jar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>Create New Jar</h2>

      {/* Jar Name */}
      <div style={{ marginBottom: 12 }}>
        <label>Jar Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Emergency Fund"
          style={{ width: "100%" }}
        />
      </div>

      {/* Goal */}
      <div style={{ marginBottom: 12 }}>
        <label>Goal Amount *</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="50000"
          style={{ width: "100%" }}
        />
      </div>

      {/* Deadline */}
      <div style={{ marginBottom: 12 }}>
        <label>Deadline (Optional)</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Color */}
      <div style={{ marginBottom: 12 }}>
        <label>Jar Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      {/* Share Section */}
      <div style={{ marginBottom: 12 }}>
        <label>Share with (Email)</label>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="friend@email.com"
            style={{ flex: 1 }}
          />
          <button onClick={addEmail}>Add</button>
        </div>

        {/* Email List */}
        <div style={{ marginTop: 8 }}>
          {sharedEmails.map((email) => (
            <div
              key={email}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                padding: 6,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              <span>{email}</span>
              <button onClick={() => removeEmail(email)}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Jar"}
      </button>
    </div>
  );
}
