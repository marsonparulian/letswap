"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LogoutButton() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Only run client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });

    // Only attempt navigation on the client side after mounting
    if (isMounted) {
      router.refresh(); // Refresh the page to update UI state
      router.push("/"); // Redirect to home page after logout
    }
  };

  return (
    <button onClick={handleLogout} className="button secondary" type="button">
      Sign out
    </button>
  );
}
