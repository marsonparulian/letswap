"use client";

import { getProviders, signIn, ClientSafeProvider } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    fetchProviders();
  }, []);

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign In</h1>
      <nav className="auth-nav">
        {providers &&
          Object.values(providers).map((provider: ClientSafeProvider) => (
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
