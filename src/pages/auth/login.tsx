import { Permission } from "@common-jshs/menkakusitsu-lib";
import { useEffect } from "react";
import { Container, Paper } from "@mui/material";

import LoginPanel from "@/components/panels/LoginPanel";
import { setFooterActive, setHeaderActive } from "@/hooks/useNavbar";

export default function LoginScreen() {
  useEffect(() => {
    setHeaderActive(false);
    setFooterActive(false);
    return () => {
      setHeaderActive(true);
      setFooterActive(true);
    };
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        margin: "30px auto 50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ padding: "32px" }}>
        <LoginPanel />
      </Paper>
    </Container>
  );
}

LoginScreen.permission = Permission.Guest;
LoginScreen.exact = true;
