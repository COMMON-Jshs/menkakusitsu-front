import { Permission } from "@common-jshs/menkakusitsu-lib";
import { useEffect } from "react";
import { Container, Paper } from "@mui/material";

import RegisterPanel from "@/components/panels/RegisterPanel";
import { setHeaderActive } from "@/hooks/useNavbar";

export default function RegisterScreen() {
  useEffect(() => {
    setHeaderActive(false);
    return () => {
      setHeaderActive(true);
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
        <RegisterPanel />
      </Paper>
    </Container>
  );
}

RegisterScreen.permission = Permission.Guest;
RegisterScreen.exact = true;
