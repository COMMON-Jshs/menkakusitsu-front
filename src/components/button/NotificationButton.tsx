import { NotificationsActive, NotificationsOff } from "@mui/icons-material";
import { CircularProgress, ListItemIcon, MenuItem } from "@mui/material";
import { useState } from "react";

import { Firebase } from "@/components";

export function NotificationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationOn, setIsNotificationOn] = useState(
    Firebase.getPushApproved()
  );

  return (
    <MenuItem
      onClick={() => {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        if (isNotificationOn) {
          Firebase.deletePushToken().then((successed) => {
            if (successed) {
              Firebase.setPushApproved(false);
              setIsNotificationOn(false);
            }
            setIsLoading(false);
          });
        } else {
          Firebase.createPushToken().then((successed) => {
            if (successed) {
              Firebase.setPushApproved(true);
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
