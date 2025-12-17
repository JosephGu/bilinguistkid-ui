import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.NEXTAUTH_SECRET;

if (!secretKey) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

const Algorithm = "HS256";

export type JWT = {
  email: string;
  role: string;
};

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
    throw new Error("INVALID_TOKEN", { cause: error });
  }
}

export async function getInfoFromJWT(): Promise<JWT> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("NO_TOKEN");
  }
  const payload = await verifyJWT(token);
  const { email, role } = payload as JWT;
  console.log("email: ", email);
  if (!email) {
    throw new Error("NO_EMAIL");
  }
  return { email, role };
}

export const AUTH_COOKIE_NAME = "token";
