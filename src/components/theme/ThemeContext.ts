import { createContext } from "react";

type ThemeContextType = {
  style: string;
  toggleStyle: Function;
};

export const ThemeContext = createContext<ThemeContextType>({
  style: "light",
  toggleStyle: () => {},
});
