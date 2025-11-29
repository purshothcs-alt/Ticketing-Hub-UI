import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Paper,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

import { DataGrid, type Column } from "../../../shared/components/DataGrid";
import type {
  CreateModuleRequest,
  ModuleListItem,
  PermissionRequest,
} from "../types";

import {
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useGetModuleByIdQuery,
  useGetModulesQuery,
  useUpdateModuleMutation,
} from "../services/ModuleApi";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

const emptyPermission: PermissionRequest = {
  id:"",
  permissionName: "",
  description: "",
};

export const ModuleManagement = () => {
  /** ✅ DataGrid state */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  /** ✅ Actual query search text */
  const [searchText, setSearchText] = useState("");

  /** ✅ Controlled input text (debounced) */
  const [searchInput, setSearchInput] = useState("");

  /** ✅ Sorting */
  const [sortField, setSortField] = useState("moduleName");
  const [sortAsc, setSortAsc] = useState(true);

  /** ✅ Debounce search (300ms) */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchText(searchInput);
      setPage(0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  /** ✅ Load module list with refetchOnArgChange */
  const { data, isLoading } = useGetModulesQuery(
    {
      PageNumber: page + 1,
      PageSize: pageSize,
      SearchText: searchText,
      SortField: sortField,
      SortOrder: sortAsc,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const modules = data?.modules ?? [];
  const totalCount = data?.totalCount ?? 0;

  /** ✅ Mutations */
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();

  /** ✅ dialog + form state */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateModuleRequest>({
    moduleName: "",
    description: "",
    permissions: [{ ...emptyPermission }],
  });

  /** ✅ FIX: API returns { module: {...} } */
  const { data: moduleResponse } = useGetModuleByIdQuery(editingId!, {
    skip: !editingId,
  });

  const moduleDetails = moduleResponse?.module;

  /** ✅ Load module details into form when editing */
  useEffect(() => {
    if (moduleDetails) {
      setFormData({
        moduleName: moduleDetails.moduleName,
        description: moduleDetails.description,
        permissions:
          moduleDetails.permissions?.length > 0
            ? moduleDetails.permissions.map((p) => ({
                id: p.id,
                permissionName: p.permissionName,
                description: p.description,
              }))
            : [{ ...emptyPermission }],
      });
    }
  }, [moduleDetails]);

  /** ✅ add new module */
  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      moduleName: "",
      description: "",
      permissions: [{ ...emptyPermission }],
    });
    setDialogOpen(true);
  };

  /** ✅ edit */
  const handleEdit = (row: ModuleListItem) => {
    setEditingId(row.id);
    setDialogOpen(true);
  };

  /** ✅ save (create / update) */
  const handleSave = async () => {
    const cleanedPermissions = formData.permissions
      .filter((p) => p.permissionName.trim() !== "")
      .map(({ id,permissionName, description }) => ({
        id,
        permissionName,
        description,
      }));

    try {
      if (editingId) {
        await updateModule({
          moduleId: editingId,
          moduleName: formData.moduleName.trim(),
          description: formData.description.trim(),
          permissions: cleanedPermissions,
          isActive: true,
        }).unwrap();
      } else {
        await createModule({
          moduleName: formData.moduleName.trim(),
          description: formData.description.trim(),
          permissions: cleanedPermissions,
        }).unwrap();
      }

      setDialogOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /** ✅ delete */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this module?")) return;

    try {
      await deleteModule(id).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /** ✅ permission change handlers */
  const handleAddPermission = () => {
    setFormData({
      ...formData,
      permissions: [...formData.permissions, { ...emptyPermission }],
    });
  };

  const handleRemovePermission = (index: number) => {
    if (formData.permissions.length === 1) return;

    setFormData({
      ...formData,
      permissions: formData.permissions.filter((_, i) => i !== index),
    });
  };

  const handlePermissionChange = (
    index: number,
    field: keyof PermissionRequest,
    value: string
  ) => {
    const updated = [...formData.permissions];
    updated[index][field] = value;
    setFormData({ ...formData, permissions: updated });
  };

  /** ✅ Columns */
  const columns: Column<ModuleListItem>[] = [
    { field: "moduleName", headerName: "Module Name", flex: 1, minWidth: 200 },
    { field: "description", headerName: "Description", flex: 1.2, minWidth: 250 },
    {
      field: "permissionCount",
      headerName: "Permissions",
      width: 130,
      align: "center",
      renderCell: (params) => <Chip label={params.value} color="primary" size="small" />,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {canEdit('Modules') && (
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>)}

          {canDelete('Modules') && (<Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>)}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Module Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage modules and their permissions
          </Typography>
        </Box>

        {canAdd('Modules') && (<Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Module
        </Button>)}
      </Box>

      {/* ✅ DataGrid */}
      <DataGrid
        rows={modules}
        rowCount={totalCount}
        loading={isLoading}
        columns={columns}
        searchText={searchInput}
        onSearchChange={(v) => {
          setSearchInput(v);
        }}
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortingMode="server"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortField(model[0].field);
            setSortAsc(model[0].sort === "asc");
            setPage(0);
          }
        }}
      />

      {/* ✅ Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Edit Module" : "Add New Module"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Name"
                value={formData.moduleName}
                onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                multiline
                rows={2}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            {/* ✅ Permissions */}
            <Grid item xs={12}>
              <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Permissions
                </Typography>

                <Button startIcon={<Add />} size="small" onClick={handleAddPermission}>
                  Add Permission
                </Button>
              </Box>

              {formData.permissions.map((p, i) => (
                <Paper key={i} sx={{ p: 2, mb: 1, borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Permission Name"
                        value={p.permissionName}
                        onChange={(e) =>
                          handlePermissionChange(i, "permissionName", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={p.description}
                        onChange={(e) =>
                          handlePermissionChange(i, "description", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={1}>
                      {formData.permissions.length > 1 && (
                        <IconButton color="error" onClick={() => handleRemovePermission(i)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.moduleName.trim()}
          >
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
