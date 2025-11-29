import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../../../services/baseQuery";
import { GET_MENU_ITEMS, MENUBASEURL } from "../apiconfig/menuItems";

// ✅ RTK Query API Slice for dropdown
export const menuItemsApi = createApi({
  reducerPath: "menuItemsApi",
  baseQuery: baseQueryWithAuth(MENUBASEURL),
  refetchOnFocus: false,
  tagTypes: ["Menus"], // Capitalized for convention
  endpoints: (builder) => ({
    // 🟩 READ: Get all departments
    getMenuItems: builder.query<any, void>({
      query: () => GET_MENU_ITEMS,
      transformResponse: (response: any) => {
        console.log(response)
        const data = Array.isArray(response) ? response : [];

        return data.map((s: any) => ({
          id: s.id,
          name: s.name,
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({
                type: "Menus" as const,
                id,
              })),
              { type: "Menus", id: "LIST" },
            ]
          : [{ type: "Menus", id: "LIST" }],
    }),
  }),
});

// ✅ Auto-generated hooks (consistent names)
export const {
  useGetMenuItemsQuery,
} = menuItemsApi;


