
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  ConfirmationNumber,
  People,
  BarChart,
  Settings,
  MenuOpen,
  Menu,
} from '@mui/icons-material';
import { canView } from '../shared/utils/helper';

type Page = 'dashboard' | 'tickets' | 'ticket-details' | 'reports' | 'users' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: any;
}

export function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse, user }: SidebarProps) {
  // const navigationItems = [
  //   { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
  //   { id: 'tickets', label: 'Tickets', icon: ConfirmationNumber },
  //   { id: 'users', label: 'Users', icon: People },
  //   { id: 'reports', label: 'Reports', icon: BarChart },
  //   { id: 'settings', label: 'Settings', icon: Settings },
  // ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard, module: null },
    { id: 'tickets', label: 'Tickets', icon: ConfirmationNumber, module: 'Ticket Management' },
    { id: 'users', label: 'Users', icon: People, module: 'Role Management' },
    { id: 'reports', label: 'Reports', icon: BarChart, module: 'SLA Management' },
    { id: 'settings', label: 'Settings', icon: Settings, module: 'Module Management' },
  ];

  // Filter navigation items based on READ permission
  const visibleItems = navigationItems.filter(item => item.module ? canView(item.module) : true);


  return (
    <Box
      sx={{
        width: isCollapsed ? 72 : 280,
        height: '100vh',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden',
      }}
    >
      {/* Logo and Toggle */}
      <Box sx={{ p: isCollapsed ? 1.5 : 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
            }}
          >
            <ConfirmationNumber fontSize="small" />
          </Avatar>
          {!isCollapsed && (
            <Typography variant="h3" color="text.primary" sx={{ whiteSpace: 'nowrap' }}>
              TicketPro
            </Typography>
          )}
        </Box>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <MenuOpen />
            </IconButton>
          </Box>
        )}
        {isCollapsed && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <IconButton
              onClick={onToggleCollapse}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <Menu />
            </IconButton>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      {/* Navigation */}
      <Box sx={{ flex: 1, p: isCollapsed ? 1 : 2 }}>
        <List>
          {visibleItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                {isCollapsed ? (
                  <Tooltip title={item.label} placement="right" arrow>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => onNavigate(item.id as Page)}
                      sx={{
                        borderRadius: 2,
                        minHeight: 48,
                        justifyContent: 'center',
                        px: 2.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.contrastText',
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                ) : (
                  <ListItemButton
                    selected={isActive}
                    onClick={() => onNavigate(item.id as Page)}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <IconComponent />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}