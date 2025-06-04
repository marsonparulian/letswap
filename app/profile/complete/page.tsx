import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import ProfileForm from "@/app/profile/complete/profile-form";
import styles from "@/app/profile/profile-form.module.css";

export default async function ProfileCompletePage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // If profile is already complete, redirect to callback URL or home
  if (session.user.isProfileComplete) {
    redirect(searchParams.callbackUrl || "/");
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
        callbackUrl={searchParams.callbackUrl}
      />
    </div>
  );
}
