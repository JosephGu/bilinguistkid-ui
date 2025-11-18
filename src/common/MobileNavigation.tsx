"use client";
import { useState } from "react";
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./navigation.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const MobileMenu = () => {
  const t = useTranslations("Navigation");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const pathName = usePathname();
  if (pathName == "/about") {
    return <></>;
  }
  return (
    <div className="mobile-menu">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Image src="/logo6.svg" alt="image" width={160} height={40} />
        </Toolbar>
        <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
          <List component="nav">
            <ListItem onClick={toggleDrawer}>
              <Link href="/">
                <Button>
                  <Typography className="!font-medium">{t("Home")}</Typography>
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/funEarth">
                <Button>
                  <Typography className="!font-medium">
                    {t("FunEarth")}
                  </Typography>
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/lexicon">
                <Button>
                  <Typography className="!font-medium">
                    {t("LexiconTest")}
                  </Typography>
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/literature">
                <Button>
                  <Typography className="!font-medium">
                    {t("Literature")}
                  </Typography>
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/about">
                <Button>
                  <Typography className="!font-medium">{t("About")}</Typography>
                </Button>
              </Link>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    </div>
  );
};
export default MobileMenu;
