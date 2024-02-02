import { useEffect } from "react";
import { RegisterPanel } from "../../components";
import { setHeaderActive } from "../../components/router/RouteWrapper";

export default function Register() {
  useEffect(() => {
    setHeaderActive(false);
    return () => {
      setHeaderActive(true);
    };
  });

  return (
    <>
      <RegisterPanel />
    </>
  );
}
