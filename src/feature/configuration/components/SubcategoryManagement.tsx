import { useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
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
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  type SubCategory,
} from "../services/subCategoryApi";

import { useGetCategoryDropdownsQuery } from "../../shared/services/dropdownsApi";
import type { GridSortModel } from "@mui/x-data-grid";
import { canAdd, canDelete, canEdit } from "../../../shared/utils/helper";

/* ✅ Category dropdown structure */
interface CategoryDropdown {
  id: string;
  name: string;
}

export const SubcategoryManagement = () => {
  /** ✅ Table state (server-side driven) */
  const [page, setPage] = useState<number>(0); // ✅ 0-based for DataGrid
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("name"); 
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>(); // empty = ALL

  /** ✅ Dialog form state */
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
  });

  /** ✅ Load category dropdown list */
  const { data: categories = [] } = useGetCategoryDropdownsQuery();

  /** ✅ Load subcategories with filters */
  const { data, isLoading, isFetching } = useGetSubCategoriesQuery({
    PageNumber: page + 1, // ✅ backend expects 1-based
    PageSize: pageSize,
    SortField: sortField,
    SortOrder: sortAsc,
    SearchText: searchText,
    CategoryId: categoryFilter || undefined, // ✅ correct name for backend
  });

  const rows = data?.rows ?? [];
  const rowCount = data?.rowCount ?? 0;

  /** ✅ Mutations */
  const [createSub] = useCreateSubCategoryMutation();
  const [updateSub] = useUpdateSubCategoryMutation();
  const [deleteSub] = useDeleteSubCategoryMutation();

  /** ✅ Open/Edit dialog */
  const handleOpenDialog = (row?: SubCategory) => {
    if (row) {
      setEditing(row);
      setFormData({
        categoryId: row.categoryId,
        name: row.name,
        description: row.description ?? "",
      });
    } else {
      setEditing(null);
      setFormData({ categoryId: "", name: "", description: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  /** ✅ Save subcategory */
  const handleSave = async () => {
    const payload = {
      categoryId: formData.categoryId,
      subCategoryName: formData.name,
      description: formData.description || null,
      isActive: editing?.isActive ?? true,
    };

    try {
      if (editing) {
        await updateSub({ id: editing.id, ...payload }).unwrap();
      } else {
        await createSub(payload).unwrap();
      }
      handleCloseDialog();
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  /** ✅ Delete a subcategory */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await deleteSub(id).unwrap();
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  /** ✅ Toggle active/inactive */
  const handleToggleActive = async (row: SubCategory) => {
    try {
      await updateSub({
        id: row.id,
        categoryId: row.categoryId,
        subCategoryName: row.name,
        description: row.description || null,
        isActive: !row.isActive,
      }).unwrap();
    } catch (e) {
      console.error("Toggle failed:", e);
    }
  };

  /** ✅ Table Columns */
  const columns: Column<SubCategory>[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Subcategory Name",
        flex: 1,
        minWidth: 180,
      },
      {
        field: "categoryId",
        headerName: "Parent Category",
        width: 180,
        renderCell: (params) => {
          const cat = categories.find((c: CategoryDropdown) => c.id === params.value);
          return (
            <Chip label={cat?.name ?? "—"} size="small" color="primary" variant="outlined" />
          );
        },
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1.5,
        minWidth: 240,
      },
      {
        field: "isActive",
        headerName: "Status",
        width: 120,
        align: "center",
        renderCell: (params) => (
          <Chip
            label={params.value ? "Active" : "Inactive"}
            size="small"
            color={params.value ? "success" : "default"}
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
            {canEdit('SubCategories') && (<Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => handleOpenDialog(params.row)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>)}

            {canEdit('SubCategories') && (<Tooltip title={params.row.isActive ? "Deactivate" : "Activate"}>
              <IconButton
                size="small"
                color={params.row.isActive ? "warning" : "success"}
                onClick={() => handleToggleActive(params.row)}
              >
                {params.row.isActive ? <Close fontSize="small" /> : <Check fontSize="small" />}
              </IconButton>
            </Tooltip>)}

            {canDelete('SubCategories') && (<Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>)}
          </Box>
        ),
      },
    ],
    [categories]
  );

  /** ✅ Sorting handler */
  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      const { field, sort } = model[0];
      setSortField(field);
      setSortAsc(sort !== "desc");
      setPage(0);
    } else {
      setSortField("");
    }
  };

  return (
    <Box>
      {/* ------- Header Section ------- */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h6">Subcategory Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage subcategories under parent categories
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Filter */}
          <TextField
            select
            size="small"
            label="Filter by Category"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((c: CategoryDropdown) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Add Button */}
          {canAdd('SubCategories') && (<Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Add Subcategory
          </Button>)}
        </Box>
      </Box>

      {/* ------- DataGrid ------- */}
      <DataGrid<SubCategory>
        rows={rows}
        rowCount={rowCount}
        loading={isLoading || isFetching}
        columns={columns}
        searchText={searchText}
        onSearchChange={(v) => {
          setSearchText(v);
          setPage(0);
        }}
        paginationMode="server"
        sortingMode="server"
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortModelChange={handleSortModelChange}
      />

      {/* ------- Dialog ------- */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Parent Category"
                value={formData.categoryId}
                onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))}
                required
              >
                {categories.map((c: CategoryDropdown) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subcategory Name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.categoryId || !formData.name.trim()}
          >
            {editing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
