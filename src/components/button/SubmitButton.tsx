import { Box, Button } from "@mui/material";

type SubmitButtonProps = {
  color: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
  [x: string]: unknown;
};

export function SubmitButton(props: SubmitButtonProps) {
  const { color, width = "100%", height = "58px", children, ...rest } = props;

  return (
    <Box sx={{ textAlign: "center", width: "100%", height: "100%" }}>
      <Button
        {...rest}
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: color,
          "&:hover": {
            backgroundColor: "#fff",
            color: color,
          },
          fontFamily: "BMDohyeon",
          height: height,
          width: width,
        }}
      >
        {children}
      </Button>
    </Box>
  );
}
