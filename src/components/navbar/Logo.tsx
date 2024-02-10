import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Box
      sx={{
        display: "inline-block",
        marginLeft: "64px",
      }}
    >
      <Link color="inherit" to="/" style={{ textDecoration: "none" }}>
        <Typography
          sx={{ fontFamily: "DesignHouseB" }}
          variant="h4"
          color="primary.main"
        >
          {import.meta.env.VITE_WEB_TITLE}
        </Typography>
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
  );
}
