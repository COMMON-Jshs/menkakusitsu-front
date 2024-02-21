import { Typography, TypographyProps } from "@mui/material";

export function Text(props: TypographyProps) {
  return (
    <Typography
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        { fontFamily: "BMDoHyeon" },
      ]}
    >
      {props.children}
    </Typography>
  );
}

export function TitleText(props: TypographyProps) {
  return (
    <Typography
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        { fontFamily: "BMDoHyeon" },
      ]}
    >
      {props.children}
    </Typography>
  );
}

export function LogoText(props: TypographyProps) {
  return (
    <Typography
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        { fontFamily: "BMDoHyeon" },
      ]}
    >
      {props.children}
    </Typography>
  );
}

