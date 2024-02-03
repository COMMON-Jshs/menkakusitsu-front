import "./index.css";
import "./styles/Fonts.css";
import "./styles/NProgress.css";

import { Permission } from "@common-jshs/menkakusitsu-lib";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import * as Page from "@/pages";
import { TimetablePanel } from "@/components";
import { getTheme, getThemeType, ThemeContext } from "@/components/theme";
import { PrivateRoute, RouteWrapper } from "@/components/router";
import { getUseDarkMode, setUseDarkMode } from "@/utils/StorageManager";

const themeType = getThemeType();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RouteWrapper />}>
      <Route index element={<Page.Main />} />

      <Route
        path="auth"
        element={<PrivateRoute permission={Permission.Guest} only />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="login" element={<Page.Login />} />
        <Route path="register" element={<Page.Register />} />
      </Route>

      <Route
        path="attendance"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="info" element={<Page.AttendanceInfo />} />
        <Route path="download" element={<Page.AttendanceDownload />} />
      </Route>

      <Route
        path="bbs"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route path=":board/create" element={<Page.BbsCreate />} />
        <Route path=":board/list" element={<Page.BbsList />} />
        <Route path=":board/:postId" element={<Page.BbsPost />} />
        <Route path=":board/:postId/edit" element={<Page.BbsEdit />} />
      </Route>

      <Route
        path="chat"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="idbot" element={<Page.ChatIdbot />} />
      </Route>

      <Route
        path="contributors"
        element={<PrivateRoute permission={Permission.Guest} />}
      >
        <Route index element={<Page.Contributors />} />
      </Route>

      <Route path="dev" element={<PrivateRoute permission={Permission.Dev} />}>
        <Route path="user" element={<Page.UserManagement />} />
      </Route>

      <Route
        path="timetable"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<TimetablePanel />} />
      </Route>

      <Route
        path="management"
        element={<PrivateRoute permission={Permission.Teacher} />}
      >
        <Route path="timetable" element={<TimetablePanel edit />} />
      </Route>

      <Route
        path="specialroom"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="apply" element={<Page.SpecialroomApply />} />
        <Route path="status" element={<Page.SpecialroomStatus />} />
        <Route
          path="management"
          element={<PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<Page.SpecialroomManagement />} />
        </Route>
        <Route
          path="outer"
          element={<PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<Page.SpecialroomOuter />} />
        </Route>
      </Route>

      <Route
        path="setting"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.Setting />} />
      </Route>

      <Route
        path="about"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.About />} />
      </Route>

      <Route path="*" element={<Page.NotFound />} />
    </Route>
  )
);

export default function App() {
  const [style, setStyle] = useState(getUseDarkMode() ? "dark" : "light");

  function toggleStyle() {
    setUseDarkMode(style === "light");
    setStyle((style) => (style === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ style, toggleStyle }}>
      <ThemeProvider theme={getTheme(themeType, style == "dark")}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
