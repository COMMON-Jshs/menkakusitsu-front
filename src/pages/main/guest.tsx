import { Container, Typography, Grid, Link } from "@mui/material";
import { useEffect } from "react";

import {
  SpecialroomInfoPanel,
  MealPanel,
  LoginButton,
  Router,
} from "@/components";

export function Guest() {
  useEffect(() => {
    Router.setHeaderActive(false);
    return () => {
      Router.setHeaderActive(true);
    };
  }, []);

  return (
    <>
      <Typography
        variant="h3"
        noWrap
        align="center"
        sx={{
          mr: 2,
          fontWeight: 500,
          fontFamily: "DesignHouseB",
          margin: "50px auto 30px",
        }}
      >
        <Link href="/" underline="none" color="primary.main">
          {import.meta.env.VITE_WEB_TITLE}
        </Link>
      </Typography>
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
            <LoginButton />
          </Grid>
          <Grid item xs={12}>
            <MealPanel />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
