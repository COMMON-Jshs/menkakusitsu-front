import { NotificationsActive, NotificationsOff } from "@mui/icons-material";
import { CircularProgress, ListItemIcon, MenuItem } from "@mui/material";
import { useState } from "react";
import { deletePushToken, getPushToken } from "../FirebaseManager";
import { getPushApproved, setPushApproved } from "../../utils/PushManager";

function NotificationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(getPushApproved());

  return (
    <MenuItem
      onClick={() => {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        if (isNotificationOn) {
          deletePushToken().then((successed) => {
            if (successed) {
              setPushApproved(false);
              setIsNotificationOn(false);
            }
            setIsLoading(false);
          });
        } else {
          getPushToken().then((successed) => {
            if (successed) {
              setPushApproved(true);
              setIsNotificationOn(true);
            }
            setIsLoading(false);
          });
        }
      }}
    >
      {isNotificationOn ? (
        <>
          <ListItemIcon>
            {isLoading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "primary.dark",
                  zIndex: 1,
                }}
              />
            ) : (
              <NotificationsActive fontSize="small" />
            )}
          </ListItemIcon>
          알림 켜짐
        </>
      ) : (
        <>
          <ListItemIcon>
            {isLoading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "primary.dark",
                  zIndex: 1,
                }}
              />
            ) : (
              <NotificationsOff fontSize="small" />
            )}
          </ListItemIcon>
          알림 꺼짐
        </>
      )}
    </MenuItem>
  );
}

export default NotificationButton;
