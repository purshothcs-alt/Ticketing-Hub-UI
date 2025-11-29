import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_PRIORITY,
  DELETE_PRIORITY,
  EDIT_PRIORITY,
  GET_PRIORITY,
  GET_PRIORITY_BY_ID,
  PRIORITYBASEURL,
} from "../apiconfig/priorityManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

export const priorityApi = createApi({
  reducerPath: "priorityApi",

  baseQuery: baseQueryWithInterceptors(PRIORITYBASEURL),

  refetchOnFocus: true,
  tagTypes: ["Priority"],

  endpoints: (builder) => ({
    // ✅ READ: Get priorities with paging + sorting + search (same as statuses)
    getPriorities: builder.query<
      {
        items: {
          id: string;
          priorityName: string;
          colorCode: string;
          slaHours: number;
          isActive: boolean;
        }[];
        totalCount: number;
      },
      {
        PageNumber?: number;
        PageSize?: number;
        SortField?: string;
        SortOrder?: boolean;
        SearchText?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters?.PageNumber !== undefined)
          params.append("PageNumber", String(filters.PageNumber));

        if (filters?.PageSize !== undefined)
          params.append("PageSize", String(filters.PageSize));

        if (filters?.SortField) params.append("SortField", filters.SortField);

        if (filters?.SortOrder !== undefined)
          params.append("SortOrder", String(filters.SortOrder));

        if (filters?.SearchText)
          params.append("SearchText", filters.SearchText);

        return `${GET_PRIORITY}?${params.toString()}`;
      },

      transformResponse: (response: any) => {
        const items = Array.isArray(response?.priorityDtos)
          ? response.priorityDtos.map((p: any) => ({
              id: p.id,
              priorityName: p.priorityName,
              colorCode: p.colorCode,
              slaHours: p.slaHours,
              isActive: p.isActive,
            }))
          : [];

        return {
          items,
          totalCount: response?.totalCount ?? items.length,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Priority" as const,
                id,
              })),
              { type: "Priority", id: "LIST" },
            ]
          : [{ type: "Priority", id: "LIST" }],
    }),

    // ✅ SINGLE PRIORITY
    getPriorityById: builder.query({
      query: (id) => `${GET_PRIORITY_BY_ID}/${id}`,
      providesTags: (result, error, id) => [{ type: "Priority", id }],
    }),

    // ✅ CREATE
    createPriority: builder.mutation({
      query: (newData) => ({
        url: CREATE_PRIORITY,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Priority", id: "LIST" }],
    }),

    // ✅ UPDATE
    updatePriority: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${EDIT_PRIORITY}/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Priority", id },
        { type: "Priority", id: "LIST" },
      ],
    }),

    // ✅ DELETE
    deletePriority: builder.mutation({
      query: (id) => ({
        url: `${DELETE_PRIORITY}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Priority", id },
        { type: "Priority", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPrioritiesQuery,
  useGetPriorityByIdQuery,
  useCreatePriorityMutation,
  useUpdatePriorityMutation,
  useDeletePriorityMutation,
} = priorityApi;
