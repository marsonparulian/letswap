"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh(); // Refresh the page to update UI state
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <button onClick={handleLogout} className="button secondary" type="button">
      Sign out
    </button>
  );
}
