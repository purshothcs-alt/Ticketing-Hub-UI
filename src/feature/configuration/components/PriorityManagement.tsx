import { useState } from "react";
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
} from "@mui/material";

import { Add, Edit, Delete, Check, Close } from "@mui/icons-material";
import { DataGrid, type Column } from "../../../shared/components/DataGrid";

import {
  useCreatePriorityMutation,
  useDeletePriorityMutation,
  useGetPrioritiesQuery,
  useUpdatePriorityMutation,
} from "../services/priorityApi";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

interface Priority {
  id: string;
  priorityName: string;
  colorCode: string;
  slaHours: number;
  isActive: boolean;
}

export const PriorityManagement = () => {
  /** ✅ Server-side DataGrid state */
  const [page, setPage] = useState(0); // ✅ MUI uses 0-based index
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("priorityName");
  const [sortAsc, setSortAsc] = useState(true);

  /** ✅ API Call — PageNumber must be page + 1 */
  const { data, isLoading } = useGetPrioritiesQuery({
    PageNumber: page + 1, // ✅ Backend expects 1-based
    PageSize: pageSize,
    SearchText: searchText,
    SortField: sortField,
    SortOrder: sortAsc,
  });

  const priorities = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  /** ✅ CRUD Mutations */
  const [createPriority] = useCreatePriorityMutation();
  const [updatePriority] = useUpdatePriorityMutation();
  const [deletePriority] = useDeletePriorityMutation();

  /** ✅ Dialog State */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [formData, setFormData] = useState({
    priorityName: "",
    colorCode: "#A8C5E6",
    slaHours: 48,
  });

  /** ✅ Open dialog */
  const handleOpenDialog = (priority?: Priority) => {
    if (priority) {
      setEditingPriority(priority);
      setFormData({
        priorityName: priority.priorityName,
        colorCode: priority.colorCode,
        slaHours: priority.slaHours,
      });
    } else {
      setEditingPriority(null);
      setFormData({
        priorityName: "",
        colorCode: "#A8C5E6",
        slaHours: 48,
      });
    }
    setDialogOpen(true);
  };

  /** ✅ Save (Create/Update) */
  const handleSave = async () => {
    try {
      if (editingPriority) {
        await updatePriority({
          id: editingPriority.id,
          ...formData,
        }).unwrap();
      } else {
        await createPriority(formData).unwrap();
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /** ✅ Delete */
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this priority?")) {
      await deletePriority(id);
    }
  };

  /** ✅ DataGrid Columns */
  const columns: Column<Priority>[] = [
    {
      field: "priorityName",
      headerName: "Priority Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              bgcolor: params.row.colorCode,
              border: "1px solid",
            }}
          />
          <Typography sx={{ fontWeight: 600, textTransform: "capitalize" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "colorCode",
      headerName: "Color",
      width: 140,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            bgcolor: params.value,
            color: "text.primary",
            fontFamily: "monospace",
            height: 24,
          }}
          size="small"
        />
      ),
    },
    {
      field: "slaHours",
      headerName: "SLA Hours",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={`${params.value}h`}
          color="info"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 130,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          icon={params.value ? <Check /> : <Close />}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {canEdit('Priorities') && (
          <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
            <Edit fontSize="small" />
          </IconButton>)}

          {canDelete('Priorities') && (<IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>)}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* ✅ Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Priority Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage ticket priorities and SLA response times
          </Typography>
        </Box>

         {canAdd('Priorities') && (<Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Priority
        </Button>)}
      </Box>

      {/* ✅ Server-side DataGrid */}
      <DataGrid
        rows={priorities}
        rowCount={totalCount}
        columns={columns}
        loading={isLoading}
        searchText={searchText}
        onSearchChange={(text) => {
          setSearchText(text);
          setPage(0); // ✅ reset to first page
        }}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)} // ✅ 0-based
        onPageSizeChange={(size) => setPageSize(size)}
        paginationMode="server"
        sortingMode="server"
        onSortModelChange={(sort) => {
          if (sort.length > 0) {
            setSortField(sort[0].field);
            setSortAsc(sort[0].sort === "asc");
            setPage(0); // ✅ reset to page 1 (0-based)
          }
        }}
      />

      {/* ✅ Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPriority ? "Edit Priority" : "Add Priority"}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Priority Name"
                  value={formData.priorityName}
                  onChange={(e) =>
                    setFormData({ ...formData, priorityName: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color Code"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="SLA Hours"
                  value={formData.slaHours}
                  onChange={(e) =>
                    setFormData({ ...formData, slaHours: Number(e.target.value) })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingPriority ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
