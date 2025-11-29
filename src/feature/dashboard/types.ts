export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
  overdueTickets: number;
  avgResolutionTime: number;
  myTickets: number;
  myOpenTickets: number;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
  onClick: () => void;
}

export interface RecentActivity {
  title: string;             // e.g., "Created"
  ticketNumber: string;      // e.g., "TCK-20251123160854"
  userName: string;          // e.g., "Purushothaman Sekar"
  activityDate: string;      // e.g., "2025-11-23T21:38:55.544047"
  actionType: string;        // e.g., "Created", "StatusChanged", etc.
}


export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TicketTrend {
  date: string;
  created: number;
  resolved: number;
  open: number;
}

export interface DepartmentMetrics {
  department: string;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  satisfaction: number;
}

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  departments: string[];
  priorities: string[];
}