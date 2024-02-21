import "@/index.css";
import "@/styles/Fonts.css";
import "@/styles/NProgress.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import Theme from "@/components/theme";
import { Routes } from "@generouted/react-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function App() {
  const { scheme } = useColorScheme();

  return (
    <ThemeProvider theme={Theme.getTheme(Theme.getThemeType(), scheme)}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}
