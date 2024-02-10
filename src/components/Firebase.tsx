// Import the functions you need from the SDKs you need
import { onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { DefaultSnackbar } from "./snackbar";
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
