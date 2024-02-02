import { createContext } from "react";

type ThemeContextType = {
  style: string;
  toggleStyle: VoidFunction;
};

export const ThemeContext = createContext<ThemeContextType>({
  style: "light",
  toggleStyle: () => {},
});
