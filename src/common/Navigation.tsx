"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import { Face, Face2, Face3, Face4, Face5, Face6 } from "@mui/icons-material";
import "./navigation.scss";
import Link from "next/link";

function Navigation() {

  return (
    <div className="navigation">
      <div className="logo">
        <Image src="/logo2.svg" alt="image" width={200} height={50} />
      </div>
      <div className="nav">
       <Button><Link color="inherit" href="/">
          Home
        </Link></Button>
        <Button><Link color="inherit" href="/funEarth">
          Fun Earth
        </Link></Button>
        <Button><Link color="inherit  " href="/about">
          About
        </Link></Button>
        <Button color="inherit">
          <Face4 />
        </Button>
      </div>
    </div>
  );
}
export default Navigation;
