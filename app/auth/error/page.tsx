/**
 * Authentication Error Page Component
 *
 * USE CASES:
 * - Displaying user-friendly auth error messages
 * - Handling NextAuth error redirects
 * - Converting error codes to readable messages
 * - Providing recovery paths after auth failures
 * - Supporting provider-specific error contexts
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
