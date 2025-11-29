import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import {
  FileDownload,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

type Page = 'dashboard' | 'tickets' | 'ticket-details' | 'reports' | 'users' | 'settings';

interface ReportsPageProps {
  onNavigate: (page: Page) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function ReportsPage({ onNavigate, onToggleTheme, isDarkMode }: ReportsPageProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  // Mock data for charts
  const ticketsByStatus = [
    { name: 'Open', value: 89, color: '#ef4444' },
    { name: 'In Progress', value: 45, color: '#f97316' },
    { name: 'Resolved', value: 1158, color: '#22c55e' },
    { name: 'Closed', value: 234, color: '#6b7280' },
  ];

  const ticketsByPriority = [
    { name: 'High', value: 23, color: '#ef4444' },
    { name: 'Medium', value: 156, color: '#f97316' },
    { name: 'Low', value: 89, color: '#22c55e' },
  ];

  const ticketTrends = [
    { month: 'Jan', created: 45, resolved: 42 },
    { month: 'Feb', created: 52, resolved: 48 },
    { month: 'Mar', created: 48, resolved: 51 },
    { month: 'Apr', created: 61, resolved: 58 },
    { month: 'May', created: 55, resolved: 59 },
    { month: 'Jun', created: 67, resolved: 62 },
  ];

  const assigneePerformance = [
    { name: 'John Smith', resolved: 45, average_time: 2.3 },
    { name: 'Sarah Jones', resolved: 38, average_time: 1.8 },
    { name: 'Mike Chen', resolved: 42, average_time: 2.1 },
    { name: 'Lisa Davis', resolved: 29, average_time: 3.2 },
    { name: 'Tom Wilson', resolved: 35, average_time: 2.7 },
  ];

  const kpis = [
    { 
      title: 'Total Tickets', 
      value: '1,526', 
      change: '+12%', 
      changeType: 'positive',
      period: 'vs last month' 
    },
    { 
      title: 'Avg Resolution Time', 
      value: '2.4 days', 
      change: '-8%', 
      changeType: 'positive',
      period: 'vs last month' 
    },
    { 
      title: 'Customer Satisfaction', 
      value: '94%', 
      change: '+3%', 
      changeType: 'positive',
      period: 'vs last month' 
    },
    { 
      title: 'First Response Time', 
      value: '4.2 hours', 
      change: '-15%', 
      changeType: 'positive',
      period: 'vs last month' 
    },
  ];

  const getTrendIcon = (changeType: string) => {
    if (changeType === 'positive') return <TrendingUp color="success" fontSize="small" />;
    if (changeType === 'negative') return <TrendingDown color="error" fontSize="small" />;
    return null;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar currentPage="reports" onNavigate={onNavigate} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title="Reports & Analytics" onToggleTheme={onToggleTheme} isDarkMode={isDarkMode} />
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3}>
            {/* Filters */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateRange}
                    label="Date Range"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="7d">Last 7 days</MenuItem>
                    <MenuItem value="30d">Last 30 days</MenuItem>
                    <MenuItem value="90d">Last 90 days</MenuItem>
                    <MenuItem value="1y">Last year</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="overview">Overview</MenuItem>
                    <MenuItem value="performance">Performance</MenuItem>
                    <MenuItem value="trends">Trends</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
              <Button variant="contained" startIcon={<FileDownload />}>
                Export Report
              </Button>
            </Box>

            {/* KPIs */}
            <Grid container spacing={3}>
              {kpis.map((kpi, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {kpi.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                        {kpi.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTrendIcon(kpi.changeType)}
                        <Chip
                          label={kpi.change}
                          color={kpi.changeType === 'positive' ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {kpi.period}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              {/* Tickets by Status */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Tickets by Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Distribution of current ticket statuses
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ticketsByStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {ticketsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tickets by Priority */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Tickets by Priority
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Priority distribution of open tickets
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ticketsByPriority}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Ticket Trends */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Ticket Trends
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Created vs resolved tickets over time
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ticketTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="created" stroke="#ef4444" strokeWidth={2} />
                          <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Team Performance */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Team Performance
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Tickets resolved by team members
                    </Typography>
                    <List>
                      {assigneePerformance.map((member, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            mb: 1,
                          }}
                        >
                          <ListItemText
                            primary={member.name}
                            secondary={`${member.resolved} tickets resolved`}
                          />
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle2">
                              {member.average_time} days
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              avg time
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Recent Activity Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Key metrics and highlights from the selected period
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h4" color="success.main" gutterBottom>
                        +15%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Resolution rate improvement
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.main" gutterBottom>
                        127
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        New tickets this week
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="h4" color="secondary.main" gutterBottom>
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SLA compliance
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}