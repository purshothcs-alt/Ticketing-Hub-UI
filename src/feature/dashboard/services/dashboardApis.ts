import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";
import { GET_DASHBOARD } from "../apiconfig/dashboard";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithInterceptors(GET_DASHBOARD),
  refetchOnFocus: true,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    
    // 🟩 GET: Dashboard Data
    getDashboard: builder.query<any, void>({
      query: () => `${GET_DASHBOARD}`,

      transformResponse: (response: any) => {
        if (!response) return {};

        return {
          // === ✔ TOP METRICS ===
          totalTickets: response.totalTickets || 0,
          openTickets: response.openTickets || 0,
          resolvedTickets: response.resolvedTickets || 0,
          highPriority: response.highPriority || 0,
          overdue: response.overdue || 0,
          avgResolutionDays: response.avgResolutionDays || 0,
          totalTrend:response.totalTrend || {},
          openTrend:response.openTrend || {},
          resolvedTrend:response.resolvedTrend || {},

          // === ✔ RECENT ACTIVITIES ===
          recentActivities: response.recentActivities?.map((a: any) => ({
            title: a.title,
            ticketNumber: a.ticketNumber,
            userName: a.userName,
            activityDate: a.activityDate,
            actionType: a.actionType,
          })) || [],

          // === ✔ STATUS CHART ===
          ticketsByStatus: response.ticketsByStatus?.map((s: any) => ({
            statusName: s.statusName,
            count: s.count,
          })) || [],

          // === ✔ PRIORITY CHART ===
          ticketsByPriority: response.ticketsByPriority?.map((p: any) => ({
            priorityName: p.priorityName,
            count: p.count,
          })) || [],

          // === ✔ 7-DAY TREND ===
          sevenDayTrends: response.sevenDayTrends?.map((t: any) => ({
            date: t.date,
            created: t.created,
            resolved: t.resolved,
            open: t.open,
          })) || [],
        };
      },

      providesTags: [{ type: "Dashboard", id: "LIST" }],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
