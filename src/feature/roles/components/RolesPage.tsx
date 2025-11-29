// === RolesPage.tsx (server-side pagination/sorting/search) ===
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Checkbox,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Security } from "@mui/icons-material";
import { DataGrid, type Column } from "../../../shared/components/DataGrid";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRoleByIdQuery,
  useGetRolesQuery,
  useUpdateRoleMutation,
} from "../services/roleApi";
import { useGetModuleByPermissionQuery } from "../../configuration/services/ModuleApi";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

export const RolesPage = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("roleName");
  const [sortAsc, setSortAsc] = useState(true);
  const { data: modules = [] } = useGetModuleByPermissionQuery();
  const { data, isFetching } = useGetRolesQuery({
    PageNumber: page + 1,
    PageSize: pageSize,
    SearchText: searchText,
    SortField: sortField,
    SortOrder: sortAsc,
  });

  const roles = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: roleDetail } = useGetRoleByIdQuery(editingId!, {
    skip: !editingId,
  });

  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: [] as Array<{ moduleId: string; permissionTypeId: string }>,
  });

  useEffect(() => {
    if (roleDetail) {
      setFormData({
        roleName: roleDetail.roleName,
        description: roleDetail.description,
        permissions: roleDetail.permissions.flatMap((m: any) =>
          m.permissionTypes.map((pt: any) => ({
            moduleId: m.moduleId,
            permissionTypeId: pt.permissionTypeId,
          }))
        ),
      });
    }
  }, [roleDetail]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ roleName: "", description: "", permissions: [] });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setDialogOpen(true);
  };

  const saveRole = async () => {
  const moduleIds = [...new Set(formData.permissions.map((p) => p.moduleId))];
  const permissionIds = formData.permissions.map((p) => p.permissionTypeId);

  if (editingId) {
    await updateRole({
      roleId: editingId,                  // ✅ ID inside body
      roleName: formData.roleName,
      description: formData.description,
      moduleIds,
      permissionIds,
    }).unwrap();
  } else {
    await createRole({
      roleName: formData.roleName,
      description: formData.description,
      moduleIds,
      permissionIds,
    }).unwrap();
  }

  setDialogOpen(false);
};


  const deleteRoleFn = async (id: string) => {
    if (confirm("Delete this role?")) await deleteRole(id);
  };

  const togglePermission = (moduleId: string, permissionTypeId: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.some(
        (p) =>
          p.moduleId === moduleId && p.permissionTypeId === permissionTypeId
      );
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter(
              (p) =>
                !(
                  p.moduleId === moduleId &&
                  p.permissionTypeId === permissionTypeId
                )
            )
          : [...prev.permissions, { moduleId, permissionTypeId }],
      };
    });
  };

  const columns: Column[] = [
    {
      field: "roleName",
      headerName: "Role Name",
      sortable: true,
      flex: 1,
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Security sx={{ color: "primary.main" }} />
          <Typography fontWeight={600}>{p.value}</Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      sortable: true,
      flex: 2,
    },
    {
      field: "permissions",
      headerName: "Modules",
      width: 120,
      renderCell: (p) => (
        <Chip label={p.value.length} size="small" color="secondary" />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {canEdit('Roles') && (<IconButton onClick={() => openEdit(p.row.id)} size="small">
            <Edit />
          </IconButton>)}
           {canDelete('Roles') && (<IconButton
            onClick={() => deleteRoleFn(p.row.id)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>)}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Role Management</Typography>
        {canAdd('Roles') &&(<Button variant="contained" startIcon={<Add />} onClick={openCreate}>
          Add Role
        </Button>)}
      </Box>

      <TextField
        placeholder="Search roles..."
        fullWidth
        sx={{ mb: 2 }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(0);
        }}
      />

      <DataGrid
        rows={roles}
        rowCount={totalCount}
        loading={isFetching}
        columns={columns}
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        sortingMode="server"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortModelChange={(m) => {
          if (m.length) {
            setSortField(m[0].field);
            setSortAsc(m[0].sort === "asc");
            setPage(0);
          }
        }}
      />

      {/* === Dialog === */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editingId ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Role Name"
                fullWidth
                value={formData.roleName}
                onChange={(e) =>
                  setFormData({ ...formData, roleName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1">Permissions</Typography>
            </Grid>

            {modules.map((mod) => (
              <Grid item xs={12} sm={6} key={mod.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={600}>{mod.moduleName}</Typography>
                    <FormGroup>
                      {mod.permissions.map((pt) => (
                        <FormControlLabel
                          key={pt.id}
                          control={
                            <Checkbox
                              checked={formData.permissions.some(
                                (p) =>
                                  p.moduleId === mod.id &&
                                  p.permissionTypeId === pt.id
                              )}
                              onChange={() => togglePermission(mod.id, pt.id)}
                            />
                          }
                          label={pt.permissionName}
                        />
                      ))}
                    </FormGroup>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveRole}>
            {editingId ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
