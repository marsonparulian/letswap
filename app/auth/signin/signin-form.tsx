"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import type { ClientSafeProvider } from "next-auth/react";

interface SignInFormProps {
  providers: Record<string, ClientSafeProvider>;
}

export default function SignInForm({ providers }: SignInFormProps) {
  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign In</h1>
      <nav className="auth-nav">
        {Object.values(providers).map((provider: ClientSafeProvider) => (
          <button
            key={provider.id}
            onClick={() => signIn(provider.id)}
            className="auth-provider-button"
          >
            {provider.name === "Google" && (
              <Image src="/google.svg" alt="Google" width={20} height={20} />
            )}
            {provider.name === "Facebook" && (
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
              />
            )}
            <span>Sign in with {provider.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
