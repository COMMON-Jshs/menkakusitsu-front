import { Box, CircularProgress } from "@mui/material";
import { useLoadingStore } from "@/components/popup/hooks";

export function LoadingComponent() {
  const { isLoading, text } = useLoadingStore();

  return (
    isLoading && (
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 100,
        }}
      >
        <CircularProgress />
        {text}
      </Box>
    )
  );
}
