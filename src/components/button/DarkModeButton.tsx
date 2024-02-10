import { ListItemIcon, MenuItem } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useContext } from "react";

import { ThemeContext } from "../theme/ThemeContext";

function DarkModeButton() {
  const { style, toggleStyle } = useContext(ThemeContext)!;

  return (
    <MenuItem
      onClick={() => {
        toggleStyle();
      }}
    >
      {style == "light" ? (
        <>
          <ListItemIcon>
            <LightMode fontSize="small" />
          </ListItemIcon>
          라이트모드
        </>
      ) : (
        <>
          <ListItemIcon>
            <DarkMode fontSize="small" />
          </ListItemIcon>
          다크모드
        </>
      )}
    </MenuItem>
  );
}

export default DarkModeButton;
