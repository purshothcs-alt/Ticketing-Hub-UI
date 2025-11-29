// src/pages/tickets/CreateTicketPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AttachFile, Delete, Upload, Info } from "@mui/icons-material";

import {
  useGetCategoryDropdownsQuery,
  useGetDepartmentsQuery,
  useGetPrioritiesQuery,
  useGetSubcategoriesQuery,
  useGetTicketTypesQuery,
} from "../../shared/services/dropdownsApi";

import {
  useCreateTicketMutation,
  useGetSLAInfoQuery,
} from "../services/ticketsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { getError } from "../../../shared/utils/helper";

interface CreateTicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  currentUserDepartmentId?: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required").min(5).max(100),
  description: Yup.string()
    .required("Description is required")
    .min(20)
    .max(2000),
  departmentId: Yup.string().required("Department is required"),
  ticketTypeId: Yup.string().required("Ticket type is required"),
  categoryId: Yup.string().required("Category is required"),
  subCategoryId: Yup.string().required("Subcategory is required"),
  priorityId: Yup.string().required("Priority is required"),
});

export const CreateTicketPage = ({
  onSuccess,
  onCancel,
  currentUserDepartmentId,
}: CreateTicketFormProps) => {
  // Load all dropdowns
  const { data: ticketTypes = [] } = useGetTicketTypesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: priorities = [] } = useGetPrioritiesQuery();
  const { data: categories = [] } = useGetCategoryDropdownsQuery();

  const [createTicket, { isLoading: creating }] = useCreateTicketMutation();

  // Attachments
  const [attachments, setAttachments] = useState<File[]>([]);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) =>
    setAttachments((prev) => prev.filter((_, i) => i !== index));

  // -------------------------
  // FORMIK SETUP
  // -------------------------
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      ticketTypeId: "",
      departmentId: "",
      projectId: "",
      categoryId: "",
      subCategoryId: "",
      priorityId: "",
    },
    validationSchema,
    enableReinitialize: false, // IMPORTANT
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          projectId: values.projectId || undefined,
        };

        await createTicket(payload).unwrap();
        onSuccess?.();
      } catch (err) {
        alert("Failed to create ticket");
      }
    },
  });

  // -------------------------
  // DEFAULT SELECT VALUES
  // -------------------------
  useEffect(() => {
    if (ticketTypes.length > 0 && !formik.values.ticketTypeId) {
      formik.setFieldValue("ticketTypeId", ticketTypes[0].id);
    }
  }, [ticketTypes]);

  useEffect(() => {
    if (departments.length > 0 && !formik.values.departmentId) {
      formik.setFieldValue(
        "departmentId",
        currentUserDepartmentId || departments[0].id
      );
    }
  }, [departments]);

  useEffect(() => {
    if (priorities.length > 0 && !formik.values.priorityId) {
      formik.setFieldValue("priorityId", priorities[1]?.id || priorities[0].id);
    }
  }, [priorities]);

  // -------------------------
  // SUBCATEGORIES LOADING
  // -------------------------
  const { data: subcategories = [], refetch: refetchSub } =
    useGetSubcategoriesQuery(
      { categoryId: formik.values.categoryId },
      { skip: !formik.values.categoryId }
    );

  useEffect(() => {
    formik.setFieldValue("subCategoryId", "");
    if (formik.values.categoryId) refetchSub();
  }, [formik.values.categoryId]);

  // -------------------------
  // SLA FETCH
  // -------------------------
  const { data: slaInfo, isLoading: slaLoading } = useGetSLAInfoQuery(
    formik.values.priorityId && formik.values.departmentId
      ? {
          PriorityId: formik.values.priorityId,
          DepartmentId: formik.values.departmentId,
        }
      : skipToken
  );
  const slaIsValid = Boolean(slaInfo?.slaId);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* LEFT FORM */}
        <Grid item xs={12} md={8}>
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
                label="Description"
                name="description"
                multiline
                rows={4}
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

            {/* Ticket Type */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Ticket Type"
                name="ticketTypeId"
                value={formik.values.ticketTypeId}
                onChange={formik.handleChange}
                error={
                  formik.touched.ticketTypeId &&
                  Boolean(formik.errors.ticketTypeId)
                }
                helperText={
                  formik.touched.ticketTypeId && formik.errors.ticketTypeId
                }
              >
                {ticketTypes.length === 0 ? (
                  <MenuItem disabled>
                    <em>No data</em>
                  </MenuItem>
                ) : (
                  ticketTypes.map((t: any) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                name="departmentId"
                value={formik.values.departmentId}
                onChange={formik.handleChange}
                error={
                  formik.touched.departmentId &&
                  Boolean(formik.errors.departmentId)
                }
                helperText={
                  formik.touched.departmentId && formik.errors.departmentId
                }
              >
                {departments.length === 0 ? (
                  <MenuItem disabled>
                    <em>No data</em>
                  </MenuItem>
                ) : (
                  departments.map((d: any) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Project */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project (optional)"
                name="projectId"
                value={formik.values.projectId}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Category */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                name="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
                helperText={
                  formik.touched.categoryId && formik.errors.categoryId
                }
              >
                {categories.length === 0 ? (
                  <MenuItem disabled>
                    <em>No categories</em>
                  </MenuItem>
                ) : (
                  categories.map((c: any) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Subcategory */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Subcategory"
                name="subCategoryId"
                disabled={!formik.values.categoryId}
                value={formik.values.subCategoryId}
                onChange={formik.handleChange}
                error={
                  formik.touched.subCategoryId &&
                  Boolean(formik.errors.subCategoryId)
                }
                helperText={
                  formik.touched.subCategoryId && formik.errors.subCategoryId
                }
              >
                {subcategories.length === 0 ? (
                  <MenuItem disabled>
                    <em>No subcategories</em>
                  </MenuItem>
                ) : (
                  subcategories.map((s: any) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                name="priorityId"
                value={formik.values.priorityId}
                onChange={formik.handleChange}
                error={
                  formik.touched.priorityId && Boolean(formik.errors.priorityId)
                }
                helperText={
                  formik.touched.priorityId && formik.errors.priorityId
                }
              >
                {priorities.length === 0 ? (
                  <MenuItem disabled>
                    <em>No data</em>
                  </MenuItem>
                ) : (
                  priorities.map((p: any) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* Attachments */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Attachments
              </Typography>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  type="file"
                  id="file-input"
                  hidden
                  multiple
                  onChange={handleFileSelect}
                />
                <Upload sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Click to upload or drag & drop
                </Typography>
              </Box>

              {attachments.length > 0 && (
                <List dense sx={{ mt: 2 }}>
                  {attachments.map((file, index) => (
                    <ListItem
                      key={index}
                      sx={{ bgcolor: "action.hover", borderRadius: 1, mb: 1 }}
                    >
                      <AttachFile sx={{ mr: 2 }} />
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(2)} KB`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => removeAttachment(index)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT SIDEBAR */}
        <Grid item xs={12} md={4}>
          {/* SLA CARD */}
          {slaLoading ? (
            <Card sx={{ mb: 2 }}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 120,
                }}
              >
                <CircularProgress />
              </CardContent>
            </Card>
          ) : slaIsValid ? (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Info sx={{ color: "primary.main", mr: 1 }} />
                  <Typography variant="h6">SLA Information</Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    SLA Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {slaInfo?.slaName}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Response Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {slaInfo?.responseTimeInHours} hours
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Resolution Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {slaInfo?.resolutionTimeInHours} hours
                  </Typography>
                </Box>

                {slaInfo?.expectedDueDate && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Expected Due Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(slaInfo.expectedDueDate).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  SLA will display once Priority and Department are selected.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          {/* <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search the knowledge base or contact your department admin if
                unsure of the category.
              </Typography>
            </CardContent>
          </Card> */}
        </Grid>
        {/* ACTION BUTTONS */}
        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? "Creating..." : "Create Ticket"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
