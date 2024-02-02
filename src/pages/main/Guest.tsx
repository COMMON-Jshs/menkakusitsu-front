import { useEffect } from "react";
import { SpecialroomInfoPanel, MealPanel, LoginButton } from "../../components";
import { Container, Typography, Grid, Link } from "@mui/material";
import { setHeaderActive } from "../../components/router/RouteWrapper";

export default function Guest() {
  useEffect(() => {
    setHeaderActive(false);
    return () => {
      setHeaderActive(true);
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
