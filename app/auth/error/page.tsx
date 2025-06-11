/**
 * Authentication Error Page Component
 *
 * MOTIVATION:
 * - Provide users with clear, friendly error messages during authentication failures
 * - Maintain consistent error presentation across the application
 * - Integrate with the standardized auth error system
 * - Offer users a path to recover from authentication errors
 * - Support different error scenarios from various providers
 *
 * USAGE:
 * - This page is automatically shown when NextAuth redirects to /auth/error
 * - Error codes and provider information are extracted from URL parameters
 * - Error messages are generated from our standardized error mapping system
 * - Users are given a clear action to retry authentication
 */
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { mapNextAuthError } from "@/app/lib/errors/auth-errors";

/**
 * Component to display authentication errors
 * Uses our standardized error handling system
 */
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const provider = searchParams.get("provider") || undefined;

  // Map the error string to our standardized AuthError type
  const authError = errorCode
    ? mapNextAuthError(errorCode, provider)
    : mapNextAuthError("Default");

  const errorMessage = authError.message;

  return (
    <main
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#dc2626", marginBottom: "16px" }}>
        Authentication Error
      </h1>
      <p style={{ marginBottom: "24px" }}>{errorMessage}</p>
      <a
        href="/auth/signin"
        style={{
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
          textDecoration: "none",
          display: "inline-block",
          borderRadius: "4px",
        }}
      >
        Try Again
      </a>
    </main>
  );
}

export default function AuthError() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
