"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteAccount() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Deleting the user will cascade and delete their profile, accounts, sessions, etc.
    await prisma.user.delete({
      where: { id: session.user.id }
    });

    return { success: true };
  } catch (error) {
    console.error("Delete Account Error:", error);
    return { error: "Failed to delete account. Please try again or contact support." };
  }
}
