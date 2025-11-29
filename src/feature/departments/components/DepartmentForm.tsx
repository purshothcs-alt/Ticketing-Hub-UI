import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
} from "@mui/material";
import type { Department } from "../../../shared/types";

interface Manager {
  id: string;
  name: string;
}


interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  editingDepartment: Department | null;
  setEditingDepartment: React.Dispatch<React.SetStateAction<Department | null>>;
  errors: Partial<Record<keyof Department, string>>;
  managers: Manager[];
  editingId?: string | null;
}

const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  editingDepartment,
  setEditingDepartment,
  errors,
  managers,
  editingId,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingId ? "Edit Department" : "Add New Department"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Department Name"
                value={editingDepartment?.departmentName || ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, departmentName: e.target.value } : prev
                  )
                }
                error={!!errors.departmentName}
                helperText={errors.departmentName}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={editingDepartment?.description || ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Department Head"
                value={editingDepartment?.headUserId || ""}
                onChange={(e) =>
                  setEditingDepartment((prev) =>
                    prev ? { ...prev, headUserId: e.target.value } : prev
                  )
                }
                error={!!errors.headUserId}
                helperText={errors.headUserId}
                required
              >
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          {editingId ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DepartmentDialog;
