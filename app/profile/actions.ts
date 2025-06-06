"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/prisma";
import { authOptions } from "@/app/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeProfile({
  // name,
  slug,
}: {
  // name: string;
  slug: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        slug,
        isProfileComplete: true,
      },
    });

    revalidatePath("/profile");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message.includes("Unique constraint")
          ? "This profile URL is already taken"
          : "Failed to complete profile"
      );
    }
    throw new Error("Failed to complete profile");
  }
}
