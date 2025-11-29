import { baseurl } from "../../../apiconfig";

export const ROLE_BASE_URL = `${baseurl}admin/RoleAdmin`;
export const GET_ROLES = `/get-all-with-permissions`;
export const GET_ROLE_BY_ID = `/permissions`;
export const CREATE_ROLE = `/create`;
export const EDIT_ROLE = `/update`;
export const DELETE_ROLE = `${ROLE_BASE_URL}`;
