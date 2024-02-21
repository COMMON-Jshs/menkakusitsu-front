import { Box, Container, Paper } from "@mui/material";
import { useState } from "react";

import { TitleText } from "@/components/basics";

export default function OuterScreen() {
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
            <TitleText>학생 외박 관리</TitleText>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
