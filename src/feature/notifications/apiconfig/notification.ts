import { baseurl } from "../../../apiconfig";

export const NOTIFICATION_BASE_URL = `${baseurl}Notification/`;
export const GET_NOTIFICATION = `${NOTIFICATION_BASE_URL}user-notification`;
export const MARK_ALL_AS_READ = `${NOTIFICATION_BASE_URL}mark-all-read`;
export const MARK_AS_READ = `${NOTIFICATION_BASE_URL}mark-as-read`;