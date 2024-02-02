import { useEffect } from "react";
import { create } from "zustand";

const useActionStore = create<{
  actions: { [key: string]: Function };
  currentKey?: string;
}>((set) => ({
  actions: {},
}));

function LazyAction() {
  const { actions, currentKey } = useActionStore();
  console.log(actions);
  useEffect(() => {
    if (currentKey && actions[currentKey]) {
      actions[currentKey]();
      useActionStore.setState({
        currentKey: undefined,
      });
    }
  }, [currentKey]);
  return <></>;
}

export default LazyAction;

export const pushAction = (key: string, action: Function) => {
  useActionStore.setState((state) => {
    return {
      actions: { ...state.actions, [key]: action },
    };
  });
};

export const runAction = (key: string) => {
  useActionStore.setState({
    currentKey: key,
  });
};

export const clearActions = () => {
  useActionStore.setState({
    actions: {},
    currentKey: undefined,
  });
};
