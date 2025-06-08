"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// Session inactivity timeout duration (in milliseconds)
// This is separate from the JWT expiry configured in auth.ts
const SESSION_INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export default function SessionManager() {
  const {
    // data: session,
    status,
    update,
  } = useSession();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Track user activity
  useEffect(() => {
    if (status !== "authenticated") return;

    // Update last activity timestamp on user interaction
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [status]);

  // Handle session refresh based on activity
  useEffect(() => {
    if (status !== "authenticated") return;

    // Set up interval to check for session refresh needs
    const sessionCheckInterval = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivity;

      // If user has been active, refresh the session
      if (inactiveTime < SESSION_INACTIVITY_TIMEOUT) {
        // NextAuth's update() will trigger the jwt callback with trigger="update"
        // This will refresh the session as configured in auth.ts
        update();
        console.log("Session refreshed due to user activity");
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(sessionCheckInterval);
  }, [lastActivity, status, update]);

  // This component doesn't render anything
  return null;
}
