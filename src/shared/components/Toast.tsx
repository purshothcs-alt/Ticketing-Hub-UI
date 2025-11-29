import React from "react";
import { Alert, Snackbar } from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material";
interface ToastProps {
  open: boolean;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  handleClose: () => void;
}

export default function Toast({
  open,
  message,
  severity,
  handleClose,
}: ToastProps) {
  const onClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    handleClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert
        severity={severity}
        onClose={onClose}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
