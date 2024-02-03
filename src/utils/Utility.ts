import { Permission, TokenPayload } from "@common-jshs/menkakusitsu-lib";
import { LoadableComponent } from "@loadable/component";
import { SHA3 } from "sha3";
import { Buffer } from "buffer";
import dayjs from "dayjs";

import { topbar } from "@/components/topbar";
import { getAccessToken } from "@/utils/StorageManager";

export const getDayInfo = () => {
  const day = dayjs();
  return {
    year: day.year(),
    month: day.month() + 1,
    date: day.date(),
  };
};

export const dynamicLoader = async (component: LoadableComponent<unknown>) => {
  topbar.show();
  component.preload();
  topbar.hide();
  return null;
};

export const dayToString = (day: number) => {
  if (day < 0 || day > 7) {
    return null;
  }
  switch (day) {
    case 0:
    case 7:
      return "일";
    case 1:
      return "월";
    case 2:
      return "화";
    case 3:
      return "수";
    case 4:
      return "목";
    case 5:
      return "금";
    case 6:
      return "토";
  }
  return null;
};

export const arrayRemove = <T>(array: Array<T>, item: T): Array<T> => {
  const index = array.indexOf(item);
  return arrayRemoveAt<T>(array, index);
};

export const arrayRemoveAt = <T>(array: Array<T>, index: number): Array<T> => {
  if (index > -1) {
    return array.splice(index, 1);
  }
  return [];
};

export const validateEmail = (email: string): boolean => {
  const regex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  return regex.test(email);
};

export const getParameter = (
  key: string,
  defaultValue: string = ""
): string => {
  const result = new URLSearchParams(window.location.search).get(key);
  if (result) {
    return result;
  } else {
    return defaultValue;
  }
};

export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener");
};

export const getPermissionLevel = () => {
  const payload = getTokenPayload();
  if (!payload) {
    return Permission.Guest;
  }
  return payload.permission;
};

export const hasPermissionLevel = (permission: number) => {
  const payload = getTokenPayload();
  if (!payload) {
    return false;
  }
  return payload.permission >= permission;
};

export const isLogined = () => {
  return Boolean(getAccessToken());
};

export const parseJWT = (token: string): TokenPayload | null => {
  try {
    return Object.assign(
      new TokenPayload(),
      JSON.parse(Buffer.from(token.split(".")[1], "base64").toString("utf-8"))
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getTokenPayload = (): TokenPayload | null => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return null;
  }
  return parseJWT(accessToken);
};

export const redirectToHome = () => {
  window.location.href = "/";
};

export const Sha3 = (input: string, bits: 224 | 256 | 384 | 512 = 512) => {
  const hash = new SHA3(bits);
  hash.update(input);
  return hash.digest("hex");
};
