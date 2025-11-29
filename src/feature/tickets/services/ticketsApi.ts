// src/redux/services/ticketsApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithInterceptors } from "../../../services/serviceApi";
import {
  CREATE_TICKET,
  GET_ALL_TICKETS,
  GET_SLA_INFO,
  ADD_COMMENT,
  UPDATE_STATUS,
  UPDATE_PRIORITY,
  REASSIGN_TICKET,
  UPLOAD_ATTACHMENT,
  ADD_SUBSCRIBER,
  GET_PRIORITY_DROPDOWN,
  GET_USERS_DROPDOWN,
  GET_SUBSCRIBERS,
  GET_TICKET_BY_ID,
  DELETE_TICKET,
  TICKETS_BASE_URL
} from "../apiConfig/tickets";

export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: baseQueryWithInterceptors(TICKETS_BASE_URL),

  refetchOnFocus: true,
  tagTypes: ["Tickets", "Ticket", "SLA", "Subscribers", "Dropdowns"],

  endpoints: (builder) => ({

    // ✅ GET ALL TICKETS
    getTickets: builder.query<
      {
        items: any[];
        totalCount: number;
      },
      any
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "")
            params.append(key, String(value));
        });
        return `${GET_ALL_TICKETS}?${params.toString()}`;
      },

      transformResponse: (response: any) => {
        const items = Array.isArray(response?.tickets)
          ? response.tickets.map((t: any) => ({
              id: t.id,
              ticketNumber: t.ticketNumber,
              title: t.title,
              department: t.department,
              category: t.category,
              status: t.status,
              priority: t.priority,
              assignedTo: t.assignedTo,
              createdDate: t.createdDate,
              dueDate: t.dueDate,
            }))
          : [];

        return {
          items,
          totalCount: response?.totalRecords ?? items.length,
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "Tickets" as const,
                id,
              })),
              { type: "Tickets", id: "LIST" },
            ]
          : [{ type: "Tickets", id: "LIST" }],
    }),

    // ✅ CREATE TICKET
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: CREATE_TICKET,
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: [{ type: "Tickets", id: "LIST" }],
    }),
// -------------------------------
// updateTicket
// -------------------------------
    updateTicket: builder.mutation<
      any,
      {
        ticketId: string;
        title: string;
        description?: string;        
        departmentId: string;
        categoryId: string;
        subCategoryId?: string | null;        
      }
    >({
      query: (payload) => ({
        url: `${GET_TICKET_BY_ID}/update`, // => /api/Ticketing/update
        method: "PUT",
        body: {
          TicketId: payload.ticketId,
          Title: payload.title,
          Description: payload.description,
          DepartmentId: payload.departmentId,
          CategoryId: payload.categoryId,
          SubCategoryId: payload.subCategoryId ?? null,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Ticket", id: arg.ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    // ✅ GET TICKET BY ID
    getTicketById: builder.query<any, string>({
      query: (id) => `${GET_TICKET_BY_ID}/${id}`,
      providesTags: (_, __, id) => [{ type: "Ticket", id }],
    }),

    // ✅ DELETE TICKET
    deleteTicket: builder.mutation({
      query: (id: string) => ({
        url: `${DELETE_TICKET}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [
        { type: "Ticket", id },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    // ✅ SLA INFO
    getSLAInfo: builder.query<any, { PriorityId: string; DepartmentId: string }>({
      query: ({ PriorityId, DepartmentId }) => {
        const params = new URLSearchParams({ PriorityId, DepartmentId });
        return `${GET_SLA_INFO}?${params.toString()}`;
      },
      providesTags: ["SLA"],
    }),

    // ✅ ADD COMMENT

    addComment: builder.mutation({
      query: ({ ticketId, commentText }) => ({
        url: ADD_COMMENT,
        method: "POST",
        body: {
          ticketId,
          commentText,
        },
      }),
      invalidatesTags: (_, __, { ticketId }) => [
        { type: "Ticket", id: ticketId }
      ],
    }),
    // uploadAttachment
    uploadAttachment: builder.mutation<
      any,
      { ticketId: string; file: File }
    >({
      query: ({ ticketId, file }) => {
        const formData = new FormData();
        formData.append("file", file); // backend expects "File"

        return {
          url: `${UPLOAD_ATTACHMENT}/${ticketId}/attachments/upload`,
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: (result, error, arg) => [
        { type: "Ticket", id: arg.ticketId },
      ],
    }),


    // ✅ UPDATE STATUS
   updateStatus: builder.mutation({
      query: ({ ticketId, newStatusId, comment }) => ({
        url: UPDATE_STATUS, // should point to /change-status
        method: "POST",
        body: {
          ticketId,
          newStatusId,
          comment,
        },
      }),
      invalidatesTags: (_, __, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),


    // ✅ UPDATE PRIORITY
    updatePriority: builder.mutation({
      query: ({ ticketId, newPriorityId, comment }) => ({
        url: UPDATE_PRIORITY,
        method: "Post",
        body: { ticketId, newPriorityId, comment },
      }),
      invalidatesTags: (_, __, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    // ✅ REASSIGN TICKET
    reassignTicket: builder.mutation({
      query: ({ ticketId, assignedToId, comment }) => ({
        url: REASSIGN_TICKET,
        method: "PUT",
        body: { ticketId, assignedToId, comment },
      }),
      invalidatesTags: (_, __, { ticketId }) => [
        { type: "Ticket", id: ticketId },
        { type: "Tickets", id: "LIST" },
      ],
    }),

    // ✅ ADD SUBSCRIBER
    addSubscriber: builder.mutation({
      query: ({ ticketId, userIds }) => ({
        url: ADD_SUBSCRIBER,
        method: "POST",
        body: {
          ticketId,
          userIds,
          isFilteringEnabled: true,
        },
      }),
      invalidatesTags: [{ type: "Subscribers", id: "LIST" }],
    }),


    // ✅ GET SUBSCRIBERS
    getSubscribers: builder.query({
      query: (ticketId) => `${GET_SUBSCRIBERS}${ticketId}/new-subscribers`,
      providesTags: [{ type: "Subscribers", id: "LIST" }],
    }),

    // ✅ ✅ GET AVAILABLE STATUS (PER TICKET)
    getAvailableStatus: builder.query<any, string>({
      query: (ticketId) => `/${ticketId}/available-status`,
      providesTags: ["Dropdowns"],
    }),

    // ✅ PRIORITY DROPDOWN
    getPriorityDropdown: builder.query({
      query: () => GET_PRIORITY_DROPDOWN,
      providesTags: ["Dropdowns"],
    }),

    // ✅ USERS DROPDOWN
    getUsersDropdown: builder.query({
      query: () => GET_USERS_DROPDOWN,
      providesTags: ["Dropdowns"],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useDeleteTicketMutation,
  useCreateTicketMutation,
  useGetSLAInfoQuery,
  useGetTicketByIdQuery,
  useUpdateStatusMutation,
  useUpdatePriorityMutation,
  useReassignTicketMutation,
  useAddSubscriberMutation,
  useGetSubscribersQuery,
  useGetAvailableStatusQuery,
  useGetPriorityDropdownQuery,
  useGetUsersDropdownQuery,
  useAddCommentMutation,
  useUploadAttachmentMutation,
  useUpdateTicketMutation,
} = ticketsApi;
