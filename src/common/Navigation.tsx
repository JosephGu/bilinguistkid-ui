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
        <Button color="inherit">Home</Button>
        <Button color="inherit">Fun Earth</Button>
        <Button color="inherit">About</Button>
        <Button color="inherit">
          <Face4 />
        </Button>
      </div>
    </div>
  );
}
export default Navigation;
