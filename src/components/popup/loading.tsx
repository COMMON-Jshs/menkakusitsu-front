import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { useLoadingStore } from "@/components/popup/hooks";

export function LoadingComponent() {
  const { isLoading, text } = useLoadingStore();

  return (
    <Backdrop
      open={isLoading}
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 10000,
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress />
        <Typography>{text}</Typography>
      </Box>
    </Backdrop>
  );
}
