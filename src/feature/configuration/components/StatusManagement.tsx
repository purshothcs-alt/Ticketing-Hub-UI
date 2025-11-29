import { useState, useMemo } from "react";
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
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import { Add, Edit, Delete, Check, Close, DragIndicator } from "@mui/icons-material";

import { DataGrid, type Column } from "../../../shared/components/DataGrid";

import {
  useGetStatusesQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} from "../services/statusApi";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

interface Status {
  id: string;
  statusName: string;
  sortOrder: number;
  colorCode: string;
  isFinalStatus: boolean;
  isActive: boolean;
}

export const StatusManagement = () => {
  /** ✅ Controlled table state */
  const [page, setPage] = useState<number>(0); // DataGrid uses 0-based
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchText, setSearchText] = useState<string>("");
  const [sortField, setSortField] = useState<string>("sortOrder");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  /** ✅ API call — always convert to API 1-based page */
  const { data, isLoading, isError, isFetching } = useGetStatusesQuery({
    PageNumber: page + 1, // ✅ always convert here
    PageSize: pageSize,
    SearchText: searchText,
    SortField: sortField,
    SortOrder: sortAsc,
  });

  const statuses = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  /** ✅ Mutations */
  const [createStatus] = useCreateStatusMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteStatus] = useDeleteStatusMutation();

  /** ✅ Dialog state */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Status | null>(null);

  const [formData, setFormData] = useState({
    statusName: "",
    sortOrder: 0,
    colorCode: "#A8C5E6",
    isFinalStatus: false,
  });

  /** ✅ Open dialog */
  const handleOpenDialog = (row?: Status) => {
    if (row) {
      setEditing(row);
      setFormData({
        statusName: row.statusName,
        sortOrder: row.sortOrder,
        colorCode: row.colorCode,
        isFinalStatus: row.isFinalStatus,
      });
    } else {
      setEditing(null);
      setFormData({
        statusName: "",
        sortOrder: totalCount + 1,
        colorCode: "#A8C5E6",
        isFinalStatus: false,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  /** ✅ Save (create or update) */
  const handleSave = async () => {
    try {
      if (editing) {
        await updateStatus({
          id: editing.id,
          ...formData,
          isActive: editing.isActive,
        }).unwrap();
      } else {
        await createStatus({
          ...formData,
          isActive: true,
        }).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  /** ✅ Delete */
  const handleDelete = async (id: string) => {
    if (confirm("Delete this status?")) {
      await deleteStatus(id);
    }
  };

  /** ✅ Toggle Active */
  const handleToggleActive = async (row: Status) => {
    await updateStatus({
      id: row.id,
      statusName: row.statusName,
      sortOrder: row.sortOrder,
      colorCode: row.colorCode,
      isFinalStatus: row.isFinalStatus,
      isActive: !row.isActive,
    });
  };

  /** ✅ Columns */
  const columns: Column<Status>[] = [
    {
      field: "sortOrder",
      headerName: "Order",
      width: 100,
      align: "center",
      renderCell: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DragIndicator sx={{ fontSize: 18, color: "text.secondary" }} />
          {p.value}
        </Box>
      ),
    },
    {
      field: "statusName",
      headerName: "Status Name",
      flex: 1,
      minWidth: 220,
      renderCell: (p) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: p.row.colorCode,
              border: "1px solid",
            }}
          />
          <Typography fontWeight={600}>{p.value}</Typography>
          {p.row.isFinalStatus && (
            <Chip label="Final" size="small" color="warning" />
          )}
        </Box>
      ),
    },
    {
      field: "colorCode",
      headerName: "Color",
      width: 150,
      align: "center",
      renderCell: (p) => (
        <Chip
          size="small"
          label={p.value}
          sx={{ bgcolor: p.value, color: "text.primary" }}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 130,
      align: "center",
      renderCell: (p) => (
        <Chip
          label={p.value ? "Active" : "Inactive"}
          color={p.value ? "success" : "default"}
          icon={p.value ? <Check /> : <Close />}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      align: "center",
      renderCell: (p) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {canEdit('Status') && (
          <IconButton size="small" onClick={() => handleOpenDialog(p.row)}>
            <Edit fontSize="small" />
          </IconButton>)}

          {canEdit('Status') && (<IconButton
            size="small"
            color={p.row.isActive ? "warning" : "success"}
            onClick={() => handleToggleActive(p.row)}
          >
            {p.row.isActive ? <Close /> : <Check />}
          </IconButton>)}

          {canDelete('Status') && (<IconButton
            size="small"
            color="error"
            disabled={p.row.isFinalStatus}
            onClick={() => handleDelete(p.row.id)}
          >
            <Delete />
          </IconButton>)}
        </Box>
      ),
    },
  ];

  /** ✅ Loading */
  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Status Management</Typography>
          <Typography color="text.secondary">
            Manage ticket statuses for workflow
          </Typography>
        </Box>

         {canAdd('Status') && (<Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Status
        </Button>)}
      </Box>

      {/* ✅ FULL SERVER-MODE GRID */}
      <DataGrid
        rows={statuses}
        rowCount={totalCount}
        loading={isFetching}
        columns={columns}
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        searchText={searchText}
        onSearchChange={(v) => {
          setSearchText(v);
          setPage(0);
        }}
        sortingMode="server"
        onSortModelChange={(sort) => {
          if (sort.length) {
            setSortField(sort[0].field);
            setSortAsc(sort[0].sort === "asc");
            setPage(0);
          }
        }}
      />

      {/* ✅ Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Status" : "Add Status"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Status Name"
                fullWidth
                value={formData.statusName}
                onChange={(e) =>
                  setFormData({ ...formData, statusName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Sort Order"
                fullWidth
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: Number(e.target.value) })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Color"
                fullWidth
                value={formData.colorCode}
                onChange={(e) =>
                  setFormData({ ...formData, colorCode: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFinalStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, isFinalStatus: e.target.checked })
                    }
                  />
                }
                label="Final Status"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
