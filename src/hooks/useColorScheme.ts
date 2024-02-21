import { create } from "zustand";

import { Storage } from "@/utils";

type ColorSchemeProps = {
  scheme: Storage.ColorScheme;
};

export const useColorScheme = create<ColorSchemeProps>(() => ({
  scheme: Storage.getColorScheme(),
}));

export function changeColorScheme(scheme: Storage.ColorScheme) {
  useColorScheme.setState({
    scheme: scheme,
  });
}
