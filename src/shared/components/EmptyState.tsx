import { Box, Typography, Button, Paper } from '@mui/material';
import { Add, Search, FilterAlt } from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'filter';
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search':
        return <Search sx={{ fontSize: 64, color: 'text.disabled' }} />;
      case 'filter':
        return <FilterAlt sx={{ fontSize: 64, color: 'text.disabled' }} />;
      default:
        return <Add sx={{ fontSize: 64, color: 'text.disabled' }} />;
    }
  };

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        backgroundColor: 'background.paper',
        border: '2px dashed',
        borderColor: 'divider',
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        {icon || getDefaultIcon()}
      </Box>
      
      <Typography variant="h6" gutterBottom color="text.primary">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={variant === 'default' ? <Add /> : undefined}
          onClick={onAction}
          sx={{
            borderRadius: 2,
            px: 3,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};