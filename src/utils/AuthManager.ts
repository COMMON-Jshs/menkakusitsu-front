import axios from "axios";
import { parseJWT, redirectToHome } from "./Utility";
import { v1 } from "@common-jshs/menkakusitsu-lib";
import { clearTokens, getRefreshToken, saveTokens } from "./StorageManager";

export const checkTokenExpiration = async (accessToken: string) => {
  const parsedJWT = parseJWT(accessToken);
  if (!parsedJWT) {
    return false;
  }
  const exp: number = parsedJWT.exp;
  if (exp - Date.now() / 1000 < 60) {
    const refreshToken = getRefreshToken();

    if (!refreshToken || !parseJWT(refreshToken)) {
      return true;
    }
    const authHeader = `Bearer ${refreshToken}`;
    const resp = await axios({
      method: "POST",
      url: import.meta.env.VITE_API_PREFIX + "/v1/auth/refresh",
      headers: {
        Authorization: authHeader,
      },
    });
    const result = resp.data as v1.PostRefreshResponse;
    if (result.status >= 0) {
      saveTokens(result.accessToken, result.refreshToken);
      return false;
    } else {
      // console.error(result.message);
      // openConfirmDialog(TITLE.Alert, result.message, onLogout);
      return true;
    }
  }
  return false;
};

export const onLogout = () => {
  clearTokens();
  redirectToHome();
};
