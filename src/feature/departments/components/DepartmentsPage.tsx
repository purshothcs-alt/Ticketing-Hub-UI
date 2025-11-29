import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Business,
  People,
  Person,
  ExpandMore,
  ExpandLess,
  AccountTree,
  ViewList,
  Edit,
  Delete,
} from "@mui/icons-material";
import { EmptyState } from "../../../shared/components/EmptyState";
import { LoadingState } from "../../../shared/components/LoadingState";
import type { Department } from "../../../shared/types";
import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByIdQuery,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "../services/departmentApis";
import { useGetManagersQuery } from "../../shared/services/dropdownsApi";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import DepartmentDialog from "./DepartmentForm";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";



export const DepartmentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState<Department | null>(null);
  const canManageDepartments =  "Admin";
  //const departmentTree = buildDepartmentTree(departments);
  const {
    data: departments,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetDepartmentsQuery();
  const [createDepartmentMutation, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartmentMutation, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartmentMutation, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();
  const { data: fetchedDepartment, isLoading: isUserLoading } =
    useGetDepartmentByIdQuery(editingId!, {
      skip: !editingId, // skip fetching if no userId (Add mode)
    });
  const { data: managers = [] } = useGetManagersQuery();

  useEffect(() => {
    if (fetchedDepartment) {
      setEditingDepartment(fetchedDepartment);
    }
  }, [fetchedDepartment]);

  const validate = (): boolean => {
    if (!editingDepartment) return false;

    const newErrors: { [key: string]: string } = {};

    if (!editingDepartment.departmentName?.trim()) {
      newErrors.departmentName = "Department Name is required";
    } else if (editingDepartment.departmentName.length < 2) {
      newErrors.departmentName =
        "Department Name must be at least 2 characters";
    }

    if (!editingDepartment.description?.trim()) {
      newErrors.description = "Description is required";
    } else if (editingDepartment.description.length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

     if (!editingDepartment.headUserId?.trim()) {
      newErrors.headUserId = "Department Head is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!editingDepartment) return;

    if (!validate()) return; // stop if validation fails

    try {
      if (editingId) {
        // Update
        await updateDepartmentMutation({
          id: editingDepartment.id,
          departmentName: editingDepartment.departmentName,
          description: editingDepartment.description,
          parentDepartmentId: null,
          headUserId: editingDepartment.headUserId,
          isActive: editingDepartment.isActive,
        }).unwrap();
      } else {
        // Create
        await createDepartmentMutation({
          departmentName: editingDepartment.departmentName,
          description: editingDepartment.description,
          parentDepartmentId: null,
          headUserId: editingDepartment.headUserId,
          isActive: editingDepartment.isActive,
        }).unwrap();
      }

      // Reset form & close
      setEditingDepartment(null);
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };
  const handleEdit = (dept: any) => {
    setEditingId(dept.id);
    setDialogOpen(true);
  };

  if (!canManageDepartments) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You don't have permission to manage departments. Contact your
          administrator for access.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingState variant="card" count={6} />;
  }

  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    try {
      await deleteDepartmentMutation(departmentToDelete.id);
      setDeleteConfirmOpen(false);
      setDepartmentToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  const handleDelete = (dept: any) => {
    setDepartmentToDelete(dept);
    setDeleteConfirmOpen(true);
  };
  console.log(departmentToDelete);
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Departments Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage organizational departments and their hierarchy
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Tabs value={viewMode} onChange={(_, value) => setViewMode(value)}>
            {/* <Tab icon={<ViewList />} iconPosition="start" label="Grid View" value="grid" /> */}
          </Tabs>
          {canAdd('Departments') &&(<Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingId(null);
              setEditingDepartment({
                id: "",
                departmentName: "",
                description: "",
                managerName: "",
                managerEmail: "",
                headUserId: "",
                memberCount: 0,
                isActive: true,
              });
              setDialogOpen(true);
            }}
          >
            Add Department
          </Button>)}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {departments?.totalDepartments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Departments
                  </Typography>
                </Box>
                <Business
                  sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "success.main" }}
                  >
                    {departments?.activeDepartments || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Departments
                  </Typography>
                </Box>
                <Business
                  sx={{ fontSize: 40, color: "success.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "info.main" }}
                  >
                    {departments?.totalMembers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Members
                  </Typography>
                </Box>
                <People
                  sx={{ fontSize: 40, color: "info.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "warning.main" }}
                  >
                    {departments?.averageTeamSize || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Team Size
                  </Typography>
                </Box>
                <Person
                  sx={{ fontSize: 40, color: "warning.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Grid View */}
      {viewMode === "grid" && (
        <Grid container spacing={3}>
          {departments.departments.map((department: any) => (
            <Grid item xs={12} sm={6} md={4} key={department.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Business
                        sx={{ fontSize: 32, color: "primary.main", mr: 2 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {department?.departmentName}
                      </Typography>
                    </Box>
                    <Box>
                      {canEdit('Departments') && (<IconButton
                        size="small"
                        onClick={() => handleEdit(department)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>)}
                      {canDelete('Departments') && (<IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(department)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>)}
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {department?.description}
                  </Typography>

                  {department?.managerName && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: "primary.main",
                          fontSize: "0.75rem",
                        }}
                      >
                        {department?.managerName.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        Manager: {department.managerName}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Chip
                      icon={<People />}
                      label={`${department.memberCount} members`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={department.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={department.isActive ? "success" : "default"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {departments.departments.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <EmptyState
            title="No departments found"
            description="Get started by creating your first department."
            actionLabel="Add Department"
            onAction={() => setDialogOpen(true)}
          />
        </Box>
      )}


      <DepartmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        editingDepartment={editingDepartment}
        setEditingDepartment={setEditingDepartment}
        errors={errors}
        managers={managers}
        editingId={editingId}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirm Delete"
        message={`Are you sure you want to delete department "${departmentToDelete?.departmentName}"? This action cannot be undone.`}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteDepartment}
        loading={isDeleting}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};
