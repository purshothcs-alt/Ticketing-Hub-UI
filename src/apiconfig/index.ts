export var baseApiUrl = import.meta.env.VITE_BASE_URL;
export const baseurl = baseApiUrl + "api/";
export const SECRET_KEY = import.meta.env.REACT_APP_CRYPTO_SECRET || "default_secret";