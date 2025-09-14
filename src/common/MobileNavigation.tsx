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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./navigation.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const MobileMenu = () => {
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
             <Image src="/logo3.svg" alt="image" width={120} height={30} />
          </IconButton>
        </Toolbar>
        <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
          <List component="nav">
            <ListItem onClick={toggleDrawer}>
              <Link href="/">
                <Button>
                  <ListItemText primary="Home" />
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/funEarth">
                <Button>
                  <ListItemText primary="Fun Earth" />
                </Button>
              </Link>
            </ListItem>
            <ListItem onClick={toggleDrawer}>
              <Link href="/about">
                <Button>
                  <ListItemText primary="About" />
                </Button>
              </Link>
            </ListItem>
            {/* 可以继续添加更多菜单项 */}
          </List>
        </Drawer>
      </AppBar>
    </div>
  );
};
export default MobileMenu;
