// src/pages/tickets/TicketDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import Autocomplete from "@mui/material/Autocomplete";
import { EditTicketPage } from "./EditTicketPage";
import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
  Divider,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress,
} from "@mui/material";


import {
  ArrowBack,
  Edit,
  Delete,
  AttachFile,
  Send,
  Person,
  CalendarToday,
  Category,
  Assignment,
  SwapHoriz,
  Flag,
  CheckCircle,
  PersonAdd,
} from "@mui/icons-material";

import {
  useGetTicketByIdQuery,
  useDeleteTicketMutation,
  useUpdateStatusMutation,
  useUpdatePriorityMutation,
  useReassignTicketMutation,
  useAddSubscriberMutation,
  useGetAvailableStatusQuery,
  useGetPriorityDropdownQuery,
  useGetUsersDropdownQuery,
  useAddCommentMutation,
  useGetSubscribersQuery,
  useUploadAttachmentMutation,
} from "../services/ticketsApi";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

const statusColors: Record<string, ChipColor> = {
  New: "primary",
  Open: "primary",
  "In Progress": "info",
  Waiting: "warning",
  Resolved: "success",
  Closed: "default",
};

const priorityColors: Record<string, ChipColor> = {
  Low: "default",
  Medium: "info",
  High: "warning",
  Critical: "error",
};

