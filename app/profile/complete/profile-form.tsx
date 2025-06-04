"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SlugInputComponent from "@/app/modules/slug-input/slug-input-component";
import { completeProfile } from "@/app/profile/actions";
import styles from "./profile-form.module.css";
import { checkSlugForUserProfile } from "@/app/modules/slug-input/slug-input-actions";

interface ProfileFormProps {
  initialData: {
    name: string;
    slug: string;
    email: string;
  };
  callbackUrl?: string;
}

export default function ProfileForm({
  initialData,
  callbackUrl,
}: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  //   const { slug, slugInput, isSlugValid } = useSlugInput({
  //     initialValue: "",
  //     generateFrom: initialData.name,
  //   });

  // Get slug from the input 'input[name="name"]'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // if (!isSlugValid) {
    //   setError("Please enter a valid profile URL");
    //   return;
    // }

    // Get slug from element [name='slug']
    const slug =
      (document.querySelector('input[name="slug"]') as HTMLInputElement)
        ?.value || "";

    try {
      await completeProfile({
        name: initialData.name,
        slug: slug,
      });

      // Redirect to callback URL or home
      router.push(callbackUrl || "/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete profile"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Name</label>
        <input
          type="text"
          value={initialData.name}
          disabled
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <SlugInputComponent
          slugCheckFunction={checkSlugForUserProfile}
          propsValidationResult={{
            slug: initialData.slug || "",
            isValid: null,
            isUnique: null,
            message: "",
            isValidating: false,
            isError: false,
          }}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          value={initialData.email}
          disabled
          className={styles.input}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.button}>
        Complete Profile
      </button>
    </form>
  );
}
