import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock, Business, Badge, SupervisorAccount } from '@mui/icons-material';
import type { SignupData } from '../types';
import { useCreateUserMutation } from '../../users/services/usersApi';
import { useGetDepartmentsQuery, useGetRolesQuery, useGetManagersQuery } from '../../shared/services/dropdownsApi';

const validationSchema = Yup.object({
  employeeCode: Yup.string()
    .trim()
    .min(6, 'Employee code must be at least 6 characters')
    .required('Employee code is required'),
  fullName: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  departmentId: Yup.string().required('Department is required'),
  managerId: Yup.string().required('Manager is required'),
});

interface SignupFormProps {
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const SignupForm = ({ onBackToLogin, isLoading = false, error = null }: SignupFormProps) => {

  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const { data: managers = [] } = useGetManagersQuery();
  const [createUserMutation, { isLoading: isCreating }] = useCreateUserMutation();
  const employeeRoleId = roles.find((role:any) => role.name === 'Employee')?.id || '';

  const formik = useFormik({
    initialValues: {
      userId: '',
      employeeCode: '',
      fullName: '',
      email: '',
      password: '',
      departmentId: '',
      roleId: employeeRoleId,
      managerId: '',
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
    try {
      // Call the mutation directly here, like in UserForm
      await createUserMutation({
        userId: values.userId,
      employeeCode: values.employeeCode,
      fullName: values.fullName,
      email: values.email,
      roleId: values.roleId,
      departmentId: values.departmentId,
      password: '',
      managerId: values.managerId,
      isActive: values.isActive,
      }).unwrap(); // .unwrap() if using RTK Query to throw on error
      onBackToLogin();
    } catch (err) {
      console.error('Failed to create user:', err);
      // Parent component can handle showing error
    }
  },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the IT Ticketing system
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            {/* Employee Code */}
            <TextField
              fullWidth
              label="Employee Code"
              name="employeeCode"
              value={formik.values.employeeCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.employeeCode && Boolean(formik.errors.employeeCode)}
              helperText={formik.touched.employeeCode && formik.errors.employeeCode}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Badge color="action" /></InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              margin="normal"
              required
              InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
              sx={{ mb: 2 }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              required
              InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
              sx={{ mb: 2 }}
            />

            {/* Department */}
            <TextField
              fullWidth
              select
              label="Department"
              name="departmentId"
              value={formik.values.departmentId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
              helperText={formik.touched.departmentId && formik.errors.departmentId}
              margin="normal"
              required
              InputProps={{ startAdornment: <InputAdornment position="start"><Business color="action" /></InputAdornment> }}
              sx={{ mb: 2 }}
            >
              {departments.map((dept: any) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField>

          

            {/* Manager */}
            <TextField
              fullWidth
              select
              label="Manager"
              name="managerId"
              value={formik.values.managerId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.managerId && Boolean(formik.errors.managerId)}
              helperText={formik.touched.managerId && formik.errors.managerId}
              margin="normal"
              required
              InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
              sx={{ mb: 2 }}
            >
              {managers.map((manager: any) => (
                <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
              ))}
            </TextField>

            {/* Password */}
            {/* <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            /> */}

            {/* Active User */}
            {/* <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                  color="primary"
                />
              }
              label="Active User"
              sx={{ mb: 3 }}
            /> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || formik.isSubmitting}
              sx={{ mb: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isLoading || formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component="button" type="button" variant="body2" onClick={onBackToLogin} sx={{ textDecoration: 'none', fontWeight: 500 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
