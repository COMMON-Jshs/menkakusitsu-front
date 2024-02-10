import { Logout } from "@mui/icons-material";
import { deleteLogout, isSuccessed } from "../../utils/Api";
import { DialogTitle } from "../../utils/Constants";
import { Popup } from "../";
import { ListItemIcon, MenuItem } from "@mui/material";
import { onLogout } from "../../utils/Api";

function LogoutButton() {
  return (
    <MenuItem
      onClick={() => {
        Popup.openYesNoDialog(
          DialogTitle.Info,
          "정말 로그아웃 하시겠습니까?",
          () => {
            Popup.startLoading("로그아웃 중입니다...");
            deleteLogout({}).then((result) => {
              if (isSuccessed(result)) {
                Popup.stopLoading();
                onLogout();
              } else {
                Popup.stopLoading();
                Popup.openConfirmDialog(DialogTitle.Info, result.message);
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

export default LogoutButton;
