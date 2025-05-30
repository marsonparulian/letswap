"use client";

import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errors: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link was invalid or has expired.",
    Default: "An error occurred while trying to sign in.",
  };

  const errorMessage = error ? errors[error] ?? errors.Default : errors.Default;

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
      <button
        onClick={() => (window.location.href = "/auth/signin")}
        style={{
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </main>
  );
}