export const TicketDetailsPage: React.FC = () => {
  const { id: ticketId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Protect against missing id
  if (!ticketId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Invalid ticket reference.</Typography>
      </Box>
    );
  }

  // -----------------------------
  // Data hooks
  // -----------------------------
  const {
    data: ticket,
    isLoading: ticketLoading,
    isError,
    refetch,
  } = useGetTicketByIdQuery(ticketId as string);

  // status dropdown (object: { currentStatus, allowedStatuses })
  const { data: statusOptions } = useGetAvailableStatusQuery(
    ticketId ? ticketId : skipToken
  );
  const allowedStatuses = statusOptions?.allowedStatuses ?? [];

  const { data: priorityOptions = [] } =
    useGetPriorityDropdownQuery(undefined);
  const { data: users = [] } = useGetUsersDropdownQuery(undefined);
  const { data: subscribers = [] } = useGetSubscribersQuery(ticketId ? ticketId : skipToken);

  // -----------------------------
  // Mutations
  // -----------------------------
  const [deleteTicket, { isLoading: deleting }] = useDeleteTicketMutation();
  const [updateStatus, { isLoading: updatingStatus }] =
    useUpdateStatusMutation();
  const [updatePriority, { isLoading: updatingPriority }] =
    useUpdatePriorityMutation();
  const [reassignTicket, { isLoading: reassigning }] =
    useReassignTicketMutation();
  const [addSubscriber, { isLoading: addingSubscriber }] =
    useAddSubscriberMutation();

  const [addComment, { isLoading: sendingComment }] = useAddCommentMutation();
  const [uploadAttachment, { isLoading: uploadingAttachment }] =
    useUploadAttachmentMutation();

  // -----------------------------
  // Local UI state
  // -----------------------------
  const [tabValue, setTabValue] = useState(0);
  const [comment, setComment] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [subscriberDialogOpen, setSubscriberDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>("");
  const [selectedPriorityId, setSelectedPriorityId] = useState<string>("");
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<string>("");
  const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<string[]>([]);


  const [statusComment, setStatusComment] = useState("");
  const [assignComment, setAssignComment] = useState("");
  const [priorityComment, setPriorityComment] = useState("");
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString?: string | null) =>
    dateString ? new Date(dateString).toLocaleString() : "-";

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Loading / error UI
  if (ticketLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !ticket) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">
          Failed to load ticket details. Please try again.
        </Typography>
      </Box>
    );
  }

  // -----------------------------
  // Action handlers
  // -----------------------------
  const handleChangeStatus = async () => {
    if (!selectedStatusId || !statusComment.trim()) return;

    try {
      await updateStatus({
        ticketId: ticket.id,
        newStatusId: selectedStatusId,
        comment: statusComment,
      }).unwrap();

      setStatusDialogOpen(false);
      setStatusComment("");
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

    // ---------- Change Priority ----------
  const handleChangePriority = async () => {
    if (!selectedPriorityId || !priorityComment.trim()) return;

    await updatePriority({
      ticketId: ticket.id,
      newPriorityId: selectedPriorityId,
      comment: priorityComment,
    });

    setPriorityDialogOpen(false);
    setPriorityComment("");
    await refetch();
  };

 // ---------- Reassign ----------
  const handleReassign = async () => {
    if (!selectedAssigneeId || !assignComment.trim()) return;

    await reassignTicket({
      ticketId: ticket.id,
      assignedToId: selectedAssigneeId,
      comment: assignComment,
    });

    setReassignDialogOpen(false);
    setAssignComment("");
    await refetch();
  };
  // ---------- Add Subscriber ----------
  const handleAddSubscriberAction = async () => {
    if (selectedSubscriberIds.length === 0) return;

    await addSubscriber({
      ticketId: ticket.id,
      userIds: selectedSubscriberIds,
    });

    setSubscriberDialogOpen(false);
    setSelectedSubscriberIds([]);
    await refetch();
  };


  const handleSendComment = async () => {
    if (!comment.trim() || !ticket) return;

    try {
      await addComment({
        ticketId: ticket.id,
        commentText: comment,
      }).unwrap();

      setComment("");
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  const handleUploadSelectedFile = async (file?: File) => {
    if (!file || !ticket) return;
    try {
      await uploadAttachment({
        ticketId: ticket.id,
        file,
      }).unwrap();

      // refresh ticket to get new attachment
      await refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to upload file");
    }
  };

  const handleEdit = () => {
    navigate(`/tickets/${ticketId}/edit`);
  };
  const handleDownloadAttachment = async (attachment: any) => {
    try {
      // If server returns a direct URL, open it
      if (attachment.fileUrl) {
        window.open(attachment.fileUrl, "_blank");
        return;
      }

      // Fallback: call download endpoint and force download as blob
      const downloadUrl = `/api/Ticketing/attachments/${attachment.id}/download`;

      const resp = await fetch(downloadUrl, {
        method: "GET",
        credentials: "same-origin",
      });

      if (!resp.ok) {
        throw new Error("Download failed");
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.filename ?? attachment.fileName ?? "attachment";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download attachment");
    }
  };

  const handleDelete = () => setDeleteDialogOpen(true);

  const confirmDelete = async () => {
    try {
      await deleteTicket(ticket.id).unwrap();
      setDeleteDialogOpen(false);
      navigate("/tickets");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ticket");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/tickets")}
              variant="outlined"
            >
              Back
            </Button>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: "primary.main" }}
            >
              {ticket.ticketNumber}
            </Typography>
            <Chip
              label={ticket.status}
              color={(statusColors as any)[ticket.status] || "default"}
              size="small"
            />
            <Chip
              label={ticket.priority}
              color={(priorityColors as any)[ticket.priority] || "default"}
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            {ticket.title}
          </Typography>
        </Box> 
        <Box sx={{ display: 'flex', gap: 1 }}>
         <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit
          </Button>
        </Box>      
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {ticket.description}
            </Typography>

            {Array.isArray(ticket.tags) && ticket.tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {ticket.tags.map((tag: string, idx: number) => (
                  <Chip key={idx} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Paper>

          {/* Tabs */}
          <Paper>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Comments" />
              <Tab label="Attachments" />
              <Tab label="History" />
            </Tabs>

            {/* Comments Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <List>
                  {(ticket.comments ?? []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  )}

                  {(ticket.comments ?? [])
                    .slice()
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((c: any, index: number) => (
                      <ListItem
                        key={c.commentId ?? index}
                        alignItems="flex-start"
                        sx={{ px: 0, py: 2 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {(c.author ?? "U").charAt(0)}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  component="span"
                                >
                                  {c.author ?? "User"}
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(c.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ mt: 1 }}
                            >
                              {c.message ?? ""}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Add Comment + Attach */}
                <Box>
                  {/* Hidden file input (single file upload) */}
                  <input
                    type="file"
                    id="file-upload-input"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      await handleUploadSelectedFile(file);
                      (e.target as HTMLInputElement).value = "";
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<AttachFile />}
                      onClick={() =>
                        document.getElementById("file-upload-input")?.click()
                      }
                      disabled={uploadingAttachment}
                    >
                      {uploadingAttachment ? "Uploading..." : "Attach File"}
                    </Button>

                    <Button
                      variant="contained"
                      endIcon={<Send />}
                      disabled={!comment.trim() || sendingComment}
                      onClick={handleSendComment}
                    >
                      {sendingComment ? "Sending..." : "Send Comment"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            {/* Attachments Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <List>
                  {(ticket.attachments ?? []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No attachments.
                    </Typography>
                  )}

                  {(ticket.attachments ?? []).map((att: any, idx: number) => (
                    <ListItem
                      key={att.id ?? att.attachmentId ?? idx}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        mb: 1,
                      }}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownloadAttachment(att)}
                        >
                          Download
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AttachFile />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={att.filename ?? att.fileName ?? "attachment"}
                        secondary={`${
                          att.fileSize ? formatFileSize(att.fileSize) : "-"
                        } • Uploaded by ${att.uploadedBy ?? "-"} on ${formatDate(
                          att.uploadedAt ?? att.createdAt
                        )}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <List>
                  {(ticket.history ?? []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No history available.
                    </Typography>
                  )}
                  {(ticket.history ?? []).map((entry: any, index: number) => (
                    <ListItem
                      key={entry.id ?? index}
                      alignItems="flex-start"
                      sx={{ px: 0 }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{ bgcolor: "primary.light", color: "primary.main" }}
                        >
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          entry.actionType
                            ? `${entry.actionType} - ${entry.description ?? ""}`
                            : entry.description ?? "Updated"
                        }
                        secondary={`${entry.changedBy ?? "-"} • ${formatDate(
                          entry.changedAt
                        )}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Reported By
                  </Typography>
                </Box>
                <Typography variant="body2">{ticket.reportedBy}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {ticket.reportedByEmail}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Assigned To
                  </Typography>
                </Box>
                <Typography variant="body2">{ticket.assignedTo}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {ticket.assignedToEmail}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Category fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                </Box>
                <Typography variant="body2">{ticket.category}</Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Assignment fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Department
                  </Typography>
                </Box>
                <Typography variant="body2">{ticket.department}</Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                </Box>
                <Typography variant="body2">{formatDate(ticket.createdDate)}</Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
                <Typography variant="body2">{formatDate(ticket.dueDate)}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SwapHoriz />}
                onClick={() => {
                  setSelectedStatusId(ticket.statusId ?? "");
                  setStatusDialogOpen(true);
                }}
              >
                Change Status
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Person />}
                onClick={() => {
                  setSelectedAssigneeId("");
                  setReassignDialogOpen(true);
                }}
              >
                Reassign
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Flag />}
                onClick={() => {
                  setSelectedPriorityId(ticket.priorityId ?? "");
                  setPriorityDialogOpen(true);
                }}
              >
                Change Priority
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonAdd />}
                onClick={() => {
                  setSelectedSubscriberId("");
                  setSubscriberDialogOpen(true);
                }}
              >
                Add Subscriber
              </Button>              
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Status"
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(e.target.value)}
            >
              {allowedStatuses.length === 0 ? (
                <MenuItem disabled>
                  <em>No statuses</em>
                </MenuItem>
              ) : (
                allowedStatuses.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.statusName}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              label="Comment"
              fullWidth
              multiline
              minRows={3}
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Enter a comment for this status change..."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setStatusDialogOpen(false);
              setStatusComment("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleChangeStatus}
            disabled={
              updatingStatus ||
              !selectedStatusId ||
              statusComment.trim().length === 0
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============================================
           DIALOG — Reassign
      ============================================ */}
      <Dialog open={reassignDialogOpen} onClose={() => setReassignDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reassign Ticket</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              label="Assign To"
              fullWidth
              value={selectedAssigneeId}
              onChange={(e) => setSelectedAssigneeId(e.target.value)}
            >
              {users.map((u: any) => (
                <MenuItem value={u.id} key={u.id}>
                  {u.fullName ?? u.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Comment"
              fullWidth
              multiline
              minRows={3}
              value={assignComment}
              onChange={(e) => setAssignComment(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setReassignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleReassign}
            disabled={reassigning || !selectedAssigneeId || !assignComment.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

     {/* ============================================
           DIALOG — Change Priority
      ============================================ */}
      <Dialog open={priorityDialogOpen} onClose={() => setPriorityDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Priority</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              select
              label="Priority"
              fullWidth
              value={selectedPriorityId}
              onChange={(e) => setSelectedPriorityId(e.target.value)}
            >
              {priorityOptions.map((p: any) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Comment"
              multiline
              minRows={3}
              fullWidth
              value={priorityComment}
              onChange={(e) => setPriorityComment(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPriorityDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleChangePriority}
            disabled={updatingPriority || !selectedPriorityId || !priorityComment.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

       {/* ============================================
           DIALOG — Subscriber
      ============================================ */}
     <Dialog
        open={subscriberDialogOpen}
        onClose={() => setSubscriberDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Subscribers</DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={subscribers}
            getOptionLabel={(option: any) => option.fullName ?? option.name}
            value={subscribers.filter((u: any) =>
              selectedSubscriberIds.includes(u.id)
            )}
            onChange={(event, value: any[]) => {
              setSelectedSubscriberIds(value.map((v) => v.id));
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                  sx={{ mr: 1 }}
                />
                {option.fullName ?? option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Select Users" placeholder="Search..." />
            )}
            sx={{ width: "100%" }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSubscriberDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddSubscriberAction}
            disabled={selectedSubscriberIds.length === 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>


      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ pt: 2 }}>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmDelete} color="error" disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
  open={editDialogOpen}
  onClose={() => setEditDialogOpen(false)}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: { borderRadius: 3, maxHeight: '90vh' }
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: 1,
    }}
  >
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Edit Ticket
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Modify ticket details
      </Typography>
    </Box>

    <IconButton onClick={() => setEditDialogOpen(false)}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent sx={{ pt: 2 }}>
    <EditTicketPage
      ticketId={ticket.id}
      onSuccess={async () => {
        await refetch();          // Refresh details page after editing
        setEditDialogOpen(false); // Close dialog
      }}
      onCancel={() => setEditDialogOpen(false)}
    />
  </DialogContent>
</Dialog>

    </Box>
  );
};

export default TicketDetailsPage;
