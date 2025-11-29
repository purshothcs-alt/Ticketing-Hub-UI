import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";
import {
  GET_NOTIFICATION,
  MARK_ALL_AS_READ,
  MARK_AS_READ,
  NOTIFICATION_BASE_URL,
} from "../apiconfig/notification";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithInterceptors(NOTIFICATION_BASE_URL),
  refetchOnFocus: true,
  tagTypes: ["Notification"],

  endpoints: (builder) => ({
    // ==========================================
    // 🔥 GET ALL NOTIFICATIONS
    // ==========================================
    getNotifications: builder.query<any, void>({
      query: () => GET_NOTIFICATION, // MUST BE RELATIVE PATH ONLY
      transformResponse: (response: any) => ({
        notifications: response.notifications,
        unreadCount: response.unreadCount,
        totalCount: response.totalCount,
        criticalCount: response.criticalCount,
        todaysLogs: response.todaysLogs,
      }),
      providesTags: ["Notification"],
    }),

    // ==========================================
    // 🔥 POST — MARK SINGLE NOTIFICATION READ
    // ==========================================
    markAsRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: MARK_AS_READ,
        method: "POST",
        body: { notificationId },
      }),
      invalidatesTags: ["Notification"],
    }),

    // ==========================================
    // 🔥 PUT — MARK ALL NOTIFICATIONS AS READ
    // ==========================================
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: MARK_ALL_AS_READ,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
