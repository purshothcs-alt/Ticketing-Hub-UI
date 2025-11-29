import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Add,
  FilterList,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Close,
} from "@mui/icons-material";
import moment from "moment";

import {
  useDeleteTicketMutation,
  useGetTicketsQuery,
} from "../services/ticketsApi";

import {
  DataGrid,
  type Column,
} from "../../../shared/components/DataGrid";
import {
  useGetDepartmentsQuery,
  useGetPrioritiesQuery,
  useGetStatusesQuery,
} from "../../shared/services/dropdownsApi";
import { CreateTicketPage } from "./CreateTicketPage";
import { EditTicketPage } from "./EditTicketPage";

export const TicketsPage = () => {
  const navigate = useNavigate();

  // ============================
  // FETCH DROPDOWN DATA
  // ============================
  const { data: statuses = [] } = useGetStatusesQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: priorities = [] } = useGetPrioritiesQuery();

  // FILTER STATES
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("categoryName");
  const [sortAsc, setSortAsc] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);


  const handleCreateTicket = () => {
    setCreateDialogOpen(false);
    // Refresh tickets list here
  };
  // ============================
  // TICKETS API CALL
  // ============================
  const { data, isLoading, refetch } = useGetTicketsQuery({
    StatusId: statusFilter !== "all" ? statusFilter : undefined,
    PriorityId: priorityFilter !== "all" ? priorityFilter : undefined,
    DepartmentId: departmentFilter !== "all" ? departmentFilter : undefined,
    SearchText: searchText || undefined,
    PageNumber: page,
    PageSize: pageSize,
    SortField: sortField,
    SortOrder: sortAsc,
  });

  const tickets = data?.items || [];
  const totalRecords = data?.totalCount || 0;

  const [deleteTicket] = useDeleteTicketMutation();

  const handleDelete = async (id: string) => {
    await deleteTicket(id);
    refetch();
  };
  interface Dropdown {
    id: string; // Replace with actual type if different
    name: string; // Replace with actual type if different
  }

  // COLORS FOR CHIP DISPLAY
  const statusColors: Record<string, any> = {
    Open: "primary",
    "In Progress": "info",
    Waiting: "warning",
    Resolved: "success",
    Closed: "default",
  };

  const priorityColors: Record<string, any> = {
    Low: "default",
    Medium: "info",
    High: "warning",
    Critical: "error",
  };

  // ============================
  // GRID COLUMNS
  // ============================
  const columns: Column[] = [
    {
      field: "ticketNumber",
      headerName: "Ticket #",
      width: 200,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
          {params.value}
        </Typography>
      ),
    },
    { field: "title", headerName: "Title", flex: 1, width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value] || "default"}
          size="small"
        />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={priorityColors[params.value] || "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    { field: "category", headerName: "Category", width: 150 },
    { field: "assignedTo", headerName: "Assigned To", width: 150 },
    { field: "department", headerName: "Department", width: 150 },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 150,
      renderCell: (params) => (
        <>{moment(params.value).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      renderCell: (params) => (
        <>{moment(params.value).format("DD-MM-YYYY")}</>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/tickets/${params.row.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/tickets/${params.row.id}/edit`)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>          */}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                setEditingTicketId(params.row.id);
                setEditDialogOpen(true);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

        </Box>
      ),
    },
  ];
const handleOpenDialog = () => {
  setCreateDialogOpen((prev) => {
    if (!prev) return true;   // open only if currently closed
    return prev;
  });
};

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Tickets
          </Typography>
          <Typography color="text.secondary">
            Manage and track support tickets
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenDialog}
        >
          Create Ticket
        </Button>
      </Box>

      {/* FILTERS */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {/* STATUS FILTER */}
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {statuses.map((s: Dropdown) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* PRIORITY FILTER */}
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {priorities.map((p: Dropdown) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* DEPARTMENT FILTER */}
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {departments.map((d: Dropdown) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* ACTIONS */}
          {/* <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Tooltip title="Refresh">
                <IconButton onClick={() => refetch()} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>

              <Tooltip title="More Filters">
                <IconButton color="primary">
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid> */}
        </Grid>
      </Paper>

      {/* DATAGRID */}
      <DataGrid
        rows={tickets}
        columns={columns}
        loading={isLoading}
        rowCount={totalRecords}
        searchText={searchText}
        onSearchChange={(value) => {
          setSearchText(value);
          setPage(1);
        }}
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(ps) => {
          setPageSize(ps);
          setPage(1);
        }}
        sortingMode="server"
        onSortModelChange={(model) => {
          if (model.length > 0) {
            setSortField(model[0].field);
            setSortAsc(model[0].sort === "asc");
          }
          setPage(1);
        }}
      /><Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Create New Ticket
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new support request
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setCreateDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CreateTicketPage onSuccess={handleCreateTicket} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
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

          <IconButton
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {editingTicketId && (
            <EditTicketPage
              ticketId={editingTicketId}
              onSuccess={() => {
                setEditDialogOpen(false);
                refetch();
              }}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};
