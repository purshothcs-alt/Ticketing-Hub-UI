// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { subCategoryApi } from "../feature/configuration/services/subCategoryApi";
import { rootReducer } from "./root-reducer";
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

const apiMiddlewares = [
  subCategoryApi.middleware,
  statusApi.middleware,
  userApi.middleware,
  dropdownApi.middleware,
  priorityApi.middleware,
  categoryApi.middleware,
  departmentApi.middleware,
  authApi.middleware,
  moduleApi.middleware,
  rolesApi.middleware,
  menuItemsApi.middleware,
  ticketsApi.middleware,
  dashboardApi.middleware,
  notificationApi.middleware,
  reportApi.middleware,
];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiMiddlewares),
});

setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
