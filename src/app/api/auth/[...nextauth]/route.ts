import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { fetchWechatUserInfo, WechatProfile, WechatProvider } from "./wechat-provider";

export const authOptions: NextAuthOptions = {
  providers: [
    WechatProvider({
      clientId: process.env.WECHAT_APP_ID!,
      clientSecret: process.env.WECHAT_APP_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "wechat") {
        const user = await fetchWechatUserInfo(profile as WechatProfile);
        if (!user) {
          return false;
        }
        return true;
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
