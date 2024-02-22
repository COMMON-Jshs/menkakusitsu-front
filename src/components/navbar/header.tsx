import {
  Box,
  Button,
  Menu,
  MenuItem,
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
import { useAuth } from "@/hooks/useAuth";

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
            pl: 4,
            pr: 4,
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };

  return (
    <>
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <Stack flex={1} spacing={4} sx={{ margin: "8px", mt: 4 }}>
          {headerItems.map((navbarItem) => {
            if (navbarItem.menu) {
              return (
                <HeaderMenu
                  key={navbarItem.title}
                  color={navbarItem.color}
                  menu={navbarItem.menu}
                  title={navbarItem.title}
                  onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
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
  onClick?: VoidFunction;
};

function HeaderItem(props: HeaderItemProps) {
  const { permission, href, color, title, newTab, onClick } = props;
  const navigate = useNavigate();
  const { payload } = useAuth();

  if (payload.hasPermission(permission)) {
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
            if (onClick) {
              onClick();
            }
          }}
        >
          <LogoText color={color} variant="h4">
            {title}
          </LogoText>
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
  onClick?: VoidFunction;
};

function HeaderMenu(props: HeaderMenuProps) {
  const { title, color, menu, onClick } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { payload } = useAuth();

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
          if (payload.hasPermission(menu.permission)) {
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
                  if (onClick) {
                    onClick();
                  }
                }}
              >
                {menu.title}
              </MenuItem>
            );
          }
        })}
      </Menu>
    </Box>
  );
}
