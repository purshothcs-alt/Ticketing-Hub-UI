import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
} from '@mui/material';
import type { CreateUserData, UpdateUserData, UserFormErrors } from '../types';
import type { User } from '../../../shared/types';
import { useGetDepartmentsQuery, useGetManagersQuery, useGetRolesQuery } from '../../shared/services/dropdownsApi';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}


export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const initialFormData = user
  ? {
      userId: user.userId,
      employeeCode: user.employeeCode,
      fullName: user.fullName,
      email: user.email,
      roleId: user.roleId,
      departmentId: user.departmentId,
      password: '',
      managerId: user.managerId,
      isActive: user.isActive,
    }
  : {
      userId: '',
      employeeCode: '',
      fullName: '',
      email: '',
      password: '',
      departmentId: '',
      roleId: '',
      managerId: '',
      isActive: true,
    };

const [formData, setFormData] = useState<CreateUserData>(initialFormData);

    const { data: departments =[] } = useGetDepartmentsQuery();
    const { data: roles=[] } = useGetRolesQuery();
    const { data: managers=[] } = useGetManagersQuery();


  const [errors, setErrors] = useState<UserFormErrors>({});
  // const [showPassword, setShowPassword] = useState(!user);


  useEffect(() => {
    if (user) {
      setFormData(initialFormData);
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {};
    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = 'Employee Code is required';
    } else if (formData.employeeCode.trim().length < 6) {
      newErrors.employeeCode = 'Employee must be at least 6 characters';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required';
    }

    if (!formData.managerId) {
      newErrors.managerId = 'Manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (user) {
      const updateData: UpdateUserData = {
        userId:formData.userId,
        employeeCode: formData.employeeCode,
        fullName: formData.fullName,
        email: formData.email,
        roleId: formData.roleId,
        departmentId: formData.departmentId,
        password: formData.password,
        managerId: formData.managerId,
        isActive: formData.isActive,
      };
      
      onSubmit(updateData);
    } else {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateUserData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing (only for fields present in UserFormErrors)
    const isErrorField = (f: keyof CreateUserData): f is keyof UserFormErrors =>
      ['employeeCode','name', 'email', 'role', 'department', 'password'].includes(f as string);

    if (isErrorField(field) && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Employee Code"
            value={formData.employeeCode}
            onChange={handleInputChange('employeeCode')}
            error={!!errors.employeeCode}
            helperText={errors.employeeCode}
            disabled={user?true:false}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={handleInputChange('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Role"
            value={formData.roleId}
            onChange={handleInputChange('roleId')}
            error={!!errors.roleId}
            helperText={errors.roleId}
            required
          >
            {roles.map((role:any) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Department"
            value={formData.departmentId}
            onChange={handleInputChange('departmentId')}
            error={!!errors.departmentId}
            helperText={errors.departmentId}
            required
          >
            {departments.map((dept:any) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Manager"
            value={formData.managerId}
            onChange={handleInputChange('managerId')}
            error={!!errors.managerId}
            helperText={errors.managerId}
            required
          >
            {managers.map((manager:any) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* {(!user || showPassword) && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={user ? 'New Password (leave blank to keep current)' : 'Password'}
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password || 'Minimum 8 characters'}
              required={!user}
            />
          </Grid>
        )} */}
        
        {/* {user && !showPassword && (
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => setShowPassword(true)}
              size="small"
            >
              Change Password
            </Button>
          </Grid>
        )} */}
        
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleInputChange('isActive')}
                color="primary"
              />
            }
            label="Active User"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};