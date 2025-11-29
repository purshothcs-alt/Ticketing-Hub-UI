import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CATEGORY_DROPDOWN,
  DROPDOWNSBASEURL,
  GET_DEPARTMENTS,
  GET_MANAGERS,
  GET_PRIORITIES,
  GET_ROLES,
  GET_STATUSES,
  GET_TICKET_TYPES,
  GET_SUBCATEGORIES,
} from "../apiconfig/dropdown";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

// ✅ RTK Query API Slice for dropdown
export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
  baseQuery: baseQueryWithInterceptors(DROPDOWNSBASEURL),
  refetchOnFocus: false,
  tagTypes: [
    "Departments",
    "Statuses",
    "Roles",
    "Priorities",
    "Managers",
    "Category",
    "TicketTypes",
    "Subcategories",
  ],

  endpoints: (builder) => ({

    // 🟩 READ: Get all departments
    getDepartments: builder.query<any, void>({
      query: () => GET_DEPARTMENTS,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Departments"],
    }),

    // 🟩 READ: Get all Priorities
    getPriorities: builder.query<any, void>({
      query: () => GET_PRIORITIES,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Priorities"],
    }),

    // 🟩 READ: Get all statuses
    getStatuses: builder.query<any, void>({
      query: () => GET_STATUSES,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Statuses"],
    }),

    // 🟩 READ: Get all roles
    getRoles: builder.query<any, void>({
      query: () => GET_ROLES,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Roles"],
    }),

    // 🟩 READ: Get all managers
    getManagers: builder.query<any, void>({
      query: () => GET_MANAGERS,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Managers"],
    }),

    // 🟩 READ: Get all categories
    getCategoryDropdowns: builder.query<any, void>({
      query: () => CATEGORY_DROPDOWN,
      transformResponse: (response: any) =>
        (Array.isArray(response) ? response : []).map((s: any) => ({
          id: s.id,
          name: s.name,
        })),
      providesTags: ["Category"],
    }),

    // 🟩 READ: Get all Ticket Types
   getTicketTypes: builder.query<any[], void>({
  query: () => GET_TICKET_TYPES,
  transformResponse: (response: any) =>
    (response?.ticketTypes ?? []).map((t: any) => ({
      id: t.id,
      name: t.typeName,   // correct field
    })),
  providesTags: ["TicketTypes"],
}),


    // 🟩 READ: Get all Subcategories
   getSubcategories: builder.query<any, { categoryId: string }>({
  query: ({ categoryId }) => `${GET_SUBCATEGORIES}?CategoryId=${categoryId}`,
  transformResponse: (response: any) => {
    const data = Array.isArray(response) ? response : [];

    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
    }));
  },
}),

  }),
});

// Auto-generated hooks
export const {
  useGetDepartmentsQuery,
  useGetStatusesQuery,
  useGetPrioritiesQuery,
  useGetRolesQuery,
  useGetManagersQuery,
  useGetCategoryDropdownsQuery,
  useGetTicketTypesQuery,
  useGetSubcategoriesQuery,
} = dropdownApi;
