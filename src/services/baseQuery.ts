// src/services/baseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../shared/utils/helper";

export const baseQueryWithAuth = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });
