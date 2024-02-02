import "./index.css";
import "./styles/Fonts.css";
import "./styles/NProgress.css";

import { useState } from "react";
import {
  Main,
  AttendanceDownload,
  AttendanceInfo,
  ChatIdbot,
  SpecialroomApply,
  SpecialroomStatus,
  SpecialroomManagement,
  About,
  Setting,
  NotFound,
  BbsList,
  BbsPost,
  BbsCreate,
  BbsEdit,
  SpecialroomOuter,
  Contributors,
  Login,
  Register,
  UserManagement,
} from "./pages";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { TimetablePanel } from "./components";
import { getTheme, getThemeType } from "./components/theme";
import { PrivateRoute, RouteWrapper } from "./components/router";
import { Permission } from "@common-jshs/menkakusitsu-lib";
import { ThemeContext } from "./components/theme/ThemeContext";
import { getUseDarkMode, setUseDarkMode } from "./utils/StorageManager";

const themeType = getThemeType();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RouteWrapper />}>
      <Route index element={<Main />} />

      <Route
        path="auth"
        element={<PrivateRoute permission={Permission.Guest} only />}
      >
        <Route index element={<NotFound />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="attendance"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<NotFound />} />
        <Route path="info" element={<AttendanceInfo />} />
        <Route path="download" element={<AttendanceDownload />} />
      </Route>

      <Route
        path="bbs"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route path=":board/create" element={<BbsCreate />} />
        <Route path=":board/list" element={<BbsList />} />
        <Route path=":board/:postId" element={<BbsPost />} />
        <Route path=":board/:postId/edit" element={<BbsEdit />} />
      </Route>

      <Route
        path="chat"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<NotFound />} />
        <Route path="idbot" element={<ChatIdbot />} />
      </Route>

      <Route
        path="contributors"
        element={<PrivateRoute permission={Permission.Guest} />}
      >
        <Route index element={<Contributors />} />
      </Route>

      <Route path="dev" element={<PrivateRoute permission={Permission.Dev} />}>
        <Route path="user" element={<UserManagement />} />
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
        <Route index element={<NotFound />} />
        <Route path="apply" element={<SpecialroomApply />} />
        <Route path="status" element={<SpecialroomStatus />} />
        <Route
          path="management"
          element={<PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<SpecialroomManagement />} />
        </Route>
        <Route
          path="outer"
          element={<PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<SpecialroomOuter />} />
        </Route>
      </Route>

      <Route
        path="setting"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Setting />} />
      </Route>

      <Route
        path="about"
        element={<PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<About />} />
      </Route>

      <Route path="*" element={<NotFound />} />
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
