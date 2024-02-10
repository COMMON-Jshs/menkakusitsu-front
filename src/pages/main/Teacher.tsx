import { Container } from "@mui/material";

import { MealPanel } from "@/components";

export function Teacher() {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <MealPanel />
        <br />
      </Container>
    </>
  );
}
