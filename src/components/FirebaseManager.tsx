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
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { DefaultSnackbar } from "./snackbar";
import { putUserPush, deleteUserPush } from "../utils/Api";
import { openConfirmDialog } from "./popup";
import { DialogTitle } from "../utils/Constant";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzQ_bR2dD4V1vdWoPViPXll6imyCajNCo",
  authDomain: "menkakusitsu-2d69d.firebaseapp.com",
  projectId: "menkakusitsu-2d69d",
  storageBucket: "menkakusitsu-2d69d.appspot.com",
  messagingSenderId: "382894730110",
  appId: "1:382894730110:web:ebf27b97399bec80c2612f",
  measurementId: "G-TE638S9GQ9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
let messaging: Messaging | undefined;
try {
  messaging = getMessaging();
} catch (error) {
  console.error(`Error: Failed to initialize Firebase Messaging for ${error}`);
}

function FirebaseManager() {
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
  }, [enqueueSnackbar]);

  return <></>;
}

export default FirebaseManager;

export const getPushToken = async (): Promise<boolean> => {
  if (messaging) {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          "BG_LNhZiWNMNjuR-PTiY8pLm0SJ8itD0lVcEr3cRtkhBEOtzcDbiUVVQ3i5ZERbsmw5Q8kPDqJ1KpvvYF7nKcbk",
      });
      if (token) {
        await putUserPush({
          pushToken: token,
          deviceId: getDeviceUuid(),
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      openConfirmDialog(
        DialogTitle.Alert,
        "Failed to get FCM token for reason: " + e
      );
      return false;
    }
  }
  return false;
};

export const deletePushToken = async (): Promise<boolean> => {
  if (messaging) {
    try {
      const result = await deleteToken(messaging);
      if (result) {
        await deleteUserPush({
          devcieId: getDeviceUuid(),
        });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
      openConfirmDialog(
        DialogTitle.Alert,
        "Failed to delete FCM token for reason: " + e
      );
      return false;
    }
  }
  return false;
};

export const logPageView = () => {
  logEvent(analytics, "screen_view", {
    firebase_screen: window.location.pathname,
    firebase_screen_class: window.location.pathname,
  });
  logEvent(analytics, "page_view", {
    page_title: window.location.pathname,
    page_location: window.location.pathname,
    page_path: window.location.pathname,
  });
};
