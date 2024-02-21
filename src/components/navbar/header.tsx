import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";

import { AccountPanel } from "@/components/panels/AccountPanel";
import { headerItems } from "@/components/navbar/items";
import { Utility } from "@/utils";
import { LogoText } from "@/components/basics";
import Logo from "@/components/basics/Logo";

export function HeaderComponent() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

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
            ml: 4,
            mr: 4,
          }}
        >
          {matches ? <HeaderList /> : <HeaderDrawer />}
        </Box>
      </Paper>
    </>
  );
}

function HeaderList() {
  return (
    <Stack flex={1} direction="row" spacing={8} alignItems="center">
      <Logo />
      {headerItems.map((navbarItem) => {
        if (navbarItem.menu) {
          return (
            <HeaderMenu
              key={navbarItem.title}
              color={navbarItem.color}
              menu={navbarItem.menu}
              title={navbarItem.title}
            />
          );
        } else {
          return (
            <HeaderItem
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
        <AccountPanel />
      </Box>
    </Stack>
  );
}

function HeaderDrawer() {
  const [state, setState] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  return (
    <>
      <Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
        <Stack flex={1} spacing={4} sx={{ margin: "8px", mt: 4 }}>
          {headerItems.map((navbarItem) => {
            if (navbarItem.menu) {
              return (
                <HeaderMenu
                  key={navbarItem.title}
                  color={navbarItem.color}
                  menu={navbarItem.menu}
                  title={navbarItem.title}
                />
              );
            } else {
              return (
                <HeaderItem
                  key={navbarItem.title}
                  permission={navbarItem.permission}
                  href={navbarItem.href}
                  color={navbarItem.color}
                  title={navbarItem.title}
                />
              );
            }
          })}
        </Stack>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconButton color="inherit" onClick={toggleDrawer(true)} edge="start">
          <MenuIcon color="primary" />
        </IconButton>
        <Logo />
        <AccountPanel />
      </Box>
    </>
  );
}

type HeaderItemProps = {
  permission: number;
  href: string;
  color?: string;
  title: string;
  newTab?: boolean;
};

function HeaderItem(props: HeaderItemProps) {
  const { permission, href, color, title, newTab } = props;
  const navigate = useNavigate();

  if (Utility.getPermissionLevel() >= permission) {
    return (
      <Box
        style={{
          display: "inline-block",
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

type HeaderMenuProps = {
  title: string;
  color: string;
  menu: HeaderItemProps[];
};

function HeaderMenu(props: HeaderMenuProps) {
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
      }}
    >
      <Button onClick={openMenu}>
        <LogoText color={color} variant="h4">
          {title}
        </LogoText>
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
