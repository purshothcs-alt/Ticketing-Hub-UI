let setLoadingFn: ((state: boolean) => void) | null = null;

export const registerLoader = (handler: (state: boolean) => void) => {
  setLoadingFn = handler;
};

export const showLoader = () => {
  setLoadingFn?.(true);
};

export const hideLoader = () => {
  setLoadingFn?.(false);
};
