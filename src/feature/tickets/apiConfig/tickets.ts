// src/shared/apiConfig/tickets.ts

import { baseurl } from "../../../apiconfig";

export const TICKETS_BASE_URL = `${baseurl}Ticketing`;

export const GET_ALL_TICKETS = `${TICKETS_BASE_URL}/all`;
export const GET_TICKET_BY_ID = `${TICKETS_BASE_URL}`;
export const CREATE_TICKET = `${TICKETS_BASE_URL}/create`;


export const UPLOAD_ATTACHMENT = `${TICKETS_BASE_URL}`;
export const GET_COMMENTS = `${TICKETS_BASE_URL}/comments`;
export const ADD_COMMENT = `${TICKETS_BASE_URL}/comment`;
export const UPDATE_STATUS = `${TICKETS_BASE_URL}/change-status`;
export const UPDATE_PRIORITY = `${TICKETS_BASE_URL}/change-priority`;
export const REASSIGN_TICKET = `${TICKETS_BASE_URL}/assign  `;
export const ADD_SUBSCRIBER = `${TICKETS_BASE_URL}/add-subscriber`;

export const DELETE_TICKET = `${TICKETS_BASE_URL}/delete`;
export const ASSIGN_TICKET = `${TICKETS_BASE_URL}/assign`;
export const RESOLVE_TICKET = `${TICKETS_BASE_URL}/resolve`;
export const CLOSE_TICKET = `${TICKETS_BASE_URL}/close`;

export const GET_SLA_INFO = `${TICKETS_BASE_URL}/sla-info`;

// Dropdowns for dialogs
export const GET_STATUS_DROPDOWN = `${TICKETS_BASE_URL}/statuses`;
export const GET_PRIORITY_DROPDOWN = `${baseurl}Dropdown/priorities`;
export const GET_USERS_DROPDOWN = `${baseurl}Dropdown/users`;
export const GET_SUBSCRIBERS = `${baseurl}Dropdown/`;
