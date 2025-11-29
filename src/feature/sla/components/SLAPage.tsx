import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Button,
  TextField,
  MenuItem,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Timer,
  Speed,
  Refresh,
  FileDownload,
} from '@mui/icons-material';
import { DataGrid, createPriorityColumn, createStatusColumn, type Column } from '../../../shared/components/DataGrid';

interface SLAMetric {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  status: 'met' | 'warning' | 'breached';
  trend: 'up' | 'down' | 'stable';
}

interface SLATicket {
  id: string;
  title: string;
  priority: string;
  responseTime: number;
  resolutionTime: number;
  slaTarget: number;
  status: 'met' | 'at-risk' | 'breached';
  department: string;
}

const mockSLAMetrics: SLAMetric[] = [
  {
    id: '1',
    name: 'First Response Time',
    target: 2,
    actual: 1.8,
    unit: 'hours',
    status: 'met',
    trend: 'down',
  },
  {
    id: '2',
    name: 'Resolution Time',
    target: 24,
    actual: 26.5,
    unit: 'hours',
    status: 'breached',
    trend: 'up',
  },
  {
    id: '3',
    name: 'Customer Satisfaction',
    target: 90,
    actual: 92,
    unit: '%',
    status: 'met',
    trend: 'up',
  },
  {
    id: '4',
    name: 'Ticket Backlog',
    target: 50,
    actual: 45,
    unit: 'tickets',
    status: 'met',
    trend: 'down',
  },
];

const mockSLATickets: SLATicket[] = [
  {
    id: 'TKT-001',
    title: 'Email server down',
    priority: 'Critical',
    responseTime: 0.5,
    resolutionTime: 3.2,
    slaTarget: 4,
    status: 'met',
    department: 'IT',
  },
  {
    id: 'TKT-002',
    title: 'Password reset request',
    priority: 'High',
    responseTime: 1.2,
    resolutionTime: 28,
    slaTarget: 24,
    status: 'breached',
    department: 'HR',
  },
  {
    id: 'TKT-003',
    title: 'Software installation',
    priority: 'Medium',
    responseTime: 2.5,
    resolutionTime: 18,
    slaTarget: 48,
    status: 'met',
    department: 'IT',
  },
  {
    id: 'TKT-004',
    title: 'Network connectivity issue',
    priority: 'High',
    responseTime: 0.8,
    resolutionTime: 22,
    slaTarget: 24,
    status: 'at-risk',
    department: 'IT',
  },
];

export const SLAPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [department, setDepartment] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'met':
        return 'success';
      case 'warning':
      case 'at-risk':
        return 'warning';
      case 'breached':
        return 'error';
      default:
        return 'default';
    }
  };

  // DataGrid columns configuration
  const slaColumns: Column[] = [
    {
      field: 'id',
      headerName: 'Ticket ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    createPriorityColumn('priority', 'Priority'),
    {
      field: 'responseTime',
      headerName: 'Response Time',
      width: 140,
      valueFormatter: (value) => `${value}h`,
    },
    {
      field: 'resolutionTime',
      headerName: 'Resolution Time',
      width: 150,
      valueFormatter: (value) => `${value}h`,
    },
    {
      field: 'slaTarget',
      headerName: 'SLA Target',
      width: 130,
      valueFormatter: (value) => `${value}h`,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value.toUpperCase().replace('-', ' ')}
          color={getStatusColor(params.value) as any}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  const calculatePercentage = (actual: number, target: number, inverse: boolean = false) => {
    const percentage = inverse ? (target / actual) * 100 : (actual / target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            SLA Performance Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor service level agreements and track performance metrics
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<FileDownload />}>
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Time Period"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <MenuItem value="all">All Departments</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Overall SLA Status Alert */}
      <Alert 
        severity="warning" 
        icon={<Warning />}
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          1 SLA metric is currently breached. Resolution time is above target by 2.5 hours.
        </Typography>
      </Alert>

      {/* SLA Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockSLAMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      {metric.name}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {metric.actual}
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {metric.unit}
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Target: {metric.target} {metric.unit}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={metric.status.toUpperCase()}
                    color={getStatusColor(metric.status) as any}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(metric.actual, metric.target, metric.name === 'Resolution Time' || metric.name === 'Ticket Backlog')}
                    color={getStatusColor(metric.status) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Trend */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {metric.trend === 'up' ? (
                    <TrendingUp fontSize="small" color={metric.status === 'met' ? 'success' : 'error'} />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown fontSize="small" color={metric.status === 'met' ? 'success' : 'error'} />
                  ) : null}
                  <Typography variant="caption" color="text.secondary">
                    {metric.trend === 'up' ? 'Trending up' : metric.trend === 'down' ? 'Trending down' : 'Stable'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance by Priority */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                SLA Compliance by Priority
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Critical', 'High', 'Medium', 'Low'].map((priority) => (
                  <Box key={priority}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{priority}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {priority === 'Critical' ? '95%' : priority === 'High' ? '88%' : priority === 'Medium' ? '92%' : '96%'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={priority === 'Critical' ? 95 : priority === 'High' ? 88 : priority === 'Medium' ? 92 : 96}
                      color={priority === 'High' ? 'warning' : 'success'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Response Time Goals
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter', borderRadius: 2 }}>
                    <Timer sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      1.8h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Response
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter', borderRadius: 2 }}>
                    <Speed sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                      26.5h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Resolution
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <CheckCircle fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      87% of tickets meet SLA targets
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent SLA Performance Table */}
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Ticket SLA Performance
          </Typography>
        </Box>
        <DataGrid
          rows={mockSLATickets}
          columns={slaColumns}
          pageSize={10}
          enableToolbar={true}
          searchPlaceholder="Search tickets..."
          height={500}
        />
      </Box>
    </Box>
  );
};
