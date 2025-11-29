import { fetchBaseQuery, type BaseQueryApi, type FetchArgs } from "@reduxjs/toolkit/query/react";
import { hideLoader, showLoader } from "./loaderService";
import { toastError, toastSuccess } from "../shared/bus/toastBus";
import type { BaseQueryFn, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { getToken } from "../shared/utils/helper";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
const backoff = (retry: number) => 300 * 2 ** retry;

export const baseQueryWithInterceptors = (
  baseUrl: string
): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> => {
  const rawBaseQuery =fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers) => {
        const token = getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
      },
    });
  return async (
    args: string | FetchArgs,
    api,
    extraOptions: {}
  ): Promise<
    | { data: unknown; meta: FetchBaseQueryMeta | undefined }
    | { error: FetchBaseQueryError; meta: FetchBaseQueryMeta | undefined }
  > => {
    let retry = 0;
    const maxRetry = 3;

    while (true) {
      try {
        showLoader();

        const result = (await rawBaseQuery(
          args,
          api,
          extraOptions
        )) as
          | { data: any; meta: FetchBaseQueryMeta }
          | { error: FetchBaseQueryError; meta: FetchBaseQueryMeta };

        // 🔥 Success toast
        if ("data" in result && result.data?.message) {
          toastSuccess(result.data.message);
        }
        // 🔥 Error toast
        if ("error" in result && result.error?.data) {
          const err = result.error.data as any;

          // Case 1: ASP.NET Core validation errors
          if (err?.errors && typeof err.errors === "object") {
            const messages = Object.values(err.errors)
              .flat()
              .filter((msg) => typeof msg === "string");
            messages.forEach((msg) => toastError(msg));
          }
          // Case 2: standard { message }
          else if (err?.message) {
            toastError(err.message);
          }
          // Case 4: fallback: { detail }
          else if (err?.detail) {
            toastError(err.detail);
          }
          // Case 3: fallback: { title }
          else if (!err?.message && !err?.detail && err?.title) {
            toastError(err.title);
          }
          // Case 4: unknown fallback
          else {
            toastError("An unexpected error occurred.");
          }
        }

        return result;
      } catch (err) {
        retry++;
        if (retry > maxRetry) {
          toastError("Server is not responding.");
          return { error: err as FetchBaseQueryError, meta: undefined };
        }
        await wait(backoff(retry));
      } finally {
        hideLoader();
      }
    }
  };
};