import { v1, DefaultResponse } from "@common-jshs/menkakusitsu-lib";
import axios, { AxiosError, AxiosResponse } from "axios";

import Popup from "@/components/popup";
import { DialogTitle } from "@/utils/Constants";
import {
  clearTokens,
  getAccessToken,
  getDeviceUuid,
  getPushList,
  getRefreshToken,
  savePushList,
  saveTokens,
} from "@/utils/Storage";
import { getTokenPayload, parseJWT, redirectToHome } from "@/utils/Utility";
import { deletePushToken } from "@/utils/Firebase";

const onApiError = (e: AxiosError) => {
  Popup.stopLoading();
  if (e.code == "ECONNABORTED") {
    Popup.openConfirmDialog(DialogTitle.Alert, "서버와 통신에 실패하였습니다.");
    return;
  }
  if (e.code == "ERR_NETWORK") {
    Popup.openConfirmDialog(
      DialogTitle.Alert,
      "서버와 통신에 실패하였습니다.\n인터넷 연결 상태를 확인해주세요."
    );
    return;
  }
  if (e.code == "ERR_BAD_REQUEST") {
    if (e.response?.status == 400) {
      Popup.openConfirmDialog(
        DialogTitle.Alert,
        "데이터 형식이 잘못되었습니다."
      );
      return;
    } else if (e.response?.status == 403) {
      Popup.openConfirmDialog(DialogTitle.Alert, "권한이 부족합니다.");
      return;
    }
  }
  if (e.code == "ERR_BAD_RESPONSE") {
    Popup.openConfirmDialog(
      DialogTitle.Alert,
      "데이터 처리 중 에러가 발생했습니다."
    );
    return;
  }
};

export const isSuccessed = (result: DefaultResponse) => {
  return result.status >= 0;
};

export const apiRequest = async (
  method: string,
  path: string,
  data?: any,
  headers?: any
) => {
  const url = import.meta.env.VITE_API_PREFIX + path;
  let accessToken = getAccessToken();
  if (!accessToken) {
    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers,
      timeout: 5000,
    });
  }
  if (await checkTokenExpiration(accessToken)) {
    onLogout();
    throw new Error("Token expired.");
  }
  accessToken = getAccessToken();
  accessToken = `Bearer ${accessToken}`;
  return axios({
    method: method,
    url: url,
    data: data,
    headers: {
      ...headers,
      Authorization: accessToken,
    },
    timeout: 5000,
  });
};

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
      // Popup.openConfirmDialog(TITLE.Alert, result.message, onLogout);
      return true;
    }
  }
  return false;
};

export const onLogout = () => {
  clearTokens();
  redirectToHome();
};

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

export const apiGet = (path: string, headers?: any) => {
  return new Promise<AxiosResponse<any, any>>((resolve) => {
    apiRequest("get", path, null, headers).then(resolve).catch(onApiError);
  });
};

export const apiPost = (path: string, body?: any, headers?: any) => {
  return new Promise<AxiosResponse<any, any>>((resolve) => {
    apiRequest("post", path, body, headers).then(resolve).catch(onApiError);
  });
};

export const apiPut = (path: string, body: any = null, headers?: any) => {
  return new Promise<AxiosResponse<any, any>>((resolve) => {
    apiRequest("put", path, body, headers).then(resolve).catch(onApiError);
  });
};

export const apiDelete = (path: string, body: any = null, headers?: any) => {
  return new Promise<AxiosResponse<any, any>>((resolve) => {
    apiRequest("delete", path, body, headers).then(resolve).catch(onApiError);
  });
};

//Auth
export const postRegister = async (props: v1.PostRegisterRequest) => {
  const resp = await apiPost("/v1/auth/account", props);
  const result: v1.PostRegisterResponse = resp.data;
  return result;
};

export const deleteSecession = async (props: v1.DeleteSecessionRequest) => {
  const resp = await apiDelete("/v1/auth/account", props);
  const result: v1.DeleteSecessionResponse = resp.data;
  return result;
};

export const postLogin = async (props: v1.PostLoginRequest) => {
  const resp = await apiPost("/v1/auth/login", props);
  const result: v1.PostLoginResponse = resp.data;
  return result;
};

