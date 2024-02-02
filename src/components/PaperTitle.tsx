import { ReactNode } from "react";
import { Typography } from "@mui/material";

type PaperTitleProps = { children: ReactNode };

function PaperTitle(props: PaperTitleProps) {
  const { children } = props;
  
  return (
    <Typography
      sx={{
        // fontSize: "60px",
        fontFamily: "BMDoHyeon",
        textAlign: "center",
        color: "primary.light",
        marginBottom: "20px",
      }}
      variant="h2"
    >
      {children}
    </Typography>
  );
}

export default PaperTitle;
