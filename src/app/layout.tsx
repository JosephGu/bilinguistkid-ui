import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import MobileMenu from "@/common/MobileNavigation";
import Navigation from "@/common/Navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
// import { buildApiUrl, API_ENDPOINTS } from "./utils/apiConfig";
// import { cookies } from "next/headers";
import StoreProvider from "./StoreProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bilinguist Kid",
  description: "Language is a skill to acquire and express.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;
  const profile: ProfileState = {
    nickname: "",
    age: 7,
    gender: "",
  };
  // try {
  //   const res = await fetch(buildApiUrl(API_ENDPOINTS.PROFILE.RETRIEVE), {
  //     method: "GET",
  //     cache: "no-cache",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Cookie: `token=${token}`,
  //     },
  //   });

  //   const data = await res.json();
  //   if (data?.profile) {
  //     console.log(data);
  //     const { nickname, birthday, gender } = data?.profile;
  //     let newAge = 7;
  //     if (birthday) {
  //       newAge = new Date().getFullYear() - new Date(birthday).getFullYear();
  //     }
  //     console.log(birthday);
  //     profile = {
  //       nickname,
  //       age: newAge,
  //       gender,
  //     };
  //   }
  // } catch (error) {
  //   console.error("Error retrieving profile:", error);
  // }
  const companySchema = {
    "@context": "http://schema.org",
    "@type": "Organization",
    name: "Bilinguist Kid",
    url: "https://bilinguistkid.cn",
    logo: "https://bilinguistkid.cn/logo5.svg",
  };

  return (
    <html lang="en">
      <Script
        id="schema-script"
        type="application/ld-json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companySchema) }}
      ></Script>

      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col h-vh`}
      >
        <StoreProvider profile={profile}>
          <AppRouterCacheProvider>
            <CssBaseline />
            <Navigation />
            <MobileMenu />
            <main className="flex-1 flex-grow" style={{ flexGrow: 1 }}>
              {children}
            </main>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
