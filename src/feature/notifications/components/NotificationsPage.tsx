import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Paper,
} from "@mui/material";

import {
  Notifications,
  MarkEmailRead,
  MarkEmailUnread,
  Refresh,
  Settings,
  Warning,
  Assignment,
  Person,
  Security,
  Info,
  Update,
  Circle,
} from "@mui/icons-material";

import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../services/notificationApi";
import moment from "moment";

// ------------------------------------------------------------
// TYPES (Your UI types are unchanged)
// ------------------------------------------------------------
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: string;
}

// Tab panel component (unchanged)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export const NotificationsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  // ============================================================
  //  API INTEGRATION (REAL DATA)
  // ============================================================
  const { data, isLoading,refetch } = useGetNotificationsQuery(undefined, {
  refetchOnFocus: false}   );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications: Notification[] = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const totalCount = data?.totalCount ?? 0; 
  const criticalCount = data?.criticalCount ?? 0; 
  const todaysLogs = data?.todaysLogs ?? 0; 

  // ============================================================
  //  API HANDLERS
  // ============================================================
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      refetch(); // Refresh after marking read
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      refetch(); // Refresh after marking all read
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // ============================================================
  //  UI HELPERS (UNCHANGED)
  // ============================================================
  const getIcon = (type: string) => {
    switch (type) {
      case "ticket":
        return <Assignment />;
      case "user":
        return <Person />;
      case "security":
        return <Security />;
      case "system":
        return <Settings />;
      default:
        return <Info />;
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
        case "low":
      return "success";
      default:
        return "default";
    }
  };

const formatTime = (ts: string) => {
  return moment(ts).format('YYYY-MM-DD HH:mm:ss');
};
  // ============================================================
  //  UI RENDER (UNCHANGED)
  // ============================================================
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with system notifications and monitor activity
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Unread
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "error.main" }}
                  >
                    {unreadCount}
                  </Typography>
                </Box>
                <Notifications
                  sx={{ fontSize: 40, color: "error.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {totalCount}
                  </Typography>
                </Box>
                <Assignment
                  sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Critical
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "warning.main" }}
                  >
                    {criticalCount}
                  </Typography>
                </Box>
                <Warning
                  sx={{ fontSize: 40, color: "warning.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Today's Logs
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "info.main" }}
                  >
                    {todaysLogs}
                  </Typography>
                </Box>
                <Update
                  sx={{ fontSize: 40, color: "info.main", opacity: 0.7 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Wrapper */}
      <Paper sx={{ mb: 3 }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={handleMarkAllAsRead}
                >
                  Mark All Read
                </Button>
                <IconButton size="small" color="primary" onClick={() => refetch()}>
                  <Refresh />
                </IconButton>
              </Box>
            </Box>

            {/* Notifications List */}
            <List>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: notification.isRead
                        ? "transparent"
                        : "action.hover",
                      "&:hover": {
                        bgcolor: "action.selected",
                      },
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        {notification.isRead ? (
                          <MarkEmailUnread />
                        ) : (
                          <MarkEmailRead />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getPriorityColor(
                            notification.severity?.toLowerCase()
                          )}.light`,
                        }}
                      >
                        {getIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          {!notification.isRead && (
                            <Circle sx={{ fontSize: 8, color: "primary.main" }} />
                          )}
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                          >
                            {notification.title}
                          </Typography>

                          <Chip
                            size="small"
                            label={notification.severity}
                            color={getPriorityColor(notification.severity?.toLowerCase()) as any}
                            sx={{ height: 20 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>

                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}

              {notifications.length === 0 && !isLoading && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Notifications
                    sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No notifications to display
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};
