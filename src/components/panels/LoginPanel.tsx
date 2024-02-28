import { Box, Button, Link, Stack, TextField } from "@mui/material";
import { AccountBox } from "@mui/icons-material";
import { v1 } from "@common-jshs/menkakusitsu-lib";

import Popup from "@/components/popup";
import { SubmitButton, Text, TitleText } from "@/components/basics";
import { Api, Constants, Firebase, Storage, Utility } from "@/utils";
import { login } from "@/hooks/useAuth";
import { useNavigate } from "@/router";
import RegisterPanel from "@/components/panels/RegisterPanel";

export default function LoginPanel() {
  const navigate = useNavigate();

  const onPostLogin = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = data.get("id")?.toString();
    const password = data.get("password")?.toString();
    if (!id || !password) {
      return;
    }

    Popup.startLoading("로그인 중입니다...");
    Api.postLogin({ id: id, password: Utility.Sha3(password) }).then(
      (result) => {
        Popup.stopLoading();
        if (Api.isSuccessed(result)) {
          onLoginSuccessed(result);
        } else {
          Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
        }
      }
    );
  };

  const onLoginSuccessed = async (result: v1.PostLoginResponse) => {
    Storage.saveTokens(result.accessToken, result.refreshToken);

    if (Api.getPushApproved()) {
      await Firebase.createPushToken();
    }

    login(result.accessToken);

    if (result.callbacks) {
      if (result.callbacks.includes("needChangePw")) {
        Popup.openConfirmDialog(
          Constants.DialogTitle.Alert,
          "기존 4자리 학번을 비밀번호로 사용하시는 경우, 비밀번호를 바꾸셔야합니다.",
          () => {
            navigate("/setting");
          }
        );
        return;
      }
      if (result.callbacks.includes("needChangeEmail")) {
        Popup.openConfirmDialog(
          Constants.DialogTitle.Alert,
          "비밀번호 복구 등의 서비스를 이용하시려면 이메일을 추가하셔야합니다.",
          () => {
            navigate("/setting");
          }
        );
        return;
      }
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <TitleText
        variant="h4"
        sx={{
          mr: 2,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        로그인하세요.
      </TitleText>
      <Box component="form" onSubmit={onPostLogin}>
        <TextField
          InputProps={{ sx: { borderRadius: "50px" } }}
          margin="normal"
          required
          fullWidth
          id="id"
          label="ID"
          name="id"
          autoComplete="username"
        />
        <TextField
          InputProps={{ sx: { borderRadius: "50px" } }}
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <SubmitButton
          fullWidth
          backgroundColor="primary.main"
          height="40px"
          sx={{ mt: 3, mb: 2, borderRadius: "50px" }}
        >
          LOGIN
        </SubmitButton>
        <Stack
          spacing={1}
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Link
            href="#"
            onClick={() => {
              Popup.openConfirmDialog(
                Constants.DialogTitle.Info,
                "현재 제공되지 않는 기능입니다."
              );
            }}
            variant="body1"
            underline="none"
          >
            비밀번호를 잊어버리셨나요?
          </Link>
          <Button
            onClick={() => {
              Popup.openCancelableDialog("", <RegisterPanel />);
            }}
            startIcon={<AccountBox />}
          >
            <Text>아직 계정이 없으신가요?</Text>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
