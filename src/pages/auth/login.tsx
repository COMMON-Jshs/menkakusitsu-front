import { useEffect } from "react";

import { LoginPanel, Router } from "@/components";

export function Login() {
  useEffect(() => {
    Router.setHeaderActive(false);
    Router.setFooterActive(false);
    return () => {
      Router.setHeaderActive(true);
      Router.setFooterActive(true);
    };
  }, []);

  return (
    <>
      <LoginPanel />
    </>
  );
}
