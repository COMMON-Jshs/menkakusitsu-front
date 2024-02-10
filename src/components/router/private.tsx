import { Navigate, Outlet } from "react-router-dom";

import { Utility } from "@/utils";

type PrivateRouteProps = {
  permission: number;
  strict?: boolean;
};

export function PrivateRoute(props: PrivateRouteProps) {
  const { permission, strict } = props;

  if (
    (strict && Utility.getPermissionLevel() == permission) ||
    (!strict && Utility.getPermissionLevel() >= permission)
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}
