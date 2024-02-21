import React from "react";

import { LogoText } from "@/components/basics/StyledText";
import { Box, BoxProps } from "@mui/material";

type LogoProps = BoxProps & {
  size?: number;
};

export default function Logo(props: LogoProps) {
  const { size = 32 } = props;

  const fontSize = Math.round(size);
  const lineHeight = Math.round(size / 8);
  const lineMargin = Math.round(-size / 16);

  return (
    <Box
      {...props}
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        {
          display: "flex",
          justifyContent: "center",
        },
      ]}
    >
      <Box
        sx={{
          display: "inline-block",
        }}
      >
        <LogoText color="primary" sx={{ fontSize: fontSize }}>
          {import.meta.env.VITE_WEB_TITLE}
        </LogoText>
        <Box
          sx={{
            display: "flex",
            borderRadius: 10,
            height: lineHeight,
            marginTop: lineMargin,
            backgroundColor: "primary.light",
          }}
        />
      </Box>
    </Box>
  );
}
