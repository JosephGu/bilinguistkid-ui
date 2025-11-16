import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CssBaseline } from "@mui/material";
import MobileMenu from "@/common/MobileNavigation";
import Navigation from "@/common/Navigation";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { NextIntlClientProvider } from "next-intl";
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
  const profile: ProfileState = {
    nickname: "",
    age: 7,
    gender: "",
  };

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
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </main>
          </AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
