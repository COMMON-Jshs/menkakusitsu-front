import { create } from "zustand";
import { ReactNode } from "react";

type DialogProps = {
  isOpened: boolean;
  title: ReactNode;
  content: ReactNode;
  onYes?: VoidFunction;
  onNo?: VoidFunction;
  onCancel?: VoidFunction;
  close: VoidFunction;
};

export const useDialogStore = create<DialogProps>((set) => ({
  isOpened: false,
  title: "",
  content: "",
  onYes: undefined,
  onNo: undefined,
  onCancel: undefined,
  close: () =>
    set({
      isOpened: false,
      onYes: undefined,
      onNo: undefined,
      onCancel: undefined,
    }),
}));

export const openDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction,
  onNo?: VoidFunction,
  onCancel?: VoidFunction
) => {
  useDialogStore.setState({
    isOpened: true,
    title: title,
    content: content,
    onYes: onYes,
    onNo: onNo,
    onCancel: onCancel,
  });
};

type LoadingProps = {
  isLoading: boolean;
  text: string;
};

export const useLoadingStore = create<LoadingProps>(() => ({
  isLoading: false,
  text: "",
}));

export const startLoading = (text: string) => {
  useLoadingStore.setState({
    isLoading: true,
    text: text,
  });
};

export const stopLoading = () => {
  useLoadingStore.setState({
    isLoading: false,
  });
};
