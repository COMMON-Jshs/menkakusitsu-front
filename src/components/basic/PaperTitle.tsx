import { ReactNode } from "react";
import { Typography } from "@mui/material";

type PaperTitleProps = { children: ReactNode };

export function PaperTitle(props: PaperTitleProps) {
  const { children } = props;
  
  return (
    <Typography
      sx={{
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

