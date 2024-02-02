import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logPageView } from "./Firebase.js";

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const host = window.location.href;
    if (
      !host.startsWith("localhost") &&
      !host.startsWith("127.") &&
      !host.startsWith("192.")
    ) {
      logPageView();
    }
  }, [location]);

  return <></>;
}

export default RouteTracker;
