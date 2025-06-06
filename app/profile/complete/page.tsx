import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import ProfileForm from "@/app/profile/complete/profile-form";
import styles from "@/app/profile/complete/profile-form.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Profile - LetSwap",
  description: "Complete your profile to start using LetSwap",
};

interface PageProps {
  // params: { slug: string };
  searchParams: Promise<{
    // [key: string]: string | undefined;
    callbackUrl: string;
  }>;
}

export default async function ProfileCompletePage({
  // params,
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl;

  // If profile is already complete, redirect to callback URL or home
  if (session.user.isProfileComplete) {
    // const callbackUrl = searchParams.callbackUrl as string | undefined;
    redirect(callbackUrl || "/");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Complete Your Profile</h1>
      <ProfileForm
        initialData={{
          name: session.user.name || "",
          slug: session.user.slug || "",
          email: session.user.email || "",
        }}
        callbackUrl={callbackUrl}
      />
    </div>
  );
}
