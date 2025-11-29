import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useFormik } from "formik";
import { useChangePasswordMutation } from "../services/authApis";
import * as Yup from 'yup';
import { Lock, Save, Visibility, VisibilityOff } from "@mui/icons-material";

interface ChangePasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordMutation, { isLoading: isChanging }] =
    useChangePasswordMutation();

const validationSchema = Yup.object({

  newPassword: Yup.string()
    .required("New password is required")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[^a-zA-Z0-9]/, "Must contain at least one special character")
    .matches(/\d/, "Must contain at least one number")
    .min(8, "Must be at least 8 characters")
    .max(15, "Must be 15 characters or less"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});
  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await changePasswordMutation({ newPassword: values.newPassword });
        setSuccess(true);
      } catch (err) {
        console.error("Failed to change password:", err);
      }
    },
  });

  const getColor = (condition: boolean): string =>
    condition ? "#11B364" : "#F04438";

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password updated successfully!
        </Alert>
      )}

      <Grid container spacing={3}>

        <Grid item xs={12} md={6}>
          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            fullWidth
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            fullWidth
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
             error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
          />
        </Grid>

        {/* Password rules */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              "At least one lowercase letter",
              "At least one uppercase letter",
              "At least one special character",
              "At least one number",
              "8 to 15 characters long",
            ].map((text, index) => {
              const password = formik.values.newPassword || "";
              let valid = false;

              switch (index) {
                case 0:
                  valid = /[a-z]/.test(password);
                  break;
                case 1:
                  valid = /[A-Z]/.test(password);
                  break;
                case 2:
                  valid = /[^a-zA-Z0-9]/.test(password);
                  break;
                case 3:
                  valid = /\d/.test(password);
                  break;
                case 4:
                  valid = password.length >= 8 && password.length <= 15;
                  break;
              }

              const xs = index === 4 ? 12 : 6;

              return (
                <Grid item xs={xs} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    color={getColor(valid)}
                  >
                    <CheckCircleIcon fontSize="small" />
                    <Typography
                      variant="caption"
                      component="div"
                      ml={0.5}
                      whiteSpace="nowrap"
                    >
                      {text}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

            <Grid item xs={12}>
                              <Box
                                sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                              >
            <Button  onClick={()=>formik.resetForm}>
              Reset
            </Button>
            <Button
              type='submit'
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={isChanging}
            >
              {isChanging ? "Saving..." : "Save Password"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
