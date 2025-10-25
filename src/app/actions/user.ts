"use server";

import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      return { success: false, msg: "User not found" };
    }
    if (user.password !== password) {
      return { success: false, msg: "Incorrect password" };
    }
    return { success: true, msg: null };
  } catch (error) {
    return { success: false, msg: `Failed to login: ${error}` };
  }
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("All fields are required");
  }
  try {
    await prisma.user.create({
      data: {
        email,
        password,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    console.log("create user success", email);
    return { data: { email, password }, error: null };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // throw new Error("Email already exists");
      return { data: null, error: "Email already exists" };
    }
    return { data: null, error: "Failed to create user" };
  }

  // redirect("/login");
}
