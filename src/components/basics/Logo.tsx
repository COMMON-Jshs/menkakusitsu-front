import { LogoText } from "@/components/basics/StyledText";
import { Box, BoxProps } from "@mui/material";
import { Link } from "@/router";
import { Variant } from "@mui/material/styles/createTypography";

type LogoProps = BoxProps & {
  variant?: Variant;
};

export default function Logo(props: LogoProps) {
  const { variant = "h4" } = props;

  return (
    <Box
      {...props}
      sx={[
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        {
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Box
        sx={{
          display: "inline-block",
          position: "relative",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <LogoText color="primary" variant={variant}>
            {import.meta.env.VITE_WEB_TITLE}
          </LogoText>
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "primary.light",
              borderRadius: "10px",
              height: "8%",
              bottom: "24%",
              left: 0,
              right: 0,
            }}
          />
        </Link>
      </Box>
    </Box>
  );
}
