import { ListItemIcon, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";

import { Popup } from "@/components";
import { Api, Constants } from "@/utils";

export function LogoutButton() {
  return (
    <MenuItem
      onClick={() => {
        Popup.openYesNoDialog(
          Constants.DialogTitle.Info,
          "정말 로그아웃 하시겠습니까?",
          () => {
            Popup.startLoading("로그아웃 중입니다...");
            Api.deleteLogout({}).then((result) => {
              if (Api.isSuccessed(result)) {
                Popup.stopLoading();
                Api.onLogout();
              } else {
                Popup.stopLoading();
                Popup.openConfirmDialog(
                  Constants.DialogTitle.Info,
                  result.message
                );
              }
            });
          }
        );
      }}
    >
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      로그아웃
    </MenuItem>
  );
}
