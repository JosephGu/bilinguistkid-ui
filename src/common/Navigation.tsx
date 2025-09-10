"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import { Face, Face2, Face3, Face4, Face5, Face6 } from "@mui/icons-material";
import "./navigation.scss";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathName = usePathname();
  if (pathName == "/about") {
    return <></>;
  }
  return (
    <div className="navigation">
      <div className="logo">
        <Image src="/logo2.svg" alt="image" width={200} height={50} />
      </div>
      <div className="nav">
        <Button color="inherit">主页</Button>
        <Button color="inherit">案例</Button>
        <Button color="inherit">关于</Button>
        <Button color="inherit">注册</Button>
        <Button color="inherit">登录</Button>
        <Button color="inherit">
          <Face4 />
        </Button>
      </div>
    </div>
  );
}
export default Navigation;
