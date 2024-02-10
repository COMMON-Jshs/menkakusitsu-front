import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { ReactElement, forwardRef } from "react";

import { useDialogStore } from "@/components/popup/hooks";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function DialogComponent() {
  const { isOpened, title, content, onYes, onNo, onCancel, close } =
    useDialogStore();

  return (
    <Dialog
      open={isOpened}
      maxWidth="sm"
      TransitionComponent={Transition}
      fullWidth
    >
      <DialogTitle>
        {title}
        {onCancel && (
          <IconButton
            onClick={() => {
              onCancel();
              close();
            }}
          />
        )}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onYes) {
              onYes();
            }
            close();
          }}
        >
          확인
        </Button>
        {onNo && (
          <Button
            onClick={() => {
              onNo();
              close();
            }}
          >
            아니오
          </Button>
        )}
        {onCancel && (
          <Button
            onClick={() => {
              onCancel();
              close();
            }}
          >
            취소
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
