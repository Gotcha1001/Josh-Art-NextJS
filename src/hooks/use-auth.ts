"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { auth, onAuthStateChanged } from "@/lib/firebase";

const ADMIN_EMAIL = "admin@example.com"; // TODO: move to an env var once you rotate this

// NOTE password is already "password"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin: user?.email === ADMIN_EMAIL };
}
