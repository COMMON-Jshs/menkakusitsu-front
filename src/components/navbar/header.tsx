import { Box, Button, Menu, MenuItem, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AccountPanel } from "@/components";
import { Logo } from "@/components/navbar/logo";
import { headerItems } from "@/components/navbar/items";
import { Utility } from "@/utils";

type NavbarItemProps = {
  permission: number;
  href: string;
  color?: string;
  title: string;
  newTab?: boolean;
};

type NavbarMenuProps = {
  title: string;
  color: string;
  menu: NavbarItemProps[];
};

function NavbarMenu(props: NavbarMenuProps) {
  const { title, color, menu } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();

  function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  return (
    <Box
      style={{
        display: "inline-block",
        marginLeft: "5rem",
      }}
    >
      <Button onClick={openMenu}>
        <Typography
          sx={{ fontFamily: "DesignHouseB" }}
          color={color}
          variant="h4"
        >
          {title}
        </Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {menu.map((menu) => {
          if (Utility.getPermissionLevel() >= menu.permission) {
            return (
              <MenuItem
                key={menu.title}
                onClick={() => {
                  if (menu.newTab) {
                    Utility.openInNewTab(menu.href);
                  } else {
                    navigate(menu.href);
                  }
                  closeMenu();
                }}
              >
                {menu.title}
              </MenuItem>
            );
          } else {
            return <div key={menu.title}></div>;
          }
        })}
      </Menu>
    </Box>
  );
}

function NavbarButton(props: NavbarItemProps) {
  const { permission, href, color, title, newTab } = props;
  const navigate = useNavigate();

  if (Utility.getPermissionLevel() >= permission) {
    return (
      <Box
        style={{
          display: "inline-block",
          marginLeft: "5rem",
        }}
      >
        <Button
          onClick={() => {
            if (newTab) {
              Utility.openInNewTab(href);
            } else {
              navigate(href);
            }
          }}
        >
          <Typography
            sx={{ fontFamily: "DesignHouseB" }}
            color={color}
            variant="h4"
          >
            {title}
          </Typography>
        </Button>
      </Box>
    );
  } else {
    return <></>;
  }
}

function HeaderItems() {
  return (
    <>
      <Logo />
      {headerItems.map((navbarItem) => {
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

export function HeaderComponent() {
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
          <HeaderItems />
        </Box>
      </Paper>
    </>
  );
}
