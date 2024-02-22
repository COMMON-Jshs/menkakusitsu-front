import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import Popup from "@/components/popup";
import { Api, Utility, Constants } from "@/utils";
import { SubmitButton } from "@/components/basics/StyledButton";
import { Text } from "@/components/basics";

export default function AccountSettingScreen() {
  return (
    <>
      <ChangeEmail />
      <ChangePassword />
    </>
  );
}

function ChangeEmail() {
  const [email, setEmail] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    Api.getMyPrivateInfo({}).then((result) => {
      setEmail(result.private.email!);
    });
  }, []);

  return (
    <Box
      component="form"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorText(null);
        const data = new FormData(event.currentTarget);
        const newEmail = data.get("email")?.toString();
        if (email === null || !newEmail) {
          return;
        }
        if (email == newEmail) {
          setErrorText("이건 당신이 이미 쓰고 계시는 이메일입니다.");
          return;
        }
        if (!Utility.validateEmail(newEmail)) {
          setErrorText("유효하지 않은 이메일입니다!");
          return;
        }
        Popup.startLoading("잠시만 기다려주세요...");
        Api.putMyEmail({ oldEmail: email, newEmail: newEmail }).then(
          (result) => {
            Popup.stopLoading();
            if (Api.isSuccessed(result)) {
              setEmail(result.newEmail);
            } else {
              Popup.openConfirmDialog(
                Constants.DialogTitle.Info,
                result.message
              );
            }
          }
        );
      }}
    >
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "32px",
        }}
      >
        <Box sx={{ width: "100%", justifyContent: "left" }}>
          <Text variant="h5">이메일 변경</Text>
        </Box>
        {email !== null && (
          <TextField
            size="small"
            label="이메일"
            name="email"
            error={Boolean(errorText)}
            helperText={errorText}
            defaultValue={email}
            fullWidth
            required
          />
        )}
        <SubmitButton
          backgroundColor="primary.main"
          width="192px"
          height="48px"
        >
          변경
        </SubmitButton>
      </Box>
    </Box>
  );
}

function ChangePassword() {
  const [errorText, setErrorText] = useState<string | null>(null);

  return (
    <Box
      component="form"
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorText(null);
        const data = new FormData(event.currentTarget);
        const oldPassword = data.get("oldPassword")?.toString();
        const newPassword = data.get("newPassword")?.toString();
        const newPasswordCheck = data.get("newPasswordCheck")?.toString();
        if (!oldPassword || !newPassword || !newPasswordCheck) {
          return;
        }
        if (newPassword != newPasswordCheck) {
          setErrorText("비밀번호와 비밀번호 확인이 다릅니다.");
          return;
        }
        Popup.startLoading("잠시만 기다려주세요...");
        Api.putMyPassword({
          oldPassword: Utility.Sha3(oldPassword),
          newPassword: Utility.Sha3(newPassword),
        }).then((result) => {
          Popup.stopLoading();
          if (Api.isSuccessed(result)) {
            window.location.reload();
          } else {
            Popup.openConfirmDialog(Constants.DialogTitle.Info, result.message);
          }
        });
      }}
    >
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          padding: "32px",
        }}
      >
        <Box sx={{ width: "100%", justifyContent: "left" }}>
          <Text variant="h5">비밀번호 변경</Text>
        </Box>
        <TextField
          size="small"
          label="이전 비밀번호"
          name="oldPassword"
          type="password"
          fullWidth
          required
        />
        <TextField
          size="small"
          label="새 비밀번호"
          name="newPassword"
          type="password"
          error={Boolean(errorText)}
          helperText={errorText}
          fullWidth
          required
        />
        <TextField
          size="small"
          label="새 비밀번호 확인"
          name="newPasswordCheck"
          type="password"
          error={Boolean(errorText)}
          helperText={errorText}
          fullWidth
          required
        />
        <SubmitButton
          backgroundColor="primary.main"
          width="192px"
          height="48px"
        >
          변경
        </SubmitButton>
      </Box>
    </Box>
  );
}
