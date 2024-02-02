import { Navigate, Outlet } from "react-router-dom";
import { getPermissionLevel } from "../../utils/Utility";

interface PrivateRouteProps {
  permission: number;
  only?: boolean;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const { permission, only } = props;

  if (
    (only && getPermissionLevel() == permission) ||
    (!only && getPermissionLevel() >= permission)
  ) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default PrivateRoute;
