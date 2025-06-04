import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import SignInForm from "./signin-form";
import type { ClientSafeProvider } from "next-auth/react";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  // Redirect to home if already signed in
  if (session) {
    redirect("/");
  }

  // Create providers object based on configured providers
  const providers: Record<string, ClientSafeProvider> = {};

  // Add Google provider if configured
  if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
    providers.google = {
      id: "google",
      name: "Google",
      type: "oauth",
      signinUrl: "/api/auth/signin/google",
      callbackUrl: "/api/auth/callback/google",
    };
  }

  // Add Facebook provider if configured
  if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
    providers.facebook = {
      id: "facebook",
      name: "Facebook",
      type: "oauth",
      signinUrl: "/api/auth/signin/facebook",
      callbackUrl: "/api/auth/callback/facebook",
    };
  }

  if (Object.keys(providers).length === 0) {
    return <div>No authentication providers available.</div>;
  }

  return <SignInForm providers={providers} />;
}
