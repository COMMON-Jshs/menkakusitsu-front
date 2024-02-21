// Import the functions you need from the SDKs you need
import { onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import { DefaultSnackbar } from "@/components/snackbar";
import { Firebase } from "@/utils";

export function FirebaseComponent() {
  const [messaging] = useState(Firebase.getFirebaseMessaging());
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
