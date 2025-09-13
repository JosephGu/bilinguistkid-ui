import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("no token");

    return Response.redirect(new URL("/login", req.url));
  } 
}

export const config = {
  matcher: ["/", "/register"],
};
