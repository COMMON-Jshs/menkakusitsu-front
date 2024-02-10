import { create } from "zustand";

type WrapperProps = {
  noHeader?: boolean;
  noFooter?: boolean;
};

export const useWrapperStore = create<WrapperProps>(() => ({
  noHeader: false,
  noFooter: false,
}));

export const setHeaderActive = (value: boolean) => {
  useWrapperStore.setState({
    noHeader: !value,
  });
};

export const setFooterActive = (value: boolean) => {
  useWrapperStore.setState({
    noFooter: !value,
  });
};
