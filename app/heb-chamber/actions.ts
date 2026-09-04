"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HEB_ACCESS_COOKIE, hebAccessToken, verifyHebPassword } from "@/lib/heb-access";

export async function unlockHebChamber(formData: FormData) {
  const password = String(formData.get("password") || "");

  if (!verifyHebPassword(password)) {
    redirect("/heb-chamber?error=invalid");
  }

  const store = await cookies();
  store.set(HEB_ACCESS_COOKIE, hebAccessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/heb-chamber",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/heb-chamber");
}
