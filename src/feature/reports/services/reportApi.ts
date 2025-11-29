import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";
import {
  DEPARTMENT_PERFORMANCE,
  DEPARTMENT_STATISTICS,
  OVERWIEW,
  REPORT_BASE_URL,
  TICKETS_PRIORITY,
  TICKETS_STATUS,
  TICKETS_TRENDS,
} from "../apiconfig/reports";
export interface DepartmentStat {
  departmentId: string;
  departmentName: string;
  totalTickets: number;
  avgResolutionTimeDays: number;
}

export interface DepartmentStatsResponse {
  departments: DepartmentStat[];
  message?: string;
}

export const reportApi = createApi({
  reducerPath: "reportApi",

  baseQuery: baseQueryWithInterceptors(REPORT_BASE_URL),

  refetchOnFocus: true,
  tagTypes: ["Reports"],

  endpoints: (builder) => ({
    /** ✅ Overview Stats */
    getOverviewStats: builder.query<
      {
        totalTickets: number;
        avgResolutionHours: number;
        avgResolutionHumanized: string;
        resolutionRatePercent: number;
        activeAgents: number;
        message: string;
      },
      {
        startDate?: string;
        endDate?: string;
        departmentId?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);
        if (filters?.departmentId)
          params.append("DepartmentId", filters.departmentId);

        return `${OVERWIEW}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        totalTickets: response?.totalTickets ?? 0,
        avgResolutionHours: response?.avgResolutionHours ?? 0,
        avgResolutionHumanized: response?.avgResolutionHumanized ?? "N/A",
        resolutionRatePercent: response?.resolutionRatePercent ?? 0,
        activeAgents: response?.activeAgents ?? 0,
        message: response?.message ?? "",
      }),
      providesTags: [{ type: "Reports", id: "OVERVIEW" }],
    }),

    /** ✅ Ticket Trends */
    getTicketTrends: builder.query<
      {
        trends: {
          date: string;
          created: number;
          resolved: number;
        }[];
        message: string;
      },
      {
        startDate?: string;
        endDate?: string;
        departmentId?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);
        if (filters?.departmentId)
          params.append("DepartmentId", filters.departmentId);

        return `${TICKETS_TRENDS}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        trends: Array.isArray(response?.trends)
          ? response.trends.map((t: any) => ({
              date: t.date,
              created: t.created ?? 0,
              resolved: t.resolved ?? 0,
            }))
          : [],
        message: response?.message ?? "",
      }),
      providesTags: [{ type: "Reports", id: "TRENDS" }],
    }),

    /** ✅ Priorities */
    getTicketPriorities: builder.query<
      {
        priorities: {
          priorityName: string;
          ticketCount: number;
        }[];
        message: string;
      },
      {
        startDate?: string;
        endDate?: string;
        departmentId?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);
        if (filters?.departmentId)
          params.append("DepartmentId", filters.departmentId);

        return `${TICKETS_PRIORITY}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        priorities: Array.isArray(response?.priorities)
          ? response.priorities.map((p: any) => ({
              priorityName: p.priorityName,
              ticketCount: p.ticketCount ?? 0,
            }))
          : [],
        message: response?.message ?? "",
      }),
      providesTags: [{ type: "Reports", id: "PRIORITIES" }],
    }),

    /** ✅ Statuses */
    getTicketStatuses: builder.query<
      {
        statuses: {
          statusName: string;
          ticketCount: number;
        }[];
        message: string;
      },
      {
        startDate?: string;
        endDate?: string;
        departmentId?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);
        if (filters?.departmentId)
          params.append("DepartmentId", filters.departmentId);

        return `${TICKETS_STATUS}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        statuses: Array.isArray(response?.statuses)
          ? response.statuses.map((s: any) => ({
              statusName: s.statusName,
              ticketCount: s.ticketCount ?? 0,
            }))
          : [],
        message: response?.message ?? "",
      }),
      providesTags: [{ type: "Reports", id: "STATUSES" }],
    }),
    getDepartmentStats: builder.query<
      DepartmentStatsResponse,
      { startDate?: string; endDate?: string }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);
        return `${DEPARTMENT_STATISTICS}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        departments: Array.isArray(response?.departments)
          ? response.departments.map((d: any) => ({
              departmentId: d.departmentId,
              departmentName: d.departmentName,
              totalTickets: d.totalTickets ?? 0,
              avgResolutionTimeDays: d.avgResolutionTimeDays ?? 0,
            }))
          : [],
        message: response?.message || "",
      }),
      providesTags: [{ type: "Reports", id: "DEPT_STATS" }],
    }),

    /** ✅ Department Performance */
    getDepartmentPerformance: builder.query<
      {
        departments: {
          departmentName: string;
          totalTickets: number;
          resolvedTickets: number;
          resolutionRate: number;
        }[];
        message: string;
      },
      {
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.startDate) params.append("StartDate", filters.startDate);
        if (filters?.endDate) params.append("EndDate", filters.endDate);

        return `${DEPARTMENT_PERFORMANCE}?${params.toString()}`;
      },
      transformResponse: (response: any) => ({
        departments: Array.isArray(response?.departments)
          ? response.departments.map((d: any) => ({
              departmentName: d.departmentName,
              totalTickets: d.totalTickets ?? 0,
              resolvedTickets: d.resolvedTickets ?? 0,
              resolutionRate: d.resolutionRate ?? 0,
            }))
          : [],
        message: response?.message ?? "",
      }),
      providesTags: [{ type: "Reports", id: "DEPARTMENTS" }],
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetTicketTrendsQuery,
  useGetTicketPrioritiesQuery,
  useGetTicketStatusesQuery,
  useGetDepartmentPerformanceQuery,
  useGetDepartmentStatsQuery 
} = reportApi;
