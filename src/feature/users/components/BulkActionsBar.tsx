
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  Close,
  Delete,
  PersonOff,
  Person,
  Email,
} from '@mui/icons-material';

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onBulkAction: (action: string) => void;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClear,
  onBulkAction,
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
      </Typography>
      
      <Divider orientation="vertical" flexItem sx={{ bgcolor: 'primary.contrastText', opacity: 0.3 }} />
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<Person />}
          onClick={() => onBulkAction('activate')}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'success.dark',
            },
          }}
        >
          Activate
        </Button>
        
        <Button
          size="small"
          variant="contained"
          color="warning"
          startIcon={<PersonOff />}
          onClick={() => onBulkAction('deactivate')}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'warning.dark',
            },
          }}
        >
          Deactivate
        </Button>
        
        <Button
          size="small"
          variant="contained"
          color="info"
          startIcon={<Email />}
          onClick={() => onBulkAction('email')}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'info.dark',
            },
          }}
        >
          Send Email
        </Button>
        
        <Button
          size="small"
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() => onBulkAction('delete')}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
        >
          Delete
        </Button>
      </Box>
      
      <Box sx={{ ml: 'auto' }}>
        <Button
          size="small"
          onClick={onClear}
          startIcon={<Close />}
          sx={{
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Clear Selection
        </Button>
      </Box>
    </Paper>
  );
};