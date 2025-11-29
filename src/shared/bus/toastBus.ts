let toastHandler: any = null;

export const registerToast = (handler: any) => {
  toastHandler = handler;
};

export const toastSuccess = (msg: string) => {
  toastHandler?.showToast(msg, "success");
};

export const toastError = (msg: string) => {
  toastHandler?.showToast(msg, "error");
};