export const deleteLogout = async (props: v1.DeleteLogoutRequest) => {
  if (getPushApproved()) {
    const result = await deletePushToken();
    if (result) {
      await deleteUserPush({
        devcieId: getDeviceUuid(),
      });
    }
  }
  const resp = await apiDelete("/v1/auth/logout", props);
  const result: v1.DeleteLogoutResponse = resp.data;
  return result;
};

//BBS
export const getBbsPostList = async (props: v1.GetBbsPostListRequest) => {
  const resp = await apiGet(
    `/v1/bbs/post/list?board=${props.board}&postPage=${props.postPage}&postListSize=${props.postListSize}`
  );
  const result: v1.GetBbsPostListResponse = resp.data;
  return result;
};

export const getBbsPost = async (props: v1.GetBbsPostRequest) => {
  const resp = await apiGet(
    `/v1/bbs/post?board=${props.board}&postId=${props.postId}`
  );
  const result: v1.GetBbsPostResponse = resp.data;
  return result;
};

export const postBbsPost = async (
  props: v1.PostBbsPostRequest,
  data: File[]
) => {
  const formData = new FormData();
  formData.append("props", JSON.stringify(props));
  for (const file of data) {
    formData.append("data", file);
  }
  const resp = await apiPost("/v1/bbs/post", formData, {
    "Content-Type": "multipart/form-data; charset: UTF-8;",
  });
  const result: v1.PostBbsPostResponse = resp.data;
  return result;
};

export const putBbsPost = async (props: v1.PutBbsPostRequest) => {
  const resp = await apiPut("/v1/bbs/post", props);
  const result: v1.PutBbsPostResponse = resp.data;
  return result;
};

export const deleteBbsPost = async (props: v1.DeleteBbsPostRequest) => {
  const resp = await apiDelete("/v1/bbs/post", props);
  const result: v1.DeleteBbsPostResponse = resp.data;
  return result;
};

export const getBbsPostHeaders = async (props: v1.GetBbsPostHeaderRequest) => {
  const resp = await apiGet(`/v1/bbs/post/headers?board=${props.board}`);
  const result: v1.GetBbsPostHeaderResponse = resp.data;
  return result;
};

export const getBbsCommentList = async (props: v1.GetBbsCommentListRequest) => {
  const resp = await apiGet(
    `/v1/bbs/comment/list?board=${props.board}&postId=${props.postId}&commentPage=${props.commentPage}&commentListSize=${props.commentListSize}`
  );
  const result: v1.GetBbsCommentListResponse = resp.data;
  return result;
};

export const postBbsComment = async (props: v1.PostBbsCommentRequest) => {
  const resp = await apiPost("/v1/bbs/comment", props);
  const result: v1.PostBbsCommentResponse = resp.data;
  return result;
};

export const deleteBbsComment = async (props: v1.DeleteBbsCommentRequest) => {
  const resp = await apiDelete("/v1/bbs/comment", props);
  const result: v1.PostBbsCommentResponse = resp.data;
  return result;
};

//Chat
export const getIdbotChat = async (props: v1.GetIdbotChatRequest) => {
  const resp = await apiGet(
    `/v1/chat/idbot/message?chatInput=${props.chatInput}`
  );
  const result: v1.GetIdbotChatResponse = resp.data;
  return result;
};

//Timetable
export const getMeal = async (props: v1.GetMealRequest) => {
  const resp = await apiGet(`/v1/meal/now`);
  const result: v1.GetMealResponse = resp.data;
  return result;
};

//Specialroom
export const getSpecialroomApply = async (props: v1.GetApplyRequest) => {
  const resp = await apiGet(`/v1/specialroom/apply?when=${props.when}`);
  const result: v1.GetApplyResponse = resp.data;
  return result;
};

export const postSpecialroomApply = async (props: v1.PostApplyRequest) => {
  const resp = await apiPost("/v1/specialroom/apply", props);
  const result: v1.PostApplyResponse = resp.data;
  return result;
};

