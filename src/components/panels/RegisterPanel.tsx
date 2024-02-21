import { Box, Container, Paper, TextField } from "@mui/material";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Popup } from "@/components";
import { TitleText } from "@/components/basics";
import { Api, Constants, Utility } from "@/utils";
import { SubmitButton } from "@/components/buttons";

export function RegisterPanel() {
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
    if (Number.isNaN(sid)) {
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
    <Fragment>
      <Container
        maxWidth="md"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "50px 50px 30px 50px",
            }}
          >
            <TitleText>회원가입</TitleText>
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                name="sid"
                label="학번"
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                name="id"
                label="아이디"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                size="small"
                name="password"
                label="비밀번호"
                type="password"
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
                <SubmitButton width="50%" color="primary.main">
                  가입하기
                </SubmitButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}
