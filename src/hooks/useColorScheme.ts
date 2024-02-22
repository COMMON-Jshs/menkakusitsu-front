import { create } from "zustand";

import { Storage } from "@/utils";
import { setColorScheme } from "@/utils/Storage";

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
  setColorScheme(scheme);
}
