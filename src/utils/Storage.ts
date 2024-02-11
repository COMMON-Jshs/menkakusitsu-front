import { v4 as uuid } from "uuid";

export const getDeviceUuid = (): string => {
  let deviceUUid = localStorage.getItem("device-id");
  if (!deviceUUid) {
    deviceUUid = uuid();
    localStorage.setItem("device-id", deviceUUid);
  }
  return deviceUUid;
};

export const getPushList = () => {
  let pushListJson = localStorage.getItem("has-push");
  if (!pushListJson) {
    pushListJson = JSON.stringify({});
    localStorage.setItem("has-push", pushListJson);
  }
  return JSON.parse(pushListJson);
};

export const savePushList = (pushList: NonNullable<unknown>) => {
  localStorage.setItem("has-push", JSON.stringify(pushList));
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("access-token");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh-token");
};

export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("access-token", accessToken);
  localStorage.setItem("refresh-token", refreshToken);
};

export const clearTokens = () => {
  localStorage.setItem("access-token", "");
  localStorage.setItem("refresh-token", "");
};

export const getPostListSize = (): number => {
  let postListSize = Number(localStorage.getItem("POST_LIST_SIZE"));
  if (!postListSize) {
    postListSize = 20;
    localStorage.setItem("POST_LIST_SIZE", String(postListSize));
  }
  return postListSize;
};

export const getCommentListSize = (): number => {
  let commentListSize = Number(localStorage.getItem("COMMENT_LIST_SIZE"));
  if (!commentListSize) {
    commentListSize = 70;
    localStorage.setItem("COMMENT_LIST_SIZE", String(commentListSize));
  }
  return commentListSize;
};

export const getUseDarkMode = (): boolean => {
  return localStorage.getItem("use-dark-mode") == "true";
};

export const setUseDarkMode = (useDarkMode: boolean): void => {
  localStorage.setItem("use-dark-mode", String(useDarkMode));
};
