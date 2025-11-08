"use client";

import { Button, Box } from "@mui/material";
import Image from "next/image";
import "./navigation.scss";
import Link from "next/link";

function Navigation() {
  return (
    <Box className="navigation p-2 pl-5 pr-5">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Box className="logo">
          <Link href="/">
            <Image src="/logo5.svg" alt="image" width={200} height={50} />
          </Link>
        </Box>
        <Box className="nav">
          <Link color="inherit" href="/">
            <Button sx={{}} color="inherit">
              Home
            </Button>
          </Link>
          <Link color="inherit" href="/funEarth">
            <Button color="inherit">Fun Earth</Button>
          </Link>
          <Link color="inherit" href="/lexicon">
            <Button color="inherit">Lexicon Test</Button>
          </Link>
          {/* <Link color="inherit" href="/topicGen">
          <Button color="inherit">Topic Generator</Button>
        </Link> */}
          <Link color="inherit  " href="/about">
            <Button color="inherit">About</Button>
          </Link>
        </Box>
        {/* <Button color="inherit">
          <Face4 />
        </Button> */}
      </Box>
    </Box>
  );
}
export default Navigation;
