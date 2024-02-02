import { SnackbarProvider } from "notistack";
import { Outlet } from "react-router-dom";
import FirebaseManager from "../FirebaseManager";
import RouteTracker from "../RouteTracker";
import { create } from "zustand";
import FixedNavbar from "../navbar";
import Footer from "../Footer";
import {
  CancelableDialog,
  ConfirmDialog,
  WaitDialog,
  YesNoDialog,
} from "../popup";
import { getThemeType, ThemeAddon } from "../theme";
import ParticleManager from "../particles";

export interface RouteWrapperProps {
  noHeader?: boolean;
  noFooter?: boolean;
}

const useRouteWrapperStore = create<RouteWrapperProps>(() => ({
  noHeader: false,
  noFooter: false,
}));

export default function RouteWrapper() {
  const { noHeader, noFooter } = useRouteWrapperStore();

  const type = getThemeType();

  return (
    <>
      <ConfirmDialog />
      <WaitDialog />
      <YesNoDialog />
      <CancelableDialog />
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <FirebaseManager />
        <RouteTracker />
        <ParticleManager />
        <ThemeAddon type={type} />
        {!noHeader && <FixedNavbar />}
        <Outlet />
        {!noFooter && <Footer />}
      </SnackbarProvider>
    </>
  );
}

export const setHeaderActive = (value: boolean) => {
  useRouteWrapperStore.setState({
    noHeader: !value,
  });
};

export const setFooterActive = (value: boolean) => {
  useRouteWrapperStore.setState({
    noFooter: !value,
  });
};
