import { useEffect } from "react";
import { LoginPanel } from "../../components";
import {
  setFooterActive,
  setHeaderActive,
} from "../../components/router/RouteWrapper";

export default function Login() {
  useEffect(() => {
    setHeaderActive(false);
    setFooterActive(false);
    return () => {
      setHeaderActive(true);
      setFooterActive(true);
    };
  });

  return (
    <>
      <LoginPanel />
    </>
  );
}
