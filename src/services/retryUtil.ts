export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const exponentialBackoff = (retryCount: number, baseDelay = 500) => {
  return baseDelay * Math.pow(2, retryCount); 
};
