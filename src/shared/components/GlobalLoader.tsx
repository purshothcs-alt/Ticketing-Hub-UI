import { useEffect, useState } from "react";
import { CircularProgress, Backdrop } from "@mui/material";
import { registerLoader } from "../../services/loaderService";

export default function GlobalLoader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    registerLoader((state: boolean | ((prevState: boolean) => boolean)) => setOpen(state));
  }, []);

  return (
    <Backdrop open={open} sx={{ zIndex: 1300 }}>
      <CircularProgress size={50} />
    </Backdrop>
  );
}
