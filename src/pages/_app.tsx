import { Outlet } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Popup from "@/components/popup";
import Firebase from "@/components/firebase";
import Particle from "@/components/particle";
import Theme from "@/components/theme";
import Navbar from "@/components/navbar";
import { useNavbar } from "@/hooks/useNavbar";

export default function RootLayout() {
  const { noHeader, noFooter } = useNavbar();

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
        <Theme.AddonComponent type={Theme.getThemeType()} />
        {!noHeader && <Navbar.HeaderComponent />}
        <Outlet />
        {!noFooter && <Navbar.FooterComponent />}
      </SnackbarProvider>
    </>
  );
}
