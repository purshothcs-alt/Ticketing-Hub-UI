import { createApi } from "@reduxjs/toolkit/query/react";
import { CREATE_DEPARTMENT, DELETE_DEPARTMENT, DEPARTMENTSBASEURL, EDIT_DEPARTMENT, GET_DEPARTMENT_BY_ID, GET_DEPARTMENTS } from "../apiconfig/department";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";


// ✅ RTK Query API Slice for user Management
export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: baseQueryWithInterceptors(DEPARTMENTSBASEURL),
  refetchOnFocus: true,
  tagTypes: ["Departments"], // Capitalized for convention
  endpoints: (builder) => ({
    // 🟩 READ: Get all departments
    getDepartments: builder.query<any,void>({
     query: () => {
    return `${GET_DEPARTMENTS}`;
  },
      transformResponse: (response: any) => {
       const departments = Array.isArray(response?.departments)
      ? response.departments.map((s: any) => ({
            id: s.id,
            departmentName: s.departmentName,
            description: s.description,
            managerName: s.managerName,
            managerEmail: s.managerEmail,
            memberCount: s.memberCount,
            isActive: s.isActive
        }))
      : [];

    // Return both departments array and metadata
    return {
      departments,
      totalDepartments: response?.totalDepartments || 0,
      activeDepartments: response?.activeDepartments || 0,
      totalMembers: response?.totalMembers || 0,
      averageTeamSize: response?.averageTeamSize || 0,
    };
  },
      providesTags: (result) =>
        result
          ? [
              ...result?.departments.map(({ id }: { id: string }) => ({
                type: "Departments" as const,
                id,
              })),
              { type: "Departments", id: "LIST" },
            ]
          : [{ type: "Departments", id: "LIST" }],
    }),

    // 🟩 READ: Get single department by ID
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `${GET_DEPARTMENT_BY_ID}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Departments", id }],
    }),

    // 🟦 CREATE: Add a new department
    createDepartment: builder.mutation({
      query: (newData) => ({
        url: CREATE_DEPARTMENT,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Departments", id: "LIST" }],
    }),

    // 🟨 UPDATE: Edit an existing department
    updateDepartment: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${EDIT_DEPARTMENT}/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Departments", id },
        { type: "Departments", id: "LIST" },
      ],
    }),

    // 🟥 DELETE: Remove a department
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `${DELETE_DEPARTMENT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Departments", id },
        { type: "Departments", id: "LIST" },
      ],
    }),
  }),
});

// ✅ Auto-generated hooks (consistent names)
export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;