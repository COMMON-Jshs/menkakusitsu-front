import { SnackbarProvider } from "notistack";
import { Outlet } from "react-router-dom";

import { Popup, Firebase, Navbar, Theme, Particle } from "@/components";
import { useWrapperStore } from "@/components/router/hooks";

export function WrapperComponent() {
  const { noHeader, noFooter } = useWrapperStore();

  const type = Theme.getThemeType();

  return (
    <>
      <Popup.DialogComponent />
      <Popup.LoadingComponent />
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Firebase.FirebaseComponent />
        <Firebase.TrackerComponent />
        <Particle.ParticleComponent />
        <Theme.AddonComponent type={type} />
        {!noHeader && <Navbar.HeaderComponent />}
        <Outlet />
        {!noFooter && <Navbar.FooterComponent />}
      </SnackbarProvider>
    </>
  );
}
