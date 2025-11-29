import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_USER,
  DELETE_USER,
  EDIT_USER,
  GET_USER_BY_ID,
  GET_USERS,
  USERSBASEURL,
} from "../apiconfig/userManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

// ✅ RTK Query API Slice for user Management
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithInterceptors(USERSBASEURL),
  refetchOnFocus: true,
  tagTypes: ["Users"], // Capitalized for convention
  endpoints: (builder) => ({
    // 🟩 READ: Get all users
    getUsers: builder.query<
      any,
      {
        PageNumber?: number;
        PageSize?: number;
        SortField?: string;
        SortOrder?: boolean;
        RoleFilter?: string;
        StatusFilter?: boolean;
        DepartmentFilter?: string;
        SearchText?: string;
      }
    >({
     query: (filters) => {
    const params = new URLSearchParams();

  if (filters.PageNumber) params.append("PageNumber", String(filters.PageNumber));
    if (filters.PageSize) params.append("PageSize", String(filters.PageSize));
    if (filters.SortField) params.append("SortField", filters.SortField);
    if (filters.SortOrder !== undefined)
      params.append("SortOrder", String(filters.SortOrder));
    if (filters.RoleFilter) params.append("RoleFilter", filters.RoleFilter);
    if (filters.StatusFilter !== undefined)
      params.append("StatusFilter", String(filters.StatusFilter));
    if (filters.DepartmentFilter)
      params.append("DepartmentFilter", filters.DepartmentFilter);
    if (filters.SearchText) params.append("SearchText", filters.SearchText);

    return `${GET_USERS}?${params.toString()}`;
  },
      transformResponse: (response: any) => {
       const users = Array.isArray(response?.users)
      ? response.users.map((s: any) => ({
          id: s.id,
          employeeCode: s.employeeCode,
          fullName: s.fullName,
          email: s.email,
          roleName: s.roleName,
          departmentName: s.departmentName,
          isActive: s.isActive,
        }))
      : [];

    // Return both users array and metadata
    return {
      users,
      totalCount: response?.totalCount || 0,
      totalUsers: response?.totalUsers || 0,
      activeUsers: response?.activeUsers || 0,
      inactiveUsers: response?.inactiveUsers || 0,
      adminUsers: response?.adminUsers || 0,
    };
  },
      providesTags: (result) =>
        result
          ? [
              ...result?.users.map(({ id }: { id: string }) => ({
                type: "Users" as const,
                id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // 🟩 READ: Get single user by ID
    getUserById: builder.query({
      query: (userId) => ({
        url: `${GET_USER_BY_ID}/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // 🟦 CREATE: Add a new user
    createUser: builder.mutation({
      query: (newData) => ({
        url: CREATE_USER,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // 🟨 UPDATE: Edit an existing user
    updateUser: builder.mutation({
      query: ({ userId, ...updatedData }) => ({
        url: `${EDIT_USER}/${userId}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),

    // 🟥 DELETE: Remove a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${DELETE_USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
});

// ✅ Auto-generated hooks (consistent names)
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
