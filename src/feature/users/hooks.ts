// RTK Query hooks for users management
// These are placeholders - replace with actual RTK Query implementation

import type { User } from "../../shared/types";
import type { CreateUserData, UpdateUserData, UserFilters } from "./types";


// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    department: 'IT',
    isActive: true,
    createdAt: '2024-01-10T09:00:00Z',
    lastLogin: '2024-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'IT Support Agent',
    department: 'IT',
    isActive: true,
    createdAt: '2024-01-08T14:20:00Z',
    lastLogin: '2024-01-15T10:15:00Z',
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'Department Manager',
    department: 'Finance',
    isActive: true,
    createdAt: '2024-01-05T11:30:00Z',
    lastLogin: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    name: 'Emily Chen',
    email: 'emily.chen@company.com',
    role: 'End User',
    department: 'Marketing',
    isActive: true,
    createdAt: '2024-01-12T13:45:00Z',
    lastLogin: '2024-01-15T09:20:00Z',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'End User',
    department: 'Sales',
    isActive: false,
    createdAt: '2024-01-03T10:15:00Z',
    lastLogin: '2024-01-10T14:30:00Z',
  },
];

// Placeholder hooks - replace with actual RTK Query hooks
export const useUsersQuery = (filters?: UserFilters) => {
  let filteredUsers = [...mockUsers];
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.department.toLowerCase().includes(search)
    );
  }
  
  if (filters?.role) {
    filteredUsers = filteredUsers.filter(user => user.role === filters.role);
  }
  
  if (filters?.department) {
    filteredUsers = filteredUsers.filter(user => user.department === filters.department);
  }
  
  if (filters?.isActive !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
  }

  return {
    data: filteredUsers,
    isLoading: false,
    error: null,
    refetch: () => Promise.resolve(),
  };
};

export const useCreateUserMutation = () => {
  return {
    mutate: async (userData: CreateUserData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        isActive: userData.isActive,
        createdAt: new Date().toISOString(),
      };
      
      return { data: newUser };
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateUserMutation = () => {
  return {
    mutate: async (userData: UpdateUserData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const existingUser = mockUsers.find(u => u.id === userData.id);
      if (!existingUser) throw new Error('User not found');
      
      const updatedUser: User = {
        ...existingUser,
        ...userData,
      };
      
      return { data: updatedUser };
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteUserMutation = () => {
  return {
    mutate: async (userId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { data: { message: 'User deleted successfully' } };
    },
    isLoading: false,
    error: null,
  };
};

export const useBulkUpdateUsersMutation = () => {
  return {
    mutate: async (userIds: string[], updates: Partial<User>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return { data: { message: `${userIds.length} users updated successfully` } };
    },
    isLoading: false,
    error: null,
  };
};