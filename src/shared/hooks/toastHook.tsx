import { useState } from "react";

export type ToastSeverity = "success" | "error" | "warning" | "info";

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("info");

  const showToast = (
    msg: string,
    sev: ToastSeverity = "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const hideToast = () => setOpen(false);

  return {
    open,
    message,
    severity,
    showToast,
    hideToast,
  };
}
