// Shared types across all slices
export interface User {
  id: string;
  userId: string; 
  employeeCode:string;
  fullName: string;
  email: string;
  roleId: 'Admin' | 'IT Support Agent' | 'Department Manager' | 'End User';
  departmentId: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  managerId:string;
}

export interface Department {
  id: string;
  departmentName: string;
  description?: string;
  managerName:string;
  managerEmail:string;
  headUserId: string;
  memberCount: number;
  isActive: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Hardware' | 'Software' | 'Network' | 'Security' | 'Access' | 'Other';
  assignedTo?: string;
  assignedToName?: string;
  reportedBy: string;
  reportedByName: string;
  department: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  resolvedAt?: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Attachment {
  id: string;
  ticketId: string;
  filename: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
  overdueTickets: number;
  avgResolutionTime: number;
  ticketsByDepartment: { department: string; count: number }[];
  ticketsByStatus: { status: string; count: number }[];
  recentTickets: Ticket[];
}

export interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  departments: string[];
  priorities: string[];
  statuses: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status: number;
  field?: string;
}

export type UserRole = 'Admin' | 'IT Support Agent' | 'Department Manager' | 'End User';
export type TicketStatus = 'Open' | 'In Progress' | 'Waiting' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Security' | 'Access' | 'Other';