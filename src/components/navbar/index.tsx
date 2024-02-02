import { Box, Paper, useMediaQuery } from "@mui/material";
import { NavbarButton, NavbarMenu } from "./NavbarItem";
import Logo from "./Logo";
import React from "react";
import { AccountPanel } from "../panel";
import { navbarItems } from "./items";

interface NavbarItemsProps {
  isMinWidth: boolean;
}

function NavbarItems(props: NavbarItemsProps) {
  const { isMinWidth } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // if (isMinWidth) {
  return (
    <>
      <Logo />
      {navbarItems.map((navbarItem) => {
        if (navbarItem.menu) {
          return (
            <NavbarMenu
              key={navbarItem.title}
              color={navbarItem.color}
              menu={navbarItem.menu}
              title={navbarItem.title}
            />
          );
        } else {
          return (
            <NavbarButton
              key={navbarItem.title}
              permission={navbarItem.permission}
              href={navbarItem.href}
              color={navbarItem.color}
              title={navbarItem.title}
              // newTab={navbarItem.newTab}
            />
          );
        }
      })}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <Box
          style={{
            display: "inline-block",
            marginRight: "64px",
          }}
        >
          <AccountPanel />
        </Box>
      </Box>
    </>
  );
  // } else {
  //     return (
  //         <Toolbar>
  //             <IconButton
  //                 color="inherit"
  //                 aria-label="open drawer"
  //                 edge="start"
  //                 onClick={handleDrawerToggle}
  //                 sx={{ mr: 2, display: { sm: "none" } }}
  //             >
  //                 <MenuIcon />
  //             </IconButton>
  //             <Logo />
  //         </Toolbar>
  //     );
  // }
}

function FixedNavbar() {
  const isMinWidth = useMediaQuery("(min-width:900px)");

  return (
    <>
      <Box bgcolor="primary.dark" height="16px" />
      <Paper elevation={3}>
        <Box
          bgcolor="white"
          height="80px"
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "0px auto",
          }}
        >
          <NavbarItems isMinWidth={isMinWidth} />
        </Box>
      </Paper>
    </>
  );
}

export default FixedNavbar;
