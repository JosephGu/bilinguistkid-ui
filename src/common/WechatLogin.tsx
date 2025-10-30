"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@mui/material";

export default function WechatLogin() {
  return (
    <Button variant="contained" color="primary" onClick={() => signIn("wechat",{
        callbackUrl: "bilinguistkid.cn" + '/',
    })}>
      Wechat Login
    </Button>
  );
}