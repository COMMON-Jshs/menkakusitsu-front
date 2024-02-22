import { LogoText } from "@/components/basics/StyledText";
import { Box, BoxProps } from "@mui/material";
import { Link } from "@/router";

type LogoProps = BoxProps;

export default function Logo(props: LogoProps) {
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <LogoText color="primary" variant="h4">
            {import.meta.env.VITE_WEB_TITLE}
          </LogoText>
          <Box
            sx={{
              marginTop: "-10px",
              backgroundColor: "primary.light",
              height: "4px",
              borderRadius: "10px",
            }}
          />
        </Link>
      </Box>
    </Box>
  );
}
