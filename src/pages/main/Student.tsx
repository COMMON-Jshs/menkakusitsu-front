import { Container } from "@mui/material";
import { MealPanel, TimetablePanel } from "../../components";

function Student() {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        {/* <TimetablePanel /> */}
        {/* <br /> */}
        <MealPanel />
        <br />
      </Container>
    </>
  );
}

export default Student;
