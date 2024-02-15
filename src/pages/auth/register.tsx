import { useEffect } from "react";
import { RegisterPanel, Router } from "@/components";

export function Register() {
  useEffect(() => {
    Router.setHeaderActive(false);
    return () => {
      Router.setHeaderActive(true);
    };
  }, []);

  return (
    <>
      <RegisterPanel />
    </>
  );
}
