// === rolesApi.ts (Updated for response { roles: [...] }) ===
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  ROLE_BASE_URL,
  GET_ROLES,
  GET_ROLE_BY_ID,
  CREATE_ROLE,
  EDIT_ROLE,
  DELETE_ROLE,
} from '../apiconfig/roleManagement';
import { baseQueryWithAuth } from '../../../services/baseQuery';
import { baseQueryWithInterceptors } from '../../../services/serviceApi';

export interface RolesQueryParams {
  PageNumber?: number;
  PageSize?: number;
  SortField?: string;
  SortOrder?: boolean; // true = asc, false = desc
  SearchText?: string;
}

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: baseQueryWithInterceptors(ROLE_BASE_URL),
  refetchOnFocus: true,
  tagTypes: ['Role'],

  endpoints: (builder) => ({
    // ✅ GET ALL ROLES — Backend returns: { roles: [...] }
    getRoles: builder.query<
      { items: any[]; totalCount: number; modules: any[] },
      RolesQueryParams
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.PageNumber) params.append('PageNumber', String(filters.PageNumber));
        if (filters?.PageSize) params.append('PageSize', String(filters.PageSize));
        if (filters?.SortField) params.append('SortField', filters.SortField);
        if (filters?.SortOrder !== undefined) params.append('SortOrder', String(filters.SortOrder));
        if (filters?.SearchText) params.append('SearchText', filters.SearchText);

        return `${GET_ROLES}?${params.toString()}`;
      },

      // ✅ Transform to DataGrid friendly structure
      transformResponse: (response: any) => {
        const items = Array.isArray(response?.roles)
          ? response.roles.map((r: any) => ({
              id: r.id,
              roleName: r.roleName,
              description: r.description,
              permissions: r.permissions ?? [],
            }))
          : [];

        return {
          items,
          totalCount: items.length, // ✅ Option A: Simulated server pagination
          modules: response?.modules ?? [], // if API provides modules
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r: any) => ({ type: 'Role' as const, id: r.id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),

    // ✅ GET BY ID
    getRoleById: builder.query({
      query: (id) => `${id}${GET_ROLE_BY_ID}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),

    // ✅ CREATE ROLE (body: { roleName, description, moduleIds, permissionIds })
    createRole: builder.mutation({
      query: (data) => ({
        url: CREATE_ROLE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),

    // ✅ UPDATE ROLE — body: { id, roleName, description, permissions[] }
    updateRole: builder.mutation({
      query: (body ) => ({
        url: `${EDIT_ROLE}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    // ✅ DELETE ROLE
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `${DELETE_ROLE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Role', id },
        { type: 'Role', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;