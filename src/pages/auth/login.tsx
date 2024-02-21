import { useEffect } from "react";

import LoginPanel from "@/components/panels/LoginPanel";
import { setFooterActive, setHeaderActive } from "@/hooks/useNavbar";

export function LoginScreen() {
  useEffect(() => {
    setHeaderActive(false);
    setFooterActive(false);
    return () => {
      setHeaderActive(true);
      setFooterActive(true);
    };
  }, []);

  return (
    <>
      <LoginPanel />
    </>
  );
}
