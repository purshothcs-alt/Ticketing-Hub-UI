import { createApi } from "@reduxjs/toolkit/query/react";
import {
  SUBCATEGORYBASEURL,
  GET_SUBCATEGORIES,
  GET_SUBCATEGORY_BY_ID,
  CREATE_SUBCATEGORY,
  EDIT_SUBCATEGORY,
  DELETE_SUBCATEGORY,
} from "../apiconfig/subcategoryManagement";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";

/** ===== Backend DTO from API ===== */
export interface SubCategoryDto {
  id: string;
  categoryId: string;
  subCategoryName: string;
  description: string | null;
  isActive: boolean;
}

/** ===== UI-friendly format ===== */
export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

/** ===== Query params for server-side filtering ===== */
export interface SubCategoryQueryParams {
  PageNumber?: number;
  PageSize?: number;
  SortField?: string;
  SortOrder?: boolean;
  SearchText?: string;
  CategoryId?: string;
}

/** ===== API Response shape ===== */
interface SubCategoryResponse {
  rows: SubCategory[];
  rowCount: number;
}

export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
  baseQuery: baseQueryWithInterceptors(SUBCATEGORYBASEURL),

  refetchOnFocus: true,
  tagTypes: ["SubCategory"],

  endpoints: (builder) => ({
    /** ✅ GET (server-side filtering + sorting + pagination) */
    getSubCategories: builder.query<
      SubCategoryResponse,
      SubCategoryQueryParams
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        // ✅ Must ALWAYS send value even if 0
        params.append("PageNumber", String(filters.PageNumber ?? 1));
        params.append("PageSize", String(filters.PageSize ?? 10));

        // ✅ SortField
        if (filters.SortField !== undefined)
          params.append("SortField", filters.SortField);

        // ✅ SortOrder (boolean - must allow false)
        if (filters.SortOrder !== undefined)
          params.append("SortOrder", String(filters.SortOrder));

        // ✅ Search Text (empty string allowed!)
        params.append("SearchText", filters.SearchText ?? "");

        // ✅ CategoryId (allow empty)
        params.append("CategoryId", filters.CategoryId ?? "");

        return `${GET_SUBCATEGORIES}?${params.toString()}`;
      },

      transformResponse: (response: any): SubCategoryResponse => {
        const list: SubCategoryDto[] = Array.isArray(response?.subCategoryDtos)
          ? response.subCategoryDtos
          : [];

        return {
          rows: list.map((s: SubCategoryDto) => ({
            id: s.id,
            categoryId: s.categoryId,
            name: s.subCategoryName,
            description: s.description,
            isActive: s.isActive,
          })),
          rowCount: response?.totalCount ?? list.length,
        };
      },

      providesTags: (result) =>
        result?.rows
          ? [
              ...result.rows.map((row) => ({
                type: "SubCategory" as const,
                id: row.id,
              })),
              { type: "SubCategory", id: "LIST" },
            ]
          : [{ type: "SubCategory", id: "LIST" }],
    }),

    /** ✅ GET (single subcategory) */
    getSubCategoryById: builder.query<SubCategoryDto, string>({
      query: (id) => `${GET_SUBCATEGORY_BY_ID}/${id}`,
      providesTags: (result, error, id) => [{ type: "SubCategory", id }],
    }),

    /** ✅ POST (create) */
    createSubCategory: builder.mutation<any, Partial<SubCategoryDto>>({
      query: (body) => ({
        url: CREATE_SUBCATEGORY,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SubCategory", id: "LIST" }],
    }),

    /** ✅ PUT (update) */
    updateSubCategory: builder.mutation<
      any,
      Partial<SubCategoryDto> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `${EDIT_SUBCATEGORY}/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubCategory", id },
        { type: "SubCategory", id: "LIST" },
      ],
    }),

    /** ✅ DELETE */
    deleteSubCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `${DELETE_SUBCATEGORY}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SubCategory", id },
        { type: "SubCategory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;
