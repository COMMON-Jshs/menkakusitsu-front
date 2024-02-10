import { Box, Paper } from "@mui/material";
import { NavbarButton, NavbarMenu } from "./NavbarItem";
import Logo from "./Logo";
import { AccountPanel } from "../panel";
import { navbarItems } from "./items";

function NavbarItems() {
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
}

function FixedNavbar() {
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
          <NavbarItems />
        </Box>
      </Paper>
    </>
  );
}

export default FixedNavbar;
