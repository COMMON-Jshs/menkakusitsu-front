import { Box, TextField } from "@mui/material";

import Popup from "@/components/popup";
import { TitleText } from "@/components/basics";
import { SubmitButton } from "@/components/basics/StyledButton";
import { Api, Constants, Utility } from "@/utils";
import { useNavigate } from "@/router";

export default function RegisterPanel() {
  const navigate = useNavigate();

  const onPostRegister = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name")?.toString().trim();
    const sid = Number(data.get("sid")?.toString().trim());
    const email = data.get("email")?.toString().trim();
    const id = data.get("id")?.toString().trim();
    const password = data.get("password")?.toString().trim();
    const passwordCheck = data.get("passwordCheck")?.toString().trim();
    if (Number.isNaN(sid) || !Number.isInteger(sid) || sid <= 0) {
      Popup.openConfirmDialog(
        Constants.DialogTitle.Info,
        "학번의 형식이 잘못되었습니다."
      );
      return;
    }
    if (!name || !sid || !email || !id || !password || !passwordCheck) {
      return;
    }
    if (password != passwordCheck) {
      Popup.openConfirmDialog(
        Constants.DialogTitle.Info,
        "비밀번호 확인을 잘못 입력하셨습니다."
      );
      return;
    }
    Popup.startLoading("회원가입 중입니다...");
    try {
      const result = await Api.postRegister({
        name: name,
        sid: sid,
        email: email,
        id: id,
        password: Utility.Sha3(password),
      });
      if (Api.isSuccessed(result)) {
        Popup.stopLoading();
        Popup.openConfirmDialog(
          Constants.DialogTitle.Info,
          "회원가입 성공!",
          () => {
            navigate("/");
          }
        );
      } else {
        Popup.stopLoading();
        Popup.openConfirmDialog(Constants.DialogTitle.Alert, result.message);
      }
    } catch (err) {
      console.error(err);
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
        회원가입
      </TitleText>
      <Box
        component="form"
        onSubmit={onPostRegister}
        sx={{ mt: 1, padding: "0 30px 0" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="name"
          label="이름"
          autoComplete="name"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="sid"
          label="학번"
          type="number"
          sx={{ appearance: "none" }}
          helperText="1학년 1반 1번이면 1101"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="email"
          label="이메일"
          type="email"
          autoComplete="email"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="id"
          label="아이디"
          autoComplete="username"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          name="passwordCheck"
          label="비밀번호 확인"
          type="password"
        />
        <Box sx={{ marginTop: 3 }}>
          <SubmitButton width="192px" backgroundColor="primary.main">
            가입하기
          </SubmitButton>
        </Box>
      </Box>
    </Box>
  );
}
