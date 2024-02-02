import { create } from "zustand";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  IconButton,
} from "@mui/material";
import { ReactNode, forwardRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { defaultCallback, DialogProps } from ".";
import { useLocation } from "react-router-dom";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useCancelableDialogStore = create<DialogProps>((set) => ({
  title: "",
  content: "",
  onYes: undefined,
  close: () => set({ onYes: undefined }),
}));

function CancelableDialog() {
  const { title, content, onYes, close } = useCancelableDialogStore();
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location]);

  return (
    <Dialog
      open={Boolean(onYes)}
      onClose={() => {
        if (onYes) {
          onYes();
        }
        close();
      }}
      maxWidth="sm"
      TransitionComponent={Transition}
      fullWidth
    >
      <DialogTitle>
        {title}
        <IconButton
          onClick={() => {
            if (onYes) {
              onYes();
            }
            close();
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}

export default CancelableDialog;

export const openCancelableDialog = (
  title: ReactNode,
  content: ReactNode,
  onYes: Function = defaultCallback
) => {
  useCancelableDialogStore.setState({
    title: title,
    content: content,
    onYes: onYes,
  });
};
