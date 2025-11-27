"use client";

import { Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import "./navigation.scss";
import Link from "next/link";
import { AccountCircle, Translate } from "@mui/icons-material";
import { useTranslations } from "next-intl";

function Navigation() {
  const t = useTranslations("Navigation");

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
              {t("Home")}
            </Button>
          </Link>
          <Link color="inherit" href="/funEarth">
            <Button color="inherit">{t("FunEarth")}</Button>
          </Link>
          <Link color="inherit" href="/lexicon">
            <Button color="inherit">{t("LexiconTest")}</Button>
          </Link>
          <Link color="inherit" href="/literature">
            <Button color="inherit">{t("Literature")}</Button>
          </Link>
          <Link color="inherit  " href="/about">
            <Button color="inherit">{t("About")}</Button>
          </Link>
          <Link color="inherit  " href="/account">
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
export default Navigation;
