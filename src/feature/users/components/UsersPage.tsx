import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Person,
  PersonOff,
  Download,
  Upload,
} from '@mui/icons-material';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { UserFilters } from './UserFilters';
import { BulkActionsBar } from './BulkActionsBar';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingState } from '../../../shared/components/LoadingState';
import type { CreateUserData, UpdateUserData } from '../types';
import type { User } from '../../../shared/types';
import { useCreateUserMutation, useDeleteUserMutation, useGetUserByIdQuery, useGetUsersQuery, useUpdateUserMutation } from '../services/usersApi';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { canAdd } from '../../../shared/utils/helper';


export const UsersPage = () => {
  const [filters, setFilters] = useState({ 
  RoleFilter: "",
  DepartmentFilter: "",
  StatusFilter: undefined as boolean | undefined,
});
  const [searchText, setSearchText] = useState(""); 
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sort, setSort] = useState<boolean | undefined>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const { data: users, isLoading, isFetching, error, refetch } = useGetUsersQuery({...filters,
  SearchText: searchText,PageNumber:page + 1,PageSize:pageSize,SortField:sortColumn,SortOrder:sort});
  const [createUserMutation, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: fetchedUser, isLoading: isUserLoading } = useGetUserByIdQuery(editingUserId!, {
  skip: !editingUserId, // skip fetching if no userId (Add mode)
});


  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createUserMutation(userData);
      setUserFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
useEffect(() => {
  if (fetchedUser) {
    setEditingUser(fetchedUser);
  }
}, [fetchedUser]);
  const handleUpdateUser = async (userData: UpdateUserData) => {
    try {
      await updateUserMutation(userData).unwrap();
      setEditingUserId(null);
       setEditingUser(null);
      setUserFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleUserFormSubmit = (data: CreateUserData | UpdateUserData) => {
  if (editingUserId) {
    // Type assertion: TS now knows it's UpdateUserData
    handleUpdateUser(data as UpdateUserData);
  } else {
    // Type assertion: TS now knows it's CreateUserData
    handleCreateUser(data as CreateUserData);
  }
};


  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUserMutation(userToDelete.id);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUserAction = (action: 'edit' | 'delete', user: User) => {
  if (action === 'edit') {
    setEditingUserId(user.id);
    setUserFormOpen(true);
  } else if (action === 'delete') {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  }
};

  const handleSelectionChange = (selected: string[]) => {
    setSelectedUsers(selected);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Users Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {canAdd('Users') &&(<Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => setUserFormOpen(true)}
          >
            Add User
          </Button>)}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {users?.totalCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {/* {users?.filter((u : User) => u.isActive).length || 0} */}
                    {users?.activeUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {/* {users?.filter((u : User) => !u.isActive).length || 0} */}
                    {users?.inactiveUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inactive Users
                  </Typography>
                </Box>
                <PersonOff sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {/* {users?.filter((u : User) => u.roleName === 'Admin').length || 0} */}
                    {users?.adminUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <UserFilters 
           filters={{
    role: filters.RoleFilter,
    department: filters.DepartmentFilter,
    isActive: filters.StatusFilter,
  }}
  onFiltersChange={(newFilters) =>
    setFilters({
      RoleFilter: newFilters.role,
      DepartmentFilter: newFilters.department,
      StatusFilter: newFilters.isActive,
    })
  }
          // onFiltersChange={handleFiltersChange}
           />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedUsers.length}
          onClear={() => setSelectedUsers([])}
          onBulkAction={(action) => console.log('Bulk action:', action)}
        />
      )}

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
            <UserTable
              users={users?.users}
              selectedUsers={selectedUsers}
              onSelectionChange={handleSelectionChange}
              onUserAction={handleUserAction}
              searchText={searchText}
              onSearchChange={setSearchText}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              rowCount={users?.totalCount || 0}
              onSortChange={setSort}
              onSortChangeColumn={setSortColumn}
              isLoading={isLoading || isFetching}
            />
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog
        open={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setEditingUserId(null);
          setEditingUser(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUserId ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            user={editingUser}
            onSubmit={handleUserFormSubmit}
            onCancel={() => {
              setUserFormOpen(false);
              setEditingUserId(null);
              setEditingUser(null);
            }}
            isLoading={isCreating || isUpdating || isUserLoading}
          />
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation */}

       <ConfirmDialog
  open={deleteConfirmOpen}
  title="Confirm Delete"
  message={`Are you sure you want to delete user "${userToDelete?.fullName}"? This action cannot be undone.`}
  onCancel={() => setDeleteConfirmOpen(false)}
  onConfirm={handleDeleteUser}
  loading={isDeleting}
  confirmText="Delete"
  confirmColor="error"
/> 

    </Box>
  );
};