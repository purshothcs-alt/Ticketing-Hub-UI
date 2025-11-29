export interface CreateDepartmentData {
  name: string;
  description?: string;
  managerId: string;
  isActive: boolean;
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {
  id: string;
}

export interface DepartmentFilters {
  search?: string;
  isActive?: boolean;
  managerId?: string;
}

export interface DepartmentFormErrors {
  name?: string;
  description?: string;
  managerId?: string;
}