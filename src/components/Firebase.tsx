// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";
import { getDeviceUuid } from "../utils/StorageManager";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { DefaultSnackbar } from "./snackbar";
import { putUserPush, deleteUserPush } from "../utils/Api";
import { Popup } from "./";
import { DialogTitle } from "../utils/Constants";
import { getFirebaseMessaging } from "../utils/FirebaseManager";

function Firebase() {
  const [messaging] = useState(getFirebaseMessaging());
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        enqueueSnackbar("fcm", {
          variant: "default",
          content: (key) => <DefaultSnackbar id={key} payload={payload} />,
        });
      });
    }
  }, [messaging, enqueueSnackbar]);

  return <></>;
}

export default Firebase;
