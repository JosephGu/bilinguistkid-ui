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
        <Link color="inherit" href="/">
          <Button sx={{}} color="inherit">Home</Button>
        </Link>
        <Link color="inherit" href="/funEarth">
          <Button color="inherit">Fun Earth</Button>
        </Link>
        <Link color="inherit" href="/topicGen">
          <Button color="inherit">Topic Generator</Button>
        </Link>
        <Link color="inherit  " href="/about">
          <Button color="inherit">About</Button>
        </Link>
        <Button color="inherit">
          <Face4 />
        </Button>
      </div>
    </div>
  );
}
export default Navigation;
