import { Box, Container, Paper } from "@mui/material";
import { useState } from "react";
import PaperTitle from "../../components/PaperTitle";

function Outer() {
  const [outsiders, setOutsiders] = useState([]);
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          margin: "30px auto 50px",
        }}
      >
        <Paper>
          <Box sx={{ padding: "50px 30px 30px 30px" }}>
            <PaperTitle>학생 외박 관리</PaperTitle>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Outer;
