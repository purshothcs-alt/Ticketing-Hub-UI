import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  CreateModuleRequest,
  ModuleDetails,
  ModuleDetailsResponse,
  ModuleListResponse,
  UpdateModuleRequest,
} from "../types";

import {
  CREATE_MODULE,
  DELETE_MODULE,
  GET_MODULE_BY_ID,
  GET_MODULES,
  MODULE_BASE_URL,
  MODULE_WITH_PERMISSION,
  UPDATE_MODULE,
} from "../apiconfig/moduleManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

export const moduleApi = createApi({
  reducerPath: "moduleApi",
  baseQuery: baseQueryWithInterceptors(MODULE_BASE_URL),

  tagTypes: ["Modules", "Module", "ModulePermission"],

  endpoints: (builder) => ({
    /** ✅ GET — Paginated List */
    getModules: builder.query<
      ModuleListResponse,
      {
        PageNumber: number;
        PageSize: number;
        SearchText?: string;
        SortField?: string;
        SortOrder?: boolean;
      }
    >({
      query: (params) => ({
        url: GET_MODULES,
        method: "GET",
        params,
      }),
      providesTags: ["Modules"],
    }),

    /** ✅ GET — Module wrapped in { module: {...} } */
    getModuleById: builder.query<ModuleDetailsResponse, string>({
      query: (id) => ({
        url: `${GET_MODULE_BY_ID}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Module", id }],
    }),
    getModuleByPermission: builder.query<ModuleDetails[], void>({
      query: () => ({
        url: MODULE_WITH_PERMISSION,
        method: "GET",
      }),
      providesTags: [{ type: "ModulePermission", id: "LIST" }],
    }),

    /** ✅ POST — Create */
    createModule: builder.mutation<void, CreateModuleRequest>({
      query: (body) => ({
        url: CREATE_MODULE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Modules"],
    }),

    /** ✅ PUT — Update */
    updateModule: builder.mutation<void, UpdateModuleRequest>({
      query: (body) => ({
        url: UPDATE_MODULE, // ✅ no /id appended
        method: "PUT",
        body, // ✅ full object in body
      }),
      invalidatesTags: (result, error, body) => [
        "Modules",
        { type: "Module", id: body.moduleId },
      ],
    }),

    /** ✅ DELETE */
    deleteModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `${DELETE_MODULE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Modules"],
    }),
  }),
});

export const {
  useGetModulesQuery,
  useGetModuleByIdQuery,
  useGetModuleByPermissionQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} = moduleApi;
