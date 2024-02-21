import "@/styles/LoginForm.module.css";

import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { AccountBox } from "@mui/icons-material";
import { v1 } from "@common-jshs/menkakusitsu-lib";

import { Popup, Firebase } from "@/components";
import { IconNavLink } from "@/components/basics";
import { Api, Constants, Storage, Utility } from "@/utils";

const onPostLogin = (event: React.MouseEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const id = data.get("id")?.toString();
  const password = data.get("password")?.toString();
  if (!id || !password) {
    return;
  }

  Popup.startLoading("로그인 중입니다...");
  Api.postLogin({ id: id, password: Utility.Sha3(password) }).then((result) => {
    if (Api.isSuccessed(result)) {
      onLoginSuccessed(result);
    } else {
      onLoginFailed(result);
    }
  });
};

const onLoginSuccessed = async (result: v1.PostLoginResponse) => {
  Storage.saveTokens(result.accessToken, result.refreshToken);

  if (Firebase.getPushApproved()) {
    await Firebase.createPushToken();
  }

  if (result.callbacks) {
    if (result.callbacks.includes("needChangePw")) {
      Popup.openConfirmDialog(
        Constants.DialogTitle.Alert,
        "기존 4자리 학번을 비밀번호로 사용하시는 경우, 비밀번호를 바꾸셔야합니다.",
        () => {
          window.location.href = "/setting";
        }
      );
      return;
    }
    if (result.callbacks.includes("needChangeEmail")) {
      Popup.openConfirmDialog(
        Constants.DialogTitle.Alert,
        "비밀번호 복구 등의 서비스를 이용하시려면 이메일을 추가하셔야합니다.",
        () => {
          window.location.href = "/setting";
        }
      );
      return;
    }
  }
  window.location.reload();
};

const onLoginFailed = (result: v1.PostLoginResponse) => {
  Popup.stopLoading();
  Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
};

export function LoginPanel() {
  return (
    <Box
      sx={{
        width: "auto",
        height: "100%",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          fontWeight: 500,
          fontFamily: "BMDohyeon",
          color: "inherit",
          textDecoration: "none",
        }}
      >
        로그인하세요.
      </Typography>
      <Box
        component="form"
        onSubmit={onPostLogin}
        sx={{ mt: 1, padding: "0 30px 0" }}
      >
        <TextField
          className="inputRounded"
          margin="normal"
          required
          fullWidth
          id="id"
          label="ID"
          name="id"
        />
        <TextField
          className="inputRounded"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            borderRadius: "50px",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "#fff",
              color: "primary.main",
            },
            fontFamily: "BMDohyeon",
          }}
        >
          LOGIN
        </Button>
        <Grid container>
          <Grid item xs>
            <Link
              href="#"
              onClick={() => {
                Popup.openConfirmDialog(
                  Constants.DialogTitle.Info,
                  "현재 제공되지 않는 기능입니다."
                );
              }}
              variant="body2"
              underline="none"
            >
              비밀번호를 잊어버리셨나요?
            </Link>
          </Grid>
          <Grid item>
            <IconNavLink
              to="/auth/register"
              label="아직 계정이 없으신가요?"
              icon={<AccountBox />}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
