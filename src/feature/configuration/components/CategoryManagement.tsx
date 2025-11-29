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
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../services/CategoryApi";
import { useToast } from "../../../shared/hooks/toastHook";
import Toast from "../../../shared/components/Toast";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

interface Category {
  id: string;
  categoryName: string;
  description: string;
  isActive: boolean;
}

export const CategoryManagement = () => {
  // ✅ Server-side state (ALWAYS 0-based for UI)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("categoryName");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { open, message, severity, showToast, hideToast } = useToast();
  // ✅ Fetch Categories (convert 0-based → 1-based before API)
  const { data, isLoading } = useGetCategoriesQuery({
    PageNumber: page + 1,
    PageSize: pageSize,
    SortField: sortField,
    SortOrder: sortAsc,
    SearchText: searchText,
  });

  const categories: Category[] = data?.items ?? [];
  const totalCount: number = data?.totalCount ?? 0;

  // ✅ CRUD hooks
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // ✅ Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    isActive: true,
  });

  // ✅ Open dialog for Add/Edit
  const handleOpenDialog = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        categoryName: cat.categoryName,
        description: cat.description,
        isActive: cat.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        categoryName: "",
        description: "",
        isActive: true,
      });
    }

    setDialogOpen(true);
  };

  // ✅ Create or Update
  const handleSave = async () => {
    if (editingCategory) {
      await updateCategory({
        id: editingCategory.id,
        ...formData,
      });
    } else {
      await createCategory(formData);
    }
    setDialogOpen(false);
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  // ✅ Toggle Active/Inactive
  const handleToggleActive = async (id: string) => {
    const found = categories.find((c) => c.id === id);
    if (!found) return;

    await updateCategory({
      id,
      categoryName: found.categoryName,
      description: found.description,
      isActive: !found.isActive,
    });
  };

  // ✅ DataGrid columns
  const columns: Column<Category>[] = [
    {
      field: "categoryName",
      headerName: "Category Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 300,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
          icon={params.value ? <Check /> : <Close />}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {canEdit('Categories') && (
            <><Tooltip title="Edit">
            
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={params.row.isActive ? "Deactivate" : "Activate"}>
            <IconButton
              size="small"
              color={params.row.isActive ? "warning" : "success"}
              onClick={() => handleToggleActive(params.row.id)}
            >
              {params.row.isActive ? (
                <Close fontSize="small" />
              ) : (
                <Check fontSize="small" />
              )}
            </IconButton>
          </Tooltip></>
)}
      {canDelete('Users') && (
          <Tooltip title="Delete">
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
      {/* ✅ Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Category Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage ticket categories and descriptions
          </Typography>
        </Box>

        {canAdd('Categories') && (<Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>)}
      </Box>

      {/* ✅ Server-side DataGrid */}
      <DataGrid
        rows={categories}
        rowCount={totalCount}
        columns={columns}
        loading={isLoading}
        searchText={searchText}
        onSearchChange={(value) => {
          setSearchText(value);
          setPage(0); // ✅ reset to first page
        }}
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)} // ✅ 0-based
        onPageSizeChange={(ps) => {
          setPageSize(ps);
          setPage(0);
        }}
        sortingMode="server"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortField(model[0].field);
            setSortAsc(model[0].sort === "asc");
          }
          setPage(0);
        }}
      />

      {/* ✅ Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCategory ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Category Name"
                fullWidth
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingCategory ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Toast
        open={open}
        message={message}
        severity={severity}
        handleClose={hideToast}
      />
    </Box>
  );
};
