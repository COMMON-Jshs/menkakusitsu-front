import React from "react";
import ReactDOM from "react-dom/client";

import App from "@/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((e) => console.log(e));
  });
}
