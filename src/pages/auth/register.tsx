import { useEffect } from "react";

import RegisterPanel from "@/components/panels/RegisterPanel";
import { setHeaderActive } from "@/hooks/useNavbar";

export function Register() {
  useEffect(() => {
    setHeaderActive(false);
    return () => {
      setHeaderActive(true);
    };
  }, []);

  return (
    <>
      <RegisterPanel />
    </>
  );
}
