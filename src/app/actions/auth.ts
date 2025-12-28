"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

interface SyncUserData {
  firebaseUid: string;
  email: string;
  name?: string;
  photoURL?: string;
}

export async function syncUser(data: SyncUserData) {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { firebaseUid: data.firebaseUid }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          firebaseUid: data.firebaseUid,
          email: data.email,
          name: data.name,
          photoURL: data.photoURL,
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { firebaseUid: data.firebaseUid },
        data: {
          name: data.name,
          photoURL: data.photoURL,
        }
      });
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
      photoURL: user.photoURL || undefined,
      firebaseUid: user.firebaseUid,
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error syncing user:", error);
    return { success: false, error: "Failed to sync user" };
  }
}

export async function signOutAction() {
  await deleteSession();
  redirect("/login");
}