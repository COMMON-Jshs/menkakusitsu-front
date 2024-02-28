import { Permission } from "@common-jshs/menkakusitsu-lib";
import { Box, Button, Container, Grid } from "@mui/material";
import { useEffect } from "react";

import Popup from "@/components/popup";
import { SpecialroomInfoPanel } from "@/components/panels/SpecialroomInfoPanel";
import MealInfo from "@/components/panels/MealInfo";
import LoginPanel from "@/components/panels/LoginPanel";
import { TitleText } from "@/components/basics";
import Logo from "@/components/basics/Logo";
import { useAuth } from "@/hooks/useAuth";
import { setHeaderActive } from "@/hooks/useNavbar";

export default function MainScreen() {
  const { payload } = useAuth();

  const permission = payload.permission;

  switch (permission) {
    case Permission.Dev:
      return <Student />;
    case Permission.Teacher:
      return <Teacher />;
    case Permission.Student:
      return <Student />;
    case Permission.Guest:
      return <Guest />;
    default:
      return <Guest />;
  }
}

function Guest() {
  useEffect(() => {
    setHeaderActive(false);
    return () => {
      setHeaderActive(true);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "50px",
        }}
      >
        <Logo variant="h2" />
      </Box>
      <Container
        maxWidth="xl"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={8.5}>
            <SpecialroomInfoPanel />
          </Grid>
          <Grid item xs={3.5}>
            <Button
              color="primary"
              sx={{
                width: "100%",
                height: 60,
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "primary.main",
                },
              }}
              variant="contained"
              onClick={() => {
                Popup.openCancelableDialog("", <LoginPanel />);
              }}
            >
              <TitleText variant="body2">
                {import.meta.env.VITE_WEB_TITLE} LOGIN
              </TitleText>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <MealInfo />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function Student() {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <MealInfo />
      </Container>
    </>
  );
}

function Teacher() {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <MealInfo />
      </Container>
    </>
  );
}
