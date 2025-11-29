// src/pages/tickets/EditTicketPage.tsx
import React, { useEffect, useMemo,useState } from "react";
import { useFormik } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import * as Yup from "yup";
// import Grid from "@mui/material/Unstable_Grid2"; 
import {
  Card,
  CardContent,
  Alert,
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Checkbox,
} from "@mui/material";

import { Save } from "@mui/icons-material";
import {
  Person,
  SwapHoriz,
  Flag,
  PersonAdd,
} from "@mui/icons-material";
import {
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useUpdateStatusMutation,
  useUpdatePriorityMutation,
  useReassignTicketMutation,
  useAddSubscriberMutation,
  useGetAvailableStatusQuery,
  useGetPriorityDropdownQuery,
  useGetUsersDropdownQuery,
  useGetSubscribersQuery,
} from "../services/ticketsApi";

import {
  useGetCategoryDropdownsQuery,
  useGetSubcategoriesQuery,
  useGetDepartmentsQuery,
} from "../../shared/services/dropdownsApi";
import { skipToken } from "@reduxjs/toolkit/query";

interface EditProps {
  ticketId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string().required().min(5).max(200),
  description: Yup.string().required().min(10).max(2000),
  categoryId: Yup.string().required(),
  subCategoryId: Yup.string().nullable(),
  departmentId: Yup.string().required("Department is required"),
});

export const EditTicketPage: React.FC<EditProps> = ({
  ticketId,
  onSuccess,
  onCancel,
}) => {

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
      
    };

  // Load ticket
  const {
    data: ticket,
    isLoading,
    isError,
    refetch: refetchTicket,
  } = useGetTicketByIdQuery(ticketId);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState("");

  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [selectedPriorityId, setSelectedPriorityId] = useState("");

  const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<string[]>([]);

  const [statusComment, setStatusComment] = useState("");
  const [assignComment, setAssignComment] = useState("");
  const [priorityComment, setPriorityComment] = useState("");
  const [subscriberDialogOpen, setSubscriberDialogOpen] = useState(false);

  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: categories = [] } = useGetCategoryDropdownsQuery();

  const { data: subcategories = [] } = useGetSubcategoriesQuery(
    ticket?.categoryId ?? "",
    { skip: !ticket?.categoryId }
  );

  const [updateTicket, { isLoading: updating }] = useUpdateTicketMutation();
  const [updateStatus, { isLoading: updatingStatus }] =
      useUpdateStatusMutation();
  const [updatePriority, { isLoading: updatingPriority }] =
      useUpdatePriorityMutation();
  const [reassignTicket, { isLoading: reassigning }] =
      useReassignTicketMutation();
  const [addSubscriber, { isLoading: addingSubscriber }] =
      useAddSubscriberMutation();
  // Form initial values
  const initialValues = useMemo(
    () => ({
      title: ticket?.title ?? "",
      description: ticket?.description ?? "",
      categoryId: ticket?.categoryId ?? "",
      subCategoryId: ticket?.subCategoryId ?? "",
      departmentId: ticket?.departmentId ?? "",
    }),
    [ticket]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (!ticket) return;

      const payload = {
        ticketId: ticket.id,
        title: values.title,
        description: values.description,
        departmentId: values.departmentId,
        categoryId: values.categoryId,
        subCategoryId: values.subCategoryId ?? null,
      };

      await updateTicket(payload).unwrap();
      await refetchTicket();
      onSuccess();
    },
  });

  if (isLoading) {
    return <Typography sx={{ p: 3 }}>Loading...</Typography>;
  }

  if (isError || !ticket) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load ticket</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="departmentId"
                  value={formik.values.departmentId}
                  onChange={(e) => formik.setFieldValue("departmentId", e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
                  helperText={formik.touched.departmentId && formik.errors.departmentId}
                >
                  {departments.map((d: any) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
                >
                  {categories.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Subcategory */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  disabled={!formik.values.categoryId}
                  label="Subcategory"
                  name="subCategoryId"
                  value={formik.values.subCategoryId}
                  onChange={(e) =>
                    formik.setFieldValue("subCategoryId", e.target.value)
                  }
                >
                  {subcategories.map((s: any) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button onClick={onCancel} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={formik.submitForm}
                  disabled={updating}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Sidebar — read-only information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Ticket Info</Typography>
              <Divider sx={{ my: 1 }} />

              <Typography variant="caption">Ticket Number</Typography>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                {ticket.ticketNumber}
              </Typography>

              <Typography variant="caption">Reported By</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {ticket.reportedBy}
              </Typography>
            </CardContent>
          </Card>
            <Paper sx={{ p: 2, mt: 3 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                {/* Change Status */}
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

                {/* Reassign */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Person />}
                  onClick={() => {
                    setSelectedAssigneeId(ticket.assignedToId ?? "");
                    setReassignDialogOpen(true);
                  }}
                >
                  Reassign
                </Button>

                {/* Change Priority */}
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

                {/* Add Subscriber */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<PersonAdd />}
                  onClick={() => {
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
    </Box>
  );
};
