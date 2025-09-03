import Image from "next/image";
import { buildApiUrl, API_ENDPOINTS } from "./utils/apiConfig";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import Profile from "./common/Profile";

async function retrieveProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let redirectPath = "";
  try {
    const res = await fetch(buildApiUrl(API_ENDPOINTS.PROFILE.RETRIEVE), {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });

    if (!res.ok && res.status === 403) {
      redirectPath = "/login";
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return null;
  } finally {
    if (redirectPath) {
      redirect(redirectPath, RedirectType.replace);
    }
  }
}

async function Home() {
  const profile = await retrieveProfile();
  const { nickname = "", birthday = "", gender = "" } = profile;

  return (
    <>
      <Image
        src="/bg2160.webp"
        alt="image"
        width={1920}
        height={1042}
        layout="responsive"
      />
      <Profile open={!nickname || !birthday || !gender}  />
    </>
  );
}

export default Home;
