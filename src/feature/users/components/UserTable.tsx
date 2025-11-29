import { Avatar, Chip, IconButton, Typography, Box } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { DataGrid, type Column } from '../../../shared/components/DataGrid';
import type { User } from '../../../shared/types';
import type { GridSortModel } from '@mui/x-data-grid';
import { Edit, Delete } from "@mui/icons-material";
import { canDelete, canEdit } from '../../../shared/utils/helper';
interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (selected: string[]) => void;
  onUserAction: (action: 'edit' | 'delete', user: User) => void;
  isLoading?: boolean;
  searchText?: string;
  onSearchChange?: (value: string) => void;
  page?:number;
  pageSize?:number;
  onPageChange: (value: number) => void;
  onPageSizeChange: (value: number) => void;
  rowCount?:number;
  onSortChange?: (value: boolean) => void; 
  onSortChangeColumn?: (value: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onUserAction,
  searchText="",
  onSearchChange = () => {},
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  rowCount,
  onSortChange,
  onSortChangeColumn,
  isLoading = false,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'IT Support Agent':
        return 'primary';
      case 'Department Manager':
        return 'secondary';
      case 'End User':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: Column<User>[] = [
    {
      field: 'fullName',
      headerName: 'User',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            {params.row?.fullName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {params.row.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
        {
      field: 'employeeCode',
      headerName: 'Employee Code',
      width: 180,
    },
    {
      field: 'roleName',
      headerName: 'Role',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      width: 150,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    //createDateColumn('lastLogin', 'Last Login', 180),
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          {canEdit('Users') && (
      <IconButton
        size="small"
        onClick={() => onUserAction('edit', params.row as User)}
      >
        <Edit fontSize="small" />
      </IconButton>
      )}
      {canDelete('Users') && (
      <IconButton
        color="error"
        size="small"
        onClick={() => onUserAction('delete', params.row as User)}
      >
        <Delete fontSize="small" />
      </IconButton>)}
    </Box>
      ),
    },
  ];
 const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

const handleSortModelChange = (sortModel: GridSortModel) => {
  if (sortModel.length > 0) {
    const { field, sort } = sortModel[0];
    console.log(field)
    onSortChange?.(sort === "asc");
    onSortChangeColumn?.(field);
    onPageChange(0);
  } else {
    onSortChangeColumn?.('');
  }
};
  return (
   <DataGrid<User>
  rows={users || []}
  rowCount={rowCount ?? 0}
  loading={isLoading}
  columns={columns} // pass original columns
  searchText={searchText}
  onSearchChange={handleSearchChange}
  paginationMode="server"
  page={page}
  pageSize={pageSize}
  onPageChange={onPageChange}
  onPageSizeChange={onPageSizeChange}
  sortingMode="server"
  onSortModelChange={handleSortModelChange}
/>

  );
};
