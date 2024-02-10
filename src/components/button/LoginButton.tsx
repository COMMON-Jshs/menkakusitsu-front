import { Box } from "@mui/material";
import { Popup } from "../";
import { SubmitButton } from "../button";
import { LoginPanel } from "../panel";

export default function LoginButton() {
  return (
    <Box
      sx={{
        width: "auto",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SubmitButton
        color="primary.main"
        onClick={() => {
          Popup.openCancelableDialog("", <LoginPanel />);
        }}
      >
        {import.meta.env.VITE_WEB_TITLE} LOGIN
      </SubmitButton>
    </Box>
  );
}
