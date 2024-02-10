import { createContext } from "react";

type ContextType = {
  style: string;
  toggleStyle: VoidFunction;
};

export const Context = createContext<ContextType>({
  style: "light",
  toggleStyle: () => {},
});
