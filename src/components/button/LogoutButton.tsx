import { Logout } from "@mui/icons-material";
import { deleteLogout, isSuccessed } from "../../utils/Api";
import { DialogTitle } from "../../utils/Constants";
import {
  closeWaitDialog,
  openConfirmDialog,
  openWaitDialog,
  openYesNoDialog,
} from "../popup";
import { ListItemIcon, MenuItem } from "@mui/material";
import { onLogout } from "../../utils/Api";

function LogoutButton() {
  return (
    <MenuItem
      onClick={() => {
        openYesNoDialog(DialogTitle.Info, "정말 로그아웃 하시겠습니까?", () => {
          openWaitDialog(DialogTitle.Info, "로그아웃 중입니다...");
          deleteLogout({}).then((result) => {
            if (isSuccessed(result)) {
              closeWaitDialog();
              onLogout();
            } else {
              closeWaitDialog();
              openConfirmDialog(DialogTitle.Info, result.message);
            }
          });
        });
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
