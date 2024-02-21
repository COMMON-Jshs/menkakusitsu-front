import { TokenPayload } from "@common-jshs/menkakusitsu-lib";
import { create } from "zustand";

import { Storage, Utility } from "@/utils";
import { getTokenPayload } from "@/utils/Utility";

type AuthProps = {
  payload: TokenPayload;
};

export const useAuth = create<AuthProps>(() => ({
  payload: getTokenPayload(),
}));

export function login(accessToken: string | null) {
  const payload = Utility.parseJWT(accessToken);
  useAuth.setState({
    payload: payload,
  });
}

export function logout() {
  useAuth.setState({
    payload: new TokenPayload(),
  });
}

const accessToken = Storage.getAccessToken();
login(accessToken);
