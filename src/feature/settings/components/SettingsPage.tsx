import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Tabs,
  Tab,
  MenuItem,
} from "@mui/material";
import { AccountCircle, LockReset } from "@mui/icons-material";
import { ChangePasswordForm } from "../../auth/components/ChangePasswordForm";
import { useLocation } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../users/services/usersApi";
import type { UpdateUserData, UserFormErrors } from "../../users/types";
import {
  useGetDepartmentsQuery,
  useGetManagersQuery,
} from "../../shared/services/dropdownsApi";
import { getUserDetails } from "../../../shared/utils/helper";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

export const SettingsPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") ? parseInt(params.get("tab")!) : 0;

  const [tabValue, setTabValue] = useState(initialTab);
  const [formData, setFormData] = useState<UpdateUserData>({
    userId: "",
    employeeCode: "",
    fullName: "",
    email: "",
    roleId: "",
    departmentId: "",
    password: "",
    managerId: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingUserId] = useState(() => getUserDetails());
  const safeUserId = editingUserId?.userId ?? "";
  const shouldSkip = !safeUserId;

  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(
    safeUserId,
    { skip: shouldSkip, refetchOnFocus: false }
  );
  const [updateUserMutation, { isLoading: isUpdating }] =
    useUpdateUserMutation();

  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: managers = [] } = useGetManagersQuery();

  // Set tab from query params
  useEffect(() => {
    setTabValue(initialTab);
  }, [initialTab]);

  // Populate form when user data is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        userId: user.userId,
        employeeCode: user.employeeCode,
        fullName: user.fullName,
        email: user.email,
        roleId: user.roleId,
        departmentId: user.departmentId,
        password: "",
        managerId: user.managerId,
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange =
    (field: keyof UpdateUserData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error if exists
      if (errors[field as keyof UserFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!formData.employeeCode.trim())
      newErrors.employeeCode = "Employee Code is required";
    else if (formData.employeeCode.trim().length < 6)
      newErrors.employeeCode = "Employee Code must be at least 6 characters";

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    else if (formData.fullName.trim().length < 2)
      newErrors.fullName = "Full Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.departmentId)
      newErrors.departmentId = "Department is required";
    if (!formData.managerId) newErrors.managerId = "Manager is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
     if (!validateForm()) return;

    try {
      await updateUserMutation(formData).unwrap();
      setSaveSuccess(true);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and system settings
        </Typography>
      </Box>

      <Card>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<AccountCircle />} label="Profile" iconPosition="start" />
          <Tab
            icon={<LockReset />}
            label="Change Password"
            iconPosition="start"
          />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
              noValidate
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee Code"
                    value={formData.employeeCode}
                    onChange={handleInputChange("employeeCode")}
                    error={!!errors.employeeCode}
                    helperText={errors.employeeCode}
                    disabled={!!formData}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Department"
                    value={formData.departmentId}
                    onChange={handleInputChange("departmentId")}
                    error={!!errors.departmentId}
                    helperText={errors.departmentId}
                    required
                  >
                    {departments.map((dept: any) => (
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
                    onChange={handleInputChange("managerId")}
                    error={!!errors.managerId}
                    helperText={errors.managerId}
                    required
                  >
                    {managers.map((manager: any) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isUserLoading || isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Change Password Tab */}
          <TabPanel value={tabValue} index={1}>
            <ChangePasswordForm />
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};
