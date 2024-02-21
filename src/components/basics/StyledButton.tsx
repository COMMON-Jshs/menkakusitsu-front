import { Box, Button, ButtonProps, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

import { TitleText } from "@/components/basics/StyledText";

type SubmitButtonProps = ButtonProps & {
  backGroundColor: string;
  width?: string;
  height?: string;
  children?: ReactNode;
  textProps?: TypographyProps;
};

export function SubmitButton(props: SubmitButtonProps) {
  const {
    backGroundColor,
    width = "100%",
    height = "58px",
    children,
    sx,
    textProps,
  } = props;

  return (
    <Box sx={{ textAlign: "center", width: "100%", height: "100%" }}>
      <Button
        {...props}
        type="submit"
        variant="contained"
        fullWidth
        sx={[
          ...(Array.isArray(sx) ? sx : [sx]),
          {
            backgroundColor: backGroundColor,
            "&:hover": {
              backgroundColor: "#fff",
              color: backGroundColor,
            },
            height: height,
            width: width,
          },
        ]}
      >
        <TitleText {...textProps}>{children}</TitleText>
      </Button>
    </Box>
  );
}
