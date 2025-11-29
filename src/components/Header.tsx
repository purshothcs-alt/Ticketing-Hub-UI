
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Toolbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search,
  Notifications,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';

interface HeaderProps {
  title: string;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  onLogout?: () => void;
}

export function Header({ title, onToggleTheme, isDarkMode, onLogout }: HeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: 3,
        py: 2,
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h2" color="text.primary">
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Bar */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TextField
              size="small"
              placeholder="Search tickets, users..."
              variant="outlined"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <Search sx={{ color: 'text.secondary', mr: 1 }} />
                ),
              }}
            />
          </Box>
          
          {/* Theme Toggle */}
          {onToggleTheme && (
            <IconButton onClick={onToggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          )}
          
          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          {/* User Avatar */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              cursor: 'pointer',
            }}
            onClick={onLogout}
          >
            JD
          </Avatar>
        </Box>
      </Toolbar>
    </Box>
  );
}