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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./navigation.scss";

const MobileMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

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
        </Toolbar>
        <Drawer open={isDrawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem component="button" onClick={toggleDrawer}>
              <ListItemText primary="首页" />
            </ListItem>
            <ListItem component="button" onClick={toggleDrawer}>
              <ListItemText primary="关于" />
            </ListItem>
            <ListItem component="button" onClick={toggleDrawer}>
              <ListItemText primary="联系" />
            </ListItem>
            {/* 可以继续添加更多菜单项 */}
          </List>
        </Drawer>
      </AppBar>
    </div>
  );
};
export default MobileMenu;
