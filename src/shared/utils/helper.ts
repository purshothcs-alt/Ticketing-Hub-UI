import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../../apiconfig";
import { 
  Dashboard, 
  ConfirmationNumber, 
  Business, 
  People, 
  Analytics, 
  Settings,
  Notifications,
  Speed,
  Security,
  Tune
} from '@mui/icons-material';
/**
 * Custom hook to debounce a value.
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { useDebounce };



export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
};

const TOKEN_KEY = "app_token";
const USER_KEY = "app_user";

export const saveToken = (token: string) => {
  sessionStorage.setItem(TOKEN_KEY, encryptData(token));
};

export const getToken = (): string | null => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;
const decrypted = decryptData(token);
  return decryptData(token);
};

export const saveUserDetails = (user: any) => {
  sessionStorage.setItem(USER_KEY, encryptData(user));
};

export const getUserDetails = (): any | null => {
  const user = sessionStorage.getItem(USER_KEY);
  if (!user) return null;
  return decryptData(user);
};

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/* ------------------ Permissions Helpers ------------------ */

// Get all role permissions of current user
export const getPermissions = (): any[] => {
  const user = getUserDetails();
  return user?.rolePermissions || [];
};

// Check VIEW (READ) permission for a module
export const canView = (moduleName: string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.READ : false;
};

// Check CREATE permission for a module
export const canAdd = (moduleName: string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.CREATE : false;
};

// Check UPDATE permission for a module
export const canEdit = (moduleName: string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.UPDATE : false;
};

// Check DELETE permission for a module
export const canDelete = (moduleName: string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.DELETE : false;
};
//DASHBOARD
// Check CREATE_TICKET permission
export const canCreateTicket = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.CREATE_TICKET : false;
};

// Check MANAGE_USERS permission
export const canManageUsers = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.MANAGE_USERS : false;
};

// Check VIEW_REPORTS permission
export const canViewReports = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.VIEW_REPORTS : false;
};

// Check SEVEN_DAY_TRENDS permission
export const canViewSevenDayTrends = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.SEVEN_DAY_TRENDS : false;
};

// Check ASSIGN_TICKET permission
export const canAssignTicket = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.ASSIGN_TICKET : false;
};

// Check TICKET_BY_STATUS permission
export const canViewTicketByStatus = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.TICKET_BY_STATUS : false;
};

// Check TICKET_BY_PRIORITY permission
export const canViewTicketByPriority = (moduleName:string): boolean => {
  const permissions = getPermissions();
  const module = permissions.find((m: any) => m.moduleName === moduleName);
  return module ? !!module.permissions.TICKET_BY_PRIORITY : false;
};
// Menu Items
export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard, path: '/dashboard', moduleName: 'Dashboard' },
  { id: 'tickets', label: 'Tickets', icon: ConfirmationNumber, path: '/tickets', moduleName: 'Tickets' },
  { id: 'sla', label: 'SLA Performance', icon: Speed, path: '/sla', moduleName: 'SLA' },
  { id: 'reports', label: 'Reports', icon: Analytics, path: '/reports', moduleName: 'Reports' },
  { id: 'notifications', label: 'Notifications', icon: Notifications, path: '/notifications', moduleName: 'Notifications' },
  { id: 'users', label: 'Users', icon: People, path: '/users', moduleName: 'Users' },
  { id: 'roles', label: 'Roles', icon: Security, path: '/roles', moduleName: 'Roles' },
  { id: 'departments', label: 'Departments', icon: Business, path: '/departments', moduleName: 'Departments' },
  { id: 'configuration', label: 'Configuration', icon: Tune, path: '/configuration', moduleName: 'Configuration' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', moduleName: 'Settings' },
];
export const getError = (touched: any, error: any) => {
  return touched && typeof error === "string" ? error : "";
};

