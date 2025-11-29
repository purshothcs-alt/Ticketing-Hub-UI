import { Box, Grid, Typography } from '@mui/material';
import { 
  ConfirmationNumber, 
  Assignment, 
  CheckCircle, 
  Schedule,
  PriorityHigh,
  Warning
} from '@mui/icons-material';

import { StatCard } from './StatCard';
import { QuickActionsCard } from './QuickActionsCard';
import { RecentActivityCard } from './RecentActivityCard';
import { ChartCard } from './ChartCard';
import { LoadingState } from '../../../shared/components/LoadingState';
import { useGetDashboardQuery } from '../services/dashboardApis';
import { canViewSevenDayTrends, canViewTicketByPriority, canViewTicketByStatus } from '../../../shared/utils/helper';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage = ({ onNavigate }: DashboardPageProps) => {
  const { data, isLoading } = useGetDashboardQuery();


  const getStatsForRole = () => {
    if (!data) return [];

    const baseStats = [
      {
        title: 'Total Tickets',
        value: data.totalTickets,
        subtitle: 'All time',
        icon: <ConfirmationNumber />,
        color: 'primary' as const,
         trend: data.totalTrend,
      },
      {
        title: 'Open Tickets',
        value: data.openTickets,
        subtitle: 'Needs attention',
        icon: <Assignment />,
        color: 'warning' as const,
        trend: data.openTrend,
      },
      {
        title: 'Resolved',
        value: data.resolvedTickets,
        subtitle: 'This month',
        icon: <CheckCircle />,
        color: 'success' as const,
        trend: data.resolvedTrend,
      },
        {
          title: 'Avg Resolution',
          value: `${data.avgResolutionDays} days`,
          subtitle: 'Average time',
          icon: <CheckCircle />,
          color: 'info' as const,
        },
{
          title: 'High Priority',
          value: data.highPriority,
          subtitle: 'Needs immediate attention',
          icon: <PriorityHigh />,
          color: 'error' as const,
        },
        {
          title: 'Overdue',
          value: data.overdue,
          subtitle: 'Past due date',
          icon: <Warning />,
          color: 'error' as const,
        },
      ];

    return baseStats;
  };

  const statsData = getStatsForRole();

  if (isLoading) return <LoadingState variant="card" count={6} />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {"Dashboard"}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {"Overview of your ticketing system activity"}
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <StatCard {...stat} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <QuickActionsCard
            onCreateTicket={() => onNavigate('tickets')}
            onAssignTicket={() => onNavigate('tickets')}
            onViewReports={() => onNavigate('reports')}
            onManageUsers={() => onNavigate('users')}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <RecentActivityCard
            activities={data?.recentActivities || []}
            isLoading={isLoading}
            onViewAll={() => onNavigate('tickets')}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
        <Grid container spacing={3}>
           {canViewTicketByStatus("Dashboard") && (
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Tickets by Status"
              type="pie"
              data={data?.ticketsByStatus || []}
              height={255}
              isLoading={isLoading}
            />
          </Grid>)}
{canViewTicketByPriority("Dashboard") && (
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Tickets by Priority"
              type="bar"
              data={data?.ticketsByPriority || []}
              height={250}
              isLoading={isLoading}
            />
          </Grid>)}
{canViewSevenDayTrends("Dashboard") && (
          <Grid item xs={12} md={4}>
            <ChartCard
              title="7-Day Trends"
              type="line"
              data={data?.sevenDayTrends || []}
              height={250}
              isLoading={isLoading}
            />
          </Grid>)}
        </Grid>
    </Box>
  );
};
