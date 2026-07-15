"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "manthanshrivas3@gmail.com" && password === "@Godfather321") {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }

  return { error: "Invalid credentials" };
}
