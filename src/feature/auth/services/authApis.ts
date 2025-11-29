import { createApi } from "@reduxjs/toolkit/query/react";
import { AUTHBASEURL, LOGIN, CHANGE_PASSWORD, FORGOT_PASSWORD } from "../apiconfig/auth";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";



// ✅ RTK Query API Slice for user Management
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithInterceptors(AUTHBASEURL),
  refetchOnFocus: true,
  tagTypes: ["Auth"], // Capitalized for convention
  endpoints: (builder) => ({

      login: builder.mutation({
      query: (newData) => ({
        url: LOGIN,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Auth", id: "LIST" }],
  }),

    forgotPassword: builder.mutation({
      query: (newData) => ({
        url: FORGOT_PASSWORD,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Auth", id: "LIST" }],
  }),

    changePassword: builder.mutation({
      query: (newData) => ({
        url: CHANGE_PASSWORD,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Auth", id: "LIST" }],
  })
  }),
});

// ✅ Auto-generated hooks (consistent names)
export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
} = authApi;
