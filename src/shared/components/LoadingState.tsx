import { Box, CircularProgress, Typography, Skeleton, Card, CardContent } from '@mui/material';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'card';
  message?: string;
  count?: number;
}

export const LoadingState = ({ 
  variant = 'spinner', 
  message = 'Loading...', 
  count = 3 
}: LoadingStateProps) => {
  if (variant === 'spinner') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 2,
        }}
      >
        <CircularProgress 
          size={40}
          sx={{
            color: 'primary.main',
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
    );
  }

  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 1, borderRadius: 1 }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (variant === 'card') {
    return (
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={80} sx={{ mt: 2, borderRadius: 1 }} />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return null;
};