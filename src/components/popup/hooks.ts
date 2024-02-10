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

export const openConfirmDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction
) => {
  useDialogStore.setState({
    isOpened: true,
    title: title,
    content: content,
    onYes: onYes || (() => {}),
  });
};

export const openYesNoDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes?: VoidFunction,
  onNo?: VoidFunction
) => {
  useDialogStore.setState({
    isOpened: true,
    title: title,
    content: content,
    onYes: onYes || (() => {}),
    onNo: onNo || (() => {}),
  });
};

export const openCancelableDialog = (
  title: ReactNode,
  content: ReactNode,
  onCancel?: VoidFunction
) => {
  useDialogStore.setState({
    isOpened: true,
    title: title,
    content: content,
    onCancel: onCancel || (() => {}),
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
