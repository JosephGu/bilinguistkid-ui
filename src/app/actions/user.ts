"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationCode } from "./emailer";
// import cache from "@/app/lib/localCache";
import { redis } from "@/app/lib/redis";
import { AUTH_COOKIE_NAME, createJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

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
    const token = await createJWT(email);
    console.log("login token: ", token);
    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return { success: true, msg: "Login success" };
  } catch (error) {
    return { success: false, msg: `Failed to login: ${error}` };
  }
}

const checkVCode = async (email: string, vCode: string) => {
  const cacheVCode = await redis.get(email);
  console.log("check vcode, cachedVCode,  ", cacheVCode, "vCode:", vCode, "email:", email);
  if (!cacheVCode) {
    throw new Error("Please get verification code first");
  }
  if (cacheVCode !== vCode) {
    throw new Error("Incorrect verification code");
  }
};

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const vCode = formData.get("vCode") as string;

  checkVCode(email, vCode);
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
    const token = await createJWT(email);
    (await cookies()).set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return { success: true, msg: "User created successfully" };
  } catch (error) {
    console.log("error: ", error);
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
}

export async function getVCode(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    throw new Error("Please input email");
  }
  const vCode = crypto.randomInt(100000, 999999).toString();
  console.log("get vode:", vCode, email);
  await redis.set(email, vCode);
  const cachedVCode = await redis.get(email);
  console.log("get vcode, cachedVCode,  ", cachedVCode, "vCode:", vCode, "email:", email);
  const { success, msg } = await sendVerificationCode(email, vCode);
  if (!success) {
    throw new Error(msg || "Failed to send verification code");
  }
  return { success, msg };
}
