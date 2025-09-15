import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { buildApiUrl, API_ENDPOINTS } from "@/app/utils/apiConfig";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const requestNextUrl = req.nextUrl;


  if (!token) {
    console.log("no token");

    return Response.redirect(new URL("/login", req.url));
  } else {
    console.log("token exists");
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.PROFILE.RETRIEVE), {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        return Response.redirect(new URL("/login", req.url));
      } else if (res.status === 200 && requestNextUrl.pathname !== "/createProfile") {
        const data = await res.json();
        if (
          data &&
          data.profile &&
          (!data.profile.nickname ||
            !data.profile.birthday ||
            !data.profile.gender)
        ) {
          return Response.redirect(new URL("/createProfile", req.url));
        }
      }
    } catch (error) {
      console.error("Error retrieving profile:", error);
    }
  }
}

export const config = {
  matcher: ["/", "/register", "/createProfile", "/about", "/funEarth"],
};
