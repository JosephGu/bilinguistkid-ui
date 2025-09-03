import { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log("no token");

    return Response.redirect(new URL("/login", req.url));
  } 
  
  // else {
  //   const res = await fetch("http://localhost:3000/api/v1/auth/authenticate", {
  //     method: "GET",
  //   });
  //   if (res.ok) {
  //     console.log("ok", res.status);
  //     return Response.redirect(new URL("/home", req.url));
  //   } else {
  //     console.log("not ok", res.status);
  //     return Response.redirect(new URL("/login", req.url));
  //   }
  // }
}

export const config = {
  matcher: ["/", "/register"],
};
