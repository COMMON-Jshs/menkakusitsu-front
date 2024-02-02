import { createTheme, responsiveFontSizes } from "@mui/material";

export const defaultTheme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: "'NotoSansKR'",
    },
    palette: {
      background: {
        default: "#EDEDED",
      },
      primary: {
        main: "#279023",
      },
      secondary: {
        main: "#4db6ac",
      },
    },
  })
);

export const christmasTheme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: "'NotoSansKR'",
    },
    palette: {
      background: {
        default: "#EDEDED",
      },
      primary: {
        main: "#C9040C",
      },
      secondary: {
        main: "#28560C",
      },
    },
  })
);

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
  })
);
