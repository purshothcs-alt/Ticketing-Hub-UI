// src/app/rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit";
import { subCategoryApi } from "../feature/configuration/services/subCategoryApi";
import { statusApi } from "../feature/configuration/services/statusApi";
import { userApi } from "../feature/users/services/usersApi";
import { dropdownApi } from "../feature/shared/services/dropdownsApi";
import { priorityApi } from "../feature/configuration/services/priorityApi";
import { categoryApi } from "../feature/configuration/services/CategoryApi";
import { departmentApi } from "../feature/departments/services/departmentApis";
import { authApi } from "../feature/auth/services/authApis";
import { moduleApi } from "../feature/configuration/services/ModuleApi";
import { rolesApi } from "../feature/roles/services/roleApi";
import { menuItemsApi } from "../feature/shared/services/menuItemsApi";
import { ticketsApi } from "../feature/tickets/services/ticketsApi";
import { dashboardApi } from "../feature/dashboard/services/dashboardApis";
import { notificationApi } from "../feature/notifications/services/notificationApi";
import { reportApi } from "../feature/reports/services/reportApi";

export const rootReducer = combineReducers({
  // 👇 RTK Query APIs
  [subCategoryApi.reducerPath]: subCategoryApi.reducer,
  [statusApi.reducerPath]: statusApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [dropdownApi.reducerPath]: dropdownApi.reducer,
  [priorityApi.reducerPath]: priorityApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [departmentApi.reducerPath]: departmentApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [moduleApi.reducerPath]: moduleApi.reducer,
  [rolesApi.reducerPath]: rolesApi.reducer,
  [menuItemsApi.reducerPath]: menuItemsApi.reducer,
  [ticketsApi.reducerPath]: ticketsApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
