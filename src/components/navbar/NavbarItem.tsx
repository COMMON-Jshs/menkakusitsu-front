import { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPermissionLevel, openInNewTab } from "../../utils/Utility";

interface NavbarItemProps {
  permission: number;
  href: string;
  color?: string;
  title: string;
  newTab?: boolean;
}

interface NavbarMenuProps {
  title: string;
  color: string;
  menu: NavbarItemProps[];
}

export function NavbarMenu(props: NavbarMenuProps) {
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
          if (getPermissionLevel() >= menu.permission) {
            return (
              <MenuItem
                key={menu.title}
                onClick={() => {
                  if (menu.newTab) {
                    openInNewTab(menu.href);
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

export function NavbarButton(props: NavbarItemProps) {
  const { permission, href, color, title, newTab } = props;
  const navigate = useNavigate();

  if (getPermissionLevel() >= permission) {
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
              openInNewTab(href);
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