export const deleteSpecialroomApply = async (props: v1.DeleteApplyRequest) => {
  const resp = await apiDelete("/v1/specialroom/apply", props);
  const result: v1.DeleteApplyResponse = resp.data;
  return result;
};

export const getAttendanceInfo = async (props: v1.GetAttendanceInfoRequest) => {
  const resp = await apiGet("/v1/specialroom/attendance/info");
  const result: v1.GetAttendanceInfoResponse = resp.data;
  return result;
};

export const getAttendanceList = async (props: v1.GetAttendanceListRequest) => {
  const resp = await apiGet(
    `/v1/specialroom/attendance/list?when=${props.when}`
  );
  const result: v1.GetAttendanceListResponse = resp.data;
  return result;
};

export const getSpecialroomInfo = async (props: v1.GetInfoRequest) => {
  const resp = await apiGet("/v1/specialroom/info");
  const result: v1.GetInfoResponse = resp.data;
  return result;
};

export const putSpecialroomInfo = async (props: v1.PutInfoRequest) => {
  const resp = await apiPut("/v1/specialroom/info", props);
  const result: v1.PutInfoResponse = resp.data;
  return result;
};

export const getSpecialroomManagerInfo = async (
  props: v1.GetManagerRequest
) => {
  const resp = await apiGet(`/v1/specialroom/info/manager/${props.when}`);
  const result: v1.GetManagerResponse = resp.data;
  return result;
};

export const getSpecialroomLocationInfo = async (
  props: v1.GetLocationInfoRequest
) => {
  const resp = await apiGet("/v1/specialroom/info/location");
  const result: v1.GetLocationInfoResponse = resp.data;
  return result;
};

export const getSpecialroomPurposeInfo = async (
  props: v1.GetPurposeInfoRequest
) => {
  const resp = await apiGet("/v1/specialroom/info/purpose");
  const result: v1.GetPurposeInfoResponse = resp.data;
  return result;
};

export const getSpecialroomStudentInfo = async (
  props: v1.GetStudentInfoRequest
) => {
  const resp = await apiGet("/v1/specialroom/info/student");
  const result: v1.GetStudentInfoResponse = resp.data;
  return result;
};

export const getSpecialroomTeacherInfo = async (
  props: v1.GetTeacherInfoRequest
) => {
  const resp = await apiGet("/v1/specialroom/info/teacher");
  const result: v1.GetTeacherInfoResponse = resp.data;
  return result;
};

//Timetable
export const getTimetable = async (props: v1.GetTimetableRequest) => {
  const resp = await apiGet(`/v1/timetable/${props.when}`);
  const result: v1.GetTimetableResponse = resp.data;
  return result;
};

export const putTimetable = async (props: v1.PutTimetableRequest) => {
  const resp = await apiPut(`/v1/timetable/${props.when}`, props);
  const result: v1.PutTimetableResponse = resp.data;
  return result;
};

//User
export const postUserPush = async (props: v1.PostPushRequest) => {
  const resp = await apiPost("/v1/user/push", props);
  const result: v1.PostPushResponse = resp.data;
  return result;
};

export const putUserPush = async (props: v1.PutPushRequest) => {
  const resp = await apiPut("/v1/user/push", props);
  const result: v1.PutPushResponse = resp.data;
  return result;
};

export const deleteUserPush = async (props: v1.DeletePushRequest) => {
  const resp = await apiDelete("/v1/user/push", props);
  const result: v1.DeletePushResponse = resp.data;
  return result;
};

export const getMyPrivateInfo = async (props: v1.GetMyPrivateInfoRequest) => {
  const resp = await apiGet("/v1/user/me");
  const result: v1.GetMyPrivateInfoResponse = resp.data;
  return result;
};

export const putMyEmail = async (props: v1.PutEmailRequest) => {
  const resp = await apiPut("/v1/user/me/email", props);
  const result: v1.PutEmailResponse = resp.data;
  return result;
};

export const putMyPassword = async (props: v1.PutPasswordRequest) => {
  const resp = await apiPut("/v1/user/me/password", props);
  const result: v1.PutPasswordResponse = resp.data;
  return result;
};
