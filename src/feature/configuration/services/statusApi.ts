import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CREATE_STATUS,
  DELETE_STATUS,
  EDIT_STATUS,
  GET_STATUS_BY_ID,
  GET_STATUSES,
  STATUSBASEURL,
} from "../apiconfig/statusManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

export const statusApi = createApi({
  reducerPath: "statusApi",

  baseQuery: baseQueryWithInterceptors(STATUSBASEURL),

  refetchOnFocus: true,
  tagTypes: ["Status"],

  endpoints: (builder) => ({
    getStatuses: builder.query<
      {
        items: {
          id: string;
          statusName: string;
          colorCode: string;
          sortOrder: number;
          isActive: boolean;
          isFinalStatus: boolean;
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

        return `${GET_STATUSES}?${params.toString()}`;
      },

      transformResponse: (response: any) => {
        const items = Array.isArray(response?.statusDtos)
          ? response.statusDtos.map((s: any) => ({
              id: s.id,
              statusName: s.statusName,
              colorCode: s.colorCode,
              sortOrder: s.sortOrder,
              isActive: s.isActive,
              isFinalStatus: s.isFinalStatus,
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
                type: "Status" as const,
                id,
              })),
              { type: "Status", id: "LIST" },
            ]
          : [{ type: "Status", id: "LIST" }],
    }),
    // ✅ READ: Get single status
    getStatusById: builder.query({
      query: (id) => `${GET_STATUS_BY_ID}/${id}`,
      providesTags: (result, error, id) => [{ type: "Status", id }],
    }),

    // ✅ CREATE
    createStatus: builder.mutation({
      query: (newData) => ({
        url: CREATE_STATUS,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Status", id: "LIST" }],
    }),

    // ✅ UPDATE
    updateStatus: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${EDIT_STATUS}/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Status", id },
        { type: "Status", id: "LIST" },
      ],
    }),

    // ✅ DELETE
    deleteStatus: builder.mutation({
      query: (id) => ({
        url: `${DELETE_STATUS}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Status", id },
        { type: "Status", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetStatusesQuery,
  useGetStatusByIdQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} = statusApi;
