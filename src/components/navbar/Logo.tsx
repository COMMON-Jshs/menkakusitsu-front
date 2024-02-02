import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Box
      style={{
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

export default Logo;
