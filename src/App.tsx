import "@/index.css";
import "@/styles/Fonts.css";
import "@/styles/NProgress.module.css";

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
import { Router, Theme } from "@/components";
import { Storage } from "@/utils";

const themeType = Theme.getThemeType();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Router.WrapperComponent />}>
      <Route index element={<Page.Main />} />

      <Route
        path="auth"
        element={<Router.PrivateRoute permission={Permission.Guest} strict />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="login" element={<Page.Login />} />
        <Route path="register" element={<Page.Register />} />
      </Route>

      <Route
        path="attendance"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="info" element={<Page.AttendanceInfo />} />
        <Route path="download" element={<Page.AttendanceDownload />} />
      </Route>

      <Route
        path="bbs"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route path=":board/create" element={<Page.BbsCreate />} />
        <Route path=":board/list" element={<Page.BbsList />} />
        <Route path=":board/:postId" element={<Page.BbsPost />} />
        <Route path=":board/:postId/edit" element={<Page.BbsEdit />} />
      </Route>

      <Route
        path="chat"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="idbot" element={<Page.ChatIdbot />} />
      </Route>

      <Route
        path="contributors"
        element={<Router.PrivateRoute permission={Permission.Guest} />}
      >
        <Route index element={<Page.Contributors />} />
      </Route>

      <Route
        path="dev"
        element={<Router.PrivateRoute permission={Permission.Dev} />}
      >
        <Route path="user" element={<Page.UserManagement />} />
      </Route>

      <Route
        path="specialroom"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.NotFound />} />
        <Route path="apply" element={<Page.SpecialroomApply />} />
        <Route path="status" element={<Page.SpecialroomStatus />} />
        <Route
          path="management"
          element={<Router.PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<Page.SpecialroomManagement />} />
        </Route>
        <Route
          path="outer"
          element={<Router.PrivateRoute permission={Permission.Teacher} />}
        >
          <Route index element={<Page.SpecialroomOuter />} />
        </Route>
      </Route>

      <Route
        path="setting"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.Setting />} />
      </Route>

      <Route
        path="about"
        element={<Router.PrivateRoute permission={Permission.Student} />}
      >
        <Route index element={<Page.About />} />
      </Route>

      <Route path="*" element={<Page.NotFound />} />
    </Route>
  )
);

export default function App() {
  const [style, setStyle] = useState(
    Storage.getUseDarkMode() ? "dark" : "light"
  );

  function toggleStyle() {
    Storage.setUseDarkMode(style === "light");
    setStyle((style) => (style === "light" ? "dark" : "light"));
  }

  return (
    <Theme.Context.Provider value={{ style, toggleStyle }}>
      <ThemeProvider theme={Theme.getTheme(themeType, style == "dark")}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Theme.Context.Provider>
  );
}
