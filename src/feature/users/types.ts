import type { User } from "../../shared/types";

export interface CreateUserData {
  userId:string,
  employeeCode: string,
  fullName: string,
  email: string,
  password: string,
  departmentId: string,
  roleId: string,
  managerId: string,
  isActive: boolean

}

export interface UpdateUserData extends Partial<CreateUserData> {
   [key: string]: any
}

export interface UserFilters {
  role?: string;
  department?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserTableColumn {
  id: keyof User | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

export interface UserFormErrors {

  employeeCode?: string,
  fullName?: string,
  email?: string,
  password?: string,
  departmentId?: string,
  roleId?: string,
  managerId?: string,
  isActive?: boolean
}