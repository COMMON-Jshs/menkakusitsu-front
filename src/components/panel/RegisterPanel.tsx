import { Fragment, useCallback } from "react";
import { Box, Container, Paper, TextField } from "@mui/material";
import PaperTitle from "../PaperTitle";
import { SubmitButton } from "../button";
import { Popup } from "../";
import { DialogTitle } from "../../utils/Constants";
import { isSuccessed, postRegister } from "../../utils/Api";
import { Sha3 } from "../../utils/Utility";
import { useNavigate } from "react-router-dom";

export default function RegisterPanel() {
  const navigate = useNavigate();

  const onPostRegister = useCallback(
    async (event: React.MouseEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const name = data.get("name")?.toString().trim();
      const sid = Number(data.get("sid")?.toString().trim());
      const email = data.get("email")?.toString().trim();
      const id = data.get("id")?.toString().trim();
      const password = data.get("password")?.toString().trim();
      const passwordCheck = data.get("passwordCheck")?.toString().trim();
      if (Number.isNaN(sid)) {
        Popup.openDialog(DialogTitle.Info, "학번의 형식이 잘못되었습니다.");
        return;
      }
      if (!name || !sid || !email || !id || !password || !passwordCheck) {
        return;
      }
      if (password != passwordCheck) {
        Popup.openDialog(
          DialogTitle.Info,
          "비밀번호 확인을 잘못 입력하셨습니다."
        );
        return;
      }
      Popup.startLoading("회원가입 중입니다...");
      try {
        const result = await postRegister({
          name: name,
          sid: sid,
          email: email,
          id: id,
          password: Sha3(password),
        });
        if (isSuccessed(result)) {
          Popup.stopLoading();
          Popup.openDialog(DialogTitle.Info, "회원가입 성공!", () => {
            navigate("/");
          });
        } else {
          Popup.stopLoading();
          Popup.openDialog(DialogTitle.Alert, result.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

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
            <PaperTitle>회원가입</PaperTitle>
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
