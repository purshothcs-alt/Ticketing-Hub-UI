
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  Add,
  Assignment,
  BarChart,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type Page = 'dashboard' | 'tickets' | 'ticket-details' | 'reports' | 'users' | 'settings';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onViewTicket: (ticketId: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function DashboardPage({ onNavigate, onViewTicket, onToggleTheme, isDarkMode, isSidebarCollapsed, onToggleSidebar }: DashboardPageProps) {
  const summaryData = [
    { title: 'Total Tickets', value: '1,247', change: '+12%', changeType: 'positive' },
    { title: 'Open Tickets', value: '89', change: '+5%', changeType: 'neutral' },
    { title: 'Closed Tickets', value: '1,158', change: '+8%', changeType: 'positive' },
    { title: 'High Priority', value: '23', change: '-2%', changeType: 'negative' },
  ];

  const recentTickets = [
    { id: 'TKT-1001', title: 'Login issue with mobile app', status: 'High', assignee: 'John Smith', created: '2 hours ago' },
    { id: 'TKT-1002', title: 'Database performance slow', status: 'Medium', assignee: 'Sarah Jones', created: '4 hours ago' },
    { id: 'TKT-1003', title: 'Email notifications not working', status: 'Low', assignee: 'Mike Chen', created: '6 hours ago' },
    { id: 'TKT-1004', title: 'User account locked', status: 'Medium', assignee: 'Lisa Davis', created: '8 hours ago' },
  ];

  const getStatusColor = (status: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (status) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getTrendIcon = (changeType: string) => {
    if (changeType === 'positive') return <TrendingUp color="success" fontSize="small" />;
    if (changeType === 'negative') return <TrendingDown color="error" fontSize="small" />;
    return null;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="dashboard" onNavigate={onNavigate} isCollapsed={isSidebarCollapsed} onToggleCollapse={onToggleSidebar} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title="Dashboard" onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3}>
            {/* Summary Cards */}
            <Grid container spacing={3}>
              {summaryData.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                        {item.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(item.changeType)}
                        <Typography
                          variant="body2"
                          sx={{
                            color: item.changeType === 'positive' ? 'success.main' : 
                                  item.changeType === 'negative' ? 'error.main' : 'text.secondary'
                          }}
                        >
                          {item.change} from last month
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Quick Actions */}
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Quick Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Common tasks and shortcuts
                    </Typography>
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        fullWidth
                        onClick={() => onNavigate('tickets')}
                      >
                        Create New Ticket
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Assignment />}
                        fullWidth
                        onClick={() => onNavigate('tickets')}
                      >
                        View All Tickets
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<BarChart />}
                        fullWidth
                        onClick={() => onNavigate('reports')}
                      >
                        Generate Report
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Tickets */}
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Recent Tickets
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Latest ticket activity
                    </Typography>
                    <List>
                      {recentTickets.map((ticket, index) => (
                        <ListItem
                          key={ticket.id}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => onViewTicket(ticket.id)}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" component="span" sx={{ fontWeight: 'medium' }}>
                                  {ticket.id}
                                </Typography>
                                <Chip
                                  label={ticket.status}
                                  color={getStatusColor(ticket.status)}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Stack spacing={1} component="span" sx={{ display: 'block' }}>
                                <Typography variant="body2" component="span" color="text.secondary" sx={{ display: 'block' }}>
                                  {ticket.title}
                                </Typography>
                                <Box component="span" sx={{ display: 'flex', gap: 2 }}>
                                  <Typography variant="caption" component="span" color="text.secondary">
                                    Assigned to {ticket.assignee}
                                  </Typography>
                                  <Typography variant="caption" component="span" color="text.secondary">
                                    {ticket.created}
                                  </Typography>
                                </Box>
                              </Stack>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => onNavigate('tickets')}
                    >
                      View All Tickets
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}