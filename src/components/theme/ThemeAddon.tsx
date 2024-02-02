import { Box } from "@mui/material";
import { ThemeType } from ".";
import christmasImg from "../../assets/christmas.png";

interface ThemeLayoutProps {
  type: ThemeType;
}

function ThemeAddon(props: ThemeLayoutProps) {
  const { type } = props;

  if (type == "april-fools") {
    const body = document.body;
    body.setAttribute(
      "style",
      "transform:rotate(180deg); -ms-transform:rotate(180deg); -webkit-transform:rotate(180deg);"
    );
  }

  switch (type) {
    case "christmas":
      return (
        <Box
          sx={{
            background: `url(${christmasImg}) repeat`,
            textIndent: "-1000em",
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "70px",
            pointerEvents: "none",
            cursor: "default",
          }}
        />
      );
    default:
      return <></>;
  }
}

export default ThemeAddon;
