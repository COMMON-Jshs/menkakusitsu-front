import { SnackbarProvider } from "notistack";
import { Outlet } from "react-router-dom";

import Popup from "@/components/popup";
import Firebase from "@/components/firebase";
import Particle from "@/components/particle";
import Theme from "@/components/theme";
import Navbar from "@/components/navbar";
import { useNavbar } from "@/hooks/useNavbar";

export function WrapperComponent() {
  const { noHeader, noFooter } = useNavbar();

  const type = Theme.getThemeType();

  return (
    <>
      <Popup.DialogContainer />
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
