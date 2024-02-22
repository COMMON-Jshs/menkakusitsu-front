import { Fragment, ReactNode, Suspense } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import type {
  ActionFunction,
  RouteObject,
  LoaderFunction,
} from "react-router-dom";

import {
  generateModalRoutes,
  generatePreservedRoutes,
  generateRegularRoutes,
} from "@generouted/react-router/core";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "@/router";

type Element = {
  (): JSX.Element;
  permission?: number;
  exact?: boolean;
};
type Module = {
  default: Element;
  Loader?: LoaderFunction;
  Action?: ActionFunction;
  Catch?: Element;
  Pending?: Element;
};

const PRESERVED = import.meta.glob<Module>("/src/pages/(_app|404).{jsx,tsx}", {
  eager: true,
});
const MODALS = import.meta.glob<Pick<Module, "default">>(
  "/src/pages/**/[+]*.{jsx,tsx}",
  { eager: true }
);
const ROUTES = import.meta.glob<Module>(
  ["/src/pages/**/[\\w[-]*.{jsx,tsx}", "!**/(_app|404).*"],
  { eager: true }
);

const preservedRoutes =
  generatePreservedRoutes<Omit<Module, "Action">>(PRESERVED);
const modalRoutes = generateModalRoutes<Element>(MODALS);

type PermissionCheckProps = {
  permission?: number;
  exact?: boolean;
  children: ReactNode;
};

const PermissionCheck = (props: PermissionCheckProps) => {
  const { permission, exact, children } = props;
  const { payload } = useAuth();

  if (
    permission == undefined ||
    (exact && payload.permission == permission) ||
    (!exact && payload.hasPermission(permission))
  ) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

const regularRoutes = generateRegularRoutes<RouteObject, Partial<Module>>(
  ROUTES,
  (module, key) => {
    const index =
      /index\.(jsx|tsx)$/.test(key) && !key.includes("pages/index")
        ? { index: true }
        : {};
    const Element = (module?.default || Fragment) as Element;
    const { permission, exact } = Element;
    const Page = () =>
      module?.Pending ? (
        <Suspense
          fallback={<module.Pending />}
          children={
            <PermissionCheck permission={permission} exact={exact}>
              <Element />
            </PermissionCheck>
          }
        />
      ) : (
        <PermissionCheck permission={permission} exact={exact}>
          <Element />
        </PermissionCheck>
      );
    return {
      ...index,
      Component: Page,
      ErrorBoundary: module?.Catch,
      loader: module?.Loader,
      action: module?.Action,
    };
  }
);

const _app = preservedRoutes?.["_app"];
const _404 = preservedRoutes?.["404"];

const Element = _app?.default || Fragment;
const App = () =>
  _app?.Pending ? (
    <Suspense fallback={<_app.Pending />} children={<Element />} />
  ) : (
    <Element />
  );

const app = {
  Component: _app?.default ? App : Outlet,
  ErrorBoundary: _app?.Catch,
  loader: _app?.Loader,
};
const fallback = { path: "*", Component: _404?.default || Fragment };

export const routes: RouteObject[] = [
  { ...app, children: [...regularRoutes, fallback] },
];
export const Routes = () => (
  <RouterProvider router={createBrowserRouter(routes)} />
);

export const Modals = () => {
  const Modal = modalRoutes[useLocation().state?.modal] || Fragment;
  return <Modal />;
};
