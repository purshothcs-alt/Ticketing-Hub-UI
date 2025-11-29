export interface PermissionRequest {
  id:string
  permissionName: string;
  description: string;
}

export interface PermissionResponse {
  id: string;
  permissionName: string;
  description: string;
}

export interface CreateModuleRequest {
  moduleName: string;
  description: string;
  permissions: PermissionRequest[];
}
export interface UpdateModuleRequest {
  moduleId: string;
  moduleName: string;
  description: string;
  permissions: PermissionRequest[];
  isActive: true;
}
export interface ModuleListItem {
  id: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  permissionCount: number;
}

export interface ModuleListResponse {
  modules: ModuleListItem[];
  totalCount: number;
}

/** ✅ Correct shape based on API */
export interface ModuleDetails {
  id: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  permissions: PermissionResponse[];
}

/** ✅ API wraps `module` */
export interface ModuleDetailsResponse {
  module: ModuleDetails;
}


/** A module with permission types */
export interface PermissionResponse {
  id: string;
  permissionName: string;
  description: string ;
  isActive: boolean;
}

export interface ModuleDetails {
  id: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  permissions: PermissionResponse[];
}
