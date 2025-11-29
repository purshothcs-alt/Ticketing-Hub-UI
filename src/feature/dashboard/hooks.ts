// RTK Query hooks for dashboard
// These are placeholders - replace with actual RTK Query implementation

import type { ChartData, DashboardStats, DepartmentMetrics, RecentActivity, TicketTrend } from "./types";

// Mock data for development
const mockDashboardStats: DashboardStats = {
  totalTickets: 1247,
  openTickets: 89,
  inProgressTickets: 156,
  resolvedTickets: 892,
  closedTickets: 110,
  highPriorityTickets: 23,
  overdueTickets: 12,
  avgResolutionTime: 4.2,
  myTickets: 15,
  myOpenTickets: 8,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'ticket_created',
    title: 'New ticket created',
    description: 'Password reset request for user authentication',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'John Smith',
    ticketId: 'TKT-001',
  },
  {
    id: '2',
    type: 'ticket_assigned',
    title: 'Ticket assigned',
    description: 'Network connectivity issue assigned to IT team',
    timestamp: '2024-01-15T09:45:00Z',
    user: 'Sarah Johnson',
    ticketId: 'TKT-002',
  },
  {
    id: '3',
    type: 'ticket_resolved',
    title: 'Ticket resolved',
    description: 'Software installation completed successfully',
    timestamp: '2024-01-15T09:15:00Z',
    user: 'Mike Davis',
    ticketId: 'TKT-003',
  },
];

const mockTicketsByStatus: ChartData[] = [
  { name: 'Open', value: 89, color: '#FB7185' },
  { name: 'In Progress', value: 156, color: '#FBBF24' },
  { name: 'Resolved', value: 892, color: '#34D399' },
  { name: 'Closed', value: 110, color: '#8B5CF6' },
];

const mockTicketsByPriority: ChartData[] = [
  { name: 'Critical', value: 23, color: '#FB7185' },
  { name: 'High', value: 67, color: '#FBBF24' },
  { name: 'Medium', value: 234, color: '#3B82F6' },
  { name: 'Low', value: 156, color: '#34D399' },
];

const mockTicketTrends: TicketTrend[] = [
  { date: '2024-01-08', created: 12, resolved: 8, open: 89 },
  { date: '2024-01-09', created: 15, resolved: 10, open: 94 },
  { date: '2024-01-10', created: 8, resolved: 12, open: 90 },
  { date: '2024-01-11', created: 18, resolved: 9, open: 99 },
  { date: '2024-01-12', created: 10, resolved: 15, open: 94 },
  { date: '2024-01-13', created: 14, resolved: 11, open: 97 },
  { date: '2024-01-14', created: 9, resolved: 13, open: 93 },
  { date: '2024-01-15', created: 11, resolved: 8, open: 96 },
];

const mockDepartmentMetrics: DepartmentMetrics[] = [
  { department: 'IT', openTickets: 34, resolvedTickets: 89, avgResolutionTime: 3.2, satisfaction: 4.5 },
  { department: 'HR', openTickets: 12, resolvedTickets: 45, avgResolutionTime: 2.8, satisfaction: 4.2 },
  { department: 'Finance', openTickets: 8, resolvedTickets: 67, avgResolutionTime: 4.1, satisfaction: 4.3 },
  { department: 'Sales', openTickets: 15, resolvedTickets: 78, avgResolutionTime: 3.9, satisfaction: 4.1 },
  { department: 'Marketing', openTickets: 10, resolvedTickets: 34, avgResolutionTime: 3.5, satisfaction: 4.4 },
];

// Placeholder hooks - replace with actual RTK Query hooks
export const useDashboardStatsQuery = (filters?: any) => {
  return {
    data: mockDashboardStats,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useRecentActivityQuery = (limit: number = 10) => {
  return {
    data: mockRecentActivity.slice(0, limit),
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useTicketsByStatusQuery = () => {
  return {
    data: mockTicketsByStatus,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useTicketsByPriorityQuery = () => {
  return {
    data: mockTicketsByPriority,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useTicketTrendsQuery = (days: number = 7) => {
  return {
    data: mockTicketTrends.slice(-days),
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useDepartmentMetricsQuery = () => {
  return {
    data: mockDepartmentMetrics,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};