import { getPushList, savePushList } from "./StorageManager";
import { getTokenPayload } from "./Utility";

export const getPushApproved = () => {
  const pushList = getPushList();
  const payload = getTokenPayload();
  if (!payload) {
    return false;
  }
  return pushList[payload.uid] === true;
};

export const setPushApproved = (value: boolean) => {
  const payload = getTokenPayload();
  if (!payload) {
    return;
  }
  const pushList = getPushList();
  pushList[payload.uid] = value;
  savePushList(pushList);
};
