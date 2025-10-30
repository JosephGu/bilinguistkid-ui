import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.NEXTAUTH_SECRET;

if (!secretKey) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const Algorithm = "HS256";

export async function createJWT(email: string) {
  return new SignJWT({ email, role: "user" })
    .setProtectedHeader({ alg: Algorithm })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(new TextEncoder().encode(secretKey));
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey)
    );
    return payload;
  } catch (error) {
    throw new Error("Invalid token", { cause: error });
  }
}

export const AUTH_COOKIE_NAME = "token";
