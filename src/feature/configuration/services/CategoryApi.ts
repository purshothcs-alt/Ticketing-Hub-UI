import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CATEGORY_BASE_URL,
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID,
} from "../apiconfig/categoryManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

// ✅ Category API with pagination, sorting, search (matches statusApi)
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithInterceptors(CATEGORY_BASE_URL),

  refetchOnFocus: true,
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // ✅ READ: Get categories with server-side filters
    getCategories: builder.query<
      {
        items: {
          id: string;
          categoryName: string;
          description: string;
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

        return `${GET_CATEGORIES}?${params.toString()}`;
      },

      transformResponse: (response: any) => {
        // ✅ your backend returns { categories: [...] }
        const items = Array.isArray(response?.categories)
          ? response.categories.map((c: any) => ({
              id: c.id,
              categoryName: c.categoryName,
              description: c.description,
              isActive: c.isActive,
            }))
          : [];

        return {
          items,
          totalCount: items.length, // ✅ backend does not send totalCount
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // ✅ READ: Single Category
    getCategoryById: builder.query({
      query: (id) => `${GET_CATEGORY_BY_ID}/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // ✅ CREATE
    createCategory: builder.mutation({
      query: (newData) => ({
        url: CREATE_CATEGORY,
        method: "POST",
        body: newData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // ✅ UPDATE
    updateCategory: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${EDIT_CATEGORY}/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // ✅ DELETE
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${DELETE_CATEGORY}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
