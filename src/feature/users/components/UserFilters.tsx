import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Search, FilterList, Clear } from "@mui/icons-material";
import {
  useGetDepartmentsQuery,
  useGetRolesQuery,
  useGetStatusesQuery,
} from "../../shared/services/dropdownsApi";

interface UserFiltersProps {
    filters: {
    role: string;
    department: string;
    isActive: boolean | undefined;
  };
  onFiltersChange: (filters: { role: string; department: string; isActive: boolean | undefined }) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFiltersChange }) => {

  const { data: departments = [] } = useGetDepartmentsQuery();
  const { data: roles = [] } = useGetRolesQuery();
  const statuses = [
    { id: "true", name: "Active" },
    { id: "false", name: "InActive" },
  ];


  const handleClearFilters = () => {
    const clearedFilters = {
      role: "",
    department: "",
    isActive: undefined,
    };
    onFiltersChange(clearedFilters);
  };

    const hasActiveFilters = filters.role || filters.department || filters.isActive !== undefined;

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Role"
            value={filters.role}
            onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
          >
            {roles.map((role: any) => (
              <MenuItem key={role.id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Department"
            value={filters.department}
            onChange={(e) => onFiltersChange({ ...filters, department: e.target.value })}
          >
            {departments.map((dept: any) => (
              <MenuItem key={dept.id} value={dept.name}>
                {dept.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Status"
 value={filters.isActive === undefined ? "" : String(filters.isActive)}
  onChange={(e) =>
    onFiltersChange({
      ...filters,
      isActive:
        e.target.value === "" ? undefined : e.target.value === "true",
    })
  }
          >
            {statuses.map((status: any) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* <Button
              variant="outlined"
              startIcon={<FilterList />}
              disabled={!hasActiveFilters}
            >
              Filter
            </Button> */}
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
