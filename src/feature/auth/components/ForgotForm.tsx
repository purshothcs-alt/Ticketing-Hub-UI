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
} from '@mui/material';
import { Email } from '@mui/icons-material';
import { useForgotPasswordMutation } from '../services/authApis';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;
}
interface ForgotPasswordFormValues {
  email: string;
}
export const ForgotPasswordForm = ({
  onBackToLogin,
  isLoading = false,
  error = null,
  successMessage = null,
}: ForgotPasswordFormProps) => {
  const [forgotPasswordMutation, { isLoading: isCreating }] = useForgotPasswordMutation();
  
  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await forgotPasswordMutation(values);
      } catch (err) {
        console.error('Failed to send reset link:', err);
      } finally {
        setSubmitting(false);
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
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email to reset your password
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMessage}</Alert>}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || formik.isSubmitting}
              sx={{ mb: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
            >
              {isLoading || formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Remembered your password?{' '}
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
