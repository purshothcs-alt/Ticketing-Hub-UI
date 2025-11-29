import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip, Badge, Popover, Card, CardContent, Divider, Chip } from '@mui/material';
import { 
  ChevronLeft,
  ChevronRight,
  Brightness4,
  Brightness7,
  AccountCircle,
  Logout,
  Notifications,
  LockReset,
} from '@mui/icons-material';
import { canView, getUserDetails, menuItems } from '../utils/helper';
import { useGetNotificationsQuery } from '../../feature/notifications/services/notificationApi';
import moment from 'moment';


interface LayoutProps {
  children: React.ReactNode;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: string;
}
export const Layout = ({
  children,
  isSidebarCollapsed,
  isDarkMode,
  onToggleSidebar,
  onToggleTheme,
  onLogout,
}: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const filteredMenuItems = menuItems?.filter(item => canView(item.moduleName));
  const user = getUserDetails();
  const drawerWidth = isSidebarCollapsed ? 72 : 280;
  const unreadCount = user?.unreadNotificationCount;
  const { data } = useGetNotificationsQuery(undefined, {
  refetchOnFocus: false}   );
const notifications: Notification[] = data?.notifications ?? [];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onLogout();
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
     //if (unreadCount === 0) return;
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ticket_assigned':
        return 'primary';
      case 'sla_breach':
        return 'error';
      case 'ticket_updated':
        return 'info';
      default:
        return 'default';
    }
  };
const formatTimeAgo = (timestamp: string) => moment(timestamp).fromNow();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)',
          color: isDarkMode ? '#F1F5F9' : '#1A202C',
          boxShadow: isDarkMode 
            ? '0 1px 3px rgba(0, 0, 0, 0.5)'
            : '0 1px 3px rgba(0, 0, 0, 0.12)',
          borderBottom: isDarkMode 
            ? '1px solid rgba(51, 65, 85, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            IT Ticketing System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton color="inherit" onClick={onToggleTheme}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                {user?.fullName?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: { 
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: isDarkMode 
                    ? '0 8px 30px rgba(167, 139, 250, 0.15)'
                    : '0 8px 30px rgba(139, 92, 246, 0.15)',
                }
              }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">{user?.fullName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.roleName}
                  </Typography>
                </Box>
              </MenuItem>
               {canView('Settings') && (<MenuItem onClick={()=>{navigate('/settings')
                handleUserMenuClose()}
              }>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                Profile
              </MenuItem>)}
              {canView('Settings') && (<MenuItem onClick={()=>{navigate('/settings?tab=1') 
                handleUserMenuClose()}}>
                <ListItemIcon>
                  <LockReset />
                </ListItemIcon>
                Change Password
              </MenuItem>)}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>

            {/* Notifications Popover */}
            <Popover
              open={Boolean(notificationsAnchor)}
              anchorEl={notificationsAnchor}
              onClose={handleNotificationsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: { 
                  width: 380,
                  maxHeight: 500,
                  borderRadius: 2,
                  mt: 1,
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Notifications
                  </Typography>
                  {unreadCount > 0 && (
                    <Chip 
                      label={`${unreadCount} new`} 
                      size="small" 
                      color="primary"
                    />
                  )}
                </Box>
              </Box>
              <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 2,
                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                        '&:hover': {
                          bgcolor: 'action.selected',
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/notifications')}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip 
                            label={formatTimeAgo(notification.timestamp)} 
                            size="small" 
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {notification.message}
                        </Typography>
                        <Chip 
                          label={notification.type} 
                          size="small" 
                          color={getNotificationColor(notification.type) as any}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => {
                    handleNotificationsClose();
                    navigate('/notifications');
                  }}
                >
                  View All Notifications
                </Typography>
              </Box>
            </Popover>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            background: isDarkMode 
              ? 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)'
              : 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)',
            borderRight: isDarkMode 
              ? '1px solid rgba(51, 65, 85, 0.5)'
              : '1px solid rgba(226, 232, 240, 0.8)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden', py: 2 }}>
          <List>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <Tooltip 
                  key={item.id} 
                  title={isSidebarCollapsed ? item.label : ''} 
                  placement="right"
                >
                  <ListItem 
                    component="button"
                    onClick={() => navigate(item.path)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      backgroundColor: isActive 
                        ? (isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(25, 118, 210, 0.1)')
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive 
                          ? (isDarkMode ? '#3B82F6' : '#1976D2')
                          : 'text.secondary',
                        minWidth: isSidebarCollapsed ? 'auto' : 56,
                        justifyContent: 'center',
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    {!isSidebarCollapsed && (
                      <ListItemText 
                        primary={item.label}
                        sx={{
                          color: isActive 
                            ? (isDarkMode ? '#3B82F6' : '#1976D2')
                            : 'text.primary',
                          '& .MuiListItemText-primary': {
                            fontWeight: isActive ? 600 : 400,
                          },
                        }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>
        </Box>
      </Drawer>

     {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: "100vh",
          overflow: "auto",
          transition: "all 0.3s ease",
          background: isDarkMode
            ? "linear-gradient(180deg, #0F172A 0%, #111827 100%)"
            : "linear-gradient(180deg, #F1F5F9 0%, #FFFFFF 100%)",
        }}
      >
        <Toolbar />
        {children}
      </Box>

    </Box>
  );
};